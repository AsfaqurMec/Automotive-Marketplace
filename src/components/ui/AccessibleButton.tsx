/**
 * Accessible Button Component - NextDeal Frontend
 *
 * An accessible button component with proper ARIA labels, keyboard navigation,
 * and screen reader support.
 *
 * Features:
 * - Proper ARIA labels and descriptions
 * - Keyboard navigation support
 * - Focus management
 * - Screen reader compatibility
 * - Loading states with accessibility
 */

import React, { forwardRef, useCallback } from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
// Removed unused import

interface AccessibleButtonProps extends Omit<ButtonProps, 'aria-label'> {
  ariaLabel?: string;
  ariaDescription?: string;
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      ariaLabel,
      ariaDescription,
      loading = false,
      loadingText = 'Loading...',
      children,
      disabled,
      onClick,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    // Removed unused theme variable

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        // Handle Enter and Space key presses
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (onClick && !disabled && !loading) {
            // Create a synthetic mouse event for keyboard-triggered clicks
            const syntheticEvent = {
              ...event,
              type: 'click',
              button: 0,
              buttons: 1,
              clientX: 0,
              clientY: 0,
              screenX: 0,
              screenY: 0,
              pageX: 0,
              pageY: 0,
              relatedTarget: null,
              movementX: 0,
              movementY: 0,
            } as unknown as React.MouseEvent<HTMLButtonElement>;
            onClick(syntheticEvent);
          }
        }

        // Call original onKeyDown if provided
        if (onKeyDown) {
          onKeyDown(event);
        }
      },
      [onClick, onKeyDown, disabled, loading],
    );

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick && !disabled && !loading) {
          onClick(event);
        }
      },
      [onClick, disabled, loading],
    );

    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        aria-describedby={ariaDescription ? `${props.id}-description` : undefined}
        aria-busy={loading}
        aria-live="polite"
        role="button"
        tabIndex={disabled ? -1 : 0}
        {...props}
        sx={{
          position: 'relative',
          minHeight: '44px', // Minimum touch target size
          minWidth: '44px',
          ...props.sx,
        }}
      >
        {loading && (
          <CircularProgress
            size={20}
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              marginLeft: '-10px',
              marginTop: '-10px',
            }}
            aria-label={loadingText}
          />
        )}
        <span style={{ visibility: loading ? 'hidden' : 'visible' }}>
          {children}
        </span>
        {ariaDescription && (
          <span id={`${props.id}-description`} className="sr-only">
            {ariaDescription}
          </span>
        )}
      </Button>
    );
  },
);

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;

