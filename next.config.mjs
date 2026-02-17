/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
        port: "",
        pathname: "**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "**",
        search: "",
      },
    ],
  },
  // Disable static generation for dynamic auth pages
  skipProxyUrlNormalize: true,
  staticPageGenerationTimeout: 1000,
};

export default nextConfig;
