import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { BarChart3, TrendingUp, Users, Calendar, AlertCircle, RefreshCw } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { apiService } from '../services/api'
import { UserStats, ChartData } from '../types'
import { LOADING_STATES, ERROR_MESSAGES } from '../constants'

export function ChartPage() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState<'idle' | 'loading' | 'success' | 'error'>(LOADING_STATES.IDLE)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = async () => {
    try {
      setLoading(LOADING_STATES.LOADING)
      setError(null)
      
      // Load stats and chart data in parallel
      const [statsResponse, chartResponse] = await Promise.all([
        apiService.getUserStats(),
        apiService.getChartData(7)
      ])
      
      setStats(statsResponse.data || null)
      // Transform chart data to match expected format and normalize date to local day
      const transformedChartData = (chartResponse.data || []).map((item: any) => {
        const parsed = new Date(item.date)
        const localDate = isNaN(parsed.getTime()) ? String(item.date) : format(parsed, 'yyyy-MM-dd')
        const usersCount = typeof item.count === 'string' ? parseInt(item.count, 10) : item.count || 0
        return { date: localDate, users: usersCount }
      })
      setChartData(transformedChartData)
      setLoading(LOADING_STATES.SUCCESS)
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.UNKNOWN_ERROR)
      setLoading(LOADING_STATES.ERROR)
      console.error('Failed to load analytics data:', err)
    }
  }



  // Prepare pie chart data
  const roleDistribution = stats ? [
    { name: 'Users', value: stats.users, color: '#64748b' },
    { name: 'Admins', value: stats.admins, color: '#002b11' }
  ] : []

  const statusDistribution = stats ? [
    { name: 'Active', value: stats.active, color: '#22c55e' },
    { name: 'Inactive', value: stats.inactive, color: '#ef4444' }
  ] : []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Analytics Dashboard</h1>
          <p className="text-secondary-600">User creation details in past 7 days and user distribution by role and status</p>
        </div>
        <button 
          onClick={loadAnalyticsData}
          disabled={loading === LOADING_STATES.LOADING}
          className="btn-outline flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading === LOADING_STATES.LOADING ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Users className="w-6 h-6 text-primary-900" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-secondary-600">Total Users</p>
              <p className="text-2xl font-bold text-secondary-900">
                {loading === LOADING_STATES.LOADING ? '...' : stats?.total || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-success-900" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-secondary-600">Active Users</p>
              <p className="text-2xl font-bold text-secondary-900">
                {loading === LOADING_STATES.LOADING ? '...' : stats?.active || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Calendar className="w-6 h-6 text-warning-900" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-secondary-600">This Week</p>
              <p className="text-2xl font-bold text-secondary-900">
                {loading === LOADING_STATES.LOADING ? '...' : chartData.reduce((sum, item) => sum + (item.users || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">User Creation Details in past 7 days</h3>
            <p className="card-subtitle">Number of users created per day over the last 7 days</p>
          </div>
          <div className="h-64">
            {loading === LOADING_STATES.LOADING ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center space-x-2">
                  <div className="loading-spinner" />
                  <span className="text-secondary-600">Loading chart data...</span>
                </div>
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#002b11" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-secondary-500">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 text-secondary-300" />
                  <p>No data available</p>
                  <p className="text-sm">Create some users to see trends</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">User Distribution</h3>
            <p className="card-subtitle">Users by role and status</p>
          </div>
          <div className="h-64">
            {loading === LOADING_STATES.LOADING ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center space-x-2">
                  <div className="loading-spinner" />
                  <span className="text-secondary-600">Loading distribution...</span>
                </div>
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="flex flex-col items-center justify-center">
                  <h4 className="text-sm font-medium text-secondary-700 mb-2">By Role</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roleDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={20}
                        outerRadius={60}
                        dataKey="value"
                      >
                        {roleDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <h4 className="text-sm font-medium text-secondary-700 mb-2">By Status</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={20}
                        outerRadius={60}
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-secondary-500">
                <div className="text-center">
                  <Users className="w-12 h-12 mx-auto mb-2 text-secondary-300" />
                  <p>No data available</p>
                  <p className="text-sm">Create some users to see distribution</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
