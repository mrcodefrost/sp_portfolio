/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  serverExternalPackages: ["@sanity/client", "sanity"],
  experimental: {
    optimizePackageImports: ["react-icons", "@heroicons/react"],
  },
  async headers() {
    return [
      {
        // Files in /public keep their names when replaced, so they cannot be "immutable": a day of fresh
        // cache plus a week of stale-while-revalidate keeps repeat visits fast without pinning old images.
        // (No images are imported into the bundle, so nothing hashed under /_next/static matches this.)
        source: "/:file*.(png|jpg|jpeg|webp|avif|svg|webm|ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },
};

export default nextConfig;
