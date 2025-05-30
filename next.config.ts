import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uxlqgllrc8f85g5q.public.blob.vercel-storage.com",
        port: "",
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
    //minimumCacheTTL: 31536000,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev"],
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
  },
};

export default nextConfig;
