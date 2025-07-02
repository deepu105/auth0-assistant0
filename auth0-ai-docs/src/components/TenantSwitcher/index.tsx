import React from 'react';
import styles from './index.module.css';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { MAIN_MENU_ITEM_CLASSNAME } from '@site/constants';
import { useCurrentTenant } from '@site/src/hooks/useCurrentTenant';
import TooltipWrapper from '../TooltipWrapper';

// NOTE: EA requirement is to display current tenant, with anticipated follow-on to make this a full switcher component
const TenantSwitcher = () => {
  const { currentTenant: tenant } = useCurrentTenant();
  const { dashboardUrl } = useDocusaurusContext().siteConfig.customFields;
  const iconUrl = useBaseUrl('/img/icon-arrow-external-link.svg');

  if (!tenant) {
    return <></>;
  }

  return (
    <div
      className={
        styles.tenantSwitcherContainer + ' ' + MAIN_MENU_ITEM_CLASSNAME
      }
    >
      <TooltipWrapper text="Go to your Auth0 Tenant" position="below">
        <a
          href={`${dashboardUrl}/${tenant.locality}/${tenant.name}`.toString()}
          target="_blank"
        >
          <div className={styles.innerTenantSwitcherContainer}>
            <div className={styles.tenantIcon}>
              {tenant.name.charAt(0).toUpperCase()}
            </div>
            <div className={styles.tenantInfo}>
              <span className={styles.tenantNameContainer}>{tenant.name}</span>
              <span className={styles.tenantTierContainer}>{tenant.tier}</span>
            </div>
            <img src={iconUrl} alt="External Link Icon" />
          </div>
        </a>
      </TooltipWrapper>
    </div>
  );
};

export default TenantSwitcher;
