
import { Shield } from 'lucide-react'

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
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
