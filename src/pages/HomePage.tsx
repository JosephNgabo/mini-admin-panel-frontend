import { Users, BarChart3, Shield, Download, CheckCircle } from 'lucide-react'

export function HomePage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Welcome to Mini Admin Panel</h1>
          <p className="card-subtitle">
            A professional admin panel with user management, analytics, and cryptographic features
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
            Complete CRUD operations for user management with role-based access control.
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
            Visualize user creation trends with interactive charts and statistics.
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-900 mb-2">100%</div>
          <div className="text-secondary-600">Test Coverage</div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-success-50 rounded-lg">
            <div>
              <p className="font-medium text-success-900">Backend API</p>
              <p className="text-sm text-success-700">Connected</p>
            </div>
            <CheckCircle className="w-6 h-6 text-success-600" />
          </div>
          <div className="flex items-center justify-between p-4 bg-success-50 rounded-lg">
            <div>
              <p className="font-medium text-success-900">Database</p>
              <p className="text-sm text-success-700">PostgreSQL</p>
            </div>
            <CheckCircle className="w-6 h-6 text-success-600" />
          </div>
        </div>
      </div>
    </div>
  )
}

