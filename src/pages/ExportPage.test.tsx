import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ExportPage } from './ExportPage'

const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

vi.mock('../services/api', () => ({
  apiService: {
    getPublicKey: vi.fn().mockResolvedValue({ data: { publicKey: 'PUBKEY' } }),
    exportUsersProtobuf: vi.fn().mockResolvedValue({ blob: { arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)) } as any, metadata: { userCount: 1, format: 'protobuf', size: 10 } }),
    exportUsersJSON: vi.fn().mockResolvedValue([{ id: '1', email: 'a@a.com', role: 'user', status: 'active', created_at: new Date().toISOString(), email_hash: '', signature: '' }]),
  },
}))

vi.mock('../services/protobuf', () => ({
  protobufService: {
    decodeUserCollection: vi.fn().mockResolvedValue({ users: [{ id: '1', email: 'a@a.com', role: 'user', status: 'active', created_at: new Date().toISOString(), email_hash: '', signature: '' }], totalCount: 1, exportedAt: new Date().toISOString(), algorithm: 'RSA', hashAlgorithm: 'SHA-384' }),
  },
}))

describe('ExportPage', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('exports as JSON', async () => {
    render(<ExportPage />)
    fireEvent.click(await screen.findByRole('button', { name: /Export as JSON/i }))
    await waitFor(() => expect(screen.getByText(/Export Successful/i)).toBeInTheDocument())
    expect(createObjectURLSpy).toHaveBeenCalled()
    expect(revokeObjectURLSpy).toHaveBeenCalled()
  })

  it('exports protobuf and decodes to table', async () => {
    render(<ExportPage />)
    fireEvent.click(await screen.findByRole('button', { name: /Export as Protocol Buffer/i }))
    await waitFor(() => expect(screen.getByText(/Export Successful/i)).toBeInTheDocument())

    fireEvent.click(screen.getByRole('button', { name: /Decode & Display Protocol Buffer/i }))
    await waitFor(() => expect(screen.getByText(/Decoded Users/i)).toBeInTheDocument())
  })
})


