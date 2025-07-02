import React, { useEffect, useMemo, useState } from 'react';
import { useSession } from '@site/src/hooks/useSession';
import Card from '../../Card';
import { CreateWebAppsCard } from '../CreateWebAppCard';
import { CreateTenantCard } from '../CreateTenantCard';
import { CreateGoogleCard } from '../CreateGoogleCard';
import {
  setupQuickstartForWebApps,
  statusChecksForWebAppQuickstarts,
  WebQuickstartStatusChecks,
} from '../../../lib/orchestrations/user-auth';
import { Client, Connection } from 'auth0';
import {
  fetchWebClients,
  QUICKSTART_TYPES,
} from '../../../lib/orchestrations/quickstarts';
import {
  configureGoogleConnectionCredentials,
  fetchGoogleConnection,
} from '../../../lib/orchestrations/google';
import { OpenAICard } from '../OpenAICard';
import ArrowLink from '../../ArrowLink';
import { useQuickstartClientContext } from '../QuickstartClientContextProvider';

type UserAuthPreReqProps = {
  googleConnection?: boolean;
  openAI?: boolean;
  userAuth?: boolean;
};

export default function UserAuthPreReq({
  googleConnection,
  openAI,
  userAuth,
}: UserAuthPreReqProps) {
  const { data, isLoading: sessionLoading } = useSession();

  const isLoggedIn = useMemo(() => !!data, [data]);

  const { setQuickstartClient: setQuickstartClientContext } =
    useQuickstartClientContext();

  const [quickstartClient, setQuickstartClient] = useState<{
    client: Client | undefined;
    connection: Connection | undefined;
    loading: boolean;
    initialLoad: boolean;
    error: string | undefined;
    connectionError: string | undefined;
  }>({
    client: undefined,
    connection: undefined,
    loading: false,
    initialLoad: false,
    error: undefined,
    connectionError: undefined,
  });

  const [quickstartStatusChecks, setQuickstartStatusChecks] =
    useState<WebQuickstartStatusChecks>({
      webClientConfigured: false,
      googleConnectionExists: false,
      clientEnabledonConnection: false,
      googleCredentialsConfigured: false,
    });

  useEffect(() => {
    const fetchQuickstartClient = async () => {
      setQuickstartClient({
        client: undefined,
        connection: undefined,
        loading: true,
        initialLoad: false,
        error: undefined,
        connectionError: undefined,
      });
      try {
        const clients = await fetchWebClients();
        const client = clients?.find(
          (c) =>
            c.client_metadata &&
            c.client_metadata?.quickstart === QUICKSTART_TYPES.WEB_APP
        );

        const connection = googleConnection && (await fetchGoogleConnection());

        setQuickstartClient({
          client: client,
          connection: connection,
          loading: false,
          initialLoad: true,
          error: undefined,
          connectionError: undefined,
        });
      } catch (err) {
        console.error('error creating client:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setQuickstartClient({
          client: undefined,
          connection: undefined,
          loading: false,
          initialLoad: true,
          error: errorMessage,
          connectionError: undefined,
        });
      }
    };

    if (isLoggedIn) {
      fetchQuickstartClient();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setQuickstartStatusChecks(
      statusChecksForWebAppQuickstarts({
        client: quickstartClient.client,
        connection: quickstartClient.connection,
      })
    );
  }, [quickstartClient.client, quickstartClient.connection]);

  useEffect(() => {
    setQuickstartClientContext({ data: quickstartClient.client });
  }, [quickstartClient.client, setQuickstartClientContext]);

  const createQuickstartClient = async () => {
    setQuickstartClient({
      client: quickstartClient.client,
      connection: quickstartClient.connection,
      loading: true,
      initialLoad: quickstartClient.initialLoad,
      error: undefined,
      connectionError: undefined,
    });
    try {
      const { client, connection } = await setupQuickstartForWebApps();

      setQuickstartClient({
        client: client,
        connection: connection,
        loading: false,
        initialLoad: quickstartClient.initialLoad,
        error: undefined,
        connectionError: quickstartClient.connectionError,
      });
    } catch (err) {
      console.error('Error creating quickstart client:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setQuickstartClient({
        client: quickstartClient.client,
        connection: quickstartClient.connection,
        loading: false,
        initialLoad: quickstartClient.initialLoad,
        error: errorMessage,
        connectionError: quickstartClient.connectionError,
      });
    }
  };

  const configureGoogleConnection = async (formData) => {
    const { clientId, clientSecret } = formData;

    setQuickstartClient({
      client: quickstartClient.client,
      connection: quickstartClient.connection,
      loading: true,
      initialLoad: quickstartClient.initialLoad,
      error: quickstartClient.error,
      connectionError: undefined,
    });

    try {
      const connection = await configureGoogleConnectionCredentials({
        googleClientId: clientId,
        googleClientSecret: clientSecret,
        connection: quickstartClient.connection,
        clientId: quickstartClient.client?.client_id,
      });

      setQuickstartClient({
        client: quickstartClient.client,
        connection,
        loading: false,
        initialLoad: quickstartClient.initialLoad,
        error: undefined,
        connectionError: undefined,
      });

      setQuickstartStatusChecks(
        statusChecksForWebAppQuickstarts({
          client: quickstartClient.client,
          connection,
        })
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setQuickstartClient({
        client: quickstartClient.client,
        connection: quickstartClient.connection,
        loading: false,
        initialLoad: quickstartClient.initialLoad,
        error: quickstartClient.error,
        connectionError: errorMessage,
      });
    }
  };

  const loading =
    (isLoggedIn && !quickstartClient.initialLoad) ||
    sessionLoading ||
    quickstartClient.loading;

  return (
    <div>
      <Card headerText="Prerequisites">
        <p>
          Before getting started, make sure you have completed the following
          steps:
        </p>

        <CreateTenantCard isLoggedIn={isLoggedIn} loading={sessionLoading} />
        <CreateWebAppsCard
          isLoggedIn={isLoggedIn}
          configured={quickstartStatusChecks.webClientConfigured}
          onClick={createQuickstartClient}
          loading={loading}
          error={quickstartClient.error}
        />
        {userAuth && (
          <Card
            headerText="Complete User Authentication quickstart"
            icon="auth0_icon.svg"
          >
            <p>
              To complete this quickstart, you need to use the same application
              you built in the{' '}
              <ArrowLink
                text="User authentication"
                href="user-authentication"
                newTab={false}
              />{' '}
              quickstart.
            </p>
          </Card>
        )}
        {googleConnection && (
          <CreateGoogleCard
            isLoggedIn={isLoggedIn}
            statusChecks={quickstartStatusChecks}
            loading={loading}
            error={quickstartClient.connectionError}
            onSave={configureGoogleConnection}
            connection={quickstartClient.connection}
          />
        )}
        {openAI && <OpenAICard />}
      </Card>
    </div>
  );
}
