// Core User Types
export interface User {
  _id: string;
  fullName?: string;
  email?: string;
  profileImage?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  // Additional fields from user data
  authenticated?: boolean;
  carsPosted?: string[];
  companyName?: string;
  contactPerson?: string;
  googleAdsAccountCurrencyCode?: string;
  googleAdsAccountTimeZone?: string;
  googleAdsCustomerId?: string;
  isBlocked?: boolean;
  isEmailVerified?: boolean;
  isVerified?: boolean;
  licenseExpiry?: string;
  numberOfReviews?: number;
  rating?: number;
  renewDate?: string;
  subscriptionId?: string;
  roleId?: string;
  role?: {
    _id: string;
    roleId: string;
    description: string;
    permissions: {
      adminPanel: {
        access: boolean;
        viewUser: boolean;
        deleteUser: boolean;
        viewDealer: boolean;
        deleteDealer: boolean;
      };
      ads: {
        view: boolean;
        create: boolean;
        edit: boolean;
        delete: boolean;
      };
      car: {
        view: boolean;
        create: boolean;
        delete: boolean;
        edit: boolean;
      };
      leads: {
        view: boolean;
        assign: boolean;
        remind: boolean;
        email: boolean;
        create: boolean;
      };
      settings: {
        update: boolean;
      };
      sidebar: {
        dashboard: boolean;
        inventory: boolean;
        crm: boolean;
        community: boolean;
        customers: boolean;
      };
      spares: {
        view: boolean;
        create: boolean;
        edit: boolean;
        delete: boolean;
      };
      subscription: {
        view: boolean;
        manage: boolean;
      };
      users: {
        manage: boolean;
      };
    };
    createdAt: string;
    updatedAt: string;
  };
}

