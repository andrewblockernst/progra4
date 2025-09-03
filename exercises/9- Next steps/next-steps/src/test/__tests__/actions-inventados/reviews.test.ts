// src/test/__tests__/actions/reviews.test.ts
import { describe, it, expect } from 'vitest'

// Simula las funciones que tienes en tu actions
function validateRating(rating: number): number {
  return Math.max(1, Math.min(5, rating))
}

function sanitizeUserName(name: string): string {
  return name.trim() || 'Usuario Anónimo'
}

function sanitizeComment(comment: string): string {
  return comment.trim()
}

describe('Review Actions Logic', () => {
  describe('validateRating', () => {
    it('should clamp rating to 1-5 range', () => {
      expect(validateRating(0)).toBe(1)
      expect(validateRating(-5)).toBe(1)
      expect(validateRating(10)).toBe(5)
      expect(validateRating(6)).toBe(5)
    })

    it('should keep valid ratings unchanged', () => {
      expect(validateRating(1)).toBe(1)
      expect(validateRating(3)).toBe(3)
      expect(validateRating(5)).toBe(5)
    })
  })

  describe('sanitizeUserName', () => {
    it('should trim whitespace', () => {
      expect(sanitizeUserName('  John Doe  ')).toBe('John Doe')
    })

    it('should return default for empty string', () => {
      expect(sanitizeUserName('')).toBe('Usuario Anónimo')
      expect(sanitizeUserName('   ')).toBe('Usuario Anónimo')
    })

    it('should keep valid names', () => {
      expect(sanitizeUserName('John')).toBe('John')
    })
  })

  describe('sanitizeComment', () => {
    it('should trim whitespace', () => {
      expect(sanitizeComment('  Great book!  ')).toBe('Great book!')
    })

    it('should handle empty comments', () => {
      expect(sanitizeComment('')).toBe('')
      expect(sanitizeComment('   ')).toBe('')
    })
  })
})

//ya no se.