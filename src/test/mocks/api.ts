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