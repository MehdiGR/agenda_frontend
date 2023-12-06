/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ["picsum.photos", "localhost", "circumicons.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "circumicons.com",
      },
    ],
  },

  // experimental: {
  //   serverActions: true,
  // },
};

module.exports = nextConfig;
