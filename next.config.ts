import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    viewTransition: true,
  },
  logging: {
    browserToTerminal: true,
  },
};

export default nextConfig;
