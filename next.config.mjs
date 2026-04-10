/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
};

export default nextConfig;
