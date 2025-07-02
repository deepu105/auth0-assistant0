import React, { useEffect, useMemo, useState } from 'react';
import { Client, GetActions200ResponseActionsInner } from 'auth0';
import { useSession } from '@site/src/hooks/useSession';
import Card from '../../Card';
import { CreateAccountLinkingAppCard } from '../CreateAccountLinkingAppCard';
import { CreateTenantCard } from '../CreateTenantCard';
import { CreateActionCard } from '../CreateActionCard';
import {
  createAccountLinkingClientForQuickstart,
  fetchWebClients,
  QUICKSTART_TYPES,
} from '../../../lib/orchestrations/quickstarts';
import {
  statusChecksForAccountLinking,
  AccountLinkingQuickstartStatusChecks,
} from '../../../lib/orchestrations/account-linking';
import {
  setupAccountLinkingAction,
  fetchAccountLinkingAction,
} from '../../../lib/orchestrations/actions';

export default function AccountLinkingPreReq() {
  const { data: sessionData, isLoading: sessionLoading } = useSession();
  const isLoggedIn = useMemo(() => !!sessionData, [sessionData]);

  const [quickstartStatusChecks, setQuickstartStatusChecks] =
    useState<AccountLinkingQuickstartStatusChecks>({
      webClientConfigured: false,
      actionConfigured: false,
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

  const [quickstartAction, setQuickstartAction] = useState<{
    initialLoad: boolean;
    data: GetActions200ResponseActionsInner | undefined;
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
      let action: GetActions200ResponseActionsInner | undefined;

      try {
        setQuickstartClient((prev) => ({
          ...prev,
          loading: true,
        }));
        const clients = await fetchWebClients();
        client = clients?.find(
          (c) =>
            c.client_metadata &&
            c.client_metadata?.quickstart === QUICKSTART_TYPES.ACCOUNT_LINKING
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
        setQuickstartAction((prev) => ({
          ...prev,
          loading: true,
        }));
        action = await fetchAccountLinkingAction();
        setQuickstartAction((prev) => ({
          ...prev,
          initialLoad: true,
          data: action,
          loading: false,
        }));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';
        setQuickstartAction((prev) => ({
          ...prev,
          initialLoad: true,
          data: undefined,
          loading: false,
          error: errorMessage,
        }));
      }
      const checks = await statusChecksForAccountLinking({
        client,
        action,
      });
      setQuickstartStatusChecks(checks);
    };

    if (isLoggedIn) {
      fetchResources();
    }
  }, [isLoggedIn]);

  const createQuickstartClient = async () => {
    setQuickstartClient((prev) => ({
      ...prev,
      loading: true,
      error: undefined,
    }));
    try {
      const client = await createAccountLinkingClientForQuickstart();
      setQuickstartClient((prev) => ({
        ...prev,
        data: client,
        loading: false,
        error: undefined,
      }));
      const checks = await statusChecksForAccountLinking({
        client,
        action: quickstartAction.data,
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

  const createQuickstartAction = async () => {
    if (!quickstartClient.data) {
      return;
    }

    setQuickstartAction((prev) => ({
      ...prev,
      loading: true,
      error: undefined,
    }));

    try {
      const action = await setupAccountLinkingAction(quickstartClient.data);

      setQuickstartAction((prev) => ({
        ...prev,
        data: action,
        loading: false,
        error: undefined,
      }));

      const checks = await statusChecksForAccountLinking({
        client: quickstartClient.data,
        action,
      });
      setQuickstartStatusChecks(checks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setQuickstartAction((prev) => ({
        ...prev,
        action: undefined,
        loading: false,
        error: errorMessage,
      }));
    }
  };

  const clientLoading =
    (isLoggedIn && !quickstartClient.initialLoad) ||
    sessionLoading ||
    quickstartClient.loading;
  const actionLoading =
    (isLoggedIn && !quickstartAction.initialLoad) ||
    sessionLoading ||
    quickstartAction.loading;

  return (
    <div>
      <Card headerText="Prerequisites">
        <p>
          Before getting started, make sure you have completed the following
          steps:
        </p>

        <CreateTenantCard isLoggedIn={isLoggedIn} loading={sessionLoading} />
        <CreateAccountLinkingAppCard
          isLoggedIn={isLoggedIn}
          configured={quickstartStatusChecks.webClientConfigured}
          onClick={createQuickstartClient}
          loading={clientLoading}
          error={quickstartClient.error}
        />
        <CreateActionCard
          isLoggedIn={isLoggedIn}
          configured={quickstartStatusChecks}
          loading={actionLoading}
          error={quickstartAction.error}
          onClick={createQuickstartAction}
        />
      </Card>
    </div>
  );
}
