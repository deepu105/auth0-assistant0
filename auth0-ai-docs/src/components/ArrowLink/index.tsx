import React, { ReactNode } from 'react';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

interface ArrowLinkProps {
  href: string;
  text: string;
  newTab?: boolean;
}

export default function ArrowLink({
  href,
  text,
  newTab = true,
}: ArrowLinkProps): ReactNode {
  return (
    <span className={styles.arrowLinkContainer}>
      <a href={href} target={newTab ? '_blank' : '_self'}>
        {text}
      </a>
      <img
        src={useBaseUrl('/img/icon-arrow-up-right.svg')}
        alt="Arrow icon"
        className={styles.arrowIcon}
      />
    </span>
  );
}
