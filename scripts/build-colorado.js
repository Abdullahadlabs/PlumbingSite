const fs = require('fs');
const path = require('path');
const { LAKEWOOD_ZIPS, SERVICES, DOMAIN, COLORADO_DIR } = require('./colorado-data');
const { generateStateHub, generateCityZipHub } = require('./generate-colorado-hubs');
const { generateServicePage } = require('./generate-colorado-services');

console.log('====================================================');
console.log('BUILDING COLORADO (CO) SECTION — LAKEWOOD PILOT');
console.log('====================================================\n');

// 1. Generate State Hub
console.log('[1/5] Generating Colorado State Hub...');
generateStateHub();

// 2. Generate City-ZIP Hubs & Service Pages
console.log('\n[2/5] Generating Lakewood City-ZIP Hubs & Service Pages...');
let totalCityHubs = 0;
let totalServicePages = 0;
const generatedUrls = [];

// State URL
generatedUrls.push({
  loc: `${DOMAIN}/colorado/`,
  priority: '0.9',
  changefreq: 'weekly'
});

LAKEWOOD_ZIPS.forEach(zipObj => {
  generateCityZipHub(zipObj);
  totalCityHubs++;

  const cityZipSlug = `lakewood-${zipObj.zip}`;
  generatedUrls.push({
    loc: `${DOMAIN}/colorado/${cityZipSlug}/`,
    priority: '0.8',
    changefreq: 'weekly'
  });

  SERVICES.forEach(serviceObj => {
    generateServicePage(zipObj, serviceObj);
    totalServicePages++;

    generatedUrls.push({
      loc: `${DOMAIN}/colorado/${cityZipSlug}/${serviceObj.slug}/`,
      priority: '0.7',
      changefreq: 'weekly'
    });
  });
});

console.log(`Successfully generated:`);
console.log(`- 1 State Hub: /colorado/`);
console.log(`- ${totalCityHubs} Lakewood City-ZIP Hubs`);
console.log(`- ${totalServicePages} Lakewood Hyper-Local Service Pages`);
console.log(`- Total URLs: ${generatedUrls.length}`);

// 3. Generate sitemap-colorado.xml
console.log('\n[3/5] Generating sitemap-colorado.xml...');
const lastModDate = new Date().toISOString().split('T')[0];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${generatedUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

const sitemapPath = path.join(__dirname, '..', 'sitemap-colorado.xml');
fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');
console.log(`Written sitemap-colorado.xml with ${generatedUrls.length} URLs to: ${sitemapPath}`);

// 4. Update root sitemap.xml index
console.log('\n[4/5] Updating root sitemap.xml index...');
const rootSitemapPath = path.join(__dirname, '..', 'sitemap.xml');
let rootSitemapContent = fs.readFileSync(rootSitemapPath, 'utf8');

if (!rootSitemapContent.includes('sitemap-colorado.xml')) {
  rootSitemapContent = rootSitemapContent.replace(
    '</sitemapindex>',
    `  <sitemap>\n    <loc>${DOMAIN}/sitemap-colorado.xml</loc>\n    <lastmod>${lastModDate}</lastmod>\n  </sitemap>\n</sitemapindex>`
  );
  fs.writeFileSync(rootSitemapPath, rootSitemapContent, 'utf8');
  console.log('Added sitemap-colorado.xml reference to root sitemap.xml');
} else {
  console.log('sitemap-colorado.xml reference already present in root sitemap.xml');
}

// 5. Automated Validation Pass
console.log('\n[5/5] Executing Validation Pass...');

// 5A: Internal Link Crawl
console.log('\n--- Link Crawl Check ---');
let brokenLinks = 0;
let totalCheckedLinks = 0;

function checkFileLinks(filePath, fileUrl) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Match href="/colorado/..."
  const linkRegex = /href="(\/colorado\/[^"#?]*)"/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    totalCheckedLinks++;
    const linkPath = match[1];
    // Resolve to physical path
    const relPath = linkPath.replace(/^\/colorado\/?/, '');
    let targetFile;
    if (!relPath) {
      targetFile = path.join(COLORADO_DIR, 'index.html');
    } else {
      targetFile = path.join(COLORADO_DIR, relPath, 'index.html');
    }

    if (!fs.existsSync(targetFile)) {
      console.error(`Broken link in ${filePath} -> ${linkPath} (Target: ${targetFile})`);
      brokenLinks++;
    }
  }
}

// Crawl state hub
checkFileLinks(path.join(COLORADO_DIR, 'index.html'), `${DOMAIN}/colorado/`);

// Crawl each city hub and service page
LAKEWOOD_ZIPS.forEach(z => {
  const cityZipSlug = `lakewood-${z.zip}`;
  checkFileLinks(path.join(COLORADO_DIR, cityZipSlug, 'index.html'), `${DOMAIN}/colorado/${cityZipSlug}/`);
  SERVICES.forEach(s => {
    checkFileLinks(path.join(COLORADO_DIR, cityZipSlug, s.slug, 'index.html'), `${DOMAIN}/colorado/${cityZipSlug}/${s.slug}/`);
  });
});

