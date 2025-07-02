import React, { ReactNode } from 'react';
import styles from './styles.module.css';

interface SpinnerProps {
  size?: 'xs' | 'sm';
}

export default function Spinner({ size = 'sm' }: SpinnerProps): ReactNode {
  return <div className={styles.spinner + ' ' + styles[size]}></div>;
}
