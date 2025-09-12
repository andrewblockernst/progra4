import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // ← Agrega esta línea para Docker
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'books.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'books.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.googleapis.com',
        port: '',
        pathname: '/books/**',
      },
      {
        protocol: 'https',
        hostname: 'www.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