console.log(`Total internal links checked: ${totalCheckedLinks}`);
console.log(`Broken links found: ${brokenLinks}`);

// 5B: Schema Validation Check
console.log('\n--- Schema JSON-LD Validation Check ---');
let schemaErrors = 0;
let schemasChecked = 0;

function checkFileSchema(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const schemaRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match;
  let hasPlumbingService = false;
  let hasGeo = false;

  while ((match = schemaRegex.exec(content)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      schemasChecked++;
      const graph = parsed['@graph'] || [parsed];
      graph.forEach(item => {
        if (item['@type'] === 'PlumbingService') {
          hasPlumbingService = true;
          if (item.geo && item.geo.latitude && item.geo.longitude) {
            hasGeo = true;
          }
        }
      });
    } catch (err) {
      console.error(`Invalid JSON-LD in ${filePath}:`, err.message);
      schemaErrors++;
    }
  }

  // If it's a city hub or service page, verify geo coordinates
  if (filePath !== path.join(COLORADO_DIR, 'index.html')) {
    if (!hasPlumbingService || !hasGeo) {
      console.error(`Missing PlumbingService or GeoCoordinates in ${filePath}`);
      schemaErrors++;
    }
  }
}

checkFileSchema(path.join(COLORADO_DIR, 'index.html'));
LAKEWOOD_ZIPS.forEach(z => {
  const cityZipSlug = `lakewood-${z.zip}`;
  checkFileSchema(path.join(COLORADO_DIR, cityZipSlug, 'index.html'));
  SERVICES.forEach(s => {
    checkFileSchema(path.join(COLORADO_DIR, cityZipSlug, s.slug, 'index.html'));
  });
});

console.log(`Total JSON-LD schemas parsed: ${schemasChecked}`);
console.log(`Schema structural errors found: ${schemaErrors}`);

// 5C: Duplication & Uniqueness Check (Section 6 rule)
console.log('\n--- Anti-Duplication Check across 3 Nearby ZIPs for Drain Cleaning ---');
function extractTextSentences(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Extract paragraphs in main content
  const matches = content.match(/<p[^>]*>([\s\S]*?)<\/p>/g) || [];
  const text = matches.map(m => m.replace(/<[^>]+>/g, '').trim()).join(' ');
  return text.split(/[.!?]+/).map(s => s.trim().toLowerCase()).filter(s => s.length > 15);
}

function calculateDifference(sentencesA, sentencesB) {
  const setB = new Set(sentencesB);
  let differentCount = 0;
  sentencesA.forEach(s => {
    if (!setB.has(s)) differentCount++;
  });
  return (differentCount / sentencesA.length) * 100;
}

const file80226 = path.join(COLORADO_DIR, 'lakewood-80226', 'drain-cleaning', 'index.html');
const file80214 = path.join(COLORADO_DIR, 'lakewood-80214', 'drain-cleaning', 'index.html');
const file80228 = path.join(COLORADO_DIR, 'lakewood-80228', 'drain-cleaning', 'index.html');

const sentences80226 = extractTextSentences(file80226);
const sentences80214 = extractTextSentences(file80214);
const sentences80228 = extractTextSentences(file80228);

const diff226vs214 = calculateDifference(sentences80226, sentences80214);
const diff226vs228 = calculateDifference(sentences80226, sentences80228);
const diff214vs228 = calculateDifference(sentences80214, sentences80228);

console.log(`Text uniqueness between 80226 (Belmar) and 80214 (West Colfax): ${diff226vs214.toFixed(1)}% different sentences`);
console.log(`Text uniqueness between 80226 (Belmar) and 80228 (Green Mountain): ${diff226vs228.toFixed(1)}% different sentences`);
console.log(`Text uniqueness between 80214 (West Colfax) and 80228 (Green Mountain): ${diff214vs228.toFixed(1)}% different sentences`);

const isUniquenessCompliant = diff226vs214 >= 30 && diff226vs228 >= 30 && diff214vs228 >= 30;
console.log(`Anti-Duplication Threshold (>30% difference) Met: ${isUniquenessCompliant ? 'YES' : 'NO'}`);

console.log('\n====================================================');
console.log('BUILD & VALIDATION SUMMARY');
console.log('====================================================');
console.log(`Total URLs Generated: ${generatedUrls.length}`);
console.log(`State Hub: /colorado/`);
console.log(`City Hubs: ${totalCityHubs}`);
console.log(`Service Pages: ${totalServicePages}`);
console.log(`Sitemap: ${sitemapPath}`);
console.log(`Broken Internal Links: ${brokenLinks}`);
console.log(`Schema Errors: ${schemaErrors}`);
console.log(`Uniqueness Check: ${isUniquenessCompliant ? 'PASSED (>30% difference)' : 'FAILED'}`);
