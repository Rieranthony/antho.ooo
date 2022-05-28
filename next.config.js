/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["img.youtube.com"]
  },
  experimental: { images: { layoutRaw: true } }
};

module.exports = nextConfig;
