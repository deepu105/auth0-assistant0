import {
  ApiResponse,
  Connection,
  ConnectionCreate,
  ConnectionUpdate,
} from 'auth0';

import { apiRequest } from '../api/request';

type setupGoogleConnectionArgs = {
  clientId: string;
  googleClientId?: string;
  googleClientSecret?: string;
};

type configureGoogleConnectionArgs = {
  clientId: string;
  googleClientId: string;
  googleClientSecret: string;
  connection?: Connection;
};

const DEFAULT_GOOGLE_CONNECTION_OPTIONS = {
  calendar: true,
  offline_access: true,
  upstream_params_offline: {
    access_type: {
      value: 'offline',
    },
  },
  federated_connections_access_tokens: {
    active: true,
  },
};

export async function setupGoogleConnectionForClient({
  clientId,
  googleClientId,
  googleClientSecret,
}: setupGoogleConnectionArgs): Promise<Connection> {
  const googleConnection = await fetchGoogleConnection();

  if (!googleConnection) {
    return createGoogleConnection({
      googleClientId,
      googleClientSecret,
      clientId,
    });
  }

  return await updateGoogleConnection(googleConnection.id, {
    enabled_clients: [...googleConnection.enabled_clients, clientId],
  });
}

export async function createGoogleConnection({
  clientId,
  googleClientId,
  googleClientSecret,
}: setupGoogleConnectionArgs): Promise<Connection> {
  const body = {
    name: 'google-oauth2',
    strategy: 'google-oauth2',
    enabled_clients: [clientId],
    options: {
      client_id: googleClientId,
      client_secret: googleClientSecret,
      ...DEFAULT_GOOGLE_CONNECTION_OPTIONS,
    },
  } as ConnectionCreate;

  const response = await apiRequest('/ai/api/auth0/connections', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const { data } = (await response.json()) as ApiResponse<Connection>;
  return data;
}

export async function updateGoogleConnection(
  connectionId: string,
  body: ConnectionUpdate
): Promise<Connection> {
  const response = await apiRequest(
    `/ai/api/auth0/connections/${connectionId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to update connection: ${response.statusText || response.status}`
    );
  }

  const { data } = (await response.json()) as ApiResponse<Connection>;
  return data;
}

export async function fetchGoogleConnection(): Promise<Connection | undefined> {
  const response = await apiRequest(
    '/ai/api/auth0/connections?strategy=google-oauth2'
  );
  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error);
  }

  const { data } = (await response.json()) as ApiResponse<Connection[]>;
  return data.find((c: Connection) => c.name === 'google-oauth2');
}

export async function configureGoogleConnectionCredentials({
  googleClientId,
  googleClientSecret,
  connection,
  clientId,
}: configureGoogleConnectionArgs): Promise<Connection> {
  const googleConnection = connection || (await fetchGoogleConnection());
  if (!googleConnection) {
    return await createGoogleConnection({
      googleClientId,
      googleClientSecret,
      clientId,
    });
  }

  return await updateGoogleConnection(googleConnection.id, {
    options: {
      ...googleConnection.options,
      ...DEFAULT_GOOGLE_CONNECTION_OPTIONS,
      enabled_clients: [...googleConnection.enabled_clients, clientId],
      client_id: googleClientId,
      client_secret: googleClientSecret,
    },
  });
}
