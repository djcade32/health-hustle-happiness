/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["firebase-admin"],
  },
  images: {
    remotePatterns: [
      {
        hostname: "www.moneytalksnews.com",
      },
      {
        hostname: "s.yimg.com",
      },
      {
        hostname: "cdn.thepennyhoarder.com",
      },
      {
        hostname: "images.everydayhealth.com",
      },
      {
        hostname: "athletechnews.com",
      },
      {
        hostname: "cdn.mos.cms.futurecdn.net",
      },
      {
        hostname: "images-prod.healthline.com",
      },
      {
        hostname: "media.post.rvohealth.io",
      },
      {
        hostname: "www.news-medical.net",
      },
      {
        hostname: "d2jx2rerrg6sh3.cloudfront.net",
      },
      {
        hostname: "www.mentalhealthfirstaid.org",
      },
      {
        hostname: "www.mrmoneymustache.com",
      },
      {
        hostname: "moneymorning.com",
      },
      {
        hostname: "chuzefitness.com",
      },
      {
        hostname: "www.nerdfitness.com",
      },
      {
        hostname: "www.anytimefitness.com",
      },
      {
        hostname: "www.nami.org",
      },
      {
        hostname: "www.bphope.com",
      },
      {
        hostname: "www.blurtitout.org",
      },
      {
        hostname: "mybrainsnotbroken.files.wordpress.com",
      },
    ],
  },
};

module.exports = nextConfig;
