'use client'

import { useState, useTransition } from 'react'
import { Star } from 'lucide-react'
import { addReview } from '@/app/actions/reviews.action'
import { Review } from '@/types/book'

interface ReviewFormProps {
    bookId: string
    onReviewAdded: (review: Review) => void
    onCancel: () => void
}

export default function ReviewForm({ bookId, onReviewAdded, onCancel }: ReviewFormProps) {
    const [userName, setUserName] = useState('')
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [hoveredRating, setHoveredRating] = useState(0)
    const [isPending, startTransition] = useTransition()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (rating === 0) {
            alert('Por favor selecciona una calificación')
            return
        }

        if (comment.trim().length < 10) {
            alert('La reseña debe tener al menos 10 caracteres')
            return
        }

        startTransition(async () => {
            try {
                const newReview = await addReview(bookId, userName, rating, comment)
                onReviewAdded(newReview)
                
                // Reset form
                setUserName('')
                setRating(0)
                setComment('')
            } catch (error) {
                console.error('Error adding review:', error)
                alert('Error al agregar la reseña. Intenta de nuevo.')
            }
        })
    }

    return (
        <div className="bg-amber-50 p-6 rounded-lg mb-6 border border-amber-200">
            <h4 className="text-xl font-semibold text-amber-800 mb-4">Escribir una reseña</h4>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Name */}
                <div>
                    <label htmlFor="userName" className="block text-sm font-medium text-amber-800 mb-1">
                        Tu nombre (opcional)
                    </label>
                    <input
                        type="text"
                        id="userName"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Nombre de usuario"
                        className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                        maxLength={50}
                    />
                </div>

                {/* Rating */}
                <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">
                        Calificación *
                    </label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    size={32}
                                    className={`${
                                        star <= (hoveredRating || rating)
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                    {rating > 0 && (
                        <p className="text-sm text-amber-700 mt-1">
                            {rating === 1 && 'Muy malo'}
                            {rating === 2 && 'Malo'}
                            {rating === 3 && 'Regular'}
                            {rating === 4 && 'Bueno'}
                            {rating === 5 && 'Excelente'}
                        </p>
                    )}
                </div>

                {/* Comment */}
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-amber-800 mb-1">
                        Tu reseña *
                    </label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Comparte tu opinión sobre este libro..."
                        rows={4}
                        className="w-full p-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none"
                        maxLength={1000}
                        required
                    />
                    <div className="flex justify-between text-xs text-amber-600 mt-1">
                        <span>Mínimo 10 caracteres</span>
                        <span>{comment.length}/1000</span>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={isPending || rating === 0 || comment.trim().length < 10}
                        className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {isPending ? 'Publicando...' : 'Publicar Reseña'}
                    </button>
                    <button
                        data-testid="review-cancel-btn"
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    )
}

// no se cual es el error a este punto de mi vida.