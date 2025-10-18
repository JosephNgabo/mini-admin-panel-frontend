import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

vi.mock('@/components/layout/Layout', () => ({
  Layout: ({ children }: any) => <div data-testid="layout">{children}</div>,
}))

vi.mock('@/pages/HomePage', () => ({ HomePage: () => <div>Home</div> }))
vi.mock('@/pages/UsersPage', () => ({ UsersPage: () => <div>Users</div> }))
vi.mock('@/pages/ChartPage', () => ({ ChartPage: () => <div>Chart</div> }))
vi.mock('@/pages/ExportPage', () => ({ ExportPage: () => <div>Export</div> }))
vi.mock('@/pages/NotFoundPage', () => ({ NotFoundPage: () => <div>Not Found</div> }))

describe('App routing', () => {
  it('renders home route', () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('renders users route', () => {
    render(
      <MemoryRouter initialEntries={["/users"]}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Users')).toBeInTheDocument()
  })

  it('renders not found for unknown route', () => {
    render(
      <MemoryRouter initialEntries={["/unknown"]}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Not Found')).toBeInTheDocument()
  })
})


