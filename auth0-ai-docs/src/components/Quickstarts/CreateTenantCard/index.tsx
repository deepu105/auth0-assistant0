import React, { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Card from '../../Card';

export interface CreateTenantProps {
  isLoggedIn: boolean;
  loading: boolean;
}

export function CreateTenantCard({
  isLoggedIn,
  loading,
}: CreateTenantProps): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const { loginUrl } = siteConfig.customFields;

  const handleClick = () => {
    if (loginUrl) {
      window.location.href = loginUrl as string; // Redirect to login URL
    } else {
      console.error('Login URL is not defined');
    }
  };

  return (
    <Card
      headerText="Create an Auth0 Account and a Dev Tenant"
      checkbox={{ isChecked: isLoggedIn }}
      cta={{
        text: 'Create Account',
        icon: 'auth0_icon.svg',
        disabled: isLoggedIn,
        onClick: handleClick,
        loading,
      }}
    >
      <p>
        To continue with this quickstart, you need an Auth0 account and a
        Developer Tenant.
      </p>
    </Card>
  );
}
