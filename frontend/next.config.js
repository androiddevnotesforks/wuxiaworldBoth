module.exports = {
  // reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["cdn.novelupdates.com", "cdn.wuxianovels.co"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  staticPageGenerationTimeout: 100000,
  experimental: {
    outputStandalone: true,
  },
};
