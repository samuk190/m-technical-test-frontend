'use client'

import { useRouter } from 'next/navigation'
import { JSX, useState } from 'react'
import api from '../lib/api'
import logger from '../lib/logger'


export default function LoginPage(): JSX.Element {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleLogin = async (): Promise<void> => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.access_token)
      document.cookie = `token=${data.access_token}; path=/`
      router.push('/dashboard/users')
    } catch (err) {
      setError('Credenciais inválidas')
      if (err instanceof Error) {
        logger.error('Erro ao fazer requisição: ' + err.message)
      } else {
        logger.error('Erro ao fazer requisição: ' + JSON.stringify(err))
      }
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 w-full mb-2" />
      <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 w-full mb-2" />
      <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded w-full">Entrar</button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
