// Utility Types for NextDeal Frontend
// These types provide better type safety and replace 'any' usage

// Generic Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Record Types
export type StringRecord = Record<string, string>;
export type NumberRecord = Record<string, number>;
export type BooleanRecord = Record<string, boolean>;
export type UnknownRecord = Record<string, unknown>;

// Function Types
export type VoidFunction = () => void;
export type AsyncVoidFunction = () => Promise<void>;
export type FunctionWithParams<T = unknown> = (params: T) => void;
export type AsyncFunctionWithParams<T = unknown, R = unknown> = (params: T) => Promise<R>;

// API Types
export type ApiParams = Record<string, string | number | boolean | undefined>;
export type ApiHeaders = Record<string, string>;
export type ApiQueryParams = Record<string, string | number | boolean | string[] | number[]>;

// Form Types
export type FormValues = Record<string, string | number | boolean | File | File[]>;
export type FormErrors = Record<string, string>;
export type FormTouched = Record<string, boolean>;

// Component Props Types
export type ComponentProps<T = unknown> = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
} & T;

// Event Handler Types
export type EventHandlerFunction<T = unknown> = (event: T) => void;
export type AsyncEventHandlerFunction<T = unknown> = (event: T) => Promise<void>;

// Callback Types
export type CallbackFunction<T = unknown> = (data: T) => void;
export type AsyncCallbackFunction<T = unknown> = (data: T) => Promise<void>;

// State Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// Validation Types
export type ValidationRule = {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
  validator?: (value: unknown) => boolean | string;
};

export type ValidationSchema = Record<string, ValidationRule[]>;

// Filter Types
export type FilterOption = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

export type FilterConfig = {
  field: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'range';
  options?: FilterOption[];
  placeholder?: string;
};

// Sort Types
export type SortDirection = 'asc' | 'desc';
export type SortConfig = {
  field: string;
  direction: SortDirection;
};

// Pagination Types
export type PaginationConfig = {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
};

// Modal Types
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalConfig = {
  isOpen: boolean;
  title?: string;
  size?: ModalSize;
  closable?: boolean;
  maskClosable?: boolean;
};

// Notification Types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type NotificationConfig = {
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  placement?: 'top' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
};

// File Types
export type FileUploadConfig = {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxCount?: number;
};

export type FileUploadResult = {
  file: File;
  url?: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
};

// Search Types
export type SearchConfig = {
  placeholder?: string;
  allowClear?: boolean;
  onSearch?: (value: string) => void;
  onClear?: () => void;
};

// Table Types
export type TableColumn<T = unknown> = {
  key: string;
  title: string;
  dataIndex: keyof T;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number | string;
  fixed?: 'left' | 'right';
  ellipsis?: boolean;
};

export type TableConfig<T = unknown> = {
  columns: TableColumn<T>[];
  dataSource: T[];
  loading?: boolean;
  pagination?: PaginationConfig;
  rowKey?: string | ((record: T) => string);
  rowSelection?: {
    type?: 'checkbox' | 'radio';
    selectedRowKeys?: string[];
    onChange?: (selectedRowKeys: string[], selectedRows: T[]) => void;
  };
};

// Chart Types
export type ChartDataPoint = {
  name: string;
  value: number;
  color?: string;
};

export type ChartConfig = {
  type: 'line' | 'bar' | 'pie' | 'area';
  data: ChartDataPoint[];
  height?: number;
  width?: number;
  title?: string;
  xAxis?: {
    title?: string;
    dataKey?: string;
  };
  yAxis?: {
    title?: string;
    dataKey?: string;
  };
};

// Socket Types
export type SocketConfig = {
  userId: string;
  role: string;
  token: string;
};

export type SocketMessage = {
  event: string;
  payload: unknown;
  timestamp: number;
  userId?: string;
};

// Cache Types
export type CacheConfig = {
  key: string;
  ttl?: number; // Time to live in seconds
  tags?: string[];
};

export type CacheEntry<T = unknown> = {
  data: T;
  timestamp: number;
  ttl: number;
  tags: string[];
};

// Error Types
export type AppError = {
  code: string;
  message: string;
  details?: unknown;
  timestamp: number;
};

export type ValidationError = {
  field: string;
  message: string;
  value?: unknown;
};

// Response Types
export type ApiResponse<T = unknown> = {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  statusCode?: number;
};

export type PaginatedResponse<T = unknown> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

// Hook Types
export type HookReturn<T = unknown> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  mutate: (data: T) => void;
};

// Context Types
export type ContextValue<T = unknown> = {
  state: T;
  dispatch: React.Dispatch<React.SetStateAction<T>>;
  actions?: Record<string, FunctionWithParams>;
};

// Router Types
export type RouteParams = Record<string, string>;
export type QueryParams = Record<string, string | string[]>;

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorPalette = {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
};

// Language Types
export type Language = 'en' | 'he' | 'ar';
export type Direction = 'ltr' | 'rtl';

// Permission Types
export type Permission = {
  resource: string;
  action: string;
  conditions?: Record<string, unknown>;
};

export type Role = {
  name: string;
  permissions: Permission[];
  description?: string;
};

// Audit Types
export type AuditLog = {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, unknown>;
  timestamp: number;
  ip?: string;
  userAgent?: string;
};

// Analytics Types
export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, unknown>;
  timestamp: number;
  userId?: string;
  sessionId?: string;
};

export type AnalyticsConfig = {
  enabled: boolean;
  trackingId?: string;
  debug?: boolean;
  anonymize?: boolean;
};
