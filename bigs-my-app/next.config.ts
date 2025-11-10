import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "front-mission.bigs.or.kr",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
