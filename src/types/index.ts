// User Types
export interface User {
  id: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  created_at: string
  email_hash: string
  signature: string
}

export interface CreateUserData {
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
}

export interface UpdateUserData {
  email?: string
  role?: 'admin' | 'user'
  status?: 'active' | 'inactive'
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage?: boolean
    hasPrevPage?: boolean
  }
}

// Statistics Types
export interface UserStats {
  total: number
  active: number
  inactive: number
  admins: number
  users: number
}

export interface ChartData {
  date: string
  users: number
}

// Export Types
export interface ExportData {
  users: User[]
  format: 'Protocol Buffer'
  userCount: number
  size: number
}

// Crypto Types
export interface PublicKeyData {
  publicKey: string
  algorithm: string
  hashAlgorithm: string
}

// Form Types
export interface UserFormData {
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
}

// Component Props Types
export interface TableColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, item: T) => React.ReactNode
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  onRowClick?: (item: T) => void
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void
}

// Hook Types
export interface UseApiOptions {
  enabled?: boolean
  refetchOnWindowFocus?: boolean
  staleTime?: number
}

// Error Types
export interface ApiError {
  message: string
  status?: number
  code?: string
}

// Loading States
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// Filter Types
export interface UserFilters {
  role?: 'admin' | 'user'
  status?: 'active' | 'inactive'
  search?: string
}

// Sort Types
export interface SortConfig {
  key: keyof User
  direction: 'asc' | 'desc'
}