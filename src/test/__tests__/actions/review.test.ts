import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchBooks } from '@/app/actions/fetch.action'

describe('Book Actions (Real)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

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
    };

    (global.fetch as unknown) = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse
    });

    const result = await fetchBooks('test query');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('q=test%20query')
    );
    expect(result).toEqual(mockResponse.items);
  });

  it('should handle empty query', async () => {
    const result = await fetchBooks('');
    expect(result).toEqual([]);
    // fetch no debe ser llamado
    expect(global.fetch).not.toHaveBeenCalled();
  });
});