# 🧠 Painel Administrativo - Frontend / Admin Panel - Frontend

> Interface de gerenciamento de usuários construída com Next.js
> User management interface built with Next.js

---

## 🇧🇷 Funcionalidades
- Login com persistência de token (`localStorage` + `document.cookie`)
- Registro de usuário com validação
- Listagem de usuários
- Edição com validações de e-mail e senha
- Exclusão com confirmação
- Logout funcional
- Middleware de proteção de rotas
- Tema escuro com texto branco
- Integração com backend via Axios
- Interceptor de requisições com JWT
- Testes unitários com Jest e React Testing Library
- Cobertura de testes >85%

## 🇺🇸 Features
- Login with token persistence (`localStorage` + `document.cookie`)
- User registration with form validation
- User list with full CRUD
- User edit page with email/password validation
- Confirmed user deletion
- Functional logout
- Route protection via middleware
- Dark theme with white text
- Backend integration using Axios
- JWT request interceptor
- Unit tests with Jest & React Testing Library
- Test coverage above 85%

---

## 🛠️ Tecnologias / Technologies

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Axios
- React Query
- Jest
- React Testing Library

---

## 📁 Estrutura de Pastas / Folder Structure

```
src/
├── app/
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   │   └── users/
│   │       ├── new/
│   │       └── [id]/
│   └── lib/
│       └── api.ts
├── types/
│   └── user.ts
test-utils/
  └── mock-router.ts
__tests__/
```

---

## 🧪 Testes / Tests

```bash
npm run test
npm run test:coverage
```

A cobertura é superior a 85%.
Coverage is above 85%.

---

## 🔐 Middleware

Protege a área `/dashboard` redirecionando usuários não autenticados.
Protects `/dashboard` by redirecting unauthenticated users.

---

## 🌐 Variáveis de Ambiente / Environment Variables

Crie um `.env.local`:
Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 🧪 API Mock Testing

Arquivo `api.ts` testado com cobertura de chamadas e headers.
`api.ts` is tested for headers and HTTP calls.

---

## 📦 Scripts

```bash
npm run dev
npm run build
npm run start
```

---

## ✍️ Autor / Author

With 💙 By Samuk190
