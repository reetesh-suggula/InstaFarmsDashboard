/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    //API_URL:'http://localhost:8000/api'
    API_URL:'https://instafarms-14ba5.el.r.appspot.com/api'
  },
};

module.exports = nextConfig;
