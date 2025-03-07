import { SitemapStream, streamToPromise } from 'sitemap';
import fs from 'fs';

const sitemap = new SitemapStream({ hostname: 'https://terranovare.tech' });

sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
sitemap.write({ url: '/mission', changefreq: 'weekly', priority: 0.9 });
sitemap.write({ url: '/brand', changefreq: 'weekly', priority: 0.8 });
sitemap.write({ url: '/shop', changefreq: 'monthly', priority: 0.7 });

sitemap.end();

streamToPromise(sitemap).then((data) =>
  fs.writeFileSync('public/sitemap.xml', data)
);