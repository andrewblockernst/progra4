import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Review from '@/models/Review';
import Favorite from '@/models/Favorite';

export default async function ProfilePage() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect('/');
  }

  await dbConnect();

  const reviews = await Review.find({ userId: session.user.id }).populate('userId');
  const favorites = await Favorite.find({ userId: session.user.id });

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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Mis Reseñas</h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{review.bookId}</h3>
                        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm font-medium">
                          {review.rating}/5 ⭐
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No has escrito reseñas aún.</p>
                  <Link
                    href="/"
                    className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                  >
                    Explorar libros →
                  </Link>
                </div>
              )}
            </div>

            {/* Libros Favoritos */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Libros Favoritos</h2>
              {favorites.length > 0 ? (
                <div className="space-y-3">
                  {favorites.map((fav) => (
                    <div key={fav._id} className="border border-gray-200 rounded-lg p-3">
                      <p className="text-gray-900 font-medium">{fav.bookId}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No tienes libros favoritos.</p>
                  <Link
                    href="/"
                    className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
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
