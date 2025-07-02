import React, { ReactNode } from 'react';
import Admonition from '@theme/Admonition';
import Card from '../../Card';
import ArrowLink from '../../ArrowLink';

export interface CreateM2MAppProps {
  isLoggedIn: boolean;
  configured: boolean;
  loading: boolean;
  error: string | undefined;
  onClick?: () => void;
}

export function CreateM2MAppCard({
  isLoggedIn,
  configured,
  loading,
  error,
  onClick,
}: CreateM2MAppProps): ReactNode {
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
        Create and configure a Machine to Machine Application to use with this
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
          Machine to Machine Application is ready for use with this quickstart.
        </Admonition>
      )}
      {error && (
        <Admonition type="danger" title="" icon="">
          The Machine to Machine Application was not created. Please try again.
        </Admonition>
      )}
    </Card>
  );
}
