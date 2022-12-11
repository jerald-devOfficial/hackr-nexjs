/** @type {import('next').NextConfig} */

const nextConfig = {
  publicRuntimeConfig: {
    APP_NAME: 'hackr-aws',
    API: process.env.NEXT_PUBLIC_API_URL,
    PRODUCTION: false,
    DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
    FB_APP_ID: process.env.NEXT_PUBLIC_FB_APP_ID,
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
