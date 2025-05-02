import api from '@/app/lib/api'

describe('api instance', () => {
  it('deve ter a baseURL correta', () => {
    expect(api.defaults.baseURL).toBe(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000')
  })

  it('deve ter o header Content-Type como application/json', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json')
  })

  it('deve permitir chamadas GET', async () => {
    api.get = jest.fn().mockResolvedValue({ data: 'ok' }) as never
    const res = await api.get('/test')
    expect(res.data).toBe('ok')
  })
})
