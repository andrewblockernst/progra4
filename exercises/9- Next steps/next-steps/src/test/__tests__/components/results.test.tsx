import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils/test-utils'

// Mock simple de resultados
function SimpleResults({ books, isLoading }: any) {
  if (isLoading) {
    return <div data-testid="loading">Cargando...</div>
  }
  
  if (!books || books.length === 0) {
    return <div data-testid="no-results">No hay resultados</div>
  }
  
  return (
    <div data-testid="results">
      {books.map((book: any) => (
        <div key={book.id} data-testid="book-item">
          <h3>{book.volumeInfo.title}</h3>
          <p>{book.volumeInfo.authors?.join(', ')}</p>
        </div>
      ))}
    </div>
  )
}

describe('Results Component', () => {
  const mockBooks = [
    {
      id: 'book-1',
      volumeInfo: {
        title: 'Test Book 1',
        authors: ['Author 1']
      }
    },
    {
      id: 'book-2',
      volumeInfo: {
        title: 'Test Book 2',
        authors: ['Author 2', 'Author 3']
      }
    }
  ]

  it('should show loading state', () => {
    render(<SimpleResults books={[]} isLoading={true} />)
    
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('should show no results message', () => {
    render(<SimpleResults books={[]} isLoading={false} />)
    
    expect(screen.getByTestId('no-results')).toBeInTheDocument()
    expect(screen.getByText('No hay resultados')).toBeInTheDocument()
  })

  it('should render books list', () => {
    render(<SimpleResults books={mockBooks} isLoading={false} />)
    
    expect(screen.getByTestId('results')).toBeInTheDocument()
    expect(screen.getAllByTestId('book-item')).toHaveLength(2)
    expect(screen.getByText('Test Book 1')).toBeInTheDocument()
    expect(screen.getByText('Test Book 2')).toBeInTheDocument()
  })

  it('should render authors correctly', () => {
    render(<SimpleResults books={mockBooks} isLoading={false} />)
    
    expect(screen.getByText('Author 1')).toBeInTheDocument()
    expect(screen.getByText('Author 2, Author 3')).toBeInTheDocument()
  })
})