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

const STATE_MAP = {
  'al': 'alabama', 'ak': 'alaska', 'az': 'arizona', 'ar': 'arkansas', 'ca': 'california',
  'co': 'colorado', 'ct': 'connecticut', 'de': 'delaware', 'dc': 'district-of-columbia',
  'fl': 'florida', 'ga': 'georgia', 'hi': 'hawaii', 'id': 'idaho', 'il': 'illinois',
  'in': 'indiana', 'ia': 'iowa', 'ks': 'kansas', 'ky': 'kentucky', 'la': 'louisiana',
  'me': 'maine', 'md': 'maryland', 'ma': 'massachusetts', 'mi': 'michigan', 'mn': 'minnesota',
  'ms': 'mississippi', 'mo': 'missouri', 'mt': 'montana', 'ne': 'nebraska', 'nv': 'nevada',
  'nh': 'new-hampshire', 'nj': 'new-jersey', 'nm': 'new-mexico', 'ny': 'new-york',
  'nc': 'north-carolina', 'nd': 'north-dakota', 'oh': 'ohio', 'ok': 'oklahoma',
  'or': 'oregon', 'pa': 'pennsylvania', 'pr': 'puerto-rico', 'ri': 'rhode-island',
  'sc': 'south-carolina', 'sd': 'south-dakota', 'tn': 'tennessee', 'tx': 'texas',
  'ut': 'utah', 'vt': 'vermont', 'va': 'virginia', 'wa': 'washington', 'wv': 'west-virginia',
  'wi': 'wisconsin', 'wy': 'wyoming'
};

const STATE_SLUGS = ['alaska', 'texas', 'florida'];

function main() {
  const lastModDate = new Date().toISOString().split('T')[0];
  const generatedSitemaps = [];

  STATE_SLUGS.forEach(stateSlug => {
    const stateDir = path.join(__dirname, stateSlug);
    if (!fs.existsSync(stateDir)) return;

    let stateCode = 'us';
    for (const [code, slug] of Object.entries(STATE_MAP)) {
      if (slug === stateSlug) {
        stateCode = code;
        break;
      }
    }

    console.log(`Generating sitemap for ${stateSlug} (${stateCode})...`);

    const urls = [];

    // State main page
    urls.push({
      loc: `${DOMAIN}/state/${stateSlug}`,
      changefreq: 'weekly',
      priority: '0.9'
    });

    const cityFolders = fs.readdirSync(stateDir, { withFileTypes: true });
    cityFolders.forEach(cf => {
      if (cf.isDirectory()) {
        const cityZipSlug = cf.name;
        // Hub URL
        urls.push({
          loc: `${DOMAIN}/${stateSlug}/${cityZipSlug}/`,
          changefreq: 'weekly',
          priority: '0.7'
        });

        // Service subpages
        const cityZipPath = path.join(stateDir, cityZipSlug);
        const subItems = fs.readdirSync(cityZipPath, { withFileTypes: true });
        subItems.forEach(si => {
          if (si.isDirectory()) {
            urls.push({
              loc: `${DOMAIN}/${stateSlug}/${cityZipSlug}/${si.name}/`,
              changefreq: 'weekly',
              priority: '0.8'
            });
          }
        });
      }
    });

    // Write XML file for state
    const sitemapFilename = `sitemap-${stateCode}.xml`;
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(__dirname, sitemapFilename), sitemapXml, 'utf8');
    console.log(`Generated ${sitemapFilename} successfully! (URLs: ${urls.length})`);
    generatedSitemaps.push(sitemapFilename);
  });

  // Root static pages
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
    <lastmod>${lastModDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${url.endsWith('/') ? '1.0' : '0.7'}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(__dirname, 'sitemap-pages.xml'), sitemapPagesXml, 'utf8');
  console.log(`Generated sitemap-pages.xml successfully! (URLs: ${rootUrls.length})`);
  generatedSitemaps.push('sitemap-pages.xml');

  // Master Sitemap Index
  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${generatedSitemaps.map(filename => `  <sitemap>
    <loc>${DOMAIN}/${filename}</loc>
    <lastmod>${lastModDate}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

  fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemapIndexXml, 'utf8');
  console.log(`Generated sitemap.xml index successfully! (Sitemaps: ${generatedSitemaps.length})`);
}

main();
