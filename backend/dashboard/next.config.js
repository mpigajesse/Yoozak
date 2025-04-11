// ce fichier gere la configuration de next.js pour le dashboard
// on utilise next.config.js pour gerer la configuration de next.js pour le dashboard
// on utilise next.config.js pour gerer la configuration de next.js pour le dashboard
// next.config.js est un fichier de configuration pour next.js car on a besoin de gerer la configuration de next.js pour le dashboard

/** @type {import('next').NextConfig} */

// ici nextConfig est une constante qui contient la configuration de next.js pour le dashboard
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  //async c'est une fonction asynchrone qui permet de gerer les rewrites de next.js pour le dashboard
  // on utilise async rewrites pour gerer les rewrites de next.js pour le dashboard
  //les rewrites sont des routes qui permettent de gerer les routes de next.js pour le dashboard
  async rewrites() {
    return [
      {
        //source c'est la route de next.js pour le dashboard
        // on utilise source pour gerer la route de next.js pour le dashboard
        source: '/api/:path*',
        //destination c'est la route de l'api pour le dashboard
        // on utilise destination pour gerer la route de l'api pour le dashboard
        destination: 'http://localhost:8000/api/:path*',
        //basePath c'est la base de la route pour le dashboard
        // on utilise basePath pour gerer la base de la route pour le dashboard
        basePath: false,
      },
      {
        //source c'est la route de next.js pour le dashboard
        // on utilise source pour gerer la route de next.js pour le dashboard
        source: '/api/auth/user-info',
        //destination c'est la route de l'api pour le dashboard
        // on utilise destination pour gerer la route de l'api pour le dashboard
        destination: 'http://localhost:8000/api/auth/user/',
        //basePath c'est la base de la route pour le dashboard
        // on utilise basePath pour gerer la base de la route pour le dashboard
        basePath: false,
      },
      {
        //source c'est la route de next.js pour le dashboard
        // on utilise source pour gerer la route de next.js pour le dashboard
        source: '/api/auth/user-update',
        //destination c'est la route de l'api pour le dashboard
        // on utilise destination pour gerer la route de l'api pour le dashboard
        destination: 'http://localhost:8000/api/auth/user/',
        //basePath c'est la base de la route pour le dashboard
        // on utilise basePath pour gerer la base de la route pour le dashboard
        basePath: false,
      },
    ];
  },  
  // Configuration pour éviter les avertissements de métadonnées
  // on utilise experimental pour gerer les avertissements de métadonnées pour le dashboard
  experimental: {
    outputFileTracingExcludes: {
      '*': ['node_modules/**'],
    },
  },
};

module.exports = nextConfig; 