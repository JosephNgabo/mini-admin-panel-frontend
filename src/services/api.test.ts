import { describe, it, expect, vi, beforeEach } from 'vitest'

const axiosMocks = vi.hoisted(() => {
  const get = vi.fn()
  const post = vi.fn()
  const put = vi.fn()
  const del = vi.fn()
  const create = vi.fn(() => ({
    get,
    post,
    put,
    delete: del,
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  }))
  return { get, post, put, del, create }
})

vi.mock('axios', () => ({
  default: { create: axiosMocks.create },
}))

import { apiService } from './api'

describe('apiService', () => {
  beforeEach(() => {
    axiosMocks.get.mockReset(); axiosMocks.post.mockReset(); axiosMocks.put.mockReset(); axiosMocks.del.mockReset()
  })

  it('gets paginated users', async () => {
    axiosMocks.get.mockResolvedValueOnce({ data: { success: true, data: { users: [{ id: '1' }] }, pagination: { page: 1, limit: 10, totalPages: 1, totalCount: 1 } } })
    const res = await apiService.getUsersPaginated(1, 10)
    expect(res.data).toHaveLength(1)
    expect(res.pagination.totalPages).toBe(1)
  })

  it('exports users json', async () => {
    axiosMocks.get.mockResolvedValueOnce({ data: { data: [{ id: '1' }] } })
    const res = await apiService.exportUsersJSON()
    expect(res).toEqual([{ id: '1' }])
  })
})


