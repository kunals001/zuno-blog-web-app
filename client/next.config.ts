import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: "https",
        hostname: "d2ntopquj72nb1.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
