import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import clsx from 'clsx';
import copy from 'copy-text-to-clipboard';
import { translate } from '@docusaurus/Translate';
import type { Props } from '@theme/CodeBlock/CopyButton';
import IconCopy from '@theme/Icon/Copy';
import IconSuccess from '@theme/Icon/Success';

import { ExtendedCodeBlockProps } from '../index';

import styles from './styles.module.css';

interface customProps extends Props {
  floating?: boolean;
}

export default function floating({
  code,
  className,
  onCopyClick,
  floating = false,
}: ExtendedCodeBlockProps & customProps): ReactNode {
  const [isCopied, setIsCopied] = useState(false);
  const elementRef = useRef(null);

  const copyTimeout = useRef<number | undefined>(undefined);

  const handleCopyCode = useCallback(() => {
    // if provided, let callback handle copying to clipboard
    if (onCopyClick) {
      onCopyClick(code);
    } else {
      copy(code);
    }
    setIsCopied(true);
    copyTimeout.current = window.setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  }, [onCopyClick, code]);

  useEffect(() => () => window.clearTimeout(copyTimeout.current), []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const element = elementRef.current;
      const style = window.getComputedStyle(element);
      const opacityValue = style.opacity;
      if (
        opacityValue === '1' &&
        (event.ctrlKey || event.metaKey) &&
        (event.key === 'c' || event.key === 'C')
      ) {
        handleCopyCode();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleCopyCode]);

  return (
    <div
      className={clsx(
        styles.copyButtonWrapper,
        floating && styles.copyButtonFloating
      )}
      ref={elementRef}
    >
      <span className={styles.copyShortkey}>
        {navigator?.platform?.toLowerCase()?.indexOf('mac') >= 0 ? '⌘' : 'ctrl'}
        <span className={styles.copyShortKeySmall}>+</span>C
      </span>
      <button
        type="button"
        aria-label={
          isCopied
            ? translate({
                id: 'theme.CodeBlock.copied',
                message: 'Copied',
                description: 'The copied button label on code blocks',
              })
            : translate({
                id: 'theme.CodeBlock.copyButtonAriaLabel',
                message: 'Copy code to clipboard',
                description: 'The ARIA label for copy code blocks button',
              })
        }
        title={translate({
          id: 'theme.CodeBlock.copy',
          message: 'Copy',
          description: 'The copy button label on code blocks',
        })}
        className={clsx(
          className,
          styles.copyButton,
          isCopied && styles.copyButtonCopied
        )}
        onClick={handleCopyCode}
      >
        <span className={styles.copyButtonIcons} aria-hidden="true">
          <IconCopy className={styles.copyButtonIcon} />
          <IconSuccess className={styles.copyButtonSuccessIcon} />
        </span>
      </button>
    </div>
  );
}
