//Los mocks NO SON TESTS. Son datos que simulan respuestas reales de APIs o bases de datos para usarlos en tests.

import { GoogleBookItem } from '@/types/book'

export const mockGoogleBooksResponse = {
  items: [
    {
      id: 'test-book-1',
      volumeInfo: {
        title: 'Test Book 1',
        authors: ['Test Author'],
        description: 'A test book description that is long enough to test truncation functionality.',
        publishedDate: '2023-01-01',
        pageCount: 300,
        categories: ['Fiction', 'Adventure'],
        imageLinks: {
          thumbnail: 'https://example.com/thumbnail.jpg',
          small: 'https://example.com/small.jpg'
        }
      }
    },
    {
      id: 'test-book-2',
      volumeInfo: {
        title: 'Test Book 2',
        authors: ['Another Author', 'Co-Author'],
        description: 'Another test book.',
        publishedDate: '2023-02-01',
        pageCount: 250,
        categories: ['Non-fiction'],
        imageLinks: {
          thumbnail: 'https://example.com/thumbnail2.jpg'
        }
      }
    }
  ]
}

export const mockSingleBook: GoogleBookItem = {
  id: 'test-book-1',
  volumeInfo: {
    title: 'Test Book 1',
    authors: ['Test Author'],
    description: 'A detailed description of the test book with HTML <b>formatting</b> that should be cleaned.',
    publishedDate: '2023-01-01',
    pageCount: 300,
    categories: ['Fiction', 'Adventure'],
    imageLinks: {
      thumbnail: 'https://example.com/thumbnail.jpg',
      small: 'https://example.com/small.jpg',
      medium: 'https://example.com/medium.jpg'
    }
  }
}

// Mock de reseñas
export const mockReviews = [
  {
    id: 'review_1',
    userId: 'user_123',
    bookId: 'book_456',
    rating: 5,
    comment: 'Excellent book! Highly recommended.',
    userName: 'Book Lover',
    createdAt: new Date('2024-01-15'),
    upvotes: 12,
    downvotes: 2,
    userVotes: {}
  },
  {
    id: 'review_2',
    userId: 'user_456',
    bookId: 'book_456',
    rating: 4,
    comment: 'Good read, but could be better.',
    userName: 'Casual Reader',
    createdAt: new Date('2024-01-10'),
    upvotes: 8,
    downvotes: 1,
    userVotes: {}
  },
  {
    id: 'review_3',
    userId: 'user_123',
    bookId: 'book_789',
    rating: 3,
    comment: 'Average book, nothing special.',
    userName: 'Book Lover',
    createdAt: new Date('2024-01-05'),
    upvotes: 3,
    downvotes: 5,
    userVotes: {}
  }
]

// Mock de usuarios
export const mockUsers = [
  {
    _id: 'user_123',
    email: 'booklover@example.com',
    password: '$2a$10$hashedpassword123',
    name: 'Book Lover',
    createdAt: new Date('2024-01-01')
  },
  {
    _id: 'user_456',
    email: 'casualreader@example.com',
    password: '$2a$10$hashedpassword456',
    name: 'Casual Reader',
    createdAt: new Date('2024-01-02')
  }
]

// Mock de favoritos
export const mockFavorites = [
  {
    _id: 'fav_1',
    userId: 'user_123',
    bookId: 'book_456',
    createdAt: new Date('2024-01-15')
  },
  {
    _id: 'fav_2',
    userId: 'user_123',
    bookId: 'book_789',
    createdAt: new Date('2024-01-10')
  }
]

// Mock de sesión de NextAuth
export const mockAuthenticatedSession = {
  user: {
    id: 'user_123',
    email: 'booklover@example.com',
    name: 'Book Lover'
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
}

export const mockUnauthenticatedSession = null

// Mock de respuestas de API
export const mockApiResponses = {
  reviews: {
    success: {
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockReviews)
    },
    error: {
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Internal server error' })
    },
    unauthorized: {
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: 'Unauthorized' })
    },
    notFound: {
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Not found' })
    }
  },
  auth: {
    login: {
      ok: true,
      status: 200,
      json: () => Promise.resolve({ user: mockUsers[0] })
    },
    invalidCredentials: {
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: 'Invalid credentials' })
    }
  },
  favorites: {
    success: {
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockFavorites)
    },
    created: {
      ok: true,
      status: 201,
      json: () => Promise.resolve({ message: 'Favorite added' })
    }
  }
}

// Funciones helper para mocks
export const createMockReview = (overrides = {}) => ({
  id: `review_${Date.now()}`,
  userId: 'user_123',
  bookId: 'book_456',
  rating: 5,
  comment: 'Great book!',
  userName: 'Test User',
  createdAt: new Date(),
  upvotes: 0,
  downvotes: 0,
  userVotes: {},
  ...overrides
})

export const createMockUser = (overrides = {}) => ({
  _id: `user_${Date.now()}`,
  email: 'test@example.com',
  password: '$2a$10$hashedpassword',
  name: 'Test User',
  createdAt: new Date(),
  ...overrides
})

export const createMockBook = (overrides = {}): GoogleBookItem => ({
  id: `book_${Date.now()}`,
  volumeInfo: {
    title: 'Test Book',
    authors: ['Test Author'],
    description: 'A test book description.',
    publishedDate: '2023-01-01',
    pageCount: 300,
    categories: ['Fiction'],
    imageLinks: {
      thumbnail: 'https://example.com/thumbnail.jpg'
    }
  },
  ...overrides
})