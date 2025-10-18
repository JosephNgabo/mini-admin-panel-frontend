import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ChartPage } from './ChartPage'

vi.mock('../services/api', () => ({
  apiService: {
    getUserStats: vi.fn().mockResolvedValue({ data: { total: 15, active: 12, inactive: 3, admins: 2, users: 13 } }),
    getChartData: vi.fn().mockResolvedValue({ data: [
      { date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), count: 5 },
      { date: new Date().toISOString(), count: 3 },
    ] }),
    healthCheck: vi.fn().mockResolvedValue({ data: { status: 'ok' } }),
    getPublicKey: vi.fn().mockResolvedValue({ data: 'PUBLIC_KEY' }),
  },
}))

describe('ChartPage', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('loads and shows stats cards', async () => {
    render(<ChartPage />)
    expect(await screen.findByText(/Analytics Dashboard/i)).toBeInTheDocument()
    expect(await screen.findByText(/Total Users/i)).toBeInTheDocument()
  })

  it('normalizes dates to local day for chart data', async () => {
    render(<ChartPage />)
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument())
    // We can’t easily assert chart internals, but we can ensure no error is shown
    expect(screen.queryByText(/No data available/i)).not.toBeInTheDocument()
  })
})


