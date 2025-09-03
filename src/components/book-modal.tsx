'use client'

import { useState, useEffect, useCallback } from 'react'
import { GoogleBookItem, Review } from '@/types/book'
import { getBookReviews, fetchBookById } from '@/app/actions/reviews.action'
import { X, Star, Pen, ChevronDown, ChevronUp } from 'lucide-react'
import ReviewForm from './review-form'
import ReviewsList from './review-list'
import Image from 'next/image'

interface BookDetailModalProps {
    book: GoogleBookItem
    isOpen: boolean
    onClose: () => void
}

export default function BookDetailModal({ book, isOpen, onClose }: BookDetailModalProps) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [isLoadingReviews, setIsLoadingReviews] = useState(true)
    const [showReviewForm, setShowReviewForm] = useState(false)
    const [detailedBook, setDetailedBook] = useState<GoogleBookItem>(book)
    const [isLoadingBook, setIsLoadingBook] = useState(false)
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

    const loadBookDetails = useCallback(async () => {
        setIsLoadingBook(true)
        try {
            const bookDetails = await fetchBookById(book.id)
            setDetailedBook(bookDetails)
        } catch (error) {
            console.error('Error loading book details:', error)
            setDetailedBook(book) // Fallback to original book data
        } finally {
            setIsLoadingBook(false)
        }
    }, [book])

    const loadReviews = useCallback(async () => {
        setIsLoadingReviews(true)
        try {
            const bookReviews = await getBookReviews(book.id)
            setReviews(bookReviews)
        } catch (error) {
            console.error('Error loading reviews:', error)
        } finally {
            setIsLoadingReviews(false)
        }
    }, [book.id])

    useEffect(() => {
        if (isOpen) {
            loadBookDetails()
            loadReviews()
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, book.id, loadBookDetails, loadReviews])

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
        return sum / reviews.length
    }

    const handleReviewAdded = (newReview: Review) => {
        setReviews(prev => [newReview, ...prev])
        setShowReviewForm(false)
    }

    const getBestImageUrl = () => {
        const { imageLinks } = detailedBook.volumeInfo
        if (!imageLinks) return null

        // Priorizar imágenes de mejor calidad
        return (
            imageLinks.large ||
            imageLinks.medium ||
            imageLinks.thumbnail ||
            imageLinks.small ||
            imageLinks.smallThumbnail
        )
    }

    const getDescriptionPreview = (description: string, maxLength: number = 300) => {
        const cleanDescription = description.replace(/<[^>]*>/g, '')
        if (cleanDescription.length <= maxLength) {
            return { preview: cleanDescription, needsExpansion: false }
        }
        
        // Encontrar el último espacio antes del límite para no cortar palabras
        const cutPoint = cleanDescription.lastIndexOf(' ', maxLength)
        const preview = cleanDescription.substring(0, cutPoint) + '...'
        
        return { preview, needsExpansion: true }
    }

    if (!isOpen) return null

    const { volumeInfo } = detailedBook
    const averageRating = calculateAverageRating()
    const bestImageUrl = getBestImageUrl()

    // Procesar la descripción
    const description = volumeInfo.description || ''
    const { preview, needsExpansion } = getDescriptionPreview(description)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop con blur */}
            <div 
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal Content */}
            <div className="relative bg-amber-50/80 backdrop-blur-sm rounded-lg border border-amber-200 max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
                {/* Modal Header */}
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-amber-100 rounded-full transition-colors flex-shrink-0"
                    >
                        <X size={24} className="text-amber-600" />
                    </button>
                </div>

                {/* Book Details */}
                <div className="p-6">
                    <div className="grid lg:grid-cols-3 gap-8 mb-8">
                        {/* Book Cover */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                {isLoadingBook ? (
                                    <div className="w-full max-w-sm mx-auto aspect-[2/3] bg-amber-200 rounded-lg shadow-lg animate-pulse" />
                                ) : bestImageUrl ? (
                                    <div className="relative group">
                                        <Image
                                            src={bestImageUrl}
                                            alt={volumeInfo.title}
                                            width={200}
                                            height={300}
                                            className="w-full max-w-sm mx-auto rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300"
                                            onError={(e) => {
                                                // Fallback en caso de error de imagen
                                                const target = e.target as HTMLImageElement
                                                target.style.display = 'none'
                                                const fallback = target.nextElementSibling as HTMLElement
                                                if (fallback) fallback.style.display = 'flex'
                                            }}
                                        />
                                        <div 
                                            className="hidden w-full max-w-sm mx-auto aspect-[2/3] bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300 rounded-lg shadow-xl items-center justify-center"
                                        >
                                            <div className="text-center p-4">
                                                <div className="text-4xl mb-2">📚</div>
                                                <span className="text-amber-700 font-medium">Imagen no disponible</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full max-w-sm mx-auto aspect-[2/3] bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300 rounded-lg shadow-xl flex items-center justify-center">
                                        <div className="text-center p-4">
                                            <div className="text-4xl mb-2">📚</div>
                                            <span className="text-amber-700 font-medium">Sin imagen disponible</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Book Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <h1 className="text-3xl lg:text-3xl font-bold text-amber-800 leading-tight">
                                    {volumeInfo.title}
                                </h1>
                                {volumeInfo.authors && (
                                    <p className="text-xl text-amber-700">
                                        {volumeInfo.authors.join(', ')}
                                    </p>
                                )}
                            </div>

                            {/* Rating Summary */}
                            <div className="w-max bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
                                <div className="flex items-center gap-4">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={28}
                                                className={`${
                                                    star <= averageRating
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-amber-800">
                                            {averageRating > 0 ? averageRating.toFixed(1) : 'Sin calificar'}
                                        </span>
                                        <span className="text-amber-700">
                                            ({reviews.length} reseña{reviews.length !== 1 ? 's' : ''})
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Description with expand/collapse */}
                            {description && (
                                <div className="bg-amber-50/80 backdrop-blur-sm rounded-lg border border-amber-200 p-6">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-semibold text-amber-800 text-lg">Descripción</h3>
                                        {needsExpansion && (
                                            <button
                                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                                className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors text-sm font-medium"
                                            >
                                                {isDescriptionExpanded ? (
                                                    <>
                                                        <ChevronUp size={20} />
                                                    </>
                                                ) : (
                                                    <>                                                  
                                                        <ChevronDown size={20} />
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    <div className="text-amber-700 leading-relaxed">
                                        <div className={`transition-all duration-300 ${isDescriptionExpanded ? 'max-h-none' : 'max-h-32 overflow-hidden'}`}>
                                            {(isDescriptionExpanded ? description.replace(/<[^>]*>/g, '') : preview)
                                                .split('\n')
                                                .map((paragraph, index) => (
                                                    paragraph.trim() && (
                                                        <p key={index} className="mb-3 last:mb-0">
                                                            {paragraph.trim()}
                                                        </p>
                                                    )
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="border-t border-amber-200 pt-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                            <h3 className="text-2xl font-bold text-amber-800">Quotes de la gente</h3>
                            <button
                                onClick={() => setShowReviewForm(!showReviewForm)}
                                className="bg-amber-600 text-white px-4 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                                data-testid={showReviewForm ? 'cancel-review-btn' : 'write-review-btn'}
                            >
                                <Pen size={20} />
                                {showReviewForm ? 'Cancelar' : 'Escribir Quote'}
                            </button>
                        </div>

                        {showReviewForm && (
                            <ReviewForm
                                bookId={book.id}
                                onReviewAdded={handleReviewAdded}
                                onCancel={() => setShowReviewForm(false)}
                            />
                        )}

                        <ReviewsList
                            reviews={reviews}
                            isLoading={isLoadingReviews}
                            onReviewsUpdate={setReviews}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}