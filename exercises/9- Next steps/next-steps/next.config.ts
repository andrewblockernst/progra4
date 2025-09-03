import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //HABILITO OUTPUT STANDALONE PARA DOCKER
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'books.google.com',
        port: '',
        pathname: '/books/content/**',
      },
      {
        protocol: 'http',
        hostname: 'books.google.com',
        port: '',
        pathname: '/books/content/**',
      },
    ],
  },
};

export default nextConfig;
