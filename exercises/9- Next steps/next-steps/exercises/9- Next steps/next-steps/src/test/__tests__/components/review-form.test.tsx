// src/test/__tests__/components/review-form.real.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils/test-utils'
import ReviewForm from '@/components/review-form'

// Mock de las actions reales
vi.mock('@/app/actions', () => ({
  addReview: vi.fn()
}))

describe('ReviewForm (Real Component)', () => {
  const mockProps = {
    bookId: 'test-book-id',
    onReviewAdded: vi.fn(),
    onCancel: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    global.alert = vi.fn()
  })

  it('should render review form', () => {
    render(<ReviewForm {...mockProps} />)
    
    // Debug para ver la estructura
    screen.debug()
    
    // Verifica que se renderice algo
    const form = document.querySelector('form')
    expect(form).toBeTruthy()
  })

  it('should have form inputs', () => {
    render(<ReviewForm {...mockProps} />)
    
    // Busca inputs por placeholder o label
    const inputs = screen.getAllByRole('textbox')
    const buttons = screen.getAllByRole('button')
    
    expect(inputs.length).toBeGreaterThan(0)
    expect(buttons.length).toBeGreaterThan(0)
    
    // Log para debugging
    console.log('Found inputs:', inputs.length)
    console.log('Found buttons:', buttons.length)
  })
})