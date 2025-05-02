'use client'

import api from '@/app/lib/api'
import logger from '@/app/lib/logger'
import { useRouter, useParams } from 'next/navigation'
import { JSX, SetStateAction, useEffect, useState } from 'react'


export default function EditUserPage(): JSX.Element {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  useEffect(() => {
    api.get(`/users/${params.id}`).then((res: { data: { name: SetStateAction<string>; email: SetStateAction<string> } }) => {
      setName(res.data.name)
      setEmail(res.data.email)
    })
  }, [params.id])

  const handleSave = async (): Promise<void> => {
    if (!name.trim()) {
      setError('Nome é obrigatório')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Email inválido')
      return
    }
    if (password && password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres')
        return
      }
    try {
        await api.put(`/users/${params.id}`, {
      name,
      email,
      ...(password ? { password } : {}),
    })
      router.push('/dashboard/users')
    } catch (err) {
      setError('Erro ao salvar')
        if (err instanceof Error) {
          logger.error('Erro ao fazer requisição: ' + err.message)
        } else {
          logger.error('Erro ao fazer requisição: ' + JSON.stringify(err))
        }
      }

  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Editar Usuário</h1>
      <input value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} className="border p-2 w-full mb-2" />
      <input value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} className="border p-2 w-full mb-2" />
      <input placeholder="Senha (opcional)" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} className="border p-2 w-full mb-2" />
      <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded w-full">Salvar</button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  )
}
