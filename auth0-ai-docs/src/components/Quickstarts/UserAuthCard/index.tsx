import React, { ReactNode } from 'react';
import Card from '../../Card';
import ArrowLink from '../../ArrowLink';

export function UserAuthCard(): ReactNode {
  return (
    <Card
      headerText="Complete User Authentication quickstart"
      icon="auth0_icon.svg"
    >
      <p>
        To complete this quickstart, you need to use the same application you
        built in the{' '}
        <ArrowLink
          text="User authentication"
          href="user-authentication"
          newTab={false}
        />{' '}
        quickstart.
      </p>
    </Card>
  );
}
