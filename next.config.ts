import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://image.tmdb.org/**")],
  },
  experimental: {
    ppr: true,
  },
};

export default nextConfig;
