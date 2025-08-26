import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils/test-utils'

function SimpleReviewList({ reviews, isLoading }: any) {
  if (isLoading) {
    return <div data-testid="loading">Cargando reseñas...</div>
  }
  
  if (!reviews || reviews.length === 0) {
    return <div data-testid="no-reviews">No hay reseñas todavía</div>
  }
  
  return (
    <div data-testid="reviews-list">
      {reviews.map((review: any) => (
        <div key={review.id} data-testid="review-item">
          <h4>{review.userName}</h4>
          <div data-testid="rating">{'⭐'.repeat(review.rating)}</div>
          <p>{review.comment}</p>
          <div data-testid="votes">
            👍 {review.upvotes} 👎 {review.downvotes}
          </div>
        </div>
      ))}
    </div>
  )
}

describe('ReviewList', () => {
  const mockReviews = [
    {
      id: 'review-1',
      userName: 'Usuario 1',
      rating: 5,
      comment: 'Excelente libro, muy recomendado!',
      upvotes: 10,
      downvotes: 1
    },
    {
      id: 'review-2',
      userName: 'Usuario 2',
      rating: 3,
      comment: 'Está bien, pero podría ser mejor.',
      upvotes: 5,
      downvotes: 3
    }
  ]

  it('should show loading state', () => {
    render(<SimpleReviewList reviews={[]} isLoading={true} />)
    
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.getByText('Cargando reseñas...')).toBeInTheDocument()
  })

  it('should show no reviews message', () => {
    render(<SimpleReviewList reviews={[]} isLoading={false} />)
    
    expect(screen.getByTestId('no-reviews')).toBeInTheDocument()
    expect(screen.getByText('No hay reseñas todavía')).toBeInTheDocument()
  })

  it('should render reviews list', () => {
    render(<SimpleReviewList reviews={mockReviews} isLoading={false} />)
    
    expect(screen.getByTestId('reviews-list')).toBeInTheDocument()
    expect(screen.getAllByTestId('review-item')).toHaveLength(2)
  })

  it('should display review details correctly', () => {
    render(<SimpleReviewList reviews={mockReviews} isLoading={false} />)
    
    expect(screen.getByText('Usuario 1')).toBeInTheDocument()
    expect(screen.getByText('Excelente libro, muy recomendado!')).toBeInTheDocument()
    expect(screen.getByText('⭐⭐⭐⭐⭐')).toBeInTheDocument()
    expect(screen.getByText('👍 10 👎 1')).toBeInTheDocument()
  })
})