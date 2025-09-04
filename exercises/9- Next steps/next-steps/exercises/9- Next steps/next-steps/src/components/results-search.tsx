import { useState } from 'react'
import { GoogleBookItem } from '@/types/book'
import SearchResultsSkeleton from './skeleton-search'
import BookDetailModal from './book-modal'
import Image from 'next/image'

interface SearchResultsProps {
    books: GoogleBookItem[]
    query: string
    isPending: boolean
}

export default function SearchResults({ books, query, isPending }: SearchResultsProps) {
    const [selectedBook, setSelectedBook] = useState<GoogleBookItem | null>(null)

    // Loading State with Skeleton
    if (isPending) {
        return <SearchResultsSkeleton />
    }

    // No Results
    if (query && books.length === 0 && !isPending) {
        return (
            <div className="text-center py-12 bg-amber-50/80 backdrop-blur-sm rounded-lg border border-amber-200">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-xl text-amber-700 font-semibold mb-2">
                    No se encontraron libros para &quot;{query}&quot;
                </p>
                <p className="text-amber-600">
                    Intenta con otros términos de búsqueda o revisa los ejemplos
                </p>
                <p>Esto es un &quot;ejemplo&quot; de búsqueda</p>
            </div>
        )
    }

    // Results
    if (books.length > 0) {
        return (
            <>
                <div>
                    <div className="mb-6 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-amber-800">
                            Resultados de búsqueda
                        </h2>
                        <span className="text-amber-600 bg-amber-100 px-3 py-1 rounded-full text-sm font-medium">
                            {books.length} libro{books.length !== 1 ? 's' : ''} encontrado{books.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {books.map((book) => (
                            <div 
                                key={book.id} 
                                onClick={() => setSelectedBook(book)}
                                className="border bg-white/90 backdrop-blur-sm border-amber-300 rounded-lg p-4 hover:shadow-xl hover:shadow-amber-400/30 transition-all duration-300 hover:scale-105 cursor-pointer"
                            >
                                {/* Book Cover */}
                                <div className="mb-4 flex justify-center">
                                    {book.volumeInfo.imageLinks?.thumbnail ? (
                                        <Image
                                            src={book.volumeInfo.imageLinks.thumbnail}
                                            alt={book.volumeInfo.title}
                                            width={200}
                                            height={300}
                                            className="h-48 w-32 object-cover rounded shadow-md hover:shadow-lg transition-shadow"
                                        />
                                    ) : (
                                        <div className="h-48 w-32 bg-amber-100 border border-amber-300 rounded shadow-md flex items-center justify-center">
                                            <span className="text-amber-600 text-xs text-center font-mono">
                                                Sin Imagen
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Book Info */}
                                <div className="space-y-2">
                                    <h3 className="font-bold text-amber-800 text-lg line-clamp-2 leading-tight">
                                        {book.volumeInfo.title}
                                    </h3>
                                    
                                    {book.volumeInfo.authors && (
                                        <p className="text-amber-700 font-medium text-sm">
                                            Por: {book.volumeInfo.authors.join(', ')}
                                        </p>
                                    )}

                                    {book.volumeInfo.description && (
                                        <p className="text-amber-600 text-xs leading-relaxed line-clamp-3">
                                            {book.volumeInfo.description.replace(/<[^>]*>/g, '')}
                                        </p>
                                    )}

                                    {/* Book Details */}
                                    <div className="pt-2 border-t border-amber-200">
                                        <div className="flex justify-between items-center text-xs text-amber-600/80">
                                            {book.volumeInfo.publishedDate && (
                                                <span>{book.volumeInfo.publishedDate}</span>
                                            )}
                                            {book.volumeInfo.pageCount && (
                                                <span>{book.volumeInfo.pageCount} págs</span>
                                            )}
                                        </div>
                                        
                                        {book.volumeInfo.categories && (
                                            <div className="mt-2">
                                                <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded font-mono">
                                                    {book.volumeInfo.categories[0]}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Book Detail Modal */}
                {selectedBook && (
                    <BookDetailModal 
                        book={selectedBook}
                        isOpen={!!selectedBook}
                        onClose={() => setSelectedBook(null)}
                    />
                )}
            </>
        )
    }

    // Default state (no search performed)
    return null
}