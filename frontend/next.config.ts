import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
    ],
  },
  // API rewrites: in production, set NEXT_PUBLIC_API_URL on Vercel to your backend URL.
  // In local dev without NEXT_PUBLIC_API_URL, requests to /api/* are proxied to the NestJS backend.
  async rewrites() {
    if (process.env.NEXT_PUBLIC_API_URL) {
      // When a backend URL is explicitly configured, the frontend calls it directly
      // (via api.ts), so no rewrite is needed.
      return [];
    }
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
