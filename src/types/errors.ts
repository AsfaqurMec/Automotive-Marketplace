// Error Types for NextDeal Frontend
// These types provide proper typing for error handling throughout the application

// Base Error Types
export interface BaseError {
  message: string;
  code?: string;
  status?: number;
  timestamp: number;
}

// API Error Types
export interface ApiError extends BaseError {
  type: 'api';
  endpoint?: string;
  method?: string;
  response?: unknown;
}

export interface NetworkError extends BaseError {
  type: 'network';
  url?: string;
  reason?: string;
}

export interface ValidationError extends BaseError {
  type: 'validation';
  field: string;
  value?: string | number | boolean | null | undefined;
  constraints?: Record<string, string>;
}

export interface AuthenticationError extends BaseError {
  type: 'authentication';
  action?: 'login' | 'logout' | 'register' | 'password-reset';
  token?: string;
}

export interface AuthorizationError extends BaseError {
  type: 'authorization';
  resource?: string;
  action?: string;
  requiredPermissions?: string[];
}

// Form Error Types
export interface FormError extends BaseError {
  type: 'form';
  field: string;
  formName?: string;
}

export interface FormValidationErrors {
  [field: string]: string | undefined;
}

export interface FormTouchedFields {
  [field: string]: boolean | undefined;
}

// Component Error Types
export interface ComponentError extends BaseError {
  type: 'component';
  componentName: string;
  props?: Record<string, string | number | boolean | null | undefined>;
}

export interface RenderError extends BaseError {
  type: 'render';
  componentStack?: string;
}

// Database Error Types
export interface DatabaseError extends BaseError {
  type: 'database';
  operation?: 'create' | 'read' | 'update' | 'delete';
  collection?: string;
  documentId?: string;
}

export interface DuplicateKeyError extends DatabaseError {
  type: 'database';
  field: string;
  value: string | number;
}

export interface NotFoundError extends DatabaseError {
  type: 'database';
  resource: string;
  id?: string;
}

// File Upload Error Types
export interface FileUploadError extends BaseError {
  type: 'file-upload';
  fileName?: string;
  fileSize?: number;
  allowedTypes?: string[];
  maxSize?: number;
}

export interface FileValidationError extends FileUploadError {
  type: 'file-upload';
  reason: 'size' | 'type' | 'corrupted' | 'permission';
}

// Socket Error Types
export interface SocketError extends BaseError {
  type: 'socket';
  event?: string;
  connectionId?: string;
}

export interface SocketConnectionError extends SocketError {
  type: 'socket';
  reason?: 'timeout' | 'network' | 'server' | 'authentication';
}

// Business Logic Error Types
export interface BusinessError extends BaseError {
  type: 'business';
  operation?: string;
  entity?: string;
}

export interface InsufficientPermissionError extends BusinessError {
  type: 'business';
  requiredRole?: string;
  requiredPermission?: string;
}

export interface ResourceLimitError extends BusinessError {
  type: 'business';
  resource: string;
  limit: number;
  current: number;
}

// Third-party Service Error Types
export interface ThirdPartyError extends BaseError {
  type: 'third-party';
  service: string;
  endpoint?: string;
  response?: unknown;
}

export interface PaymentError extends ThirdPartyError {
  type: 'third-party';
  paymentMethod?: string;
  amount?: number;
  currency?: string;
}

// Generic Error Handler Types
export type AppError =
  | ApiError
  | NetworkError
  | ValidationError
  | AuthenticationError
  | AuthorizationError
  | FormError
  | ComponentError
  | DatabaseError
  | FileUploadError
  | SocketError
  | BusinessError
  | ThirdPartyError;

// Error Handler Function Types
export type ErrorHandler = (error: AppError) => void;

export type ErrorLogger = (error: AppError, context?: Record<string, string | number | boolean | null | undefined>) => void;

export type ErrorNotifier = (error: AppError) => void;

// Error Response Types
export interface ErrorResponse {
  success: false;
  error: AppError;
  timestamp: number;
  requestId?: string;
}

export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
  timestamp: number;
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

// Error Context Types
export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  url?: string;
  method?: string;
  userAgent?: string;
  timestamp: number;
  additionalData?: Record<string, string | number | boolean | null | undefined>;
}

// Error Recovery Types
export interface ErrorRecoveryAction {
  type: 'retry' | 'fallback' | 'redirect' | 'show-error' | 'ignore';
  maxRetries?: number;
  retryDelay?: number;
  fallbackData?: string | number | boolean | null | undefined;
  redirectUrl?: string;
}

export interface ErrorRecoveryStrategy {
  errorType: string;
  actions: ErrorRecoveryAction[];
  priority: number;
}

// Error Boundary Types
export interface ErrorBoundaryState {
  hasError: boolean;
  error?: AppError;
  errorInfo?: {
    componentStack: string;
  };
}

export interface ErrorBoundaryProps {
  fallback?: React.ComponentType<{ error: AppError; resetError: () => void }>;
  onError?: ErrorHandler;
  children: React.ReactNode;
}

// Error Utility Types
export interface ErrorUtils {
  isApiError: (error: unknown) => error is ApiError;
  isNetworkError: (error: unknown) => error is NetworkError;
  isValidationError: (error: unknown) => error is ValidationError;
  isAuthenticationError: (error: unknown) => error is AuthenticationError;
  isAuthorizationError: (error: unknown) => error is AuthorizationError;
  isBusinessError: (error: unknown) => error is BusinessError;
  createError: (type: AppError['type'], message: string, details?: Partial<AppError>) => AppError;
  formatError: (error: unknown) => AppError;
  logError: ErrorLogger;
  notifyError: ErrorNotifier;
}
