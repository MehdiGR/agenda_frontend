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
  async rewrites() {
    return {
      beforeFiles: [
        // These rewrites are checked after headers/redirects
        // and before all files including _next/public files which
        // allows overriding page files
        {
          source: "/",
          destination: "/agenda",
        },
      ],

      // {
      //   source: "/agenda",
      //   destination: "/",
      // },
      // {
      //   source: "/index",
      //   destination: "/_index",
      // },
    };
  },

  // experimental: {
  //   serverActions: true,
  // },
  // typescript: {
  //   // !! WARN !!
  //   // Dangerously allow production builds to successfully complete even if
  //   // your project has type errors.
  //   // !! WARN !!
  //   ignoreBuildErrors: true,
  // },
};

module.exports = nextConfig;
