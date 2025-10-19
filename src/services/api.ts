import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { User, CreateUserData, UpdateUserData, UserStats, ChartData, PublicKeyData, ApiResponse, PaginatedResponse } from '@/types'
import { API_CONFIG, API_ENDPOINTS, ERROR_MESSAGES } from '../constants'

class ApiService {
  private api: AxiosInstance
  private requestCache = new Map<string, Promise<any>>()

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken')
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        
        if (import.meta.env.DEV) {
        }
        return config
      },
      (error: AxiosError) => {
        console.error('❌ Request Error:', error)
        return Promise.reject(error)
      }
    )

    // Enhanced response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log successful response in development
        if (import.meta.env.DEV) {
        }
        return response
      },
      (error: AxiosError) => {
        // Enhanced error handling
        const errorMessage = this.getErrorMessage(error)
        
        if (import.meta.env.DEV) {
          console.error(' API Error:', {
            status: error.response?.status,
            message: errorMessage,
            url: error.config?.url,
            data: error.response?.data,
          })
        }

        // Handle specific error cases
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken')
          // Don't redirect automatically, let components handle it
        }

        return Promise.reject({
          ...error,
          message: errorMessage,
          status: error.response?.status,
        })
      }
    )
  }

  // User Management
  async getUsers(page = 1, limit = 10): Promise<ApiResponse<User[]>> {
    try {
      const response = await this.api.get(`${API_ENDPOINTS.USERS}?page=${page}&limit=${limit}`)
      // Fallback simple shape for legacy callers
      return {
        success: response.data.success,
        data: response.data.data?.users || [],
        message: response.data.message
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Paginated Users (with metadata)
  async getUsersPaginated(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    try {
      const response = await this.api.get(`${API_ENDPOINTS.USERS}?page=${page}&limit=${limit}`)
      const users = response.data?.data?.users || response.data?.data || []
      const apiMeta = response.data?.data?.pagination || response.data?.pagination
      const pagination = apiMeta
        ? {
            page: Number(apiMeta.page ?? page),
            limit: Number(apiMeta.limit ?? limit),
            total: Number(apiMeta.total ?? apiMeta.totalCount ?? (Array.isArray(users) ? users.length : 0)),
            totalPages: Number(apiMeta.totalPages ?? 1),
            hasNextPage: Boolean(apiMeta.hasNextPage ?? (Number(apiMeta.page ?? page) < Number(apiMeta.totalPages ?? 1))),
            hasPrevPage: Boolean(apiMeta.hasPrevPage ?? (Number(apiMeta.page ?? page) > 1)),
          }
        : {
            page,
            limit,
            total: Array.isArray(users) ? users.length : 0,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          }
      return {
        success: Boolean(response.data?.success ?? true),
        data: users,
        pagination,
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      const response = await this.api.get(`${API_ENDPOINTS.USERS}/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async createUser(userData: CreateUserData): Promise<ApiResponse<User>> {
    try {
      const response = await this.api.post(API_ENDPOINTS.USERS, userData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<ApiResponse<User>> {
    try {
      const response = await this.api.put(`${API_ENDPOINTS.USERS}/${id}`, userData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async deleteUser(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await this.api.delete(`${API_ENDPOINTS.USERS}/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Statistics
  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return this.cachedRequest('user-stats', () => 
      this.retryRequest(async () => {
        const response = await this.api.get(`${API_ENDPOINTS.USERS}/stats`)
        return response.data
      })
    )
  }

  async getChartData(days = 7): Promise<ApiResponse<ChartData[]>> {
    return this.cachedRequest(`chart-data-${days}`, () => 
      this.retryRequest(async () => {
        const response = await this.api.get(`${API_ENDPOINTS.USERS}/chart?days=${days}`)
        return response.data
      })
    )
  }

  // Export - Protocol Buffer
  async exportUsersProtobuf(): Promise<{ blob: Blob; metadata: any }> {
    return this.retryRequest(async () => {
      const cacheBust = `t=${Date.now()}`
      const url = `${API_ENDPOINTS.USERS_EXPORT}?${cacheBust}`
      const response = await this.api.get(url, {
        responseType: 'blob',
      })
      
      const metadata = {
        userCount: response.headers['x-user-count'] || 0,
        format: response.headers['x-format'] || 'protobuf',
        size: response.headers['x-size'] || 0,
      }
      
      return { blob: response.data, metadata }
    })
  }

  // Export - JSON
  async exportUsersJSON(): Promise<User[]> {
    try {
      const response = await this.api.get(API_ENDPOINTS.USERS)
      return response.data.data || response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Cryptographic Features
  async getPublicKey(): Promise<ApiResponse<PublicKeyData>> {
    try {
      const response = await this.api.get(API_ENDPOINTS.CRYPTO_PUBLIC_KEY)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async verifySignature(data: string, signature: string): Promise<boolean> {
    try {
      const response = await this.api.post(`${API_ENDPOINTS.USERS}/crypto/verify`, { data, signature })
      // Explicitly return the boolean value from the response
      return Boolean(response.data.data)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get(API_ENDPOINTS.HEALTH)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Enhanced error message handler
  private getErrorMessage(error: AxiosError): string {
    if (error.response?.data && typeof error.response.data === 'object') {
      const data = error.response.data as any
      return data.message || data.error || ERROR_MESSAGES.SERVER_ERROR
    }
    
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.'
    }
    
    if (!error.response) {
      return ERROR_MESSAGES.NETWORK_ERROR
    }
    
    switch (error.response.status) {
      case 400:
        return ERROR_MESSAGES.VALIDATION_ERROR
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED
      case 404:
        return ERROR_MESSAGES.NOT_FOUND
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR
      default:
        return ERROR_MESSAGES.UNKNOWN_ERROR
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || error.response.data?.message || 'Server error'
      const status = error.response.status
      return new Error(`${status}: ${message}`)
    } else if (error.request) {
      // Request was made but no response received
      return new Error(ERROR_MESSAGES.NETWORK_ERROR)
    } else {
      // Something else happened
      return new Error(error.message || ERROR_MESSAGES.UNKNOWN_ERROR)
    }
  }

  // Retry logic for rate limiting
  private async retryRequest<T>(requestFn: () => Promise<T>, maxRetries = 3): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn()
      } catch (error: any) {
        if (error.response?.status === 429 && attempt < maxRetries) {
          // Rate limited - wait with exponential backoff
          const delay = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        }
        throw error
      }
    }
    throw new Error('Max retries exceeded')
  }

  // Cached request to prevent duplicate calls
  private async cachedRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.requestCache.has(key)) {
      return this.requestCache.get(key)!
    }

    const promise = requestFn().finally(() => {
      // Remove from cache after 5 seconds
      setTimeout(() => this.requestCache.delete(key), 5000)
    })

    this.requestCache.set(key, promise)
    return promise
  }
}

export const apiService = new ApiService()
