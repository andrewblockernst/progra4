import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

// Proveedor que envuelve a todos los demás
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
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