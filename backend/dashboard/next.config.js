/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
        basePath: false,
      },
      {
        source: '/api/auth/user-info',
        destination: 'http://localhost:8000/api/auth/user/',
        basePath: false,
      },
      {
        source: '/api/auth/user-update',
        destination: 'http://localhost:8000/api/auth/user/',
        basePath: false,
      },
    ];
  },
  // Configuration pour éviter les avertissements de métadonnées
  experimental: {
    outputFileTracingExcludes: {
      '*': ['node_modules/**'],
    },
  },
};

module.exports = nextConfig; 