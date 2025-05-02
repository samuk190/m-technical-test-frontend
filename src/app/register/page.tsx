'use client'

import { JSX, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '../lib/api'
import logger from '../lib/logger'


export default function RegisterPage(): JSX.Element {
  const router = useRouter()
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleRegister = async () => {
    if (!name) return setError('Nome é obrigatório')
    if (!email.includes('@')) return setError('Email inválido')
    if (password.length < 6) return setError('A senha deve ter no mínimo 6 caracteres')

    try {
      await api.post('/auth/register', { name, email, password })
      router.push('/login')
    } catch (err) {
      setError('Erro ao registrar')
      if (err instanceof Error) {
        logger.error('Erro ao fazer requisição: ' + err.message)
      } else {
        logger.error('Erro ao fazer requisição: ' + JSON.stringify(err))
      }
    }
  }
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Criar Conta</h1>
      <input placeholder="Nome" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} className="border p-2 w-full mb-2" />
      <input placeholder="Email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} className="border p-2 w-full mb-2" />
      <input type="password" placeholder="Senha" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} className="border p-2 w-full mb-2" />
      <button onClick={handleRegister} className="bg-blue-600 text-white px-4 py-2 rounded w-full">Registrar</button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
