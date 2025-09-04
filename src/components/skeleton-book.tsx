export default function BookCardSkeleton() {
    return (
        <div className="border bg-white/90 backdrop-blur-sm border-amber-300 rounded-lg p-4 animate-pulse">
            {/* Book Cover Skeleton */}
            <div className="mb-4 flex justify-center">
                <div className="h-48 w-32 bg-amber-200 rounded shadow-md"></div>
            </div>

            {/* Book Info Skeleton */}
            <div className="space-y-2">
                {/* Title Skeleton */}
                <div className="space-y-2">
                    <div className="h-4 bg-amber-200 rounded w-full"></div>
                    <div className="h-4 bg-amber-200 rounded w-3/4"></div>
                </div>
                
                {/* Author Skeleton */}
                <div className="h-3 bg-amber-200 rounded w-2/3"></div>

                {/* Description Skeleton */}
                <div className="space-y-1">
                    <div className="h-2 bg-amber-200 rounded w-full"></div>
                    <div className="h-2 bg-amber-200 rounded w-full"></div>
                    <div className="h-2 bg-amber-200 rounded w-4/5"></div>
                </div>

                {/* Book Details Skeleton */}
                <div className="pt-2 border-t border-amber-200">
                    <div className="flex justify-between items-center">
                        <div className="h-2 bg-amber-200 rounded w-16"></div>
                        <div className="h-2 bg-amber-200 rounded w-12"></div>
                    </div>
                    
                    <div className="mt-2">
                        <div className="h-4 bg-amber-200 rounded w-20"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}