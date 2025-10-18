import { useState, useEffect } from 'react'
import { Users, BarChart3, Shield, Download, CheckCircle, AlertCircle, Database } from 'lucide-react'
import { apiService } from '../services/api'
import { UserStats } from '../types'
import { LOADING_STATES, ERROR_MESSAGES } from '../constants'

export function HomePage() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState<'idle' | 'loading' | 'success' | 'error'>(LOADING_STATES.IDLE)
  const [error, setError] = useState<string | null>(null)
  const [systemStatus, setSystemStatus] = useState({
    api: false,
    database: false,
    crypto: false,
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(LOADING_STATES.LOADING)
      setError(null)
      
      // Load stats and check system status
      const [statsResponse, healthResponse, publicKeyResponse] = await Promise.allSettled([
        apiService.getUserStats(),
        apiService.healthCheck(),
        apiService.getPublicKey(),
      ])
      
      if (statsResponse.status === 'fulfilled') {
        setStats(statsResponse.value.data || null)
      }
      
      setSystemStatus({
        api: healthResponse.status === 'fulfilled',
        database: healthResponse.status === 'fulfilled',
        crypto: publicKeyResponse.status === 'fulfilled',
      })
      
      setLoading(LOADING_STATES.SUCCESS)
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.UNKNOWN_ERROR)
      setLoading(LOADING_STATES.ERROR)
      console.error('Failed to load dashboard data:', err)
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Welcome to Mini Admin Panel</h1>
          <p className="card-subtitle">
             Admin panel with user management, analytics, and cryptographic features
          </p>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 text-primary-900 mr-3" />
            <h3 className="text-lg font-semibold text-secondary-900">User Management</h3>
          </div>
          <p className="text-secondary-600 mb-4">
            Complete CRUD operations for user management.
          </p>
          <div className="flex items-center text-sm text-success-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Ready</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-8 w-8 text-primary-900 mr-3" />
            <h3 className="text-lg font-semibold text-secondary-900">Analytics</h3>
          </div>
          <p className="text-secondary-600 mb-4">
            Visualize user creation trends with interactive charts over 7 days.
          </p>
          <div className="flex items-center text-sm text-success-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Ready</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 text-primary-900 mr-3" />
            <h3 className="text-lg font-semibold text-secondary-900">Cryptography</h3>
          </div>
          <p className="text-secondary-600 mb-4">
            SHA-384 hashing and RSA digital signatures for secure user data.
          </p>
          <div className="flex items-center text-sm text-success-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Ready</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <Download className="h-8 w-8 text-primary-900 mr-3" />
            <h3 className="text-lg font-semibold text-secondary-900">Protocol Buffer</h3>
          </div>
          <p className="text-secondary-600 mb-4">
            Export user data in efficient binary format with signature verification.
          </p>
          <div className="flex items-center text-sm text-success-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Ready</span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-error-600" />
          <div>
            <h3 className="text-error-800 font-medium">Error</h3>
            <p className="text-error-600 text-sm">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-error-600 hover:text-error-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-900 mb-2">
            {loading === LOADING_STATES.LOADING ? '...' : stats?.total || 0}
          </div>
          <div className="text-secondary-600">Total Users</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-900 mb-2">
            {loading === LOADING_STATES.LOADING ? '...' : stats?.active || 0}
          </div>
          <div className="text-secondary-600">Active Users</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-900 mb-2">RSA-2048</div>
          <div className="text-secondary-600">Digital Signatures</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-900 mb-2">SHA-384</div>
          <div className="text-secondary-600">Hash Algorithm</div>
        </div>
      </div>

      {/* System Status */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">System Status</h3>
          <p className="card-subtitle">Current system health and performance</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`flex items-center justify-between p-4 rounded-lg ${
            systemStatus.api ? 'bg-success-50' : 'bg-error-50'
          }`}>
            <div>
              <p className={`font-medium ${systemStatus.api ? 'text-success-900' : 'text-error-900'}`}>
                Backend API
              </p>
              <p className={`text-sm ${systemStatus.api ? 'text-success-700' : 'text-error-700'}`}>
                {systemStatus.api ? 'Connected' : 'Disconnected'}
              </p>
            </div>
            {systemStatus.api ? (
              <CheckCircle className="w-6 h-6 text-success-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-error-600" />
            )}
          </div>
          
          <div className={`flex items-center justify-between p-4 rounded-lg ${
            systemStatus.database ? 'bg-success-50' : 'bg-error-50'
          }`}>
            <div>
              <p className={`font-medium ${systemStatus.database ? 'text-success-900' : 'text-error-900'}`}>
                Database
              </p>
              <p className={`text-sm ${systemStatus.database ? 'text-success-700' : 'text-error-700'}`}>
                {systemStatus.database ? 'PostgreSQL' : 'Disconnected'}
              </p>
            </div>
            {systemStatus.database ? (
              <Database className="w-6 h-6 text-success-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-error-600" />
            )}
          </div>
          
          <div className={`flex items-center justify-between p-4 rounded-lg ${
            systemStatus.crypto ? 'bg-success-50' : 'bg-error-50'
          }`}>
            <div>
              <p className={`font-medium ${systemStatus.crypto ? 'text-success-900' : 'text-error-900'}`}>
                Cryptography
              </p>
              <p className={`text-sm ${systemStatus.crypto ? 'text-success-700' : 'text-error-700'}`}>
                {systemStatus.crypto ? 'RSA-2048 Ready' : 'Not Available'}
              </p>
            </div>
            {systemStatus.crypto ? (
              <Shield className="w-6 h-6 text-success-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-error-600" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

