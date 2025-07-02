import React, { ReactNode } from 'react';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';

interface ImageCardProps {
  image: string;
  alt: string;
}

export default function ImageCard({ image, alt }: ImageCardProps): ReactNode {
  return (
    <div className={styles.imageCardContainer}>
      <img src={useBaseUrl(`/img/${image}`)} alt={alt} />
    </div>
  );
}
