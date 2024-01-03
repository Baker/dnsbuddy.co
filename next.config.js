/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagsapi.com',
        port: '',
        pathname: '**',
      },
    ],
  },
  sentry: {
    hideSourceMaps: true,
  },
};

const SentryWebpackPluginOptions = {
  silent: true,
  org: 'personal-a0d',
  project: 'dnsbuddy',
  authToken: process.env.SENTRY_AUTH_TOKEN,
};

module.exports = withSentryConfig(
  withBundleAnalyzer(nextConfig),
  SentryWebpackPluginOptions
);
