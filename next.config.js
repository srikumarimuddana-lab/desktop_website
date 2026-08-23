const nextConfig = {
  output: 'standalone',
  images: {
    // unoptimized: true, // Commented out to enable Image Optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  serverExternalPackages: ['mongodb', '@langchain/community', '@langchain/core', '@langchain/openai', 'langchain', 'mammoth', 'jsdom'],
  experimental: {
    // Remove if not using Server Components
  },
  devIndicators: false,
  /* The redesign consolidated the help centre: article pages moved from
     /help/article/:slug to /help/:slug, and category pages became anchors on
     the one help page. 301 rather than 404 — these URLs are indexed and
     linked, and a permanent redirect passes their ranking to the new page. */
  async redirects() {
    return [
      { source: '/help/article/:slug', destination: '/help/:slug', permanent: true },
      /* /support was top-articles + browse-by-category + an email link. The
         redesigned /help does all three, plus the FAQ and the assistant, so
         the page had nothing left of its own. */
      { source: '/support', destination: '/help', permanent: true },
      { source: '/support/requirements', destination: '/drive', permanent: true },
      { source: '/help/category/:slug', destination: '/help', permanent: true },
      // the old design lived here while the new one was being built
      { source: '/preview', destination: '/', permanent: true },
      { source: '/preview/:path*', destination: '/:path*', permanent: true },
    ]
  },
  turbopack: {},
  webpack(config, { dev }) {
    if (dev) {
      // Reduce CPU/memory from file watching
      config.watchOptions = {
        poll: 2000, // check every 2 seconds
        aggregateTimeout: 300, // wait before rebuilding
        ignored: ['**/node_modules'],
      };
    }
    return config;
  },
  onDemandEntries: {
    maxInactiveAge: 10000,
    pagesBufferLength: 2,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Content-Security-Policy", value: "frame-ancestors *;" },
          { key: "Access-Control-Allow-Origin", value: process.env.CORS_ORIGINS || "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "*" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
