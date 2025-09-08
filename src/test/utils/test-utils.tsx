import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'
import { SessionProvider } from 'next-auth/react'

// Mock de next-auth
vi.mock('next-auth/react', () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSession: () => ({ data: { user: { id: 'test-user', email: 'test@example.com' } } }),
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

// Proveedor que envuelve a todos los demás
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

// Reemplaza la función render original con una que incluye el proveedor
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-exporta todo de testing-library
export * from '@testing-library/react'

// Mantén la función render original
export { customRender as render }