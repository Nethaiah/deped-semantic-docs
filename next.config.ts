import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  experimental: {
    viewTransition: true,
  },
  logging: {
    browserToTerminal: true,
  },
};

export default nextConfig;
