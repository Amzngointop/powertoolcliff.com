/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    deviceSizes: [256, 384, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'm.media-amazon.com' },
    ],
  },
}

export default nextConfig
