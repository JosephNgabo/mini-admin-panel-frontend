import { Link } from 'react-router-dom'
import { Shield, Bell, User } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-secondary-200">
      <div className="container">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-900 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-secondary-900">
                Mini Admin Panel
              </h1>
              <p className="text-sm text-secondary-600">
                Professional Admin Dashboard
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="nav-link"
            >
              Dashboard
            </Link>
            <Link 
              to="/users" 
              className="nav-link"
            >
              Users
            </Link>
            <Link 
              to="/chart" 
              className="nav-link"
            >
              Analytics
            </Link>
            <Link 
              to="/export" 
              className="nav-link"
            >
              Export
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-secondary-600 hover:text-primary-900 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-secondary-600 hover:text-primary-900 transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
