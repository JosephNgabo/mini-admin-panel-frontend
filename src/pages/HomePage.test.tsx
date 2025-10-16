import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HomePage } from './HomePage'

vi.mock('../services/api', () => ({
  apiService: {
    getUserStats: vi.fn().mockResolvedValue({ data: { total: 10, active: 5 } }),
    healthCheck: vi.fn().mockResolvedValue({ data: { status: 'ok' } }),
    getPublicKey: vi.fn().mockResolvedValue({ data: 'PUBLIC_KEY' }),
  },
}))

describe('HomePage', () => {
  it('renders welcome title', async () => {
    render(<HomePage />)
    expect(await screen.findByText(/Welcome to Mini Admin Panel/i)).toBeInTheDocument()
  })

  it('shows quick stats section items', async () => {
    render(<HomePage />)
    expect(await screen.findByText(/Total Users/i)).toBeInTheDocument()
    expect(await screen.findByText(/Active Users/i)).toBeInTheDocument()
  })
})


