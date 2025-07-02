import React, { ReactNode, useState, useMemo, useEffect, useRef } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import clsx from 'clsx';
import { useCurrentUser } from '@site/src/hooks/useCurrentUser';

interface User {
  name: string;
  email: string;
  initials: string;
}

export default function NavBarProfile(): ReactNode {
  const { logoutUrl } = useDocusaurusContext().siteConfig.customFields;
  const { currentUser } = useCurrentUser();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const profileHandler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener('click', profileHandler, true);
    return () => {
      document.removeEventListener('click', profileHandler);
    };
  }, []);

  if (!currentUser) {
    return <></>;
  }

  return (
    <div className={styles.profileContainer} ref={profileRef}>
      <button
        onClick={() => setShowProfile(!showProfile)}
        className={clsx(styles.profileButton, styles.profilePreview)}
        aria-label="Toggle Profile Dropdown"
      >
        {currentUser.initials}
      </button>
      {showProfile && (
        <div className={styles.profileDropdown}>
          <div className={styles.profileDropdownInner}>
            <div className={styles.profilePreview}>{currentUser.initials}</div>
            <div className={styles.profileUserInfo}>
              <div className={styles.profileName}>{currentUser.name}</div>
              <div className={styles.profileEmail}>{currentUser.email}</div>
            </div>
          </div>
          <a href={logoutUrl.toString()} className={styles.profileLogoutButton}>
            Logout
          </a>
        </div>
      )}
    </div>
  );
}
