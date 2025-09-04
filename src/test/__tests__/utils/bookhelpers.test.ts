// src/test/__tests__/utils/bookhelpers.test.ts
import { describe, it, expect } from 'vitest'

// Funciones helper simples para probar lógica pura
export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0
  const sum = ratings.reduce((acc, rating) => acc + rating, 0)
  return sum / ratings.length
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  const cutPoint = text.lastIndexOf(' ', maxLength)
  return text.substring(0, cutPoint) + '...'
}

describe('Book Helpers', () => {
  describe('calculateAverageRating', () => {
    it('should return 0 for empty array', () => {
      expect(calculateAverageRating([])).toBe(0)
    })

    it('should calculate average correctly', () => {
      expect(calculateAverageRating([1, 2, 3, 4, 5])).toBe(3)
      expect(calculateAverageRating([5, 5, 5])).toBe(5)
      expect(calculateAverageRating([1, 5])).toBe(3)
    })

    it('should handle single rating', () => {
      expect(calculateAverageRating([4])).toBe(4)
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-01-15')
      const formatted = formatDate(date)
      expect(formatted).toContain('2023')
      expect(formatted).toContain('enero')
    })
  })

  describe('truncateText', () => {
    it('should not truncate short text', () => {
      expect(truncateText('Short text', 50)).toBe('Short text')
    })

    it('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated'
      const result = truncateText(longText, 20)
      expect(result).toBe('This is a very long...')
      expect(result.length).toBeLessThanOrEqual(23) // 20 + '...'
    })

    it('should truncate at word boundary', () => {
      const result = truncateText('Hello world this is long', 10)
      expect(result).toBe('Hello...')
    })
  })
})