import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@carnetmariage/core", "@carnetmariage/ui"],
};

export default nextConfig;
