import { useTooltipTrigger, useTooltip } from 'react-aria';
import { useTooltipTriggerState } from 'react-stately';
import React, { useRef, useState, ReactNode } from 'react';
import styles from './styles.module.css';

interface TooltipWrapperProps {
  children: ReactNode;
  text: string;
  position?: 'above' | 'below';
}

export default function TooltipWrapper({
  children,
  text,
  position = 'above',
}: TooltipWrapperProps): ReactNode {
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const state = useTooltipTriggerState({});
  const { triggerProps, tooltipProps } = useTooltipTrigger(
    {
      delay: 0,
    },
    state,
    triggerRef
  );
  const { tooltipProps: ariaTooltipProps } = useTooltip(
    {
      ...tooltipProps,
      isOpen: state.isOpen,
    },
    state
  );

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const enterDelayMs = 50;
  const leaveDelayMs = 100;
  const enterTimeoutRef = useRef<number | null>(null);
  const leaveTimeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);

      leaveTimeoutRef.current = null;
    }

    enterTimeoutRef.current = window.setTimeout(() => {
      state.open();

      setIsTooltipVisible(true);
    }, enterDelayMs);
  };

  const handleMouseLeave = () => {
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current);

      enterTimeoutRef.current = null;
    }

    leaveTimeoutRef.current = window.setTimeout(() => {
      state.close();

      setIsTooltipVisible(false);
    }, leaveDelayMs);
  };

  return (
    <div
      className={styles.tooltipContainer}
      ref={triggerRef}
      {...triggerProps}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <span
        ref={tooltipRef}
        {...ariaTooltipProps}
        className={
          position === 'above'
            ? styles.tooltip + ' ' + styles.above
            : styles.tooltip + ' ' + styles.below
        }
        data-visible={isTooltipVisible}
      >
        {text}
      </span>
    </div>
  );
}
