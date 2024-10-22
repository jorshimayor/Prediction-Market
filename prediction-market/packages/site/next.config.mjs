/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dummyimage.com',
        port: '', // leave empty for default port
        pathname: '/**', // allow any image path from this domain
      },
    ],
  },
};

export default nextConfig;
