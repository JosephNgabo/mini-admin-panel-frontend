import * as protobuf from 'protobufjs'
import { User } from '../types'

/**
 * Protocol Buffer Service for Frontend
 * Handles decoding of protobuf data received from backend
 */
class ProtobufService {
  private UserMessage: any = null
  private UserCollectionMessage: any = null
  private isInitialized = false

  constructor() {
    this.initializeProtobuf()
  }

  /**
   * Initialize Protocol Buffer messages
   */
  private async initializeProtobuf() {
    try {
      // Load the proto file
      const root = await protobuf.load('/user.proto')
      
      // Get message types
      this.UserMessage = root.lookupType('user.User')
      this.UserCollectionMessage = root.lookupType('user.UserCollection')
      
      this.isInitialized = true
      
      console.log('✅ Protocol Buffer initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Protocol Buffer:', error)
      throw error
    }
  }

  /**
   * Ensure Protocol Buffer is initialized
   */
  private async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initializeProtobuf()
    }
  }

  /**
   * Decode Protocol Buffer data to user collection
   * @param buffer - Binary protobuf data
   * @returns Decoded user collection
   */
  async decodeUserCollection(buffer: ArrayBuffer): Promise<{
    users: User[]
    totalCount: number
    exportedAt: string
    algorithm: string
    hashAlgorithm: string
  }> {
    try {
      await this.ensureInitialized()
      
      if (!this.isInitialized) {
        throw new Error('Protocol Buffer not initialized')
      }

      // Convert ArrayBuffer to Uint8Array
      const uint8Array = new Uint8Array(buffer)
      
      // Decode the message
      const message = this.UserCollectionMessage.decode(uint8Array)
      
      // Convert to plain object
      const decoded = this.UserCollectionMessage.toObject(message, {
        longs: String,
        enums: String,
        bytes: String,
        defaults: true,
        arrays: true,
        objects: true,
      })

      try {
        // Debug raw decoded payload to inspect field casing/values
        // Note: safe logging only first user keys and previews
        if (decoded && Array.isArray(decoded.users) && decoded.users.length > 0) {
          const u = decoded.users[0]
          console.log('🔎 Decoded raw user[0] keys:', Object.keys(u))
          console.log('🔎 Decoded raw user[0] previews:', {
            id: u.id,
            email: u.email,
            created_at: (u as any).created_at,
            createdAt: (u as any).createdAt,
            email_hash: (u as any).email_hash?.slice?.(0, 16),
            emailHash: (u as any).emailHash?.slice?.(0, 16),
            signature: (u as any).signature?.slice?.(0, 16),
          })
        }
      } catch {}

      // Transform users to match frontend User interface
      const users: User[] = decoded.users.map((user: any) => ({
        id: user.id || '',
        email: user.email || '',
        role: user.role || 'user',
        status: user.status || 'active',
        // Support both snake_case and camelCase from protobufjs
        created_at: user.created_at || user.createdAt || new Date().toISOString(),
        email_hash: user.email_hash || user.emailHash || '',
        signature: user.signature || ''
      }))

      console.log('✅ Protocol Buffer decoded successfully', {
        userCount: users.length,
        totalCount: decoded.total_count,
        exportedAt: decoded.exported_at,
        algorithm: decoded.algorithm,
        hashAlgorithm: decoded.hash_algorithm
      })

      return {
        users,
        totalCount: (typeof decoded.total_count === 'number' ? decoded.total_count : users.length) || users.length,
        exportedAt: decoded.exported_at || new Date().toISOString(),
        algorithm: decoded.algorithm || 'RSA-2048',
        hashAlgorithm: decoded.hash_algorithm || 'SHA-384'
      }

    } catch (error) {
      console.error('❌ Failed to decode Protocol Buffer:', error)
      throw error
    }
  }

  /**
   * Decode single user from Protocol Buffer
   * @param buffer - Binary protobuf data
   * @returns Decoded user object
   */
  async decodeUser(buffer: ArrayBuffer): Promise<User> {
    try {
      await this.ensureInitialized()
      
      if (!this.isInitialized) {
        throw new Error('Protocol Buffer not initialized')
      }

      // Convert ArrayBuffer to Uint8Array
      const uint8Array = new Uint8Array(buffer)
      
      // Decode the message
      const message = this.UserMessage.decode(uint8Array)
      
      // Convert to plain object
      const decoded = this.UserMessage.toObject(message, {
        longs: String,
        enums: String,
        bytes: String,
      })

      // Transform to match frontend User interface
      const user: User = {
        id: decoded.id || '',
        email: decoded.email || '',
        role: decoded.role || 'user',
        status: decoded.status || 'active',
        // Support both snake_case and camelCase
        created_at: decoded.created_at || decoded.createdAt || new Date().toISOString(),
        email_hash: decoded.email_hash || decoded.emailHash || '',
        signature: decoded.signature || ''
      }

      console.log('✅ Single user decoded successfully', { userId: user.id })

      return user

    } catch (error) {
      console.error('❌ Failed to decode single user:', error)
      throw error
    }
  }

  /**
   * Get Protocol Buffer initialization status
   */
  getStatus() {
    return {
      initialized: this.isInitialized,
      hasUserMessage: !!this.UserMessage,
      hasUserCollectionMessage: !!this.UserCollectionMessage
    }
  }
}

export const protobufService = new ProtobufService()
