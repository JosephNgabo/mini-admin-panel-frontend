// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3026',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
}

// API Endpoints
export const API_ENDPOINTS = {
  USERS: '/api/users',
  USERS_EXPORT: '/api/users/export',
  CRYPTO_PUBLIC_KEY: '/api/users/crypto/public-key',
  HEALTH: '/health',
} as const

// Application Configuration
export const APP_CONFIG = {
  NAME: 'Mini Admin Panel',
  VERSION: '1.0.0',
  DESCRIPTION: 'Professional admin panel with user management, analytics, and cryptographic features',
}

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const

// Table Configuration
export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
  SORT_DIRECTIONS: {
    ASC: 'asc',
    DESC: 'desc',
  },
}

// Chart Configuration
export const CHART_CONFIG = {
  COLORS: {
    PRIMARY: '#002b11',
    SECONDARY: '#64748b',
    SUCCESS: '#22c55e',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
  },
  ANIMATION_DURATION: 300,
}

// Form Validation
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Please enter a valid email address',
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    MESSAGE: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  },
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error: Unable to connect to server',
  SERVER_ERROR: 'Server error: Please try again later',
  VALIDATION_ERROR: 'Please check your input and try again',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  UNKNOWN_ERROR: 'An unknown error occurred',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  DATA_EXPORTED: 'Data exported successfully',
  CHANGES_SAVED: 'Changes saved successfully',
}

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'admin-panel-theme',
  USER_PREFERENCES: 'admin-panel-preferences',
  FILTERS: 'admin-panel-filters',
}

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  API: 'yyyy-MM-dd',
  CHART: 'MMM dd',
  FULL: 'MMMM dd, yyyy HH:mm',
}

// Export Formats
export const EXPORT_FORMATS = {
  PROTOBUF: 'Protocol Buffer',
  JSON: 'JSON',
  CSV: 'CSV',
} as const

// Crypto Configuration
export const CRYPTO_CONFIG = {
  HASH_ALGORITHM: 'SHA-384',
  SIGNATURE_ALGORITHM: 'RSA-2048',
  KEY_SIZE: 2048,
}

