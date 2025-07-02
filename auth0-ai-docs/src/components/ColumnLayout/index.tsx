import React, { ReactNode } from 'react';
import styles from './styles.module.css';

interface ColumnLayoutProps {
  children?: ReactNode[];
}

export default function ColumnLayout({
  children,
}: ColumnLayoutProps): ReactNode {
  return (
    <div className={styles.columnLayoutContainer}>
      {children?.map((child, i) => (
        <div
          className={
            i === 0
              ? styles.columnLayoutSection + ' ' + styles.noborder
              : styles.columnLayoutSection
          }
        >
          {child}
        </div>
      ))}
    </div>
  );
}
