/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration Turbopack (nouvelle syntaxe stable)
  turbopack: {
    rules: {
      // Configuration pour les fichiers SVG avec Turbopack
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    resolveAlias: {
      // Aliases corrects pour Turbopack (utiliser des chemins vides au lieu de false)
      canvas: './src/lib/canvas-fallback',
      fs: './src/lib/fs-fallback',
      path: './src/lib/path-fallback',
    },
  },
  
  // Configuration pour les en-têtes CORS
  async headers() {
    return [
      {
        source: '/pdf.worker.min.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // En-têtes supplémentaires pour PDF.js
        source: '/_next/static/chunks/pdf.worker.min.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Configuration Webpack uniquement pour le build de production
  webpack: (config, { isServer, dev }) => {
    // Seulement pour les builds de production (pas en dev avec Turbopack)
    if (!dev) {
      // Handle PDF.js worker pour le build de production
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          path: false,
          canvas: false,
        };
      }

      // Handle file types pour le build de production
      config.module.rules.push({
        test: /\.pdf$/,
        type: 'asset/resource',
      });
    }

    return config;
  },
};

module.exports = nextConfig; 