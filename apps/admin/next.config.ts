import type { NextConfig } from "next";

const WEB_API_URL = process.env.WEB_API_URL || "http://localhost:3002";

const nextConfig: NextConfig = {
  transpilePackages: ["@carnetmariage/core", "@carnetmariage/ui"],
  env: {
    WEB_API_URL, // Expose to client-side
  },
  async rewrites() {
    return [
      {
        source: "/api/admin/:path*",
        destination: `${WEB_API_URL}/api/admin/:path*`,
      },
    ];
  },
};

export default nextConfig;
