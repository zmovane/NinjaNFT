/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs.infura.io", "nftstorage.link"],
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  env: {
    RPC_URL: process.env.RPC_URL,
    NFT_STORAGE_KEY: process.env.NFT_STORAGE_KEY,
  },
};

module.exports = nextConfig;
