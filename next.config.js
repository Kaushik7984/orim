/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["upload.wikimedia.org", "miro.medium.com", "img.icons8.com"],
  },
  webpack(config) {
    // Exclude svg from the default file loader
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    // Add custom SVG loader
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{ loader: "@svgr/webpack", options: { icon: true } }],
    });

    // Your .node rule is kept
    config.module.rules.push({
      test: /\.node$/,
      use: [{ loader: "node-loader" }],
    });

    return config;
  },
};

module.exports = nextConfig;
