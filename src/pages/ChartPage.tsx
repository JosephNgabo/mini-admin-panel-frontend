import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react'

export function ChartPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Analytics Dashboard</h1>
        <p className="text-secondary-600">User creation trends and system statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Users className="w-6 h-6 text-primary-900" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-secondary-600">Total Users</p>
              <p className="text-2xl font-bold text-secondary-900">0</p>
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
              <p className="text-2xl font-bold text-secondary-900">0</p>
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
              <p className="text-2xl font-bold text-secondary-900">0</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-secondary-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-secondary-900" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-secondary-600">Growth Rate</p>
              <p className="text-2xl font-bold text-secondary-900">0%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">User Creation Trend</h3>
            <p className="card-subtitle">Users created per day over the last 7 days</p>
          </div>
          <div className="h-64 flex items-center justify-center text-secondary-500">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 text-secondary-300" />
              <p>Chart will be displayed here</p>
              <p className="text-sm">Connect to backend to see data</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">User Distribution</h3>
            <p className="card-subtitle">Users by role and status</p>
          </div>
          <div className="h-64 flex items-center justify-center text-secondary-500">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-2 text-secondary-300" />
              <p>Distribution chart will be displayed here</p>
              <p className="text-sm">Connect to backend to see data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">System Performance</h3>
          <p className="card-subtitle">Backend API and database metrics</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-success-50 rounded-lg">
            <p className="text-sm text-success-700">API Response Time</p>
            <p className="text-2xl font-bold text-success-900">~50ms</p>
          </div>
          <div className="text-center p-4 bg-success-50 rounded-lg">
            <p className="text-sm text-success-700">Database Status</p>
            <p className="text-2xl font-bold text-success-900">Connected</p>
          </div>
          <div className="text-center p-4 bg-success-50 rounded-lg">
            <p className="text-sm text-success-700">Uptime</p>
            <p className="text-2xl font-bold text-success-900">99.9%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
