/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      // {
      //   protocol: "http",
      //   hostname: "localhost",
      //   pathname: "/api/photos/**",
      // },
      {
        protocol: "https",
        hostname: "fullstack-app-jhxjzbofyq-uc.a.run.app",
        pathname: "/api/photos/**",
      },
    ],
  },
};

export default nextConfig;
