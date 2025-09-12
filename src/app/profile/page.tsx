import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Favorite from '@/models/Favorite';
import { fetchBookById } from '@/app/actions/reviews.action';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/');
  }

  await dbConnect();

  // Obtener reseñas del usuario
  const reviews = await Review.find({ userId: session.user.id }).sort({ createdAt: -1 });

  // Obtener favoritos del usuario
  const favorites = await Favorite.find({ userId: session.user.id }).sort({ addedAt: -1 });

  // Función para obtener información del libro
  async function getBookInfo(bookId: string) {
    try {
      const bookData = await fetchBookById(bookId);
      return {
        title: bookData.volumeInfo?.title || 'Título desconocido',
        authors: bookData.volumeInfo?.authors?.join(', ') || 'Autor desconocido',
        thumbnail: bookData.volumeInfo?.imageLinks?.thumbnail || null
      };
    } catch (error) {
      console.error('Error fetching book info:', error);
      return {
        title: 'Título desconocido',
        authors: 'Autor desconocido',
        thumbnail: null
      };
    }
  }

  // Obtener información de libros para reseñas
  const reviewsWithBookInfo = await Promise.all(
    reviews.map(async (review) => ({
      id: review._id.toString(),
      bookId: review.bookId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      upvotes: review.upvotes || 0,
      downvotes: review.downvotes || 0,
      bookInfo: await getBookInfo(review.bookId)
    }))
  );

  // Obtener información de libros para favoritos
  const favoritesWithBookInfo = await Promise.all(
    favorites.map(async (fav) => ({
      id: fav._id.toString(),
      bookId: fav.bookId,
      addedAt: fav.addedAt,
      bookInfo: await getBookInfo(fav.bookId)
    }))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-8">
          <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors font-semibold">
            ← Volver al inicio
          </Link>
          <div className="flex items-center gap-4">
          </div>
        </nav>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
          <p className="text-gray-600 mb-8">Gestiona tus reseñas y libros favoritos</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mis Reseñas */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Mis Reseñas ({reviewsWithBookInfo.length})</h2>
              {reviewsWithBookInfo.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {reviewsWithBookInfo.map((review) => (
                    <div key={`review-${review.id}`} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3 mb-3">
                        {review.bookInfo.thumbnail && (
                          <img
                            src={review.bookInfo.thumbnail}
                            alt={review.bookInfo.title}
                            className="w-12 h-16 object-cover rounded shadow-sm"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{review.bookInfo.title}</h3>
                          <p className="text-sm text-gray-600 truncate">{review.bookInfo.authors}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm font-medium">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2 text-sm leading-relaxed">{review.comment}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {new Date(review.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            👍 {review.upvotes || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            👎 {review.downvotes || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📚</div>
                  <p className="text-gray-500 mb-4">No has escrito reseñas aún.</p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                  >
                    Explorar libros →
                  </Link>
                </div>
              )}
            </div>

            {/* Libros Favoritos */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Libros Favoritos ({favoritesWithBookInfo.length})</h2>
              {favoritesWithBookInfo.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {favoritesWithBookInfo.map((fav) => (
                    <div key={`favorite-${fav.id}`} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        {fav.bookInfo.thumbnail && (
                          <img
                            src={fav.bookInfo.thumbnail}
                            alt={fav.bookInfo.title}
                            className="w-10 h-14 object-cover rounded shadow-sm"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{fav.bookInfo.title}</h3>
                          <p className="text-sm text-gray-600 truncate">{fav.bookInfo.authors}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Agregado: {new Date(fav.addedAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <button
                          className="text-red-500 hover:text-red-700 p-1 opacity-50 cursor-not-allowed"
                          title="Funcionalidad próximamente"
                          disabled
                        >
                          ❤️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">❤️</div>
                  <p className="text-gray-500 mb-4">No tienes libros favoritos.</p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Descubrir libros →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
