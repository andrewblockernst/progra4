import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils/test-utils'
import ReviewForm from '@/components/review-form'

// Mock NextAuth at the top
const mockUseSession = vi.fn()
vi.mock('next-auth/react', () => ({
  useSession: mockUseSession,
  signIn: vi.fn(),
  signOut: vi.fn(),
}))

// Mock de las actions reales
vi.mock('@/app/actions', () => ({
  addReview: vi.fn()
}))

// Mock dbConnect al inicio
vi.mock('@/lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue(null),
}))

// Mock modelos si es necesario
vi.mock('@/models/Review', () => ({
  default: vi.fn().mockImplementation((data) => ({
    ...data,
    save: vi.fn().mockResolvedValue(data),
  })),
}))

// Mock fetch
global.fetch = vi.fn()

describe('ReviewForm Component', () => {
  const mockProps = {
    bookId: 'test-book-id',
    onReviewAdded: vi.fn(),
    onCancel: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    global.alert = vi.fn()

    // Setup default authenticated session
    mockUseSession.mockReturnValue({
      data: {
        user: { id: 'test-user', email: 'test@example.com', name: 'Test User' },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      status: 'authenticated',
      update: vi.fn()
    })

    // Setup successful fetch by default
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'new-review-id' })
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Rendering', () => {
    it('should render review form with all required elements', () => {
      render(<ReviewForm {...mockProps} />)

      expect(screen.getByText('Escribir una reseña')).toBeInTheDocument()
      expect(screen.getByText('Calificación *')).toBeInTheDocument()
      expect(screen.getByText('Tu reseña *')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /publicar reseña/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
    })

    it('should render star rating component', () => {
      render(<ReviewForm {...mockProps} />)

      // Should have 5 stars
      const stars = screen.getAllByRole('button')
      expect(stars.length).toBeGreaterThanOrEqual(5)
    })

    it('should render textarea for comment', () => {
      render(<ReviewForm {...mockProps} />)

      const textarea = screen.getByPlaceholderText('Comparte tu opinión sobre este libro...')
      expect(textarea).toBeInTheDocument()
      expect(textarea).toHaveAttribute('maxLength', '1000')
    })
  })

  describe('User Interactions', () => {
    it('should allow user to select star rating', async () => {
      render(<ReviewForm {...mockProps} />)

      const stars = screen.getAllByRole('button').slice(0, 5) // First 5 buttons should be stars

      // Click on 4th star
      fireEvent.click(stars[3])

      // Should show rating feedback
      await waitFor(() => {
        expect(screen.getByText('Bueno')).toBeInTheDocument()
      })
    })

    it('should update comment text', () => {
      render(<ReviewForm {...mockProps} />)

      const textarea = screen.getByPlaceholderText('Comparte tu opinión sobre este libro...')
      const testComment = 'This is a test comment for the book review.'

      fireEvent.change(textarea, { target: { value: testComment } })

      expect(textarea).toHaveValue(testComment)
    })

    it('should show character count', () => {
      render(<ReviewForm {...mockProps} />)

      const textarea = screen.getByPlaceholderText('Comparte tu opinión sobre este libro...')
      const testComment = 'Short comment'

      fireEvent.change(textarea, { target: { value: testComment } })

      expect(screen.getByText(`${testComment.length}/1000`)).toBeInTheDocument()
    })

    it('should handle cancel button click', () => {
      render(<ReviewForm {...mockProps} />)

      const cancelButton = screen.getByRole('button', { name: /cancelar/i })
      fireEvent.click(cancelButton)

      expect(mockProps.onCancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('Form Validation', () => {
    it('should prevent submission without rating', async () => {
      render(<ReviewForm {...mockProps} />)

      const textarea = screen.getByPlaceholderText('Comparte tu opinión sobre este libro...')
      fireEvent.change(textarea, { target: { value: 'This is a valid comment with enough characters.' } })

      const submitButton = screen.getByRole('button', { name: /publicar reseña/i })
      fireEvent.click(submitButton)

      // Should not call onReviewAdded
      expect(mockProps.onReviewAdded).not.toHaveBeenCalled()
      expect(global.alert).toHaveBeenCalledWith('Por favor selecciona una calificación')
    })

    it('should prevent submission with short comment', async () => {
      render(<ReviewForm {...mockProps} />)

      // Select rating
      const stars = screen.getAllByRole('button').slice(0, 5)
      fireEvent.click(stars[3]) // 4 stars

      const textarea = screen.getByPlaceholderText('Comparte tu opinión sobre este libro...')
      fireEvent.change(textarea, { target: { value: 'Short' } })

      const submitButton = screen.getByRole('button', { name: /publicar reseña/i })
      fireEvent.click(submitButton)

      expect(mockProps.onReviewAdded).not.toHaveBeenCalled()
      expect(global.alert).toHaveBeenCalledWith('La reseña debe tener al menos 10 caracteres')
    })

    it('should show validation errors for unauthenticated users', async () => {
      // Override session for this test
      mockUseSession.mockReturnValueOnce({
        data: null,
        status: 'unauthenticated',
        update: vi.fn()
      })

      render(<ReviewForm {...mockProps} />)

      // Select rating and add comment
      const stars = screen.getAllByRole('button').slice(0, 5)
      fireEvent.click(stars[3])

      const textarea = screen.getByPlaceholderText('Comparte tu opinión sobre este libro...')
      fireEvent.change(textarea, { target: { value: 'This is a valid comment with enough characters.' } })

      const submitButton = screen.getByRole('button', { name: /publicar reseña/i })
      fireEvent.click(submitButton)

      expect(global.alert).toHaveBeenCalledWith('Debes iniciar sesión para publicar una reseña')
    })
  })

  describe('Form Submission', () => {
    it('should submit valid review successfully', async () => {
      render(<ReviewForm {...mockProps} />)

      // Select rating
      const stars = screen.getAllByRole('button').slice(0, 5)
      fireEvent.click(stars[3]) // 4 stars

      // Add comment
      const textarea = screen.getByPlaceholderText('Comparte tu opinión sobre este libro...')
      const testComment = 'This is a comprehensive review of the book. I found it very engaging and well-written.'
      fireEvent.change(textarea, { target: { value: testComment } })

      // Submit form
      const submitButton = screen.getByRole('button', { name: /publicar reseña/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookId: 'test-book-id',
            rating: 4,
            comment: testComment
          })
        })
      })

      expect(mockProps.onReviewAdded).toHaveBeenCalledWith({ id: 'new-review-id' })
    })

    it('should handle submission errors', async () => {
      ;(global.fetch as any).mockRejectedValue(new Error('Network error'))

      render(<ReviewForm {...mockProps} />)

      // Select rating
      const stars = screen.getAllByRole('button').slice(0, 5)
      fireEvent.click(stars[3])

      // Add comment
      const textarea = screen.getByPlaceholderText('Comparte tu opinión sobre este libro...')
      fireEvent.change(textarea, { target: { value: 'This is a valid comment.' } })

      // Submit form
      const submitButton = screen.getByRole('button', { name: /publicar reseña/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Error al agregar la reseña. Intenta de nuevo.')
      })

      expect(mockProps.onReviewAdded).not.toHaveBeenCalled()
    })

    it('should disable submit button during submission', async () => {
      render(<ReviewForm {...mockProps} />)

      // Select rating
      const stars = screen.getAllByRole('button').slice(0, 5)
      fireEvent.click(stars[3])

      // Add comment
      const textarea = screen.getByPlaceholderText('Comparte tu opinión sobre este libro...')
      fireEvent.change(textarea, { target: { value: 'This is a valid comment.' } })

      // Submit form
      const submitButton = screen.getByRole('button', { name: /publicar reseña/i })
      fireEvent.click(submitButton)

      // Button should be disabled during submission
      expect(submitButton).toBeDisabled()
      expect(submitButton).toHaveTextContent('Publicando...')

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<ReviewForm {...mockProps} />)

      const textarea = screen.getByPlaceholderText('Comparte tu opinión sobre este libro...')
      expect(textarea).toHaveAttribute('id')

      const ratingLabel = screen.getByText('Calificación *')
      expect(ratingLabel).toBeInTheDocument()
    })

    it('should support keyboard navigation', () => {
      render(<ReviewForm {...mockProps} />)

      const textarea = screen.getByPlaceholderText('Comparte tu opinión sobre este libro...')

      // Focus on textarea
      textarea.focus()
      expect(textarea).toHaveFocus()

      // Should be able to type
      fireEvent.change(textarea, { target: { value: 'Test comment' } })
      expect(textarea).toHaveValue('Test comment')
    })
  })

  describe('Edge Cases', () => {
    it('should handle maximum comment length', () => {
      render(<ReviewForm {...mockProps} />)

      const textarea = screen.getByPlaceholderText('Comparte tu opinión sobre este libro...')
      const longComment = 'A'.repeat(1000)

      fireEvent.change(textarea, { target: { value: longComment } })

      expect(textarea).toHaveValue(longComment)
      expect(screen.getByText('1000/1000')).toBeInTheDocument()
    })

    it('should prevent comment exceeding maximum length', () => {
      render(<ReviewForm {...mockProps} />)

      const textarea = screen.getByPlaceholderText('Comparte tu opinión sobre este libro...')
      const tooLongComment = 'A'.repeat(1001)

      fireEvent.change(textarea, { target: { value: tooLongComment } })

      // Should be truncated or rejected
      expect(textarea).toHaveValue(tooLongComment.substring(0, 1000))
    })

    it('should handle special characters in comment', () => {
      render(<ReviewForm {...mockProps} />)

      const textarea = screen.getByPlaceholderText('Comparte tu opinión sobre este libro...')
      const specialComment = 'Comment with émojis 😀 and spëcial chärs!'

      fireEvent.change(textarea, { target: { value: specialComment } })

      expect(textarea).toHaveValue(specialComment)
    })
  })
})
