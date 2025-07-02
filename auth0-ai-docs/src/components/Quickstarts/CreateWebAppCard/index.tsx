import React, { ReactNode } from 'react';
import Admonition from '@theme/Admonition';
import Card from '../../Card';
import ArrowLink from '../../ArrowLink';

export interface CreateWebAppProps {
  isLoggedIn: boolean;
  configured: boolean;
  loading: boolean;
  error: string | undefined;
  onClick?: () => void;
}

export function CreateWebAppsCard({
  isLoggedIn,
  configured,
  loading,
  error,
  onClick,
}: CreateWebAppProps): ReactNode {
  const disabled = !isLoggedIn || loading || (configured && !error);

  return (
    <Card
      headerText="Create Application"
      checkbox={{ isChecked: configured }}
      cta={{
        text: 'Create App',
        onClick,
        disabled,
        loading,
      }}
    >
      <p>
        Create and configure a Regular Web Application to use with this
        quickstart.
        <br />
        To learn more about Auth0 applications, read{' '}
        <ArrowLink
          href="https://auth0.com/docs/get-started/applications"
          text="Applications"
        />
      </p>
      {configured && !error && (
        <Admonition type="tip" title="" icon="">
          Regular Web Application is ready for use with this quickstart. The
          Callback and Logout URLs have been set.
        </Admonition>
      )}
      {error && (
        <Admonition type="danger" title="" icon="">
          The Regular Web Application was not created. Please try again.
        </Admonition>
      )}
    </Card>
  );
}
