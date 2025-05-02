'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User } from '@/types/user'
import { JSX } from 'react'
import api from '@/app/lib/api'

export default function UsersPage(): JSX.Element {
  const router = useRouter()

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users')
      return data as User[]
    },
  })
  const queryClient = useQueryClient()
  const logout = () => {
    localStorage.removeItem('token')
    document.cookie = 'token=; Max-Age=0; path=/'
    router.push('/login')
  }
  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja remover este usuário?')) return

    try {
      await api.delete(`/users/${id}`)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    } catch (err) {
      alert('Erro ao remover usuário')
      console.log(err);
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Usuários</h1>
        <button onClick={logout} className="text-sm text-red-600">Sair</button>
      </div>

      <Link href="/dashboard/users/new" className="text-blue-600 underline">Novo Usuário</Link>
      {isLoading && <p>Carregando...</p>}
      {users && (
        <ul className="mt-4">
    {users.map((user) => (
  <li key={user.id} className="border p-2 mb-2">
    <p><strong>{user.name}</strong></p>
    <p>{user.email}</p>
    <div className="flex gap-4">
      <Link href={`/dashboard/users/${user.id}`} className="text-sm text-blue-600 underline">Editar</Link>
      <button onClick={() => handleDelete(user.id)} className="text-sm text-red-500 underline">Remover</button>
    </div>
  </li>
))}
        </ul>
      )}
    </div>
  )
}
