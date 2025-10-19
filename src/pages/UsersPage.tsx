import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, AlertCircle, Shield, CheckCircle } from 'lucide-react'
import { apiService } from '../services/api'
import { User, CreateUserData, UpdateUserData } from '../types'
import { LOADING_STATES, ERROR_MESSAGES } from '../constants'

export function UsersPage() {
  // State management
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<'idle' | 'loading' | 'success' | 'error'>(LOADING_STATES.IDLE)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // Form state
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    role: 'user',
    status: 'active',
  })

  // Load users on component mount
  useEffect(() => {
    loadUsers()
  }, [])

  // Load users from API (server-side pagination)
  const loadUsers = async () => {
    try {
      setLoading(LOADING_STATES.LOADING)
      setError(null)
      const { data: pagedUsers, pagination } = await apiService.getUsersPaginated(currentPage, pageSize)
      const allUsers = pagedUsers || []

      // Verify signatures before displaying users (do not change pagination counts)
      const verifiedUsers = await verifyUserSignatures(allUsers)
      setUsers(verifiedUsers)
      if (pagination) {
        setTotalItems(pagination.total ?? verifiedUsers.length)
        setTotalPages(pagination.totalPages ?? Math.max(1, Math.ceil((pagination.total ?? verifiedUsers.length) / pageSize)))
      } else {
        setTotalItems(verifiedUsers.length)
        setTotalPages(1)
      }
      setLoading(LOADING_STATES.SUCCESS)
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.UNKNOWN_ERROR)
      setLoading(LOADING_STATES.ERROR)
      console.error('Failed to load users:', err)
    }
  }

  // Verify user signatures - only display users with valid signatures
  const verifyUserSignatures = async (users: User[]): Promise<User[]> => {
    const verifiedUsers: User[] = []
    
    for (const user of users) {
      try {
        // Only verify if user has both email_hash and signature
        if (user.email_hash && user.signature) {
          const isValid = await apiService.verifySignature(user.email_hash, user.signature)
          if (isValid) {
            verifiedUsers.push(user)
          } else {
          }
        } else {
          console.warn(`User ${user.email} missing cryptographic data - excluding from display`)
        }
      } catch (error) {
        console.error(`Error verifying signature for user ${user.email}:`, error)
      }
    }
    
    return verifiedUsers
  }

  // Create user
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(LOADING_STATES.LOADING)
      await apiService.createUser(formData)
      await loadUsers() // Refresh the list
      setShowCreateForm(false)
      setFormData({ email: '', role: 'user', status: 'active' })
      setLoading(LOADING_STATES.SUCCESS)
      
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.UNKNOWN_ERROR)
      setLoading(LOADING_STATES.ERROR)
      console.error('Failed to create user:', err)
    }
  }

  // Update user
  const handleUpdateUser = async (id: string, userData: UpdateUserData) => {
    try {
      setLoading(LOADING_STATES.LOADING)
      await apiService.updateUser(id, userData)
      await loadUsers() // Refresh the list
      setEditingUser(null)
      setLoading(LOADING_STATES.SUCCESS)
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.UNKNOWN_ERROR)
      setLoading(LOADING_STATES.ERROR)
      console.error('Failed to update user:', err)
    }
  }

  // Delete user
  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    
    try {
      setDeletingUserId(id)
      await apiService.deleteUser(id)
      await loadUsers() // Refresh the list
      setDeletingUserId(null)
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.UNKNOWN_ERROR)
      setDeletingUserId(null)
      console.error('Failed to delete user:', err)
    }
  }

  // Filter users based on search term
  const filteredUsers = (users || [])
    .filter(user => {
      const term = searchTerm.toLowerCase()
      if (!term) return true
      return (
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term) ||
        user.status.toLowerCase().includes(term)
      )
    })
    .filter(user => (filterRole === 'all' ? true : user.role === filterRole))
    .filter(user => (filterStatus === 'all' ? true : user.status === filterStatus))

  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const visibleUsers = filteredUsers

  useEffect(() => {
    // Reset to first page when filters/search change
    setCurrentPage(1)
  }, [searchTerm, filterRole, filterStatus])

  useEffect(() => {
    // On page change, fetch server data
    loadUsers()
  }, [currentPage])

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    return status === 'active' 
      ? 'bg-success-100 text-success-800' 
      : 'bg-error-100 text-error-800'
  }

  // Get role badge class
  const getRoleBadgeClass = (role: string) => {
    return role === 'admin' 
      ? 'bg-primary-100 text-primary-800' 
      : 'bg-secondary-100 text-secondary-800'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">User Management</h1>
          <p className="text-secondary-600">Manage CRUD(Create, Read, Update, Delete) operations for users</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center space-x-2"
          disabled={loading === LOADING_STATES.LOADING}
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
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

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="btn-outline flex items-center space-x-2"
                onClick={() => setShowFilters(v => !v)}
                aria-expanded={showFilters}
                aria-controls="user-filters"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              {(filterRole !== 'all' || filterStatus !== 'all' || searchTerm) && (
                <button
                  className="btn-secondary"
                  onClick={() => { setSearchTerm(''); setFilterRole('all'); setFilterStatus('all') }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          {showFilters && (
            <div id="user-filters" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Role</label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as 'all' | 'admin' | 'user')}
                  className="input-field w-full"
                >
                  <option value="all">All</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                  className="input-field w-full"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading === LOADING_STATES.LOADING ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="loading-spinner" />
                      <span className="text-secondary-600">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-secondary-500 py-8">
                    {searchTerm ? 'No users match your search criteria.' : 'No users found. Create your first user to get started.'}
                  </td>
                </tr>
              ) : (
                visibleUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium text-sm">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-secondary-900">{user.email}</div>
                          <div className="text-sm text-secondary-500">ID: {user.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="text-secondary-600">
                      {formatDate(user.created_at)}
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        {/* Signature Verification Indicator */}
                        <div className="flex items-center space-x-1" title="Signature verification status">
                          {user.email_hash && user.signature ? (
                            <div className="flex items-center text-success-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs ml-1">Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-warning-600">
                              <Shield className="w-4 h-4" />
                              <span className="text-xs ml-1">No Crypto</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-1 text-secondary-600 hover:text-primary-600 transition-colors"
                            title="Edit user"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1 text-secondary-600 hover:text-error-600 transition-colors"
                            disabled={deletingUserId === user.id}
                            title="Delete user"
                          >
                            {deletingUserId === user.id ? (
                              <div className="loading-spinner w-4 h-4" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          <div className="text-sm text-secondary-600">
            Page {safeCurrentPage} of {totalPages} · Showing {totalItems === 0 ? 0 : startIndex + 1}-{endIndex} of {totalItems}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous page"
              className={`btn-outline px-3 py-1 ${safeCurrentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => { if (safeCurrentPage > 1) setCurrentPage(safeCurrentPage - 1) }}
              disabled={safeCurrentPage <= 1}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                type="button"
                aria-label={`Go to page ${page}`}
                aria-current={page === safeCurrentPage ? 'page' : undefined}
                disabled={page === safeCurrentPage}
                key={page}
                onClick={() => page !== safeCurrentPage && setCurrentPage(page)}
                className={`px-3 py-1 rounded border ${page === safeCurrentPage ? 'bg-primary-900 text-white border-primary-900 cursor-default' : 'border-secondary-200 text-secondary-700 hover:bg-secondary-100'}`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              aria-label="Next page"
              className={`btn-outline px-3 py-1 ${safeCurrentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => { if (safeCurrentPage < totalPages) setCurrentPage(safeCurrentPage + 1) }}
              disabled={safeCurrentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New User</h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field w-full"
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                  className="input-field w-full"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="input-field w-full"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary"
                  disabled={loading === LOADING_STATES.LOADING}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                  disabled={loading === LOADING_STATES.LOADING}
                >
                  {loading === LOADING_STATES.LOADING ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              const updateData: UpdateUserData = {
                email: formData.get('email') as string,
                role: formData.get('role') as 'admin' | 'user',
                status: formData.get('status') as 'active' | 'inactive',
              }
              handleUpdateUser(editingUser.id, updateData)
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingUser.email}
                  className="input-field w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  defaultValue={editingUser.role}
                  className="input-field w-full"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={editingUser.status}
                  className="input-field w-full"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="btn-secondary"
                  disabled={loading === LOADING_STATES.LOADING}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                  disabled={loading === LOADING_STATES.LOADING}
                >
                  {loading === LOADING_STATES.LOADING ? 'Updating...' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

