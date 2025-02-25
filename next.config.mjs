/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add a rule to handle the canvas.node binary module
    config.module.rules.push({ test: /\.node$/, use: "raw-loader" });

    // Exclude canvas from being processed by Next.js in the browser
    if (!isServer) config.externals.push("canvas");
    return config;
  },
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

  experimental: {
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js"
        }
      }
    }
  }
};

export default nextConfig;
