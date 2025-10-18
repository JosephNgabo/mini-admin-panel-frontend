import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NotFoundPage } from './NotFoundPage'

describe('NotFoundPage', () => {
  it('renders 404 and buttons', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    )
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Go Home/i })).toBeInTheDocument()
    // Go Back button exists (click is no-op in jsdom)
    fireEvent.click(screen.getByRole('button', { name: /Go Back/i }))
  })
})


