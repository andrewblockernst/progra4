import BookCardSkeleton from './skeleton-book';

export default function SearchResultsSkeleton() {
    return (
        <div>
            <div className="mb-6 flex justify-between items-center">
                <div className="h-8 bg-amber-200 rounded w-48 animate-pulse"></div>
                <div className="h-6 bg-amber-200 rounded w-32 animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                    <BookCardSkeleton key={index} />
                ))}
            </div>
        </div>
    )
}