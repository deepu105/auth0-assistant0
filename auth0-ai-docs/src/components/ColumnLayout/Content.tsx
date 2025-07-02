import { ReactNode } from 'react';
import styles from './styles.module.css';

type ContentProps = {
  children: ReactNode[];
};

export function ContentLeft({ children }: ContentProps): ReactNode {
  return <div className={styles.columnLayoutContentLeft}>{children}</div>;
}

export function ContentRight({ children }: ContentProps): ReactNode {
  return <div className={styles.columnLayoutContentRight}>{children}</div>;
}
