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
    ],
  },
};

export default nextConfig;
