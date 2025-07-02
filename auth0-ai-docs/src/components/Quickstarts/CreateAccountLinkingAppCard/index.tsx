import React, { ReactNode } from 'react';
import Admonition from '@theme/Admonition';
import Card from '../../Card';
import ArrowLink from '../../ArrowLink';

export interface CreateAccountLinkingAppProps {
  isLoggedIn: boolean;
  configured: boolean;
  loading: boolean;
  error: string | undefined;
  onClick?: () => void;
}

export function CreateAccountLinkingAppCard({
  isLoggedIn,
  configured,
  loading,
  error,
  onClick,
}: CreateAccountLinkingAppProps): ReactNode {
  const disabled = !isLoggedIn || loading || (configured && !error);

  return (
    <Card
      headerText="Create Account Linking Application"
      checkbox={{ isChecked: configured }}
      cta={{
        text: 'Create App',
        onClick,
        disabled,
        loading,
      }}
    >
      <p>
        Create and configure an Account Linking Application. To learn more about
        Auth0 Applications read{' '}
        <ArrowLink
          href="https://auth0.com/docs/get-started/applications"
          text="Applications"
        />
      </p>
      {configured && !error && (
        <Admonition type="tip" title="" icon="">
          Account Linking Application is ready for use.
        </Admonition>
      )}
      {error && (
        <Admonition type="danger" title="" icon="">
          The Account Linking Application was not created. Please try again.
        </Admonition>
      )}
    </Card>
  );
}
