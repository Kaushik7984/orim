/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com'], // For Google OAuth profile images
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['fabric', 'fabric-ca-client'],
  },
  transpilePackages: ['@mui/material', '@emotion/react', '@emotion/styled'],
}

module.exports = nextConfig 