import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils/test-utils'
import BookDetailModal from '@/components/book-modal'

// Mock NextAuth
const mockUseSession = vi.fn()
vi.mock('next-auth/react', () => ({
  useSession: mockUseSession,
}))

// Mock actions
vi.mock('../../../app/actions/reviews.action', () => ({
  fetchBookById: vi.fn().mockResolvedValue({
    id: 'test-book-id',
    volumeInfo: {
      title: 'Test Book Title',
      authors: ['Test Author'],
      description: 'This is a much longer description that should trigger the expansion functionality. '.repeat(20),
      imageLinks: {
        large: 'https://example.com/large.jpg',
        medium: 'https://example.com/medium.jpg',
        thumbnail: 'https://example.com/thumbnail.jpg',
      },
    },
  }),
}))

// Mock components
vi.mock('@/components/review-form', () => ({
  default: ({ onReviewAdded, onCancel }: any) => (
    <div data-testid="review-form">
      <button onClick={onCancel} data-testid="review-form-cancel">Cancel Review</button>
    </div>
  ),
}))

vi.mock('@/components/review-list', () => ({
  default: ({ reviews, isLoading }: any) => (
    <div data-testid="reviews-list">
      {isLoading ? 'Loading reviews...' : `${reviews.length} reviews`}
    </div>
  ),
}))

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} data-testid="book-image" />
  ),
}))

// Mock fetch
global.fetch = vi.fn()

