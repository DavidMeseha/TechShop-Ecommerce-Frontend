/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/images/**"
      },
      {
        protocol: "https",
        hostname: "techshop-ecommerce-backend-production.up.railway.app",
        port: "",
        pathname: "/images/**"
      },
      {
        protocol: "https",
        hostname: "rxbeaxrpqdbp4d9h.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**"
      }
    ]
  },

  expireTime: 86_400, //1 day

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js"
      }
    }
  }
};

export default nextConfig;
