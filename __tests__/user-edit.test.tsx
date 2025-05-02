import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EditUserPage from '@/app/dashboard/users/[id]/page'

import '@testing-library/jest-dom'
import api from '@/app/lib/api'
import * as nextNavigation from 'next/navigation'

jest.mock('@/app/lib/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
  },
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}))

describe('EditUserPage', () => {
  const push = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    ;(nextNavigation.useRouter as jest.Mock).mockReturnValue({ push })
    ;(nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '1' })
    ;(api.get as jest.Mock).mockResolvedValue({
      data: { name: 'Teste', email: 'teste@email.com' },
    })
  })

  it('carrega dados do usuário', async () => {
    render(<EditUserPage />)
    expect(await screen.findByDisplayValue('Teste')).toBeInTheDocument()
    expect(await screen.findByDisplayValue('teste@email.com')).toBeInTheDocument()
  })

  it('valida nome obrigatório', async () => {
    render(<EditUserPage />)
    fireEvent.change(await screen.findByDisplayValue('Teste'), {
      target: { value: '' },
    })
    fireEvent.click(screen.getByText('Salvar'))
    expect(await screen.findByText('Nome é obrigatório')).toBeInTheDocument()
  })

  it('valida email inválido', async () => {
    render(<EditUserPage />)
    fireEvent.change(await screen.findByDisplayValue('teste@email.com'), {
      target: { value: 'emailinvalido' },
    })
    fireEvent.click(screen.getByText('Salvar'))
    expect(await screen.findByText('Email inválido')).toBeInTheDocument()
  })

  it('valida senha pequena', async () => {
    render(<EditUserPage />)
    const senhaInput = await screen.findByPlaceholderText('Senha (opcional)')
    fireEvent.change(senhaInput, { target: { value: '123' } })
    fireEvent.click(screen.getByText('Salvar'))
    expect(await screen.findByText('A senha deve ter no mínimo 6 caracteres')).toBeInTheDocument()
  })

  it('salva e redireciona se dados forem válidos', async () => {
    render(<EditUserPage />)
    const senhaInput = await screen.findByPlaceholderText('Senha (opcional)')
    fireEvent.change(senhaInput, { target: { value: '123456' } })
    fireEvent.click(screen.getByText('Salvar'))
    await waitFor(() => {
      expect(api.put).toHaveBeenCalled()
      expect(push).toHaveBeenCalledWith('/dashboard/users')
    })
  })

  it('mostra erro se API falhar', async () => {
    ;(api.put as jest.Mock).mockRejectedValueOnce(new Error('Erro'))
    render(<EditUserPage />)
    const senhaInput = await screen.findByPlaceholderText('Senha (opcional)')
    fireEvent.change(senhaInput, { target: { value: '123456' } })
    fireEvent.click(screen.getByText('Salvar'))

    expect(await screen.findByText('Erro ao salvar')).toBeInTheDocument()
  })
})
