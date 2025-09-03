'use server'

import { Review } from '@/types/book'

const GOOGLE_API = 'https://www.googleapis.com/books/v1/volumes'

// Simulamos una base de datos en memoria (en producción usarías una DB real)
const reviewsDB: Review[] = [
  {
    id: '1',
    bookId: 'zyTCAlFPjgYC', // Harry Potter example
    userName: 'BookLover123',
    rating: 5,
    comment: 'Absolutely amazing book! A masterpiece of fantasy literature.',
    createdAt: new Date('2024-01-15'),
    upvotes: 15,
    downvotes: 2,
    userVotes: {}
  },
  {
    id: '2',
    bookId: 'zyTCAlFPjgYC',
    userName: 'CriticalReader',
    rating: 4,
    comment: 'Great story, though some parts felt a bit slow.',
    createdAt: new Date('2024-01-10'),
    upvotes: 8,
    downvotes: 1,
    userVotes: {}
  }
]

export async function fetchBooks(query: string) {
  if (!query.trim()) {
    return []
  }

  const response = await fetch(`${GOOGLE_API}?q=${encodeURIComponent(query)}&maxResults=40`)
  if (!response.ok) {
    throw new Error('Failed to fetch books')
  }
  const data = await response.json()
  return data.items || []
}

export async function fetchBookById(id: string) {
  try {
    const response = await fetch(`${GOOGLE_API}/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch book')
    }
    const data = await response.json()
    
    // Mejorar las URLs de imagen si están disponibles
    if (data.volumeInfo && data.volumeInfo.imageLinks) {
      const { imageLinks } = data.volumeInfo
      
      // Priorizar imágenes de mejor calidad
      if (imageLinks.thumbnail) {
        // Convertir a HTTPS y aumentar el zoom para mejor calidad
        imageLinks.thumbnail = imageLinks.thumbnail
          .replace('http://', 'https://')
          .replace('&zoom=1', '&zoom=2')
      }
      
      if (imageLinks.smallThumbnail) {
        imageLinks.smallThumbnail = imageLinks.smallThumbnail
          .replace('http://', 'https://')
          .replace('&zoom=1', '&zoom=2')
      }
      
      // Agregar imágenes de diferentes tamaños si no existen
      if (!imageLinks.large && imageLinks.thumbnail) {
        imageLinks.large = imageLinks.thumbnail.replace('&zoom=2', '&zoom=3')
      }
      
      if (!imageLinks.medium && imageLinks.thumbnail) {
        imageLinks.medium = imageLinks.thumbnail.replace('&zoom=2', '&zoom=2')
      }
    }
    
    return data
  } catch (error) {
    console.error('Error fetching book by ID:', error)
    throw error
  }
}

export async function getBookReviews(bookId: string): Promise<Review[]> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return reviewsDB
    .filter(review => review.bookId === bookId)
    .sort((a, b) => {
      // Ordenar por score (upvotes - downvotes) y luego por fecha
      const scoreA = a.upvotes - a.downvotes
      const scoreB = b.upvotes - b.downvotes
      if (scoreA !== scoreB) return scoreB - scoreA
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
}

export async function addReview(
  bookId: string, 
  userName: string, 
  rating: number, 
  comment: string
): Promise<Review> {
  const newReview: Review = {
    id: Math.random().toString(36).substr(2, 9),
    bookId,
    userName: userName.trim() || 'Usuario Anónimo',
    rating: Math.max(1, Math.min(5, rating)), // Ensure 1-5 range
    comment: comment.trim(),
    createdAt: new Date(),
    upvotes: 0,
    downvotes: 0,
    userVotes: {}
  }
  
  reviewsDB.push(newReview)
  return newReview
}

export async function voteReview(
  reviewId: string, 
  userId: string, 
  voteType: 'up' | 'down'
): Promise<Review | null> {
  const review = reviewsDB.find(r => r.id === reviewId)
  if (!review) return null
  
  const previousVote = review.userVotes[userId]
  
  // Remove previous vote if exists
  if (previousVote === 'up') review.upvotes--
  if (previousVote === 'down') review.downvotes--
  
  // Add new vote if different from previous
  if (previousVote !== voteType) {
    if (voteType === 'up') review.upvotes++
    if (voteType === 'down') review.downvotes++
    review.userVotes[userId] = voteType
  } else {
    // Remove vote if clicking same vote
    delete review.userVotes[userId]
  }
  
  return review
}