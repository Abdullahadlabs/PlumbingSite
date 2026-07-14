const fs = require('fs');
const path = require('path');

function slugify(text) {
  if (!text) return '';
  let decoded = text;
  try {
    let prev;
    do {
      prev = decoded;
      decoded = decodeURIComponent(decoded);
    } while (decoded !== prev);
  } catch (e) {}
  return decoded
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const DOMAIN = 'https://homeplumbingusa.com';

function main() {
  const serviceAreasPath = path.join(__dirname, 'service-areas');
  if (!fs.existsSync(serviceAreasPath)) {
    console.error("service-areas directory not found!");
    return;
  }

  const items = fs.readdirSync(serviceAreasPath, { withFileTypes: true });
  const cityFolders = items
    .filter(item => item.isDirectory())
    .map(item => item.name);

  const statesSet = new Set();
  const cityUrls = [];
  const serviceUrls = [];

  cityFolders.forEach(folder => {
    const parts = folder.split('-');
    if (parts.length >= 3) {
      const stateCode = parts[0].toLowerCase();
      const stateMap = {
        'ak': 'alaska',
        'tx': 'texas'
      };
      const stateName = stateMap[stateCode] || stateCode;
      statesSet.add(stateName);

      const cleanFolder = slugify(folder);
      cityUrls.push(`${DOMAIN}/service-areas/${cleanFolder}/`);

      const folderPath = path.join(serviceAreasPath, folder);
      const subItems = fs.readdirSync(folderPath, { withFileTypes: true });
      subItems.forEach(subItem => {
        if (subItem.isDirectory()) {
          const serviceSlug = slugify(subItem.name);
          serviceUrls.push(`${DOMAIN}/service-areas/${cleanFolder}/${serviceSlug}/`);
        }
      });
    }
  });

  // 1. Generate sitemap-states.xml
  const stateUrls = Array.from(statesSet).map(state => `${DOMAIN}/state/${slugify(state)}`);
  const sitemapStatesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${stateUrls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(__dirname, 'sitemap-states.xml'), sitemapStatesXml, 'utf8');

  // 2. Generate sitemap-cities.xml
  cityUrls.sort();
  const sitemapCitiesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cityUrls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(__dirname, 'sitemap-cities.xml'), sitemapCitiesXml, 'utf8');

  // 3. Generate sitemap-services.xml
  serviceUrls.sort();
  const sitemapServicesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${serviceUrls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(__dirname, 'sitemap-services.xml'), sitemapServicesXml, 'utf8');

  // 4. Generate sitemap-pages.xml
  const rootUrls = [
    `${DOMAIN}/`,
    `${DOMAIN}/about`,
    `${DOMAIN}/services`,
    `${DOMAIN}/projects`,
    `${DOMAIN}/contact`,
    `${DOMAIN}/privacy-policy`,
    `${DOMAIN}/terms-and-conditions`
  ];
  const sitemapPagesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rootUrls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>monthly</changefreq>
    <priority>${url.endsWith('/') ? '1.0' : '0.7'}</priority>
  </url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(__dirname, 'sitemap-pages.xml'), sitemapPagesXml, 'utf8');

  // 5. Generate sitemap.xml (Index)
  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemap-pages.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-states.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-cities.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-services.xml</loc>
  </sitemap>
</sitemapindex>`;
  fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemapIndexXml, 'utf8');

  console.log(`Generated all sitemaps successfully!`);
  console.log(`- States: ${stateUrls.length}`);
  console.log(`- Cities: ${cityUrls.length}`);
  console.log(`- Services: ${serviceUrls.length}`);
}

main();
