'use client';

import { Client, GetActions200ResponseActionsInner } from 'auth0';
import {
  createAccountLinkingClientForQuickstart,
  QUICKSTART_TYPES,
} from './quickstarts';
import {
  setupAccountLinkingAction,
  fetchBindingsForPostLoginTrigger,
} from './actions';

export const bootstrapQuickstartForAccountLinking = async (): Promise<{
  client?: Client;
  action?: GetActions200ResponseActionsInner;
}> => {
  let client: Client | undefined;
  let action: GetActions200ResponseActionsInner | undefined;

  try {
    client = await createAccountLinkingClientForQuickstart();
  } catch (error) {
    console.error('Error creating client', { error });
  }

  if (client) {
    try {
      action = await setupAccountLinkingAction(client);
    } catch (error) {
      console.error('Error enabling guardian push notification', { error });
    }
  }

  return { client, action };
};

export type AccountLinkingQuickstartStatusChecks = {
  webClientConfigured: boolean;
  actionConfigured: boolean;
};

export const statusChecksForAccountLinking = async ({
  client,
  action,
}: {
  client?: Client;
  action?: GetActions200ResponseActionsInner;
}): Promise<AccountLinkingQuickstartStatusChecks> => {
  const webClientConfigured =
    client?.client_metadata?.quickstart === QUICKSTART_TYPES.ACCOUNT_LINKING;

  let actionConfigured = false;
  if (action) {
    const { bindings } = await fetchBindingsForPostLoginTrigger();
    actionConfigured = !!bindings.find((b) => b.action.id === action.id);
  }

  return {
    webClientConfigured,
    actionConfigured,
  };
};
