'use client'

import { BookOpenText } from 'lucide-react'

interface SearchFormProps {
    query: string
    setQuery: (query: string) => void
    onSearch: (query: string) => void
    isPending: boolean
}

export default function SearchForm({ query, setQuery, onSearch, isPending }: SearchFormProps) {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(query)
    }

    const handleExampleClick = (exampleQuery: string) => {
        setQuery(exampleQuery)
        onSearch(exampleQuery)
    }

    return (
        <>
            {/* Search Form */}
            <form onSubmit={handleSubmit} className="mb-8">
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
                        className="rounded-full bg-zinc-200 text-zinc-600 font-mono ring-1 ring-zinc-400 focus:ring-2 focus:ring-amber-400 outline-none duration-300 px-3 py-2 shadow-md focus:shadow-lg focus:shadow-amber-400 dark:shadow-md dark:shadow-amber-500 hover:bg-zinc-300 disabled:opacity-50 transition-all"
                    >
                        <BookOpenText size={20} />
                    </button>
                </div>
            </form>

            {/* Search Examples */}
            <div className="mb-8 p-4 bg-amber-50/80 backdrop-blur-sm rounded-lg border border-amber-200">
                <h3 className="font-semibold mb-3 text-black">Ejemplos de búsqueda:</h3>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => handleExampleClick('Diego Peretti')}
                        className="px-3 py-1 bg-white/80 border text-slate rounded text-sm hover:bg-amber-100 transition-colors text-black font-medium"
                    >
                        Diego Peretti
                    </button>
                    <button
                        onClick={() => handleExampleClick('inauthor:francella')}
                        className="px-3 py-1 bg-white/80 border text-slate rounded text-sm hover:bg-amber-100 transition-colors text-black font-medium"
                    >
                        inauthor:francella
                    </button>
                    <button
                        onClick={() => handleExampleClick('perón')}
                        className="px-3 py-1 bg-white/80 border text-slate rounded text-sm hover:bg-amber-100 transition-colors text-black font-medium"
                    >
                        perón
                    </button>
                    <button
                        onClick={() => handleExampleClick('isbn:9780439708180')}
                        className="px-3 py-1 bg-white/80 border text-slate rounded text-sm hover:bg-amber-100 transition-colors text-black font-medium"
                    >
                        isbn:9780439708180
                    </button>
                </div>
            </div>
        </>
    )
}