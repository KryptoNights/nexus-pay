/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  resolve: {
    fallback: {
      fs: false, // Ignore fs module
    },
  },
  reactStrictMode: true,
};
