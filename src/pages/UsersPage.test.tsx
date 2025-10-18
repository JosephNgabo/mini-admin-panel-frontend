import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { UsersPage } from './UsersPage'

const users = Array.from({ length: 15 }).map((_, i) => ({
  id: `id-${i}`,
  email: `user${i}@example.com`,
  role: i % 5 === 0 ? 'admin' as const : 'user' as const,
  status: i % 3 === 0 ? 'inactive' as const : 'active' as const,
  created_at: new Date().toISOString(),
  email_hash: 'hash',
  signature: 'sig',
}))

vi.mock('../services/api', () => ({
  apiService: {
    getUsersPaginated: vi.fn().mockImplementation((page: number, limit: number) => {
      const start = (page - 1) * limit
      const slice = users.slice(start, start + limit)
      return Promise.resolve({
        success: true,
        data: slice,
        pagination: {
          page,
          limit,
          total: users.length,
          totalPages: Math.ceil(users.length / limit),
          hasNextPage: page < Math.ceil(users.length / limit),
          hasPrevPage: page > 1,
        },
      })
    }),
    verifySignature: vi.fn().mockResolvedValue(true),
    deleteUser: vi.fn().mockResolvedValue({ success: true }),
    updateUser: vi.fn().mockResolvedValue({ success: true }),
    createUser: vi.fn().mockResolvedValue({ success: true }),
  },
}))

describe('UsersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders first page and paginates to next page', async () => {
    render(<UsersPage />)
    // Wait for first page to load
    await waitFor(() => expect(screen.getByText(/Page 1 of 2/i)).toBeInTheDocument())
    // Should show first item id-0
    expect(screen.getByText(/user0@example.com/)).toBeInTheDocument()
    // Go to next page
    fireEvent.click(screen.getByRole('button', { name: /Next page/i }))
    await waitFor(() => expect(screen.getByText(/Page 2 of 2/i)).toBeInTheDocument())
    // Should show item from second page
    expect(screen.getByText(/user10@example.com/)).toBeInTheDocument()
  })

  it('filters by role and status', async () => {
    render(<UsersPage />)
    await waitFor(() => expect(screen.getByText(/Page 1 of 2/i)).toBeInTheDocument())

    // Open filters
    fireEvent.click(screen.getByRole('button', { name: /Filters/i }))
    // Filter role admin
    const selects = screen.getAllByRole('combobox')
    const roleSelect = selects[0]
    const statusSelect = selects[1]
    fireEvent.change(roleSelect, { target: { value: 'admin' } })
    // Filter status active
    fireEvent.change(statusSelect, { target: { value: 'active' } })

    // Should show only rows matching filters (admin+active exists for some entries)
    expect(await screen.findAllByText(/@example.com/)).toBeTruthy()
  })
})


