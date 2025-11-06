// Event Types for NextDeal Frontend
// These types provide proper typing for all event handlers throughout the application

import { ChangeEvent, FormEvent, MouseEvent, KeyboardEvent, FocusEvent } from 'react';

// Form Events
// export interface FormChangeEvent extends ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
//   target: {
//     name: string;
//     value: string | number | boolean;
//     type: string;
//     checked?: boolean;
//   };
// }

export interface FormSubmitEvent extends FormEvent<HTMLFormElement> {
  target: HTMLFormElement;
}

// Input Events
export interface InputChangeEvent extends ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    name: string;
    value: string;
    type: string;
    checked?: boolean;
  };
}

export interface SelectChangeEvent extends ChangeEvent<HTMLSelectElement> {
  target: HTMLSelectElement & {
    name: string;
    value: string;
  };
}

export interface TextareaChangeEvent extends ChangeEvent<HTMLTextAreaElement> {
  target: HTMLTextAreaElement & {
    name: string;
    value: string;
  };
}

// Material-UI Events
export interface MuiSelectChangeEvent {
  target: {
    name?: string;
    value: string | number | boolean | Array<string | number | boolean>;
  };
}

// export interface MuiAutocompleteChangeEvent<T = any> {
//   target: {
//     value: T | null;
//   };
// }

// Click Events
export interface ButtonClickEvent extends MouseEvent<HTMLButtonElement> {
  target: HTMLButtonElement;
}

export interface DivClickEvent extends MouseEvent<HTMLDivElement> {
  target: HTMLDivElement;
}

// Keyboard Events
export interface KeyboardEventType extends KeyboardEvent<HTMLInputElement | HTMLTextAreaElement> {
  target: HTMLInputElement | HTMLTextAreaElement;
  key: string;
  code: string;
}

// Focus Events
export interface FocusEventType extends FocusEvent<HTMLInputElement | HTMLTextAreaElement> {
  target: HTMLInputElement | HTMLTextAreaElement;
}

// File Upload Events
export interface FileChangeEvent extends ChangeEvent<HTMLInputElement> {
  target: HTMLInputElement & {
    files: FileList | null;
    name: string;
  };
}

// Dropzone Events
export interface DropzoneEvent {
  acceptedFiles: File[];
  rejectedFiles: File[];
  type: 'drop' | 'dragenter' | 'dragleave';
}

// Custom Event Types
// export interface CustomChangeEvent<T = any> {
//   target: {
//     name: string;
//     value: T;
//   };
// }

export interface SearchChangeEvent {
  target: {
    value: string;
  };
}

export interface FilterChangeEvent {
  target: {
    name: string;
    value: string | number | boolean | Array<string>;
  };
}

// Socket Events
// export interface SocketEvent {
//   event: string;
//   data: any;
//   timestamp: number;
// }

// API Response Events
// export interface ApiResponseEvent<T = any> {
//   success: boolean;
//   data: T;
//   message?: string;
//   error?: string;
//   status: number;
// }

// Navigation Events
export interface NavigationEvent {
  pathname: string;
  search: string;
  hash: string;
}

// Modal Events
// export interface ModalEvent {
//   isOpen: boolean;
//   data?: any;
// }

// Table Events
// export interface TableEvent {
//   page: number;
//   pageSize: number;
//   sortBy?: string;
//   sortOrder?: 'asc' | 'desc';
//   filters?: Record<string, any>;
// }

// Pagination Events
export interface PaginationEvent {
  current: number;
  pageSize: number;
  total: number;
}

// Sort Events
export interface SortEvent {
  field: string;
  order: 'asc' | 'desc';
}

// Filter Events
// export interface FilterEvent {
//   field: string;
//   value: any;
//   operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
// }

// Validation Events
export interface ValidationEvent {
  field: string;
  isValid: boolean;
  message?: string;
}

// Loading Events
export interface LoadingEvent {
  isLoading: boolean;
  message?: string;
}

// Error Events
export interface ErrorEvent {
  error: Error | string;
  context?: string;
  timestamp: number;
}

// Success Events
// export interface SuccessEvent {
//   message: string;
//   data?: any;
//   timestamp: number;
// }

// Notification Events
export interface NotificationEvent {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Export all event types
export type {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  KeyboardEvent,
  FocusEvent,
};
