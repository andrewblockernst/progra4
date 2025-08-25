'use client'

import { useState, useTransition } from 'react'
import { fetchBooks } from '@/app/actions/fetch.action'
import { GoogleBookItem } from '@/types/book'
import SearchForm from './form-search'
import SearchResults from './results-search'

export default function BookSearch() {
    const [query, setQuery] = useState('')
    const [books, setBooks] = useState<GoogleBookItem[]>([])
    const [isPending, startTransition] = useTransition()

    const handleSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) return

        startTransition(async () => {
            try {
                const results = await fetchBooks(searchQuery)
                setBooks(results)
            } catch (error) {
                console.error('Error searching books:', error)
                setBooks([])
            }
        })
    }

    return (
        <div className="max-w-6xl mx-auto">
            <SearchForm 
                query={query}
                setQuery={setQuery}
                onSearch={handleSearch}
                isPending={isPending}
            />
            
            <SearchResults 
                books={books}
                query={query}
                isPending={isPending}
            />
        </div>
    )
}