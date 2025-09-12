import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware() {
    // Lógica adicional si es necesario
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ['/protected/:path*', '/profile/:path*', '/api/reviews/:path*', '/api/favorites/:path*'] };