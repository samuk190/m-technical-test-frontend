import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UsersPage from '@/app/dashboard/users/page'
import '@testing-library/jest-dom'
import api from '@/app/lib/api'
import * as nextNavigation from 'next/navigation'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

jest.mock('@/app/lib/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    delete: jest.fn(),
  },
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('UsersPage', () => {
  const push = jest.fn()
  const queryClient = new QueryClient()

  beforeEach(() => {
    jest.clearAllMocks()
    queryClient.clear()
    ;(nextNavigation.useRouter as jest.Mock).mockReturnValue({ push })

  })

  function renderWithClient() {
    return render(
      <QueryClientProvider client={queryClient}>
        <UsersPage />
      </QueryClientProvider>
    )
  }

  it('exibe carregando quando está carregando os usuários', () => {
    ;(api.get as jest.Mock).mockImplementation(() => new Promise(() => {}))
    renderWithClient()
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('renderiza a lista de usuários', async () => {
    ;(api.get as jest.Mock).mockResolvedValue({
      data: [
        { id: 1, name: 'Fulano', email: 'fulano@email.com' },
        { id: 2, name: 'Ciclano', email: 'ciclano@email.com' },
      ],
    })

    renderWithClient()

    expect(await screen.findByText('Fulano')).toBeInTheDocument()
    expect(await screen.findByText('Ciclano')).toBeInTheDocument()
  })

  it('executa logout corretamente', () => {
    ;(api.get as jest.Mock).mockResolvedValue({ data: [] })
    renderWithClient()
    fireEvent.click(screen.getByText('Sair'))
    expect(push).toHaveBeenCalledWith('/login')
  })

  it('confirma e remove usuário', async () => {
    global.confirm = jest.fn(() => true)
    ;(api.get as jest.Mock).mockResolvedValue({
      data: [{ id: 1, name: 'Teste', email: 'teste@email.com' }],
    })
    ;(api.delete as jest.Mock).mockResolvedValue({})

    renderWithClient()
    await screen.findByText('Teste')
    fireEvent.click(screen.getByText('Remover'))

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/users/1')
    })
  })

  it('cancela exclusão se usuário não confirmar', async () => {
    global.confirm = jest.fn(() => false)
    ;(api.get as jest.Mock).mockResolvedValue({
      data: [{ id: 1, name: 'Teste', email: 'teste@email.com' }],
    })

    renderWithClient()
    await screen.findByText('Teste')
    fireEvent.click(screen.getByText('Remover'))

    expect(api.delete).not.toHaveBeenCalled()
  })

  it('mostra alerta se erro ao remover', async () => {
    global.confirm = jest.fn(() => true)
    ;(api.get as jest.Mock).mockResolvedValue({
      data: [{ id: 1, name: 'Teste', email: 'teste@email.com' }],
    })
    ;(api.delete as jest.Mock).mockRejectedValue(new Error('Erro'))

    window.alert = jest.fn()

    renderWithClient()
    await screen.findByText('Teste')
    fireEvent.click(screen.getByText('Remover'))

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Erro ao remover usuário')
    })
  })
})
