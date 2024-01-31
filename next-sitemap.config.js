/** @type {import('next-sitemap').IConfig} */
// Docs: https://github.com/iamvishnusankar/next-sitemap
module.exports = {
  siteUrl: process.env.SITE_URL || "http://localhost:3000",
  generateRobotsTxt: true,
};
