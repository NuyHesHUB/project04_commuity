/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.gravatar.com",
      "localhost",
      "ec2-3-25-221-182.ap-southeast-2.compute.amazonaws.com"
    ]
  }
}

module.exports = nextConfig
