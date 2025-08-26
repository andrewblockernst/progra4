import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils/test-utils'

// Componente simple para probar
function SearchInput({ placeholder }: { placeholder: string }) {
  return <input placeholder={placeholder} />
}

function SearchButton({ children }: { children: string }) {
  return <button>{children}</button>
}

describe('Search Components', () => {
  it('should render search input', () => {
    render(<SearchInput placeholder="Buscar libros..." />)
    
    const input = screen.getByPlaceholderText('Buscar libros...')
    expect(input).toBeDefined()
  })

  it('should render search button', () => {
    render(<SearchButton>Buscar</SearchButton>)
    
    const button = screen.getByText('Buscar')
    expect(button).toBeDefined()
  })

  it('should have correct button text', () => {
    render(<SearchButton>Buscar</SearchButton>)
    
    expect(screen.getByText('Buscar')).toBeDefined()
  })
})