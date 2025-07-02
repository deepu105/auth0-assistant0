import React, { ReactNode, useState, useMemo, useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import { useCurrentTenant } from '@site/src/hooks/useCurrentTenant';
import { MAIN_MENU_ITEM_CLASSNAME } from '@site/constants';

export default function LoginButton(): ReactNode {
  const { loginUrl } = useDocusaurusContext().siteConfig.customFields;
  const { currentTenant } = useCurrentTenant();

  if (currentTenant) {
    return <></>;
  }

  return (
    <div className={styles.loginButton + ' ' + MAIN_MENU_ITEM_CLASSNAME}>
      <a href={`${loginUrl}`.toString()}>Log in</a>
    </div>
  );
}
