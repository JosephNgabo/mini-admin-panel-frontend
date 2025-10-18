import { describe, it, expect, vi } from 'vitest'

// JSDOM provides a root element in test environment; simulate minimal render by importing main
vi.mock('./App', () => ({ default: () => null }))

describe('main entry', () => {
  it('loads without crashing', async () => {
    const root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)
    await import('./main')
    expect(document.getElementById('root')).toBeTruthy()
  })
})


