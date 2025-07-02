import React, { ReactNode, useState, useMemo, useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import { useCurrentTenant } from '@site/src/hooks/useCurrentTenant';
import { MAIN_MENU_ITEM_CLASSNAME } from '@site/constants';

export default function SignupButton(): ReactNode {
  const { signupUrl } = useDocusaurusContext().siteConfig.customFields;
  const { currentTenant } = useCurrentTenant();

  if (currentTenant) {
    return <></>;
  }

  return (
    <div className={styles.signupButton + ' ' + MAIN_MENU_ITEM_CLASSNAME}>
      <a href={`${signupUrl}`.toString()}>Start building</a>
    </div>
  );
}
