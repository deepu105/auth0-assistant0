import React, { ReactNode } from 'react';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { CardCTA, CardCTAProps } from './CardCTA';

interface Checkbox {
  isChecked: boolean;
}

interface CardProps {
  headerText?: string;
  href?: string;
  icon?: string;
  iconBorder?: boolean;
  checkbox?: Checkbox;
  children?: React.ReactNode;
  cta?: CardCTAProps;
  tags?: string[];
}

export default function Card({
  headerText,
  icon,
  iconBorder = true,
  checkbox,
  children,
  cta,
  tags,
  href,
}: CardProps): ReactNode {
  const CardInternals = (
    <div className={styles.cardContainer}>
      {icon && !checkbox && (
        <span
          className={
            iconBorder
              ? styles.iconContainer
              : styles.iconContainer + ' ' + styles.noIconBorder
          }
        >
          <img
            src={useBaseUrl(`/img/${icon}`)}
            alt={headerText}
            className={
              iconBorder
                ? styles.iconImage
                : styles.iconImage + ' ' + styles.noIconBorder
            }
          />
        </span>
      )}
      {checkbox && !icon && (
        <span className={styles.checkboxContainer}>
          {checkbox.isChecked ? (
            <img
              src={useBaseUrl(`/img/checkbox-checked.svg`)}
              alt="checked"
              className={styles.iconImage}
            />
          ) : (
            <img
              src={useBaseUrl(`/img/checkbox-uncheck.svg`)}
              alt="unchecked"
              className={styles.iconImage}
            />
          )}
        </span>
      )}
      <div className={styles.cardBody}>
        {headerText && <h3 className={styles.cardHeader}>{headerText}</h3>}
        {children && <div>{children}</div>}
      </div>
      {(cta || tags) && (
        <div className={styles.cardHeaderCTAContainer}>
          {cta && !tags && <CardCTA {...cta} />}
          {tags && !cta && (
            <div className={styles.tagsContainer}>
              {tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
  if (href) {
    return (
      <a className={styles.cardLink} href={href}>
        {CardInternals}
      </a>
    );
  }
  return CardInternals;
}
