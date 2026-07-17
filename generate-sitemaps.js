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

// Dictionary mapping all US states (plus DC & PR) to slugified names to prevent scaling bugs.
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

function main() {
  const serviceAreasPath = path.join(__dirname, 'service-areas');
  if (!fs.existsSync(serviceAreasPath)) {
    console.error("service-areas directory not found!");
    return;
  }

  // 1. Read all city folders
  const items = fs.readdirSync(serviceAreasPath, { withFileTypes: true });
  
  // Group city folders by state code
  const stateFoldersMap = {};
  items.forEach(item => {
    if (item.isDirectory()) {
      const folderName = item.name;
      const parts = folderName.split('-');
      if (parts.length >= 3) {
        const stateCode = parts[0].toLowerCase();
        if (!stateFoldersMap[stateCode]) {
          stateFoldersMap[stateCode] = [];
        }
        stateFoldersMap[stateCode].push(folderName);
      }
    }
  });

  const lastModDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const generatedSitemaps = [];

  // 2. Generate state-specific sitemaps (combining state, city, and service URLs)
  Object.keys(stateFoldersMap).sort().forEach(stateCode => {
    const stateName = STATE_MAP[stateCode] || stateCode;
    const folders = stateFoldersMap[stateCode];
    folders.sort();

    const urls = [];

    // A. Add State main page URL
    urls.push({
      loc: `${DOMAIN}/state/${slugify(stateName)}`,
      changefreq: 'weekly',
      priority: '0.8'
    });

    // B. Add City pages and their Service subpages
    folders.forEach(folder => {
      const cleanFolder = slugify(folder);
      
      // City URL
      urls.push({
        loc: `${DOMAIN}/service-areas/${cleanFolder}/`,
        changefreq: 'weekly',
        priority: '0.6'
      });

      // Scan subdirectories for service subpages
      const folderPath = path.join(serviceAreasPath, folder);
      const subItems = fs.readdirSync(folderPath, { withFileTypes: true });
      
      subItems.forEach(subItem => {
        if (subItem.isDirectory()) {
          const serviceSlug = slugify(subItem.name);
          urls.push({
            loc: `${DOMAIN}/service-areas/${cleanFolder}/${serviceSlug}/`,
            changefreq: 'weekly',
            priority: '0.8'
          });
        }
      });
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

  // 3. Generate sitemap-pages.xml (Static Pages)
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

  // 4. Generate sitemap.xml (Sitemap Index)
  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${generatedSitemaps.map(filename => `  <sitemap>
    <loc>${DOMAIN}/${filename}</loc>
    <lastmod>${lastModDate}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

  fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemapIndexXml, 'utf8');
  console.log(`Generated sitemap.xml index successfully! (Sitemaps: ${generatedSitemaps.length})`);

  // 5. Cleanup deprecated sitemaps if they exist in the root
  const deprecatedFiles = [
    'sitemap-cities.xml',
    'sitemap-services.xml',
    'sitemap-states.xml'
  ];
  deprecatedFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up deprecated sitemap file: ${file}`);
      } catch (err) {
        console.error(`Failed to delete deprecated file ${file}:`, err.message);
      }
    }
  });
}

main();
