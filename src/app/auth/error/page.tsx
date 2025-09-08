'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const errorMessages: Record<string, string> = {
  Configuration: 'Hay un problema con la configuración del servidor.',
  AccessDenied: 'No tienes permisos para acceder a este recurso.',
  Verification: 'El enlace de verificación ha expirado o ya ha sido utilizado.',
  Default: 'Ha ocurrido un error durante la autenticación.',
  CredentialsSignin: 'Las credenciales proporcionadas son incorrectas.',
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error de Autenticación</h1>
          <p className="text-gray-600">{errorMessages[error] || errorMessages.Default}</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors font-medium block text-center"
          >
            Intentar de Nuevo
          </Link>

          <Link
            href="/"
            className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium block text-center"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
