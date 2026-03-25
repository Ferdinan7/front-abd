import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'

import { routeTree } from './routeTree.gen'
import { AuthProvider } from '@/features/auth/context/AuthContext'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,       // 5 min — datos considerados frescos
      gcTime: 1000 * 60 * 30,          // 30 min — tiempo en caché tras desmontar
      refetchOnWindowFocus: false,      // no re-fetch al volver al tab
      refetchOnReconnect: false,        // no re-fetch al reconectar red
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
