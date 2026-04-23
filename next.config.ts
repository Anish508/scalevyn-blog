import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Bypass private IP check for Supabase storage (NAT64 in local dev).
    // Remove `unoptimized` on Vercel where Supabase resolves to public IPs.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "owudshbxalszrbzycxvm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
  // Note: Custom Cache-Control on /_next/static is handled by Vercel automatically.
  // Only add headers for public assets to avoid dev-mode warnings.
  async headers() {
    return [
      {
        source: "/(.*)\\.(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2)$",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
