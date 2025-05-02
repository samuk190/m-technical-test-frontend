import { render, screen, fireEvent } from '@testing-library/react'
import NewUserPage from '@/app/dashboard/users/new/page'
import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() })
}))

describe('NewUserPage', () => {
  it('valida senha menor que 6 caracteres', async () => {
    render(<NewUserPage />)

    fireEvent.change(screen.getByPlaceholderText('Nome'), {
      target: { value: 'Fulano' },
    })
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'fulano@email.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: '123' },
    })

    fireEvent.click(screen.getByText('Criar'))

    expect(await screen.findByText('A senha deve ter no mínimo 6 caracteres')).toBeInTheDocument()
  })

  it('valida nome vazio', async () => {
    render(<NewUserPage />)

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'teste@email.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: '123456' },
    })

    fireEvent.click(screen.getByText('Criar'))

    expect(await screen.findByText('Nome é obrigatório')).toBeInTheDocument()
  })
})
