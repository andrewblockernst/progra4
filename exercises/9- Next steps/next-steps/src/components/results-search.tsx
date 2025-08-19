import { GoogleBookItem } from '@/types/book'
import SearchResultsSkeleton from './skeleton-search'

interface SearchResultsProps {
    books: GoogleBookItem[]
    query: string
    isPending: boolean
}

export default function SearchResults({ books, query, isPending }: SearchResultsProps) {
    if (isPending) {
        return <SearchResultsSkeleton />
    }

    //RESULTADOS DE BUSQUEDA
    if (books.length > 0) {
        return (
            <div>
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-black bg-amber-50/80 backdrop-blur-sm rounded-lg border border-amber-200 px-3 py-2">
                        Resultados de búsqueda
                    </h2>
                    <span className="text-black bg-amber-50/80 backdrop-blur-sm rounded-lg border border-amber-200 px-3 py-1 text-sm font-medium">
                        {books.length} libro{books.length !== 1 ? 's' : ''} encontrado{books.length !== 1 ? 's' : ''}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {books.map((book) => (
                        <div 
                            key={book.id} 
                            className="border bg-white/90 backdrop-blur-sm border-amber-300 rounded-lg p-4 hover:shadow-xl hover:shadow-amber-400/30 transition-all duration-300 hover:scale-105"
                        >
                            {/*PORTADA DEL LIBRO*/}
                            <div className="mb-4 flex justify-center">
                                {book.volumeInfo.imageLinks?.thumbnail ? (
                                    <img
                                        src={book.volumeInfo.imageLinks.thumbnail}
                                        alt={book.volumeInfo.title}
                                        className="h-48 w-32 object-cover rounded shadow-md hover:shadow-lg transition-shadow"
                                    />
                                ) : (
                                    <div className="h-48 w-32 bg-amber-100 border border-amber-300 rounded shadow-md flex items-center justify-center">
                                        <span className="text-black text-xs text-center font-mono">
                                            NO HUBO PLATA PARA UNA IMAGEN
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/*TITULO, AUTOR, DESCRIPCION*/}
                            <div className="space-y-2">
                                <h3 className="font-bold text-black text-lg line-clamp-2 leading-tight">
                                    {book.volumeInfo.title}
                                </h3>
                                
                                {book.volumeInfo.authors && (
                                    <p className="text-black font-medium text-sm">
                                        {book.volumeInfo.authors.join(', ')}
                                    </p>
                                )}

                                {book.volumeInfo.description && (
                                    <p className="text-black text-xs leading-relaxed line-clamp-3">
                                        {book.volumeInfo.description.replace(/<[^>]*>/g, '')}
                                    </p>
                                )}

                                {/*FECHA DE PUBLICACION Y PAGINAS*/}
                                <div className="pt-2 border-t border-amber-200">
                                    <div className="flex justify-between items-center text-xs text-black/80">
                                        {book.volumeInfo.publishedDate && (
                                            <span>{book.volumeInfo.publishedDate}</span>
                                        )}
                                        {book.volumeInfo.pageCount && (
                                            <span>{book.volumeInfo.pageCount} págs</span>
                                        )}
                                    </div>
                                    
                                    {book.volumeInfo.categories && (
                                        <div className="mt-2">
                                            <span className="inline-block bg-amber-100 text-black text-xs px-2 py-1 rounded font-mono">
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
        )
    }
    return null
}