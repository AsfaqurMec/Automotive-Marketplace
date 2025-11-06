/**
 * Error Handler Utility - NextDeal Frontend
 *
 * Centralized error handling and logging system for the application.
 * Provides consistent error handling, logging, and user feedback.
 *
 * Features:
 * - Structured error logging
 * - User-friendly error messages
 * - Error categorization
 * - Performance monitoring integration
 * - Development vs production error handling
 */

import { toast } from 'react-toastify';
import { AppError, ApiError } from '../../types/errors';

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Error categories
export enum ErrorCategory {
  API = 'api',
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  UI = 'ui',
  BUSINESS = 'business',
  UNKNOWN = 'unknown'
}

interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp: number;
  userAgent?: string;
  url?: string;
}

interface ErrorLogEntry {
  error: AppError;
  context: ErrorContext;
  severity: ErrorSeverity;
  category: ErrorCategory;
}

class ErrorHandler {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private errorLog: ErrorLogEntry[] = [];

  /**
   * Log an error with context and severity
   */
  logError(
    error: unknown,
    context: Partial<ErrorContext> = {},
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
  ): void {
    const appError = this.formatError(error);
    const errorContext: ErrorContext = {
      timestamp: Date.now(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      ...context,
    };

    const logEntry: ErrorLogEntry = {
      error: appError,
      context: errorContext,
      severity,
      category,
    };

    this.errorLog.push(logEntry);

    // Development logging
    if (this.isDevelopment) {
      // console.group(`🚨 Error [${severity.toUpperCase()}] - ${category}`);
      // console.error('Error:', appError);
      // console.error('Context:', errorContext);
      // console.groupEnd();
    }

    // Production logging (send to external service)
    this.sendToErrorService();

    // Show user notification for high severity errors
    if (severity === ErrorSeverity.HIGH || severity === ErrorSeverity.CRITICAL) {
      this.notifyUser(appError);
    }
  }

  /**
   * Format unknown error into AppError structure
   */
  private formatError(error: unknown): AppError {
    if (this.isApiError(error)) {
      return {
        type: 'api',
        message: error.message || 'API request failed',
        code: error.code || 'UNKNOWN',
        status: error.status,
        endpoint: error.endpoint,
        method: error.method,
        response: error.response,
        timestamp: Date.now(),
      };
    }

    if (error instanceof Error) {
      return {
        type: 'component',
        message: error.message,
        code: 'UNKNOWN_ERROR',
        componentName: 'Unknown',
        timestamp: Date.now(),
      };
    }

    return {
      type: 'component',
      message: String(error),
      code: 'UNKNOWN_ERROR',
      componentName: 'Unknown',
      timestamp: Date.now(),
    };
  }

  /**
   * Type guards for error categorization
   */
  private isApiError(error: unknown): error is ApiError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      'type' in error &&
      error.type === 'api'
    );
  }

  /**
   * Send error to external monitoring service
   */
  private sendToErrorService(): void {
    // In production, send to services like Sentry, LogRocket, etc.
    if (!this.isDevelopment) {
      // Example: Sentry.captureException(logEntry.error);
      // Example: LogRocket.captureException(logEntry.error);
    }
  }

  /**
   * Show user-friendly error notification
   */
  private notifyUser(error: AppError): void {
    const message = this.getUserFriendlyMessage(error);
    toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  /**
   * Get user-friendly error message
   */
  private getUserFriendlyMessage(error: AppError): string {
    switch (error.type) {
      case 'api':
        if (error.status === 401) {
          return 'Please log in to continue';
        }
        if (error.status === 403) {
          return 'You don\'t have permission to perform this action';
        }
        if (error.status === 404) {
          return 'The requested resource was not found';
        }
        if (error.status && error.status >= 500) {
          return 'Server error. Please try again later';
        }
        return error.message || 'Something went wrong. Please try again';

      case 'network':
        return 'Network error. Please check your connection and try again';

      case 'validation':
        return 'Please check your input and try again';

      case 'authentication':
        return 'Authentication failed. Please log in again';

      case 'authorization':
        return 'You don\'t have permission to access this resource';

      default:
        return 'An unexpected error occurred. Please try again';
    }
  }

  /**
   * Handle API errors with automatic categorization
   */
  handleApiError(error: unknown, context?: Partial<ErrorContext>): void {
    const severity = this.getApiErrorSeverity(error);
    const category = ErrorCategory.API;
    this.logError(error, context, severity, category);
  }

  /**
   * Handle network errors
   */
  handleNetworkError(error: unknown, context?: Partial<ErrorContext>): void {
    this.logError(error, context, ErrorSeverity.HIGH, ErrorCategory.NETWORK);
  }

  /**
   * Handle validation errors
   */
  handleValidationError(error: unknown, context?: Partial<ErrorContext>): void {
    this.logError(error, context, ErrorSeverity.LOW, ErrorCategory.VALIDATION);
  }

  /**
   * Handle authentication errors
   */
  handleAuthError(error: unknown, context?: Partial<ErrorContext>): void {
    this.logError(error, context, ErrorSeverity.HIGH, ErrorCategory.AUTHENTICATION);
  }

  /**
   * Determine API error severity based on status code
   */
  private getApiErrorSeverity(error: unknown): ErrorSeverity {
    if (this.isApiError(error)) {
      const status = error.status;
      if (status && status >= 500) return ErrorSeverity.HIGH;
      if (status === 401 || status === 403) return ErrorSeverity.MEDIUM;
      if (status === 404) return ErrorSeverity.LOW;
    }
    return ErrorSeverity.MEDIUM;
  }

  /**
   * Get error log for debugging
   */
  getErrorLog(): ErrorLogEntry[] {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  clearErrorLog(): void {
    this.errorLog = [];
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

// Export convenience functions
export const logError = (error: unknown, context?: Partial<ErrorContext>) =>
  errorHandler.logError(error, context);

export const handleApiError = (error: unknown, context?: Partial<ErrorContext>) =>
  errorHandler.handleApiError(error, context);

export const handleNetworkError = (error: unknown, context?: Partial<ErrorContext>) =>
  errorHandler.handleNetworkError(error, context);

export const handleValidationError = (error: unknown, context?: Partial<ErrorContext>) =>
  errorHandler.handleValidationError(error, context);

export const handleAuthError = (error: unknown, context?: Partial<ErrorContext>) =>
  errorHandler.handleAuthError(error, context);

export default errorHandler;

