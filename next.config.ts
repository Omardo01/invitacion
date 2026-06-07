import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  images: {
    // calidades permitidas para next/image (Next 16 exige declararlas)
    qualities: [75, 90, 92],
  },
};

export default nextConfig;
