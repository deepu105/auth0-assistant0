import React, { ReactNode } from 'react';
import Admonition from '@theme/Admonition';
import { Connection } from 'auth0';
import Card from '@site/src/components/Card';
import Form from '@site/src/components/Form';
import { WebQuickstartStatusChecks } from '../../../lib/orchestrations/user-auth';
import ArrowLink from '../../ArrowLink';

export interface CreateGoogleProps {
  connection: Connection;
  isLoggedIn: boolean;
  statusChecks: WebQuickstartStatusChecks;
  loading: boolean;
  error: string | undefined;
  onSave: (data: Record<string, string>) => void;
}

export function CreateGoogleCard({
  connection,
  isLoggedIn,
  statusChecks,
  loading,
  error,
  onSave,
}: CreateGoogleProps): ReactNode {
  const disabled = !isLoggedIn || loading;

  return (
    <Card
      headerText="Configure Google Social Connection"
      checkbox={{
        isChecked: statusChecks.googleCredentialsConfigured,
      }}
    >
      <p>
        Set up a Google developer account that allows for third-party API calls
        following the{' '}
        <ArrowLink
          href="/ai/docs/google-sign-in-and-auth"
          text="Google Sign-in and Authorization"
        />{' '}
        instructions.
      </p>
      <p>
        Use the Google OAuth Client ID and Client Secret to fill out the
        following form:
      </p>

      <Form
        fields={[
          {
            name: 'clientId',
            label: 'Google Client ID',
            type: 'text',
            placeholder: 'Paste your Client ID here',
            required: true,
            description: 'The unique identifier for your application.',
            defaultValue: connection?.options?.client_id,
          },
          {
            name: 'clientSecret',
            label: 'Google Client Secret',
            type: 'text',
            placeholder: 'Paste your Client Secret here',
            required: true,
            description:
              'The secret used by the application to authenticate with Auth0.',
            sensitive: true,
            defaultValue: connection?.options?.client_secret,
          },
        ]}
        isDisabled={disabled}
        loading={loading}
        onSave={onSave}
        onCancel={() => {}}
      />
      <p>
        {statusChecks.googleCredentialsConfigured && !error && (
          <Admonition type="tip" title="" icon="">
            Google Connection is ready for use with this quickstart.
          </Admonition>
        )}
        {error && (
          <Admonition type="danger" title="" icon="">
            The Google Social Connection was not configured. Please try again.
          </Admonition>
        )}
      </p>
    </Card>
  );
}
