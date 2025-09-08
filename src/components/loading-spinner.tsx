'use client';

export default function LoadingSpinner({ message = 'Cargando...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
