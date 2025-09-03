// src/test/__tests__/actions/book-actions.real.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchBooks, fetchBookById } from '@/app/actions/fetch.action'

// Mock fetch global
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Book Actions (Real)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchBooks', () => {
    it('should handle empty query', async () => {
      const result = await fetchBooks('')
      expect(result).toEqual([])
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should fetch books from Google API', async () => {
      const mockResponse = {
        items: [
          {
            id: 'book-1',
            volumeInfo: {
              title: 'Test Book',
              authors: ['Test Author']
            }
          }
        ]
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await fetchBooks('test query')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('test+query')
      )
      expect(result).toEqual(mockResponse.items)
    })

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await expect(fetchBooks('test')).rejects.toThrow('Failed to fetch books')
    })
  })

  describe('fetchBookById', () => {
    it('should fetch single book', async () => {
      const mockBook = {
        id: 'book-1',
        volumeInfo: {
          title: 'Single Book',
          authors: ['Author']
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBook
      })

      const result = await fetchBookById('book-1')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('book-1')
      )
      expect(result).toEqual(mockBook)
    })
  })
})