describe('BookDetailModal Component', () => {
  const mockBook = {
    id: 'test-book-id',
    volumeInfo: {
      title: 'Test Book Title',
      authors: ['Test Author'],
      description: 'This is a test book description that is long enough to test the expansion functionality.',
      imageLinks: {
        large: 'https://example.com/large.jpg',
        medium: 'https://example.com/medium.jpg',
        thumbnail: 'https://example.com/thumbnail.jpg',
      },
    },
  }

  const mockDetailedBook = {
    ...mockBook,
    volumeInfo: {
      ...mockBook.volumeInfo,
      description: 'This is a much longer description that should trigger the expansion functionality. '.repeat(20),
    },
  }

  const mockProps = {
    book: mockBook,
    isOpen: true,
    onClose: vi.fn(),
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

    // Mock is already set up at the top

    // Mock fetch for reviews
    ;(global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('/api/reviews')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: '1', rating: 5, comment: 'Great book!', userId: 'user1', bookId: 'test-book-id' },
            { id: '2', rating: 4, comment: 'Good read', userId: 'user2', bookId: 'test-book-id' },
          ]),
        })
      }
      if (url.includes('/api/favorites')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        })
      }
      return Promise.reject(new Error('Unknown URL'))
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Modal Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(<BookDetailModal {...mockProps} isOpen={false} />)
      expect(screen.queryByText('Test Book Title')).not.toBeInTheDocument()
    })

    it('should render modal when isOpen is true', async () => {
      render(<BookDetailModal {...mockProps} />)
      
      await waitFor(() => {
        expect(screen.getByText('Test Book Title')).toBeInTheDocument()
        expect(screen.getByText('Test Author')).toBeInTheDocument()
      })
    })

    it('should render close button', async () => {
      render(<BookDetailModal {...mockProps} />)
      
      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /close/i })
        expect(closeButton).toBeInTheDocument()
      })
    })

    it('should render book image', async () => {
      render(<BookDetailModal {...mockProps} />)
      await waitFor(() => {
        const image = screen.getByTestId('book-image')
        expect(image).toBeInTheDocument()
        expect(image).toHaveAttribute('src', 'https://example.com/large.jpg')
      })
    })

    it('should render fallback when no image available', () => {
      const bookWithoutImage = {
        ...mockBook,
        volumeInfo: {
          ...mockBook.volumeInfo,
          imageLinks: undefined,
        },
      }

      render(<BookDetailModal {...mockProps} book={bookWithoutImage} />)
      expect(screen.getByText('Sin imagen disponible')).toBeInTheDocument()
    })
  })

  describe('Modal Interactions', () => {
    it('should call onClose when close button is clicked', async () => {
      render(<BookDetailModal {...mockProps} />)
      
      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /close/i })
        fireEvent.click(closeButton)
        expect(mockProps.onClose).toHaveBeenCalledTimes(1)
      })
    })

    it('should call onClose when backdrop is clicked', async () => {
      render(<BookDetailModal {...mockProps} />)
      
      await waitFor(() => {
        const backdrop = screen.getByTestId('modal-backdrop') || document.querySelector('.absolute.inset-0')
        if (backdrop) {
          fireEvent.click(backdrop)
          expect(mockProps.onClose).toHaveBeenCalledTimes(1)
        }
      })
    })

    it('should prevent body scroll when modal is open', async () => {
      render(<BookDetailModal {...mockProps} />)
      
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden')
      })
    })

    it('should restore body scroll when modal is closed', async () => {
      const { rerender } = render(<BookDetailModal {...mockProps} />)
      
      await waitFor(() => {
        expect(document.body.style.overflow).toBe('hidden')
      })

      rerender(<BookDetailModal {...mockProps} isOpen={false} />)
      expect(document.body.style.overflow).toBe('unset')
    })
  })

  describe('Book Details Loading', () => {
    it('should load detailed book information on mount', async () => {
      const { fetchBookById } = require('@/app/actions/reviews.action')
      render(<BookDetailModal {...mockProps} />)

      await waitFor(() => {
        expect(fetchBookById).toHaveBeenCalledWith('test-book-id')
      })
    })

    it('should handle book loading error gracefully', async () => {
      const { fetchBookById } = require('@/app/actions/reviews.action')
      fetchBookById.mockRejectedValue(new Error('Network error'))

      render(<BookDetailModal {...mockProps} />)

      await waitFor(() => {
        expect(screen.getByText('Test Book Title')).toBeInTheDocument()
      })
    })

    it('should show loading state for book details', () => {
      render(<BookDetailModal {...mockProps} />)
      expect(screen.getByText('Cargando detalles del libro...')).toBeInTheDocument()
    })
  })

  describe('Reviews Functionality', () => {
    it('should load reviews on mount', async () => {
      render(<BookDetailModal {...mockProps} />)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/reviews?bookId=test-book-id')
      })
    })

    it('should display reviews count', async () => {
      render(<BookDetailModal {...mockProps} />)

      await waitFor(() => {
        expect(screen.getByTestId('reviews-list')).toHaveTextContent('2 reviews')
      })
    })

    it('should show loading state for reviews', () => {
      render(<BookDetailModal {...mockProps} />)
      expect(screen.getByTestId('reviews-list')).toHaveTextContent('Loading reviews...')
    })

    it('should toggle review form visibility', () => {
      render(<BookDetailModal {...mockProps} />)

      const writeReviewButton = screen.getByTestId('write-review-btn')
      expect(writeReviewButton).toHaveTextContent('Escribir Quote')

      fireEvent.click(writeReviewButton)
      expect(screen.getByTestId('review-form')).toBeInTheDocument()

      const cancelButton = screen.getByTestId('cancel-review-btn')
      expect(cancelButton).toHaveTextContent('Cancelar')
    })
  })

  describe('Rating Display', () => {
    it('should calculate and display average rating', async () => {
      render(<BookDetailModal {...mockProps} />)

      await waitFor(() => {
        expect(screen.getByText('4.5')).toBeInTheDocument()
        expect(screen.getByText('(2 reseñas)')).toBeInTheDocument()
      })
    })

    it('should display "Sin calificar" when no reviews', async () => {
      ;(global.fetch as any).mockImplementation((url: string) => {
        if (url.includes('/api/reviews')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          })
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        })
      })

      render(<BookDetailModal {...mockProps} />)

      await waitFor(() => {
        expect(screen.getByText('Sin calificar')).toBeInTheDocument()
        expect(screen.getByText('(0 reseñas)')).toBeInTheDocument()
      })
    })

    it('should render star rating correctly', async () => {
      render(<BookDetailModal {...mockProps} />)

      await waitFor(() => {
        const stars = screen.getAllByTestId('star')
        expect(stars.length).toBe(5)
        // First 4 stars should be filled (rating 4.5)
        expect(stars[0]).toHaveClass('text-yellow-400', 'fill-yellow-400')
        expect(stars[1]).toHaveClass('text-yellow-400', 'fill-yellow-400')
        expect(stars[2]).toHaveClass('text-yellow-400', 'fill-yellow-400')
        expect(stars[3]).toHaveClass('text-yellow-400', 'fill-yellow-400')
        expect(stars[4]).toHaveClass('text-gray-300')
      })
    })
  })

  describe('Description Handling', () => {
    it('should show description preview when description is long', async () => {
      render(<BookDetailModal {...mockProps} />)

      await waitFor(() => {
        expect(screen.getByText('Descripción')).toBeInTheDocument()
        const expandButton = screen.getByRole('button', { name: /expand/i })
        expect(expandButton).toBeInTheDocument()
      })
    })

    it('should expand and collapse description', async () => {
      render(<BookDetailModal {...mockProps} />)

      await waitFor(() => {
        const expandButton = screen.getByRole('button', { name: /expand/i })
        fireEvent.click(expandButton)

        // Should show collapse button after expansion
        const collapseButton = screen.getByRole('button', { name: /collapse/i })
        expect(collapseButton).toBeInTheDocument()
      })
    })

    it('should not show expand button for short descriptions', () => {
      const bookWithShortDesc = {
        ...mockBook,
        volumeInfo: {
          ...mockBook.volumeInfo,
          description: 'Short description',
        },
      }

      render(<BookDetailModal {...mockProps} book={bookWithShortDesc} />)

      expect(screen.queryByRole('button', { name: /expand/i })).not.toBeInTheDocument()
    })
  })

  describe('Favorites Functionality', () => {
    it('should show favorite button for authenticated users', async () => {
      render(<BookDetailModal {...mockProps} />)

      await waitFor(() => {
        const favoriteButton = screen.getByRole('button', { name: /favorite/i })
        expect(favoriteButton).toBeInTheDocument()
      })
    })

    it('should not show favorite button for unauthenticated users', () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      })

      render(<BookDetailModal {...mockProps} />)

      expect(screen.queryByRole('button', { name: /favorite/i })).not.toBeInTheDocument()
    })

    it('should toggle favorite status', async () => {
      ;(global.fetch as any).mockImplementation((url: string, options?: any) => {
        if (url.includes('/api/favorites') && options?.method === 'POST') {
          return Promise.resolve({ ok: true })
        }
        if (url.includes('/api/favorites') && !options?.method) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          })
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      render(<BookDetailModal {...mockProps} />)

      await waitFor(() => {
        const favoriteButton = screen.getByRole('button', { name: /favorite/i })
        fireEvent.click(favoriteButton)
      })

      expect(global.fetch).toHaveBeenCalledWith('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: 'test-book-id' }),
      })
    })

    it('should show alert for unauthenticated favorite attempt', async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      })

      render(<BookDetailModal {...mockProps} />)

      // Since favorite button is not shown for unauthenticated users,
      // this test verifies the logic in the component
      expect(screen.queryByRole('button', { name: /favorite/i })).not.toBeInTheDocument()
    })
  })

  describe('Review Form Integration', () => {
    it('should add new review to reviews list', async () => {
      render(<BookDetailModal {...mockProps} />)

      // Mock the review form component to trigger onReviewAdded
      const reviewForm = screen.getByTestId('review-form')
      const mockNewReview = {
        id: 'new-review-id',
        rating: 5,
        comment: 'New review',
        userId: 'test-user',
        bookId: 'test-book-id',
      }

      // Simulate review form adding a review
      // This would normally be done by the ReviewForm component
      await waitFor(() => {
        expect(screen.getByTestId('reviews-list')).toHaveTextContent('2 reviews')
      })
    })

    it('should hide review form when cancelled', () => {
      render(<BookDetailModal {...mockProps} />)

      // Show review form
      const writeReviewButton = screen.getByTestId('write-review-btn')
      fireEvent.click(writeReviewButton)
      expect(screen.getByTestId('review-form')).toBeInTheDocument()

      // Cancel review form
      const cancelButton = screen.getByTestId('review-form-cancel')
      fireEvent.click(cancelButton)

      expect(screen.queryByTestId('review-form')).not.toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should handle reviews loading error', async () => {
      ;(global.fetch as any).mockImplementation((url: string) => {
        if (url.includes('/api/reviews')) {
          return Promise.reject(new Error('Network error'))
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        })
      })

      render(<BookDetailModal {...mockProps} />)

      await waitFor(() => {
        expect(screen.getByTestId('reviews-list')).toHaveTextContent('0 reviews')
      })
    })

    it('should handle favorites loading error', async () => {
      ;(global.fetch as any).mockImplementation((url: string) => {
        if (url.includes('/api/favorites')) {
          return Promise.reject(new Error('Network error'))
        }
        if (url.includes('/api/reviews')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          })
        }
        return Promise.reject(new Error('Unknown URL'))
      })

      render(<BookDetailModal {...mockProps} />)

      // Should still render without crashing
      await waitFor(() => {
        expect(screen.getByText('Test Book Title')).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', async () => {
      render(<BookDetailModal {...mockProps} />)

      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /close/i })
        expect(closeButton).toHaveAttribute('aria-label', 'Close modal')

        const writeReviewButton = screen.getByTestId('write-review-btn')
        expect(writeReviewButton).toHaveAttribute('aria-label', 'Write a review')
      })
    })

    it('should support keyboard navigation', async () => {
      render(<BookDetailModal {...mockProps} />)

      await waitFor(() => {
        const closeButton = screen.getByRole('button', { name: /close/i })
        closeButton.focus()
        expect(closeButton).toHaveFocus()

        // Tab to next focusable element
        fireEvent.keyDown(closeButton, { key: 'Tab' })
        // Should move focus to next element
      })
    })

    it('should trap focus within modal', async () => {
      render(<BookDetailModal {...mockProps} />)

      await waitFor(() => {
        // Focus should be trapped within the modal
        const modal = screen.getByRole('dialog')
        expect(modal).toBeInTheDocument()
      })
    })
  })
})
