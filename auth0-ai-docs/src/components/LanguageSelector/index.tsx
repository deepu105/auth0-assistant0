import clsx from 'clsx';
import React, { ReactNode, useState } from 'react';

import useBaseUrl from '@docusaurus/useBaseUrl';

import TooltipWrapper from '../TooltipWrapper';
import styles from './index.module.css';

type Props = {
  children: ReactNode[];
  title: string;
  defaultSelected: string;
};

export default function LanguageSelector({
  children,
  title = 'Pick Your Tech Stack',
  defaultSelected = 'js',
}: Props): ReactNode {
  const [selected, setSelected] = useState(defaultSelected);
  const handleSelect = (language) => {
    setSelected(language);
  };

  const getLanguageTile = (child: React.ReactElement): ReactNode => (
    <button
      key={child.props.id}
      onClick={
        child.props.disabled ? () => {} : () => handleSelect(child.props.id)
      }
      className={clsx(
        styles.languageSelectorOption,
        child.props.disabled && styles.languageSelectorOptionDisabled,
        !child.props.disabled &&
          selected === child.props.id &&
          styles.languageSelectorOptionSelected
      )}
    >
      <span className={styles.languageSelectorOptionImageContainer}>
        <img
          src={useBaseUrl(`/img/${child.props.icon}`)}
          alt={child.props.name}
          className={styles.languageSelectorOptionImage}
        />
      </span>
      {child.props.name}
    </button>
  );

  return (
    <div className={styles.languageSelector}>
      <p className={styles.languageSelectorTitle}>{title}</p>

      <div className={styles.languageSelectorContainer}>
        {children?.map(
          (child) =>
            React.isValidElement(child) &&
            (!child.props.disabled ? (
              getLanguageTile(child)
            ) : (
              <TooltipWrapper text="Coming soon!">
                {getLanguageTile(child)}
              </TooltipWrapper>
            ))
        )}
      </div>

      <hr />

      {children?.map(
        (child) =>
          React.isValidElement(child) && (
            <div
              key={child?.props.id}
              className={clsx(
                styles.languageSelection,
                child.props.id === selected && styles.languageSelectionSelected
              )}
            >
              {child}
            </div>
          )
      )}
    </div>
  );
}
