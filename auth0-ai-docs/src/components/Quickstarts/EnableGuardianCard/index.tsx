import React, { ReactNode } from 'react';
import Admonition from '@theme/Admonition';
import Card from '../../Card';
import ArrowLink from '../../ArrowLink';

export interface EnableGuardianProps {
  isLoggedIn: boolean;
  configured: boolean;
  loading: boolean;
  error: string | undefined;
  onClick?: () => void;
}

export function EnableGuardianCard({
  isLoggedIn,
  configured,
  loading,
  error,
  onClick,
}: EnableGuardianProps): ReactNode {
  const disabled = !isLoggedIn || loading || (configured && !error);

  return (
    <Card
      headerText="Enable Guardian Push"
      checkbox={{ isChecked: configured }}
      cta={{
        text: 'Enable',
        icon: 'auth0_icon.svg',
        onClick,
        disabled,
        loading,
      }}
    >
      <p>
        Enable Mutli-factor authentication (MFA) with Guardian Push
        Notifications for your Auth0 tenant.
        <br />
        To learn more about MFA with Guardian, read the{' '}
        <ArrowLink
          href="https://auth0.com/docs/secure/multi-factor-authentication/auth0-guardian"
          text="Auth0 Guardian documentation"
        />
      </p>
      {configured && !error && (
        <Admonition type="tip" title="" icon="">
          Push notifications with Guardian are now ready for use with this
          Quickstart.
        </Admonition>
      )}
      {error && (
        <Admonition type="danger" title="" icon="">
          Push notifications with Guardian could not be enabled. Please, try
          again.
        </Admonition>
      )}
    </Card>
  );
}
