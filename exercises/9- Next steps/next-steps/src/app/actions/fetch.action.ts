'use server'

const GOOGLE_API = 'https://www.googleapis.com/books/v1/volumes'

export async function fetchBooks(query: string) {
  const response = await fetch(`${GOOGLE_API}?q=${query}`)
  if (!response.ok) {
    throw new Error('Failed to fetch books')
  }
  const data = await response.json()
  return data.items
}

export async function fetchBookById(id: string) {
  const response = await fetch(`${GOOGLE_API}/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch book')
  }
  const data = await response.json()
  return data
}

