import React from 'react';

/**
 * Standard component props that all components should support.
 * Extends HTMLDivElement attributes for full HTML attribute compatibility.
 */
export interface StandardComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  loading?: boolean;
  error?: string | Error | null;
  disabled?: boolean;
  testId?: string;
}

/**
 * Loading state props for async components
 */
export interface LoadingProps {
  loading?: boolean;
  error?: Error | string | null;
}

/**
 * Async state container
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | string | null;
  lastUpdated: Date | null;
}
