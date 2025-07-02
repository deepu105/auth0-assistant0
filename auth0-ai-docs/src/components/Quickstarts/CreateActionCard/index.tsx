import React, { ReactNode } from 'react';
import Admonition from '@theme/Admonition';
import Card from '../../Card';
import ArrowLink from '../../ArrowLink';
import { AccountLinkingQuickstartStatusChecks } from '@site/src/lib/orchestrations/account-linking';

export interface CreateActionProps {
  isLoggedIn: boolean;
  configured: AccountLinkingQuickstartStatusChecks;
  loading: boolean;
  error: string | undefined;
  onClick?: () => void;
}

export function CreateActionCard({
  isLoggedIn,
  configured,
  loading,
  error,
  onClick,
}: CreateActionProps): ReactNode {
  const { actionConfigured, webClientConfigured } = configured;
  const disabled =
    !isLoggedIn ||
    !webClientConfigured ||
    loading ||
    (actionConfigured && !error);

  return (
    <Card
      headerText="Add Account Linking Action"
      checkbox={{ isChecked: actionConfigured }}
      cta={{
        text: 'Add Action',
        icon: 'action_icon.svg',
        onClick,
        disabled,
        loading,
      }}
    >
      <p>
        After you have created the Account Linking Application, create the
        Account linking Action. To learn more about Auth0 Actions, read{' '}
        <ArrowLink
          href="https://auth0.com/docs/customize/actions/actions-overview"
          text="Actions"
        />
      </p>
      {actionConfigured && !error && (
        <Admonition type="tip" title="" icon="">
          Account Linking Action is ready for use.
        </Admonition>
      )}
      {error && (
        <Admonition type="danger" title="" icon="">
          Account Linking Action was not added: {error}
        </Admonition>
      )}
    </Card>
  );
}
