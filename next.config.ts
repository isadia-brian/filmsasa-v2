import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uxlqgllrc8f85g5q.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
    minimumCacheTTL: 3600,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev", "192.168.0.34"],
  experimental: {
    optimizePackageImports: [
      "drizzle-orm",
      "react-scroll",
      "react-snap-carousel",
      "framer-motion",
      "use-debounce",
      "pg",
      "postgres",
      "motion",
      "next-themes",
      "unique-username-generator",
      "jose",
      "bcryptjs",
      "lucide-react",
      "dotenv",
    ],
    webpackMemoryOptimizations: true,
    serverSourceMaps: false,
    preloadEntriesOnStart: false,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
