import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils/test-utils'
import BookModal from '@/components/book-modal'

// Mock de las actions reales
vi.mock('@/app/actions/reviews.action', () => ({
  fetchBookById: vi.fn().mockResolvedValue({
    id: 'test-book-id',
    volumeInfo: {
      title: 'Detailed Book Title',
      authors: ['Detailed Author'],
      description: 'Detailed description'
    }
  }),
  getBookReviews: vi.fn().mockResolvedValue([])
}))

describe('BookModal (Real Component)', () => {
  const mockBook = {
    id: 'test-book-id',
    volumeInfo: {
      title: 'Test Book Title',
      authors: ['Test Author', 'Second Author'],
      description: 'This is a comprehensive test book description that is long enough to test the expand/collapse functionality.',
      publishedDate: '2023-01-01',
      pageCount: 350,
      categories: ['Fiction', 'Adventure'],
      imageLinks: {
        thumbnail: 'https://example.com/thumbnail.jpg',
        small: 'https://example.com/small.jpg'
      }
    }
  }

  const defaultProps = {
    book: mockBook,
    isOpen: true,
    onClose: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock para document.body.style
    Object.defineProperty(document.body, 'style', {
      value: { overflow: '' },
      writable: true
    })
  })

  it('should not render when closed', () => {
    render(<BookModal {...defaultProps} isOpen={false} />)
    
    // Cuando está cerrado, no debería haber contenido modal
    expect(screen.queryByText('Test Book Title')).not.toBeInTheDocument()
  })

  it('should render book title and authors when open', () => {
    render(<BookModal {...defaultProps} />)
    
    expect(screen.getByText('Test Book Title')).toBeInTheDocument()
    expect(screen.getByText('Test Author, Second Author')).toBeInTheDocument()
  })

  it('should show description section', () => {
    render(<BookModal {...defaultProps} />)
    
    expect(screen.getByText('Descripción')).toBeInTheDocument()
  })

  it('should show reviews section', () => {
    render(<BookModal {...defaultProps} />)
    
    expect(screen.getByText('Quotes de la gente')).toBeInTheDocument()
    expect(screen.getByText('Escribir Quote')).toBeInTheDocument()
  })

  it('should toggle review form', async () => {
    render(<BookModal {...defaultProps} />)
    
    // Click para mostrar formulario
    const writeReviewBtn = screen.getByTestId('write-review-btn')
    fireEvent.click(writeReviewBtn)
    
    // Esperar a que aparezca el botón de cancelar
    await waitFor(() => {
      expect(screen.getByTestId('cancel-review-btn')).toBeInTheDocument()
    })
    
    // Click para ocultar formulario
    const cancelBtn = screen.getByTestId('cancel-review-btn')
    fireEvent.click(cancelBtn)
    
    // Debería volver al texto original
    await waitFor(() => {
      expect(screen.getByTestId('write-review-btn')).toBeInTheDocument()
    })
  })

  it('should toggle review form (alternative approach)', async () => {
    render(<BookModal {...defaultProps} />)
    
    // Verificar estado inicial
    expect(screen.getByTestId('write-review-btn')).toBeInTheDocument()
    
    // Click para mostrar formulario
    const writeReviewBtn = screen.getByTestId('write-review-btn')
    fireEvent.click(writeReviewBtn)
    
    // Buscar indicadores de que el formulario está activo
    await waitFor(() => {
      expect(screen.getByTestId('cancel-review-btn')).toBeInTheDocument()
    })
    
    // También verificar que aparecieron elementos de formulario
    await waitFor(() => {
      const formElements = document.querySelectorAll('textarea, input[type="text"]')
      expect(formElements.length).toBeGreaterThan(0)
    })
  })

  it('should call onClose when close button clicked', () => {
    render(<BookModal {...defaultProps} />)
    
    // Busca el botón X (puede ser por aria-label o por contenido SVG)
    const closeButtons = screen.getAllByRole('button')
    const closeButton = closeButtons.find(btn => 
      btn.innerHTML.includes('X') || 
      btn.querySelector('svg')
    )
    
    expect(closeButton).toBeTruthy()
    
    if (closeButton) {
      fireEvent.click(closeButton)
      expect(defaultProps.onClose).toHaveBeenCalled()
    }
  })

  it('should cancel review form', async () => {
    render(<BookModal {...defaultProps} />)
    
    // Click para mostrar formulario
    const writeReviewBtn = screen.getByTestId('write-review-btn')
    fireEvent.click(writeReviewBtn)
    
    // Asegurarse de que el formulario está visible
    await waitFor(() => {
      expect(screen.getByTestId('review-cancel-btn')).toBeInTheDocument()
    })
    
    // Click en el botón de cancelar del formulario
    const cancelBtn = screen.getByTestId('review-cancel-btn')
    fireEvent.click(cancelBtn)
    
    // Debería volver al texto original
    await waitFor(() => {
      expect(screen.getByTestId('write-review-btn')).toBeInTheDocument()
    })
  })
})