// Authentication Types
export interface AuthState {
  user: User | null;
  isGettingLoggedIn: boolean;
  isLoading: boolean;
  isLoggingIn: boolean; // Loading state during login navigation
  isLoggingOut: boolean; // Loading state during logout navigation
  setIsGettingLoggedIn: (val: boolean) => void;
  setIsLoading: (val: boolean) => void;
  setIsLoggingIn: (val: boolean) => void;
  setIsLoggingOut: (val: boolean) => void;
  setUser: (user: User | null) => void;
  updateUser: (userUpdate: Partial<User>) => void;
  login: (user: User, token?: string) => void;
  userStatus: () => void;
  logout: () => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  role: 'dealer' | 'customer' | 'garage';
  phone?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordResetData {
  token: string;
  newPassword: string;
}

// Vehicle Types
export interface Vehicle {
  _id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  fuelType: string;
  transmission: string;
  mileage: number;
  condition: string;
  status: string;
  type: string;
  public: boolean;
  postedBy: string;
  vinNumber?: string;
  productCode?: string;
  priceNegotiable?: boolean;
  slug?: string;
  media?: Array<{ url: string }>;
  location?: {
    city: string;
    country: string;
    state?: string;
  };
  contactInfo?: {
    phone: string;
    email: string;
    name: string;
  };
  description?: string;
  features?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleFormData {
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  fuelType: string;
  transmission: string;
  mileage: number;
  condition: string;
  type: string;
  description?: string;
  features?: string[];
  location?: {
    city: string;
    country: string;
  };
  media?: File[];
}

// Dealer Types
export interface Dealer {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  logo?: string;
  isVerified?: boolean;
  rating?: number;
  numberOfReviews?: number;
  businessLicenseNumber?: string;
  licenseExpiry?: string;
  carsPosted?: string[];
  isBlocked?: boolean;
  contactPerson?: string;
  lastLogin?: string;
  profileImage?: string;
}

export interface DealerFormData {
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
}

// Customer Types
export interface Customer {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerFormData {
  fullName: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
}

// Garage Types
export interface Garage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  services?: string[];
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface GarageFormData {
  name: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  services?: string[];
}

// Lead Types
export interface Lead {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  source?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  assignedTo?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  budget?: string;
  interestedIn?: string;
  reminder?: string;
  task?: string;
  googleCalendarSyncStatus?: string;
  trackingInfo?: string;
  emailLogs?: string;
  [key: string]: unknown;
  aiReason?: string;
  data?: string;
}

export interface LeadFormData {
  fullName: string;
  email: string;
  phone?: string;
  source?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  assignedTo?: string;
  notes?: string;
}

// Campaign Types
export interface Campaign {
  _id: string;
  name: string;
  title?: string;
  type: 'email' | 'sms' | 'social';
  status: 'draft' | 'active' | 'paused' | 'completed';
  targetAudience?: string[];
  content?: string;
  scheduledAt?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  display?: string[];
  headlines?: string[];
  descriptions?: string[];
  campaigns?: Campaign[];
  creativeData?: {
    headlines?: string[];
    descriptions?: string[];
  };
  payment?: {
    status: 'pending' | 'succeeded' | 'failed';
    invoiceLink?: string;
    price?: number;
  };
  creative?: Array<{
    url?: string;
    image?: string;
  }>;
  creativeABTesting?: boolean;
  impressions?: Array<{
    totalImpressions: number;
    totalClicks: number;
  }>;
}

export interface CampaignFormData {
  name: string;
  type: 'email' | 'sms' | 'social';
  targetAudience?: string[];
  content?: string;
  scheduledAt?: string;
}

// Advertisement Types
export interface Advertisement {
  _id: string;
  title: string;
  type: 'display' | 'search' | 'video';
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget?: number;
  targetAudience?: string[];
  content?: {
    headline?: string;
    description?: string;
    image?: string;
    finalUrl?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  display?: string[];
  headlines?: string[];
  descriptions?: string[];
}

export interface AdvertisementFormData {
  title: string;
  type: 'display' | 'search' | 'video';
  budget?: number;
  targetAudience?: string[];
  content?: {
    headline?: string;
    description?: string;
    image?: File | string;
    finalUrl?: string;
  };
}

// Creative Data Types for Advertisements
export interface HeadlineItem {
  text: string;
}

export interface DescriptionItem {
  text: string;
}

export interface SearchAdCreative {
  finalUrl: string;
  headlines: HeadlineItem[];
  descriptions: DescriptionItem[];
  path1: string;
  path2: string;
  image: File | null;
  imgUrl: string;
}

export interface DisplayAdCreative {
  finalUrl: string;
  image: File | null;
  imgUrl: string;
  headline: string;
  descriptionText: string;
}

export interface CreativeData {
  finalUrl: string;
  headlines?: HeadlineItem[];
  descriptions?: DescriptionItem[];
  path1?: string;
  path2?: string;
  image: File | null;
  imgUrl: string;
  headline?: string;
  descriptionText?: string;
}

export interface NewAdvertisementFormData {
  title: string;
  description: string;
  campaignObjective: string;
  networks: string[];
  adType: string;
  dailyBudget: number;
  biddingStrategy: string;
  targetLocations: string;
  isABTesting: boolean;
  searchAdA: SearchAdCreative;
  searchAdB: SearchAdCreative;
  displayAdA: DisplayAdCreative;
  displayAdB: DisplayAdCreative;
  startDate: string;
  endDate: string;
  total: number;
}

// Chat Types
export interface ChatMessage {
  _id: string;
  sender: string | User;
  receiver: string;
  content: string;
  type: 'text' | 'image' | 'file';
  timestamp: string;
  read: boolean;
  tempId?: string;
  chatId?: string;
  fileName?: string;
  fileUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  isLoading?: boolean;
  isFailed?: boolean;
  isRetry?: boolean;
  messages?: ChatMessage[];
}

export interface ChatDetails extends ChatRoom {
  _id: string;
  type: 'd2d' | 'ai' | 'd2c';
  isNewChatContext?: boolean;
  assistant?: User;
  dealer?: User;
  customer?: User;
  dealers?: User[];
  chat?: ChatRoom;
}

export interface ChatRoom {
  data: any;
  _id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  type?: 'd2d' | 'ai' | 'd2c';
  name?: string;
  dealer?: User;
  customer?: User;
  other?: User;
  avatar?: string;
  lastMessageTime?: string;
  dealers?: User[];
  messages?: ChatMessage[];
}

// Community Types
export interface CommunityPost {
  _id: string;
  author?: string; // For backward compatibility
  dealerId?: string; // ObjectId of the dealer
  content: string;
  media?: Array<{ url: string; type: 'image' | 'video' }>;
  likes: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  text?: string;
  views?: number;
}

export interface Comment {
  _id: string;
  author?: string; // For backward compatibility
  commenterId?: string; // ObjectId of the commenter
  content?: string;
  text?: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  pagination?: {
    pages: number;
    page: number;
    total: number;
    hasMore: boolean;
  };
}

// Form Error Types
export interface FormErrors {
  [key: string]: string | undefined;
}

export interface FormTouched {
  [key: string]: boolean | undefined;
}

// Theme Types
export interface Theme {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

// Permission Types
export interface Permission {
  module: string;
  action: string;
  allowed: boolean;
}

export interface UserPermissions {
  [key: string]: Permission[];
}

// Subscription Types
export interface Subscription {
  _id: string;
  userId: string;
  plan: 'basic' | 'premium' | 'enterprise';
  planName: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  features: {
    supportLevel: string;
    carPostLimit: number;
    leadAccess: boolean;
    featuredListing: boolean;
    ads: {
      totalCreateLimit: number;
      createDurationDays: number;
      canCreate: boolean;
      canDelete: boolean;
    };
  };
  price: number;
  durationDays: number;
  description: string;
  notes: string;
  subscriptionId: string;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  filter?: Record<string, unknown>;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface TableProps<T> extends BaseComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number) => void;
  };
}

export interface TableColumn<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  render?: (value: unknown, record: T) => React.ReactNode;
  sortable?: boolean;
  width?: number;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'file' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// File Upload Types
export interface FileUpload {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

// Search Types
export interface SearchFilters {
  brand?: string;
  model?: string;
  year?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  location?: string;
  condition?: string;
  fuelType?: string;
  transmission?: string;
}

// Location Types
export interface Location {
  city: string;
  state?: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Analytics Types
export interface AnalyticsData {
  totalUsers: number;
  totalVehicles: number;
  totalLeads: number;
  totalRevenue: number;
  monthlyGrowth: number;
  topPerformingDealers: Array<{
    name: string;
    sales: number;
  }>;
}

// Export all types from other files
export * from './events';
export * from './utils';

// Explicitly re-export event and error types to avoid ambiguity
export * from './events';
export type { AppError, ValidationError } from './utils';
export * from './errors';

// Socket Types
export interface SocketConfig {
  userId: string;
  role: string;
  token: string;
}

export interface SocketMessage {
  event: string;
  data: unknown;
  timestamp: number;
}

// All types are already exported above

// Chat Types
export interface Chat {
  _id: string;
  type: 'd2d' | 'ai';
  name?: string;
  dealer?: User;
  customer?: User;
  other?: User;
  lastMessage?: Message;
  unreadCount: number;
  lastMessageTime?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  timestamp: string;
  read: boolean;
}

// Chat sidebar props
export interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chats: ChatRoom[];
  onChatSelect: (chat: ChatRoom) => void;
  selectedChatId?: string;
  onCloseDrawer?: () => void;
  isLoading?: boolean;
}

// Car details interface
export interface CarDetails {
  _id: string;
  make: string;
  model: string;
  brand: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  engineSize?: string;
  color?: string;
  description: string;
  images?: string[];
  features?: string[];
  condition: string;
  status: string;
  dealerId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Form Data Types
export interface FormData {
  [key: string]: unknown;
}

// File Types
export interface FileWithPreview {
  file: File;
  preview: string;
}

// Email Types
export interface EmailLog {
  sentAt: string;
  subject: string;
  status: string;
  response: string;
  content: string;
}
