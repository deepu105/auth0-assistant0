import React, { ReactNode } from 'react';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Spinner from '@site/src/components/Spinner';

export interface CardCTAProps {
  loading?: boolean;
  disabled: boolean;
  text: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
}

export function CardCTA({
  loading,
  disabled,
  text,
  icon = 'app_icon.svg',
  href,
  onClick,
}: CardCTAProps): ReactNode {
  if (loading) {
    return (
      <span className={styles.loading}>
        <Spinner />
      </span>
    );
  }
  return (
    <div
      className={
        !disabled
          ? styles.cardCTAContainer
          : styles.cardCTAContainer + ' ' + styles.disabled
      }
      onClick={() => (!disabled && onClick ? onClick() : null)}
    >
      <img src={useBaseUrl(`/img/${icon}`)} alt="icon" />
      {!disabled ? (
        <a className={styles.cardCTA} href={href}>
          {text}
        </a>
      ) : (
        <span className={styles.cardCTA}>{text}</span>
      )}
    </div>
  );
}
