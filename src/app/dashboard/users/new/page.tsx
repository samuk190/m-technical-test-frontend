'use client'

import api from '@/app/lib/api'
import { useRouter } from 'next/navigation'
import { JSX, useState } from 'react'

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export default function NewUserPage(): JSX.Element {
  const router = useRouter()
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleCreate = async (): Promise<void> => {
    if (!name.trim()) {
      setError('Nome é obrigatório')
      return
    }
    if (!validateEmail(email)) {
      setError('Email inválido')
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres')
      return
    }

    try {
      await api.post('/users', { name, email, password })
      router.push('/dashboard/users')
    } catch (err) {
      setError('Erro ao criar')
      console.log(err);
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto bg-black text-white min-h-screen">
      <h1 className="text-xl font-bold mb-4">Novo Usuário</h1>
      <input
        placeholder="Nome"
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        className="border p-2 w-full mb-2 bg-transparent text-white placeholder-white"
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        className="border p-2 w-full mb-2 bg-transparent text-white placeholder-white"
      />
      <input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        className="border p-2 w-full mb-2 bg-transparent text-white placeholder-white"
      />
      <button
        onClick={handleCreate}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Criar
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
