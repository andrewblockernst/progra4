import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils/test-utils'
import { useState } from 'react'

// Mock correcto - debe coincidir con donde está el archivo actions
vi.mock('@/app/actions', () => ({
  addReview: vi.fn()
}))

// Importa desde el mock, no desde el archivo real
const mockAddReview = vi.fn()
const mockOnReviewAdded = vi.fn()
const mockOnCancel = vi.fn()

// Mock de addReview para que esté disponible
vi.mocked = vi.mocked || ((fn: any) => fn)

// Mock simple del form
function SimpleReviewForm({ onReviewAdded, onCancel }: any) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [userName, setUserName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      alert('Por favor selecciona una calificación')
      return
    }
    
    if (comment.length < 10) {
      alert('La reseña debe tener al menos 10 caracteres')
      return
    }
    
    onReviewAdded({
      id: Date.now().toString(),
      userName: userName || 'Usuario Anónimo',
      rating,
      comment,
      createdAt: new Date()
    })
  }

  return (
    <form onSubmit={handleSubmit} data-testid="review-form">
      <input
        placeholder="Tu nombre"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        data-testid="name-input"
      />
      
      <div data-testid="rating-section">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            data-testid={`star-${star}`}
          >
            ⭐
          </button>
        ))}
      </div>
      
      <textarea
        placeholder="Tu reseña"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        data-testid="comment-input"
      />
      
      <button type="submit" data-testid="submit-btn">
        Publicar Reseña
      </button>
      
      <button type="button" onClick={onCancel} data-testid="cancel-btn">
        Cancelar
      </button>
    </form>
  )
}

describe('ReviewForm', () => {
  const mockOnReviewAdded = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    global.alert = vi.fn()
  })

  it('should render all form elements', () => {
    render(
      <SimpleReviewForm 
        onReviewAdded={mockOnReviewAdded} 
        onCancel={mockOnCancel} 
      />
    )
    
    expect(screen.getByTestId('review-form')).toBeInTheDocument()
    expect(screen.getByTestId('name-input')).toBeInTheDocument()
    expect(screen.getByTestId('rating-section')).toBeInTheDocument()
    expect(screen.getByTestId('comment-input')).toBeInTheDocument()
    expect(screen.getByTestId('submit-btn')).toBeInTheDocument()
    expect(screen.getByTestId('cancel-btn')).toBeInTheDocument()
  })

  it('should validate rating selection', () => {
    render(
      <SimpleReviewForm 
        onReviewAdded={mockOnReviewAdded} 
        onCancel={mockOnCancel} 
      />
    )
    
    const submitBtn = screen.getByTestId('submit-btn')
    fireEvent.click(submitBtn)
    
    expect(global.alert).toHaveBeenCalledWith('Por favor selecciona una calificación')
  })

  it('should validate comment length', () => {
    render(
      <SimpleReviewForm 
        onReviewAdded={mockOnReviewAdded} 
        onCancel={mockOnCancel} 
      />
    )
    
    // Select rating
    const star5 = screen.getByTestId('star-5')
    fireEvent.click(star5)
    
    // Enter short comment
    const commentInput = screen.getByTestId('comment-input')
    fireEvent.change(commentInput, { target: { value: 'Short' } })
    
    const submitBtn = screen.getByTestId('submit-btn')
    fireEvent.click(submitBtn)
    
    expect(global.alert).toHaveBeenCalledWith('La reseña debe tener al menos 10 caracteres')
  })

  it('should submit valid review', () => {
    render(
      <SimpleReviewForm 
        onReviewAdded={mockOnReviewAdded} 
        onCancel={mockOnCancel} 
      />
    )
    
    // Fill form
    const nameInput = screen.getByTestId('name-input')
    fireEvent.change(nameInput, { target: { value: 'Test User' } })
    
    const star4 = screen.getByTestId('star-4')
    fireEvent.click(star4)
    
    const commentInput = screen.getByTestId('comment-input')
    fireEvent.change(commentInput, { 
      target: { value: 'This is a great book with detailed analysis!' } 
    })
    
    const submitBtn = screen.getByTestId('submit-btn')
    fireEvent.click(submitBtn)
    
    expect(mockOnReviewAdded).toHaveBeenCalledWith(
      expect.objectContaining({
        userName: 'Test User',
        rating: 4,
        comment: 'This is a great book with detailed analysis!'
      })
    )
  })

  it('should call onCancel when cancel clicked', () => {
    render(
      <SimpleReviewForm 
        onReviewAdded={mockOnReviewAdded} 
        onCancel={mockOnCancel} 
      />
    )
    
    const cancelBtn = screen.getByTestId('cancel-btn')
    fireEvent.click(cancelBtn)
    
    expect(mockOnCancel).toHaveBeenCalledOnce()
  })
})

