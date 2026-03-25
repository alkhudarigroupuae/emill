import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: false,
      },
      {
        source: "/:locale(en|ar)/undefined/:path*",
        destination: "/:locale/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
