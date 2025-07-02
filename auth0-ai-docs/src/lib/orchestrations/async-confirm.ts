'use client';

import { Client, Factor, PutFactorsByName200Response } from 'auth0';
import {
  createM2MClientForQuickstart,
  enableGuardianPushNotification,
  QUICKSTART_TYPES,
} from './quickstarts';

export const setupQuickstartForAsyncConfirm = async (): Promise<{
  client?: Client;
  factor?: PutFactorsByName200Response;
}> => {
  let client: Client | undefined;
  let factor: PutFactorsByName200Response | undefined;

  try {
    client = await createM2MClientForQuickstart();
  } catch (error) {
    console.error('Error creating client', { error });
  }

  try {
    factor = await enableGuardianPushNotification();
  } catch (error) {
    console.error('Error enabling guardian push notification', { error });
  }

  return { client, factor };
};

export type AsyncConfirmQuickstartStatusChecks = {
  resourceServer?: boolean;
  m2mClientConfigured: boolean;
  guardianPushEnabled: boolean;
};

export const statusChecksForAsyncConfirm = ({
  client,
  guardian,
}: {
  client?: Client;
  guardian?: Factor;
}): AsyncConfirmQuickstartStatusChecks => {
  const m2mClientConfigured =
    client?.client_metadata?.quickstart === QUICKSTART_TYPES.ASYNC_CONFIRM;
  const guardianPushEnabled = !!guardian?.enabled;

  return {
    m2mClientConfigured,
    guardianPushEnabled,
  };
};
