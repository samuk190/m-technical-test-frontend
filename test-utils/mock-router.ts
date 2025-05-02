jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
    useParams: () => ({ id: '1' }),
  }))
