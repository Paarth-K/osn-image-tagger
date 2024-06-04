/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dh14sesjf/**",
      },
      {
        protocol: "https",
        hostname: "wsrv.nl",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
