import { useState, useEffect } from 'react'
import { Download, Shield, FileText, CheckCircle, AlertCircle, Database, Users, Eye } from 'lucide-react'
import { apiService } from '../services/api'
import { protobufService } from '../services/protobuf'
import { User } from '../types'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants'

export function ExportPage() {
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [exportedUsers, setExportedUsers] = useState<User[]>([])
  const [exportMetadata, setExportMetadata] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [protobufUsers, setProtobufUsers] = useState<User[]>([])
  const [protobufMetadata, setProtobufMetadata] = useState<any>(null)
  const [showProtobufTable, setShowProtobufTable] = useState(false)

  useEffect(() => {
    loadPublicKey()
  }, [])

  const loadPublicKey = async () => {
    try {
      const response = await apiService.getPublicKey()
      setPublicKey(response.data?.publicKey || null)
    } catch (err: any) {
      console.error('Failed to load public key:', err)
    }
  }

  const handleProtobufExport = async () => {
    setIsExporting(true)
    setExportStatus('idle')
    setError(null)
    
    try {
      const { blob, metadata } = await apiService.exportUsersProtobuf()
      setExportMetadata(metadata)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `users-export-${new Date().toISOString().split('T')[0]}.pb`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      setExportStatus('success')
      console.log(SUCCESS_MESSAGES.DATA_EXPORTED)
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.UNKNOWN_ERROR)
      setExportStatus('error')
      console.error('Failed to export users:', err)
    } finally {
      setIsExporting(false)
    }
  }

  const handleProtobufDecode = async () => {
    setIsExporting(true)
    setError(null)
    
    try {
      // Fetch protobuf data
      const { blob } = await apiService.exportUsersProtobuf()
      
      // Convert blob to ArrayBuffer
      const arrayBuffer = await blob.arrayBuffer()
      
      // Decode protobuf data
      const decodedData = await protobufService.decodeUserCollection(arrayBuffer)
      
      // Set decoded data
      setProtobufUsers(decodedData.users)
      setProtobufMetadata({
        totalCount: decodedData.totalCount,
        exportedAt: decodedData.exportedAt,
        algorithm: decodedData.algorithm,
        hashAlgorithm: decodedData.hashAlgorithm
      })
      setShowProtobufTable(true)
      
      console.log('✅ Protocol Buffer decoded successfully', {
        userCount: decodedData.users.length,
        metadata: decodedData
      })
      
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.UNKNOWN_ERROR)
      console.error('Failed to decode protobuf:', err)
    } finally {
      setIsExporting(false)
    }
  }

  const handleJSONExport = async () => {
    setIsExporting(true)
    setExportStatus('idle')
    setError(null)
    
    try {
      const users = await apiService.exportUsersJSON()
      setExportedUsers(users)
      
      // Create JSON download
      const dataStr = JSON.stringify(users, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = window.URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `users-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      setExportStatus('success')
      console.log(SUCCESS_MESSAGES.DATA_EXPORTED)
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.UNKNOWN_ERROR)
      setExportStatus('error')
      console.error('Failed to export users:', err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Data Decode, View and Export</h1>
        <p className="text-secondary-600">Decode, View and Export user data in Protocol Buffer format with cryptographic verification</p>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Protocol Buffer Export</h3>
            <p className="card-subtitle">Binary format with digital signatures</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-primary-900" />
              <span className="text-sm text-secondary-700">SHA-384 Hash Verification</span>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-primary-900" />
              <span className="text-sm text-secondary-700">RSA-2048 Digital Signature</span>
            </div>
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-primary-900" />
              <span className="text-sm text-secondary-700">Binary Protocol Buffer Format</span>
            </div>
            <div className="space-y-3">
              
              
              <button 
                onClick={handleProtobufDecode}
                disabled={isExporting}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {isExporting ? (
                  <>
                    <div className="loading-spinner" />
                    <span>Decoding...</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Decode & Display Protocol Buffer</span>
                  </>
                )}
              </button>

<button 
                onClick={handleProtobufExport}
                disabled={isExporting}
                className="btn-outline w-full flex items-center justify-center space-x-2"
              >
                {isExporting ? (
                  <>
                    <div className="loading-spinner" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    <span>Export as Protocol Buffer</span>
                  </>
                )}
              </button>
              
              <button 
                onClick={handleJSONExport}
                disabled={isExporting}
                className="btn-outline w-full flex items-center justify-center space-x-2"
              >
                {isExporting ? (
                  <>
                    <div className="loading-spinner" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span>Export as JSON</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Export Status</h3>
            <p className="card-subtitle">Current export status and verification</p>
          </div>
          <div className="space-y-4">
            {exportStatus === 'idle' && (
              <div className="text-center py-8">
                <Download className="w-12 h-12 mx-auto mb-4 text-secondary-300" />
                <p className="text-secondary-500">Ready to export user data</p>
              </div>
            )}
            
            {exportStatus === 'success' && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success-600" />
                <p className="text-success-700 font-medium">Export Successful!</p>
                <p className="text-sm text-success-600">Data exported with cryptographic verification</p>
              </div>
            )}
            
            {exportStatus === 'error' && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error-600" />
                <p className="text-error-700 font-medium">Export Failed</p>
                <p className="text-sm text-error-600">Please try again or check connection</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cryptographic Information */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Cryptographic Features</h3>
          <p className="card-subtitle">Security measures for data integrity</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-secondary-900 mb-3">Hash Algorithm</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-secondary-600">Algorithm:</span>
                <span className="font-medium">SHA-384</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Output Size:</span>
                <span className="font-medium">384 bits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Security Level:</span>
                <span className="font-medium text-success-600">High</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-secondary-900 mb-3">Digital Signature</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-secondary-600">Algorithm:</span>
                <span className="font-medium">RSA-2048</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Key Size:</span>
                <span className="font-medium">2048 bits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600">Verification:</span>
                <span className="font-medium text-success-600">Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-error-600" />
          <div>
            <h3 className="text-error-800 font-medium">Export Error</h3>
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

      {/* Export Metadata */}
      {exportMetadata && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Export Details</h3>
            <p className="card-subtitle">Protocol Buffer export information</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary-600" />
              <div className="text-2xl font-bold text-primary-900">{exportMetadata.userCount}</div>
              <div className="text-sm text-primary-600">Users Exported</div>
            </div>
            <div className="text-center p-4 bg-secondary-50 rounded-lg">
              <Database className="w-8 h-8 mx-auto mb-2 text-secondary-600" />
              <div className="text-2xl font-bold text-secondary-900">{exportMetadata.format}</div>
              <div className="text-sm text-secondary-600">Format</div>
            </div>
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <FileText className="w-8 h-8 mx-auto mb-2 text-success-600" />
              <div className="text-2xl font-bold text-success-900">{Math.round(exportMetadata.size / 1024)}KB</div>
              <div className="text-sm text-success-600">File Size</div>
            </div>
          </div>
        </div>
      )}

      {/* Exported Users Table */}
      {exportedUsers.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Exported Users (JSON)</h3>
            <p className="card-subtitle">Users exported in JSON format</p>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Hash</th>
                  <th>Signature</th>
                </tr>
              </thead>
              <tbody>
                {exportedUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="font-medium">{user.email}</td>
                    <td>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin' ? 'bg-primary-100 text-primary-800' : 'bg-secondary-100 text-secondary-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'active' ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="text-secondary-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="text-xs font-mono text-secondary-500">
                      {user.email_hash ? `${user.email_hash.slice(0, 16)}...` : 'N/A'}
                    </td>
                    <td className="text-xs font-mono text-secondary-500">
                      {user.signature ? `${user.signature.slice(0, 16)}...` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Protocol Buffer Decoded Users Table */}
      {showProtobufTable && protobufUsers.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Protocol Buffer Decoded Users</h3>
            <p className="card-subtitle">Users decoded from binary Protocol Buffer format</p>
          </div>
          <div className="space-y-4">
            {/* Protocol Buffer Metadata */}
            {protobufMetadata && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-primary-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-900">{protobufMetadata.totalCount}</div>
                  <div className="text-sm text-primary-600">Total Users</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary-900">{protobufMetadata.algorithm}</div>
                  <div className="text-sm text-primary-600">Algorithm</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary-900">{protobufMetadata.hashAlgorithm}</div>
                  <div className="text-sm text-primary-600">Hash Algorithm</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-primary-900">
                    {new Date(protobufMetadata.exportedAt).toLocaleString()}
                  </div>
                  <div className="text-sm text-primary-600">Exported At</div>
                </div>
              </div>
            )}
            
            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Email & ID</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Hash (Email)</th>
                    <th>Signature</th>
                  </tr>
                </thead>
                <tbody>
                  {protobufUsers.map((user) => (
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
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === 'admin' ? 'bg-primary-100 text-primary-800' : 'bg-secondary-100 text-secondary-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === 'active' ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="text-secondary-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="text-xs font-mono text-secondary-500">
                        {(() => {
                          const hashVal = (user as any).email_hash || (user as any).emailHash || ''
                          return hashVal ? `${String(hashVal).slice(0, 16)}...` : ' ...'
                        })()}
                      </td>
                      <td className="text-xs font-mono text-secondary-500">
                        {(() => {
                          const sigVal = (user as any).signature || ''
                          return sigVal ? `${String(sigVal).slice(0, 50)}...` : 'N/A'
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Public Key Display */}
      {publicKey && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">RSA Public Key</h3>
            <p className="card-subtitle">Used for signature verification</p>
          </div>
          <div className="bg-secondary-50 rounded-lg p-4">
            <pre className="text-xs font-mono text-secondary-700 whitespace-pre-wrap break-all">
              {publicKey}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

