'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Navigation() {
  const { data: session } = useSession()

  return (
    <nav className="flex justify-between items-center mb-8">
      {/* Izquierda: saludo */}
      <div>
        {session && (
          <span className="text-amber-200">
            ¡Hola, {session.user?.name || 'Usuario'}!
          </span>
        )}
      </div>
      {/* Derecha: enlaces y botones */}
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <Link href="/profile" className="bg-amber-950 p-2 rounded-lg text-amber-200 hover:text-amber-100 transition-colors">
              Perfil
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-amber-950 p-2 text-amber-200 rounded-lg hover:text-amber-100 transition-colors"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-amber-200 hover:text-amber-100 transition-colors px-3 py-1 rounded"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
