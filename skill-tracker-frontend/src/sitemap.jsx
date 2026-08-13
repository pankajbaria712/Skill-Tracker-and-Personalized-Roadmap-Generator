// Helper export of the sitemap XML. Use this string if you want to
// generate or preview the sitemap programmatically.
export const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://skill-tracker-and-personalized-road.vercel.app/</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.00</priority>
  </url>
  <url>
    <loc>https://skill-tracker-and-personalized-road.vercel.app/about</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://skill-tracker-and-personalized-road.vercel.app/activity</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://skill-tracker-and-personalized-road.vercel.app/dashboard</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>https://skill-tracker-and-personalized-road.vercel.app/templates</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://skill-tracker-and-personalized-road.vercel.app/signin</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.50</priority>
  </url>
  <url>
    <loc>https://skill-tracker-and-personalized-road.vercel.app/signup</loc>
    <lastmod>2026-08-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.50</priority>
  </url>
</urlset>`;

// Default React component placeholder. Not intended for page rendering;
// the static `public/sitemap.xml` is served directly by the hosting platform.
export default function Sitemap() {
  return null;
}
