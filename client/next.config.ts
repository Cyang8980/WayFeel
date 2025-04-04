import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": __dirname,
      "@/Components": `${__dirname}/Components`,
      "@/pages": `${__dirname}/pages`,
    };
    return config;
  },
};

export default nextConfig;
