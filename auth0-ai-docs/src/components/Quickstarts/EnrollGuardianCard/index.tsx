import React, { ReactNode } from 'react';
import Card from '../../Card';
import ImageCard from '../../ImageCard';
import ArrowLink from '../../ArrowLink';

export function EnrollGuardianCard(): ReactNode {
  return (
    <Card
      headerText="Enroll your user to use Auth0 Guardian"
      icon="auth0_icon.svg"
    >
      <p>
        To initiate a CIBA push request, the authorizing user must be enrolled
        in MFA using push notifications. To verify if the authorizing user is
        enrolled for MFA push notifications in the{' '}
        <ArrowLink href="http://manage.auth0.com/" text="Auth0 Dashboard" />,
        navigate to <strong>User Management {'>'} Users</strong> and click on
        the user.
      </p>
      <div>
        <p>
          Under <strong>Multi-Factor Authentication</strong>, Auth0 lists the
          factors the user is enrolled in:
        </p>
        <ImageCard
          alt="User Enrolled in Auth0 Guardian"
          image="user_enrolled_in_auth0_guardian.png"
        />{' '}
      </div>
      <div>
        <p>
          If the user is not enrolled, you can send an enrollment request by
          email:
        </p>
        <ImageCard
          alt="Enable Guardian Push Screenshot"
          image="enroll_user_in_auth0_guardian.png"
        />{' '}
      </div>
    </Card>
  );
}
