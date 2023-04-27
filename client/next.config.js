/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "www.gravatar.com",
      "localhost",
      "ec2-3-27-115-11.ap-southeast-2.compute.amazonaws.com"
    ]
  }
}

module.exports = nextConfig
