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

  // Configuration Webpack pour tous les builds
  webpack: (config, { isServer }) => {
    // Configuration pour PDF.js - toujours nécessaire
    if (!isServer) {
      // Ignorer complètement canvas et autres modules natifs côté client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        canvas: false,
      };
      
      // Exclure complètement les modules canvas pour éviter les erreurs
      config.externals = config.externals || [];
      config.externals.push({
        canvas: 'canvas',
        'canvas/lib/bindings': 'canvas/lib/bindings',
        'canvas/build/Release/canvas.node': 'canvas/build/Release/canvas.node',
      });
    }
    
    // Configuration pour tous les environnements - rediriger tous les imports canvas
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: require.resolve('./src/lib/canvas-fallback.js'),
      'canvas/lib/bindings': require.resolve('./src/lib/canvas-fallback.js'),
      'canvas/build/Release/canvas.node': require.resolve('./src/lib/canvas-fallback.js'),
    };

    // Handle file types
    config.module.rules.push({
      test: /\.pdf$/,
      type: 'asset/resource',
    });

    return config;
  },
};

module.exports = nextConfig; 