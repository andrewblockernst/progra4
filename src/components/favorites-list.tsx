'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface Favorite {
  _id: string;
  bookId: string;
  addedAt: string;
}

interface FavoritesListProps {
  favorites: Favorite[];
  onFavoriteRemoved: (bookId: string) => void;
}

export default function FavoritesList({ favorites, onFavoriteRemoved }: FavoritesListProps) {
  const [removing, setRemoving] = useState<string | null>(null);

  const removeFavorite = async (bookId: string) => {
    setRemoving(bookId);
    try {
      const response = await fetch(`/api/favorites?bookId=${bookId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        onFavoriteRemoved(bookId);
      } else {
        alert('Error al remover favorito');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Error al remover favorito');
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="space-y-4">
      {favorites.map((favorite) => (
        <div key={favorite._id} className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                Libro ID: {favorite.bookId}
              </h3>
              <p className="text-sm text-gray-500">
                Agregado: {new Date(favorite.addedAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => removeFavorite(favorite.bookId)}
              disabled={removing === favorite.bookId}
              className="text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              <Heart className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}