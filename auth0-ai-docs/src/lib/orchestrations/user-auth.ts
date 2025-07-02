import { Client, Connection } from 'auth0';
import {
  createWebClientLocalForQuickstart,
  QUICKSTART_TYPES,
} from './quickstarts';
import { setupGoogleConnectionForClient } from './google';

export const setupQuickstartForWebApps = async (): Promise<{
  client?: Client;
  connection?: Connection;
}> => {
  let client: Client | undefined;
  let connection: Connection | undefined;
  try {
    client = await createWebClientLocalForQuickstart();
  } catch (error) {
    console.error('Error creating client', { error });
  }

  if (client) {
    try {
      connection = await setupGoogleConnectionForClient({
        clientId: client.client_id,
      });
    } catch (error) {
      console.error('Error setting up Google connection', { error });
    }
  }

  return { client, connection };
};

export type WebQuickstartStatusChecks = {
  webClientConfigured: boolean;
  googleConnectionExists: boolean;
  clientEnabledonConnection: boolean;
  googleCredentialsConfigured: boolean;
};

export const statusChecksForWebAppQuickstarts = ({
  client,
  connection,
}: {
  client?: Client;
  connection?: Connection;
}): WebQuickstartStatusChecks => {
  const webClientConfigured =
    client?.client_metadata?.quickstart === QUICKSTART_TYPES.WEB_APP;
  const googleConnectionExists = !!connection;
  const clientEnabledonConnection = !!(
    client && connection?.enabled_clients.includes(client.client_id)
  );
  const googleCredentialsConfigured = !!(
    connection && isgoogleClientConfigured(connection)
  );

  return {
    webClientConfigured,
    googleConnectionExists,
    clientEnabledonConnection,
    googleCredentialsConfigured,
  };
};

const isgoogleClientConfigured = (connection: Connection) => {
  return (
    !!connection &&
    !!(
      connection.options &&
      connection.options.client_id &&
      connection.options.client_secret &&
      connection.options.offline_access &&
      connection?.options.federated_connections_access_tokens?.active &&
      connection.options.upstream_params_offline?.access_type?.value ===
        'offline'
    )
  );
};
