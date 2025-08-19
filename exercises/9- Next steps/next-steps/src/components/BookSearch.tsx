'use client'

import { useState, useTransition } from 'react'
import { fetchBooks } from '@/app/actions'
import { GoogleBookItem } from '@/types/book'
import { BookOpenText } from 'lucide-react'

export default function BookSearch() {
    const [query, setQuery] = useState('')
    const [books, setBooks] = useState<GoogleBookItem[]>([])
    const [isPending, startTransition] = useTransition()

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!query.trim()) return

        startTransition(async () => {
            try {
                const results = await fetchBooks(query)
                setBooks(results)
            } catch (error) {
                console.error('Error searching books:', error)
                setBooks([])
            }
        })
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-8">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar por título, autor o ISBN..."
                        className="flex-1 bg-zinc-200 text-zinc-600 font-mono ring-1 ring-zinc-400 focus:ring-2 focus:ring-amber-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-2 shadow-md focus:shadow-lg focus:shadow-amber-400 dark:shadow-md dark:shadow-amber-500"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        disabled={isPending}
                        className="rounded-full bg-zinc-200 text-zinc-600 font-mono ring-1 ring-zinc-400 focus:ring-2 focus:ring-amber-400 outline-none duration-300 px-2 py-2 shadow-md focus:shadow-lg focus:shadow-amber-400 dark:shadow-md dark:shadow-amber-500 hover:bg-zinc-300 disabled:opacity-50"
                    >
                    <BookOpenText/>
                    </button>
                </div>
            </form>

            {/* Search Examples */}
            <div className="mb-6 p-4 bg-amber-50 rounded-lg">
                <h3 className="font-semibold mb-2">Ejemplos</h3>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setQuery('Diego Peretti')}
                        className="px-3 py-1 bg-white border rounded text-sm hover:bg-amber-100"
                    >
                        Diego Peretti
                    </button>
                    <button
                        onClick={() => setQuery('inauthor:francella')}
                        className="px-3 py-1 bg-white border rounded text-sm hover:bg-amber-100"
                    >
                        inauthor:francella
                    </button>
                </div>
            </div>

            {/* Results */}
            {books.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map((book) => (
                        <div key={book.id} className="border bg-amber-950 border-amber-500 rounded-lg p-4 hover:shadow-lg transition-shadow">
                            {book.volumeInfo.imageLinks?.thumbnail && (
                                <img
                                    src={book.volumeInfo.imageLinks.thumbnail}
                                    alt={book.volumeInfo.title}
                                    className="w-full h-48 object-cover rounded mb-4"
                                />
                            )}
                            <h3 className="font-semibold text-amber-400 text-lg mb-2">{book.volumeInfo.title}</h3>
                            {book.volumeInfo.authors && (
                                <p className="text-amber-600 mb-2">
                                    Por: {book.volumeInfo.authors.join(', ')}
                                </p>
                            )}
                            {book.volumeInfo.description && (
                                <p className="text-sm text-amber-500 mb-3 line-clamp-3">
                                    {book.volumeInfo.description.replace(/<[^>]*>/g, '')}
                                </p>
                            )}
                            <div className="flex justify-between items-center text-sm text-amber-500">
                                {book.volumeInfo.publishedDate && (
                                    <span>{book.volumeInfo.publishedDate}</span>
                                )}
                                {book.volumeInfo.pageCount && (
                                    <span>{book.volumeInfo.pageCount} páginas</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}