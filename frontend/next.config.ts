import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@formio/js': false,
        'dragula': false,
      }
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    config.module.rules.push({
      test: /\.ejs$/,
      use: 'raw-loader'
    });
    return config;
  }
};

export default nextConfig;
