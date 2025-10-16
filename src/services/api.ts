import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { User, CreateUserData, UpdateUserData, UserStats, ChartData, PublicKeyData, ApiResponse } from '@/types'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3025',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        console.error('❌ API Request Error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`)
        return response
      },
      (error) => {
        console.error('❌ API Response Error:', error.response?.status, error.response?.data)
        return Promise.reject(error)
      }
    )
  }

  // User Management
  async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response = await this.api.get('/api/users')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    try {
      const response = await this.api.get(`/api/users/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async createUser(userData: CreateUserData): Promise<ApiResponse<User>> {
    try {
      const response = await this.api.post('/api/users', userData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<ApiResponse<User>> {
    try {
      const response = await this.api.put(`/api/users/${id}`, userData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async deleteUser(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await this.api.delete(`/api/users/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Statistics
  async getUserStats(): Promise<ApiResponse<UserStats>> {
    try {
      const response = await this.api.get('/api/users/stats')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getChartData(): Promise<ApiResponse<ChartData[]>> {
    try {
      const response = await this.api.get('/api/users/chart')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Export
  async exportUsers(): Promise<Blob> {
    try {
      const response = await this.api.get('/api/users/export', {
        responseType: 'blob',
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Public Key
  async getPublicKey(): Promise<ApiResponse<PublicKeyData>> {
    try {
      const response = await this.api.get('/api/users/crypto/public-key')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<any>> {
    try {
      const response = await this.api.get('/health')
      return response.data
    } catch (error) {
      throw this.handleError(error)
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
      return new Error('Network error: Unable to connect to server')
    } else {
      // Something else happened
      return new Error(error.message || 'Unknown error occurred')
    }
  }
}

export const apiService = new ApiService()
