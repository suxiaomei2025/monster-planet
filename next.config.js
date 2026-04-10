/** @type {import('next').NextConfig} */ 
const nextConfig = { 
  experimental: { 
  }, 
  images: { 
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  }, 
  async headers() { 
    return [ 
      { 
        source: '/:path*', 
        headers: [ 
          { 
            key: 'X-DNS-Prefetch-Control', 
            value: 'on', 
          }, 
        ], 
      }, 
    ] 
  }, 
} 

module.exports = nextConfig 
