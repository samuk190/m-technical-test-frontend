import { render, screen, fireEvent } from '@testing-library/react'
import RegisterPage from '@/app/register/page'
import '@testing-library/jest-dom'
import api from '@/app/lib/api'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('@/app/lib/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn().mockResolvedValue({}),
  },
}))

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('renderiza campos corretamente', () => {
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() })
    render(<RegisterPage />)
    expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument()
    expect(screen.getByText('Registrar')).toBeInTheDocument()
  })

  it('valida e mostra erro se campos estiverem vazios', async () => {
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() })
    render(<RegisterPage />)
    fireEvent.click(screen.getByText('Registrar'))
    expect(await screen.findByText('Nome é obrigatório')).toBeInTheDocument()
  })

  it('valida senha menor que 6 caracteres', async () => {
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() })
    render(<RegisterPage />)
    fireEvent.change(screen.getByPlaceholderText('Nome'), {
      target: { value: 'Fulano' },
    })
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'fulano@email.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: '123' },
    })
    fireEvent.click(screen.getByText('Registrar'))
    expect(await screen.findByText('A senha deve ter no mínimo 6 caracteres')).toBeInTheDocument()
  })

  it('valida email inválido', async () => {
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() })
    render(<RegisterPage />)
    fireEvent.change(screen.getByPlaceholderText('Nome'), {
      target: { value: 'Fulano' },
    })
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'fulanoemail.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: '123456' },
    })
    fireEvent.click(screen.getByText('Registrar'))
    expect(await screen.findByText('Email inválido')).toBeInTheDocument()
  })

  it('registra com sucesso e redireciona', async () => {
    const push = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push })

    render(<RegisterPage />)

    fireEvent.change(screen.getByPlaceholderText('Nome'), {
      target: { value: 'Fulano' },
    })
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'fulano@email.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: '123456' },
    })

    fireEvent.click(screen.getByText('Registrar'))
    await screen.findByText('Registrar')
    expect(push).toHaveBeenCalledWith('/login')
  })

  it('mostra erro se API falhar', async () => {
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() })
    ;(api.post as jest.Mock).mockRejectedValueOnce(new Error('Erro'))

    render(<RegisterPage />)
    fireEvent.change(screen.getByPlaceholderText('Nome'), {
      target: { value: 'Fulano' },
    })
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'fulano@email.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: '123456' },
    })

    fireEvent.click(screen.getByText('Registrar'))
    expect(await screen.findByText('Erro ao registrar')).toBeInTheDocument()
  })
})
