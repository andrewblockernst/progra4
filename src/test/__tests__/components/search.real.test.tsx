import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils/test-utils'
import BookSearch from '@/components/book-search'
import { fetchBooks } from '@/app/actions/fetch.action'

// Mock de las actions reales
vi.mock('@/app/actions/fetch.action', () => ({
  fetchBooks: vi.fn(),
}));

const mockFetchBooks = fetchBooks as Mock

describe('BookSearch (Real Component)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetchBooks.mockResolvedValue([])
  })

  it('should render search form', () => {
    render(<BookSearch />)
    
    // Debug para ver qué se renderiza
    screen.debug()
    
    // Busca elementos que probablemente existan
    const searchElements = screen.getAllByRole('textbox')
    expect(searchElements.length).toBeGreaterThan(0)
  })

  it('should have search button', () => {
    render(<BookSearch />)
    
    // Busca botones
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
    
    // Log para ver qué texto tienen
    buttons.forEach((btn, index) => {
      console.log(`Button ${index}:`, btn.textContent)
    })
  })

  it('should call fetchBooks when searching', async () => {
    render(<BookSearch />)
    
    // Busca input de búsqueda
    const searchInput = screen.getByRole('textbox')
    const submitButton = screen.getAllByRole('button')[0]
    
    // Simula búsqueda
    fireEvent.change(searchInput, { target: { value: 'harry potter' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockFetchBooks).toHaveBeenCalled()
    })
  })
})