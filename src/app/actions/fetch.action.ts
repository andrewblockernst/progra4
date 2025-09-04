'use server'

const GOOGLE_API = 'https://www.googleapis.com/books/v1/volumes'

export async function fetchBooks(query: string) {
  if (!query) return [];
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch books');
  const data = await res.json();
  return data.items || [];
}

export async function fetchBookById(id: string) {
  const response = await fetch(`${GOOGLE_API}/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch book')
  }
  const data = await response.json()
  return data
}

// MUCHAS GRACIAS PALERMO, MUCHAS GRACIAS PALERMO