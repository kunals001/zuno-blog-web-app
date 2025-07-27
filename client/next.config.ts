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
        hostname: "ddx1444aoq5w5.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "d2ntopquj72nb1.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
