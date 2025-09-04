'use client'

import { useState, useTransition } from 'react'
import { Star, ThumbsUp, ThumbsDown, Clock } from 'lucide-react'
import { Review } from '@/types/book'
import { voteReview } from '@/app/actions/reviews.action'

interface ReviewsListProps {
    reviews: Review[]
    isLoading: boolean
    onReviewsUpdate: (reviews: Review[]) => void
}

export default function ReviewsList({ reviews, isLoading, onReviewsUpdate }: ReviewsListProps) {
    const [isPending, startTransition] = useTransition()
    const [votingReviewId, setVotingReviewId] = useState<string | null>(null)

    // Simular un ID de usuario (en producción vendría de autenticación)
    const currentUserId = 'user123'

    const handleVote = async (reviewId: string, voteType: 'up' | 'down') => {
        setVotingReviewId(reviewId)
        
        startTransition(async () => {
            try {
                const updatedReview = await voteReview(reviewId, currentUserId, voteType)
                if (updatedReview) {
                    onReviewsUpdate(
                        reviews.map(review => 
                            review.id === reviewId ? updatedReview : review
                        )
                    )
                }
            } catch (error) {
                console.error('Error voting on review:', error)
            } finally {
                setVotingReviewId(null)
            }
        })
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-lg border border-amber-200 animate-pulse">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-amber-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-amber-200 rounded w-24 mb-1"></div>
                                <div className="h-3 bg-amber-200 rounded w-16"></div>
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <div key={star} className="w-4 h-4 bg-amber-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 bg-amber-200 rounded w-full"></div>
                            <div className="h-3 bg-amber-200 rounded w-3/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-8 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="text-lg font-semibold text-amber-800 mb-2">
                    Aún no hay reseñas
                </h4>
                <p className="text-amber-600">
                    ¡Sé el primero en compartir tu opinión sobre este libro!
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => {
                const userVote = review.userVotes[currentUserId]
                const score = review.upvotes - review.downvotes
                
                return (
                    <div 
                        key={review.id} 
                        className="bg-white p-6 rounded-lg border border-amber-200 hover:shadow-md transition-shadow"
                    >
                        {/* Review Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                    <span className="text-amber-800 font-semibold text-lg">
                                        {review.userName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h5 className="font-semibold text-amber-800">
                                        {review.userName}
                                    </h5>
                                    <div className="flex items-center gap-2 text-xs text-amber-600">
                                        <Clock size={12} />
                                        {formatDate(review.createdAt)}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Rating Stars */}
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={16}
                                        className={`${
                                            star <= review.rating
                                                ? 'text-yellow-400 fill-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Review Content */}
                        <p className="text-gray-700 leading-relaxed mb-4">
                            {review.comment}
                        </p>

                        {/* Voting Section */}
                        <div className="flex items-center justify-between pt-3 border-t border-amber-100">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleVote(review.id, 'up')}
                                    disabled={isPending && votingReviewId === review.id}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                                        userVote === 'up'
                                            ? 'bg-green-100 text-green-700'
                                            : 'hover:bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    <ThumbsUp size={14} />
                                    <span>{review.upvotes}</span>
                                </button>
                                
                                <button
                                    onClick={() => handleVote(review.id, 'down')}
                                    disabled={isPending && votingReviewId === review.id}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                                        userVote === 'down'
                                            ? 'bg-red-100 text-red-700'
                                            : 'hover:bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    <ThumbsDown size={14} />
                                    <span>{review.downvotes}</span>
                                </button>
                            </div>

                            {/* Review Score */}
                            <div className="text-sm text-gray-500">
                                Score: <span className={`font-semibold ${score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {score > 0 ? '+' : ''}{score}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}