/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: false,
  env: {
    // MYSQL_HOST: "sql12.freesqldatabase.com",
    // MYSQL_PORT: "3306",
    // MYSQL_DATABASE: "sql12663468",
    // MYSQL_USER: "sql12663468",
    // MYSQL_PASSWORD: "JANAgh4IBh",
    MYSQL_HOST: "localhost",
    MYSQL_PORT: "3306",
    MYSQL_DATABASE: "sql12663468",
    MYSQL_USER: "root",
    MYSQL_PASSWORD: "",
    // CLOUDINARY_API_KEY: "<our_key>",
    // CLOUDINARY_API_SECRET: "<our_api_secret>",
    // CLOUDINARY_NAME: "<our_cloud_name></our_cloud_name>",
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

// module.exports = nextConfig
