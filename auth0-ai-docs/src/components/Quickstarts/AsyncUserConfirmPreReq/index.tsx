import React, { useEffect, useMemo, useState } from 'react';
import { Client, Factor } from 'auth0';
import { useSession } from '@site/src/hooks/useSession';
import Card from '../../Card';
import { CreateM2MAppCard } from '../CreateM2MAppCard';
import { CreateTenantCard } from '../CreateTenantCard';
import { EnableGuardianCard } from '../EnableGuardianCard';
import { EnrollGuardianCard } from '../EnrollGuardianCard';
import { OpenAICard } from '../OpenAICard';
import {
  createM2MClientForQuickstart,
  enableGuardianPushNotification,
  fetchGuardianFactors,
  fetchM2MClients,
  QUICKSTART_TYPES,
} from '../../../lib/orchestrations/quickstarts';
import {
  statusChecksForAsyncConfirm,
  AsyncConfirmQuickstartStatusChecks,
} from '../../../lib/orchestrations/async-confirm';
import { useQuickstartClientContext } from '../QuickstartClientContextProvider';

export default function AsyncUserConfirmPreReq() {
  const { data, isLoading: sessionLoading } = useSession();
  const isLoggedIn = useMemo(() => !!data, [data]);
  const { setQuickstartClient: setQuickstartClientContext } =
    useQuickstartClientContext();

  const [quickstartStatusChecks, setQuickstartStatusChecks] =
    useState<AsyncConfirmQuickstartStatusChecks>({
      m2mClientConfigured: false,
      guardianPushEnabled: false,
    });

  const [quickstartClient, setQuickstartClient] = useState<{
    initialLoad: boolean;
    data: Client | undefined;
    loading: boolean;
    error: string | undefined;
  }>({
    initialLoad: false,
    data: undefined,
    loading: false,
    error: undefined,
  });

  const [quickstartGuardian, setQuickstartGuardian] = useState<{
    initialLoad: boolean;
    data: Factor | undefined;
    loading: boolean;
    error: string | undefined;
  }>({
    initialLoad: false,
    data: undefined,
    loading: false,
    error: undefined,
  });

  useEffect(() => {
    const fetchResources = async () => {
      let client: Client | undefined;
      let guardian: Factor | undefined;

      try {
        setQuickstartClient((prev) => ({
          ...prev,
          loading: true,
        }));
        const clients = await fetchM2MClients();
        client = clients?.find(
          (c) =>
            c.client_metadata &&
            c.client_metadata?.quickstart === QUICKSTART_TYPES.ASYNC_CONFIRM
        );
        setQuickstartClient((prev) => ({
          ...prev,
          initialLoad: true,
          data: client,
          loading: false,
        }));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setQuickstartClient((prev) => ({
          ...prev,
          initialLoad: true,
          data: undefined,
          loading: false,
          error: errorMessage,
        }));
      }

      try {
        setQuickstartGuardian((prev) => ({
          ...prev,
          loading: true,
        }));
        const factors = await fetchGuardianFactors();
        guardian = factors?.find((f) => f.name === 'push-notification');
        if (!guardian) {
          throw new Error('Guardian factor not found');
        }
        setQuickstartGuardian((prev) => ({
          ...prev,
          initialLoad: true,
          data: guardian,
          loading: false,
        }));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setQuickstartGuardian((prev) => ({
          ...prev,
          initialLoad: true,
          data: undefined,
          loading: false,
          error: errorMessage,
        }));
      }
      const checks = statusChecksForAsyncConfirm({
        client,
        guardian,
      });
      setQuickstartStatusChecks(checks);
    };

    if (isLoggedIn) {
      fetchResources();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setQuickstartClientContext(quickstartClient);
  }, [quickstartClient, setQuickstartClientContext]);

  const createQuickstartClient = async () => {
    setQuickstartClient((prev) => ({
      ...prev,
      loading: true,
      error: undefined,
    }));
    try {
      const client = await createM2MClientForQuickstart();
      setQuickstartClient((prev) => ({
        ...prev,
        data: client,
        loading: false,
        error: undefined,
      }));
      const checks = statusChecksForAsyncConfirm({
        client,
        guardian: quickstartGuardian.data,
      });
      setQuickstartStatusChecks(checks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setQuickstartClient((prev) => ({
        ...prev,
        data: undefined,
        loading: false,
        error: errorMessage,
      }));
    }
  };

  const enableGuardian = async () => {
    if (!quickstartClient.data) {
      return;
    }

    setQuickstartGuardian((prev) => ({
      ...prev,
      loading: true,
      error: undefined,
    }));

    try {
      const guardian = await enableGuardianPushNotification();

      setQuickstartGuardian((prev) => ({
        ...prev,
        data: guardian,
        loading: false,
        error: undefined,
      }));

      const checks = statusChecksForAsyncConfirm({
        client: quickstartClient.data,
        guardian,
      });
      setQuickstartStatusChecks(checks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setQuickstartGuardian((prev) => ({
        ...prev,
        data: undefined,
        loading: false,
        error: errorMessage,
      }));
    }
  };

  const clientLoading =
    (isLoggedIn && !quickstartClient.initialLoad) ||
    sessionLoading ||
    quickstartClient.loading;
  const guardingLoading =
    (isLoggedIn && !quickstartGuardian.initialLoad) ||
    sessionLoading ||
    quickstartGuardian.loading;

  return (
    <div>
      <Card headerText="Prerequisites">
        <p>
          Before getting started, make sure you have completed the following
          steps:
        </p>

        <CreateTenantCard isLoggedIn={isLoggedIn} loading={sessionLoading} />
        <CreateM2MAppCard
          isLoggedIn={isLoggedIn}
          configured={quickstartStatusChecks.m2mClientConfigured}
          onClick={createQuickstartClient}
          loading={clientLoading}
          error={quickstartClient.error}
        />
        <EnableGuardianCard
          isLoggedIn={isLoggedIn}
          configured={quickstartStatusChecks.guardianPushEnabled}
          loading={guardingLoading}
          error={quickstartGuardian.error}
          onClick={enableGuardian}
        />
        <EnrollGuardianCard />
        <OpenAICard />
        <p>
          {/* By the end of this quickstart, you will have your{' '}
          <ArrowLink href="https://nextjs.org" text="Next.js" />
          application secured with
          Auth0. */}
        </p>
      </Card>
    </div>
  );
}
