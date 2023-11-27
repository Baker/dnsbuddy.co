const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagsapi.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'icons.duckduckgo.com',
        port: '',
        pathname: '/ip3/**',
      },
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
