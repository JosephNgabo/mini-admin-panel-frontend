import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from './Sidebar'

describe('Sidebar', () => {
  it('renders navigation links', () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Sidebar />
      </MemoryRouter>
    )
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
    expect(screen.getByText(/Users/i)).toBeInTheDocument()
    expect(screen.getByText(/Analytics/i)).toBeInTheDocument()
    expect(screen.getByText(/Export/i)).toBeInTheDocument()
  })
})


