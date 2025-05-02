import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from '@/app/login/page'
import '@testing-library/jest-dom'
import api from '@/app/lib/api'
import * as nextNavigation from 'next/navigation'

jest.mock('@/app/lib/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('LoginPage', () => {
  const push = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(nextNavigation.useRouter as jest.Mock).mockReturnValue({ push })
  })

  it('renderiza campos e botão', () => {
    render(<LoginPage />)

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument()
    expect(screen.getByText('Entrar')).toBeInTheDocument()
  })

  it('realiza login com sucesso', async () => {
    ;(api.post as jest.Mock).mockResolvedValue({
      data: { access_token: 'abc123' },
    })

    render(<LoginPage />)

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'email@teste.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: '123456' },
    })
    fireEvent.click(screen.getByText('Entrar'))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'email@teste.com',
        password: '123456',
      })
      expect(push).toHaveBeenCalledWith('/dashboard/users')
    })
  })

  it('mostra erro ao falhar login', async () => {
    ;(api.post as jest.Mock).mockRejectedValue(new Error('Erro'))

    render(<LoginPage />)

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'email@invalido.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'senhaerrada' },
    })
    fireEvent.click(screen.getByText('Entrar'))

    expect(await screen.findByText('Credenciais inválidas')).toBeInTheDocument()
  })
})
