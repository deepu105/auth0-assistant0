import {
  ApiResponse,
  Client,
  Factor,
  PutFactorsByName200Response,
} from 'auth0';
import { apiRequest } from '../api/request';

export const QUICKSTART_TYPES = {
  WEB_APP: 'user-auth',
  USER_AUTH: 'user-auth',
  // requirements
  // has web client
  // configured for localhost [callback, logout]
  CALL_APIS_FIRST_PARTY: 'user-auth',
  // requirements
  // has web client
  // configured for localhost [callback, logout]
  CALL_APIS_USERS_BEHALF: 'user-auth',
  // requirements
  // has web client
  // configured for localhost [callback, logout]
  // has grant type FCAT
  // has google connection
  // google connection enabled for client
  ASYNC_CONFIRM: 'async-confirm',
  // requirements
  // has machine to machine client
  // has grant type CIBA
  // has guardian factor enabled

  ACCOUNT_LINKING: 'account-linking',
  // requirements
  // has machine to machine client
  // has client grant with read:users on api2
  // action created
  // deployed
  // binded to post-login flow
};

export const FCAT_GRANT_TYPE =
  'urn:auth0:params:oauth:grant-type:token-exchange:federated-connection-access-token';
export const WEB_APP_GRANT_TYPES = [
  'authorization_code',
  'implicit',
  'refresh_token',
  'client_credentials',
];
export const CIBA_GRANT_TYPE = 'urn:openid:params:grant-type:ciba';
export const M2M_GRANT_TYPES = ['client_credentials'];
export const ACCOUNT_LINKING_GRANT_TYPES = [
  'client_credentials',
  'authorization_code',
];

// Common Utilities
export const fetchWebClients = async () => {
  const response = await apiRequest(
    '/ai/api/auth0/clients?app_type=regular_web'
  );
  if (!response.ok) {
    throw new Error('Failed to fetch clients');
  }
  const { data } = (await response.json()) as ApiResponse<Client[]>;

  return data;
};

export const fetchM2MClients = async () => {
  const response = await apiRequest(
    '/ai/api/auth0/clients?app_type=non_interactive'
  );
  if (!response.ok) {
    throw new Error('Failed to fetch clients');
  }
  const { data } = (await response.json()) as ApiResponse<Client[]>;

  return data;
};

// User Auth Functions
export const createWebClientLocalForQuickstart = async (): Promise<Client> => {
  const response = await apiRequest('/ai/api/auth0/clients', {
    method: 'POST',
    body: JSON.stringify({
      name: 'WebApp Quickstart Client',
      description: 'Created from Quickstarts',
      app_type: 'regular_web',
      callbacks: ['http://localhost:3000/auth/callback'],
      allowed_logout_urls: ['http://localhost:3000'],
      jwt_configuration: {
        alg: 'RS256',
        lifetime_in_seconds: 3600,
      },
      token_endpoint_auth_method: 'client_secret_post',
      oidc_conformant: true,
      grant_types: [...WEB_APP_GRANT_TYPES, FCAT_GRANT_TYPE],
      client_metadata: {
        quickstart: QUICKSTART_TYPES.WEB_APP,
      },
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to create client');
  }

  const { data } = (await response.json()) as ApiResponse<Client>;
  return data;
};

// Async Confirmation Functions
export const createM2MClientForQuickstart = async (): Promise<Client> => {
  const response = await apiRequest('/ai/api/auth0/clients', {
    method: 'POST',
    body: JSON.stringify({
      name: 'M2M Quickstart Client',
      description: 'Created from Quickstarts',
      app_type: 'non_interactive',
      oidc_conformant: true,
      grant_types: [...M2M_GRANT_TYPES, CIBA_GRANT_TYPE],
      client_metadata: {
        quickstart: QUICKSTART_TYPES.ASYNC_CONFIRM,
      },
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to create client');
  }

  const { data } = (await response.json()) as ApiResponse<Client>;
  return data;
};

export const enableGuardianPushNotification = async () => {
  const response = await apiRequest(
    '/ai/api/auth0/guardian/factors/push-notification',
    {
      method: 'PUT',
    }
  );
  if (!response.ok) {
    throw new Error('Failed to enable guardian push notification');
  }
  const { data } =
    (await response.json()) as ApiResponse<PutFactorsByName200Response>;
  return data;
};

export const fetchGuardianFactors = async () => {
  const response = await apiRequest('/ai/api/auth0/guardian/factors');
  if (!response.ok) {
    throw new Error('Failed to fetch guardian factors');
  }
  const { data } = (await response.json()) as ApiResponse<Factor[]>;
  return data;
};

// Possible future needed functions
export const updateWebClientLocal = async (id: string) => {
  const response = await apiRequest(`/ai/api/auth0/clients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      callbacks: ['http://localhost:3000/auth/callback'],
      allowed_logout_urls: ['http://localhost:3000'],
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to update client');
  }
  return response.json();
};

export const updateWebClientWithFcatGrantType = async (client: Client) => {
  const response = await apiRequest(
    `/ai/api/auth0/clients/${client.client_id}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        grant_types: [...client.grant_types, FCAT_GRANT_TYPE],
      }),
    }
  );
  if (!response.ok) {
    throw new Error('Failed to update client');
  }
  return response.json();
};

export const isClientConfiguredLocally = (client: Client) => {
  return (
    client.callbacks.includes('http://localhost:3000/auth/callback') &&
    client.allowed_logout_urls.includes('http://localhost:3000')
  );
};

export const clientHasFcatGrantType = (client: Client) => {
  return client.grant_types.includes(FCAT_GRANT_TYPE);
};

// Account Linking Functions
export const createAccountLinkingClientForQuickstart =
  async (): Promise<Client> => {
    const response = await apiRequest('/ai/api/auth0/clients', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Account Linking Companion App',
        description: 'Created from Quickstarts',
        app_type: 'regular_web',
        callbacks: ['https://{USER_DOMAIN}/continue'],
        jwt_configuration: {
          alg: 'RS256',
          lifetime_in_seconds: 3600,
        },
        token_endpoint_auth_method: 'client_secret_post',
        oidc_conformant: true,
        grant_types: ACCOUNT_LINKING_GRANT_TYPES,
        client_metadata: {
          quickstart: QUICKSTART_TYPES.ACCOUNT_LINKING,
        },
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to create client');
    }

    const { data } = (await response.json()) as ApiResponse<Client>;
    await apiRequest('/ai/api/auth0/client-grants', {
      method: 'POST',
      body: JSON.stringify({
        client_id: data.client_id,
        scope: ['create:users', 'update:users'],
      }),
    });
    return data;
  };
