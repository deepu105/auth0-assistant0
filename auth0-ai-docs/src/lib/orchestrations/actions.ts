import {
  ApiResponse,
  Client,
  GetActions200Response,
  GetActions200ResponseActionsInner,
  PatchBindings200Response,
} from 'auth0';
import { generateAccountLinkingAction } from './auth0ActionTemplate';
import { apiRequest } from '../api/request';

export const fetchAccountLinkingAction = async (): Promise<
  GetActions200ResponseActionsInner | undefined
> => {
  const response = await apiRequest(
    '/ai/api/auth0/actions?actionName=account-linking'
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch action: ${response.statusText}`);
  }
  const { data } =
    (await response.json()) as ApiResponse<GetActions200Response>;

  if (data.actions.length === 0) {
    return undefined;
  } else if (data.actions.length > 1) {
    throw new Error('Multiple actions found');
  } else {
    return data.actions[0];
  }
};

export const createAccountLinkingAction = async (
  client: Client
): Promise<GetActions200ResponseActionsInner> => {
  const action = generateAccountLinkingAction({
    clientId: client.client_id,
    clientSecret: client.client_secret,
    domain: client.domain,
  });

  const response = await apiRequest('/ai/api/auth0/actions', {
    method: 'POST',
    body: JSON.stringify(action),
  });
  if (!response.ok) {
    const {
      error,
      details: { statusCode },
    } = await response.json();

    // If the action already exists, fetch it
    if (statusCode === 409) {
      const action = await fetchAccountLinkingAction();
      if (action) {
        return action;
      }
    }

    throw new Error(error || `Failed to create action: ${response.statusText}`);
  }
  const { data } =
    (await response.json()) as ApiResponse<GetActions200ResponseActionsInner>;
  return data;
};

export const setupAccountLinkingAction = async (
  client: Client
): Promise<GetActions200ResponseActionsInner> => {
  const action = await createAccountLinkingAction(client);
  if (!action) {
    throw new Error('Failed to create action');
  }

  let retries = 0;
  const maxRetries = 5;
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  while (action.status !== 'built' && retries < maxRetries) {
    await delay(3000); // wait 3 seconds
    retries++;

    // Fetch the action again to check its deployment status
    const updatedAction = await fetchAccountLinkingAction();
    if (!updatedAction) {
      throw new Error('Failed to fetch updated action');
    }
    action.status = updatedAction.status;
  }

  if (action.status !== 'built') {
    throw new Error('Action deployment failed after maximum retries');
  }

  await attachActionToPostLoginTrigger(action);
  return action;
};

export const attachActionToPostLoginTrigger = async (
  action: GetActions200ResponseActionsInner
): Promise<PatchBindings200Response> => {
  const binding = {
    ref: {
      type: 'action_name',
      value: action.name,
    },
    display_name: 'Account Linking',
  };
  // TODO: add support for existing action bindings
  const response = await apiRequest(
    `/ai/api/auth0/triggers/post-login/bindings`,
    {
      method: 'PATCH',
      body: JSON.stringify({ bindings: [binding] }),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to attach action: ${response.statusText}`);
  }
  const { data } =
    (await response.json()) as ApiResponse<PatchBindings200Response>;
  return data;
};

export const fetchBindingsForPostLoginTrigger =
  async (): Promise<PatchBindings200Response> => {
    const response = await apiRequest(
      `/ai/api/auth0/triggers/post-login/bindings`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch bindings: ${response.statusText}`);
    }
    const { data } =
      (await response.json()) as ApiResponse<PatchBindings200Response>;
    return data;
  };
