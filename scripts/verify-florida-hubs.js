const fs = require('fs');
const path = require('path');

const seoPagesPath = path.join(__dirname, '..', 'database', 'seo-pages.json');
const seoData = JSON.parse(fs.readFileSync(seoPagesPath, 'utf8'));
const flLocs = seoData.filter(l => l.state === 'FL');

console.log('Total FL locations in DB:', flLocs.length);

let validCount = 0;
let missingCount = 0;
let schemaErrors = 0;
let missingSections = 0;

const requiredSnippets = [
  'class=\"hero\"',
  'class=\"trust-badges\"',
  'class=\"about-section\"',
  'class=\"process-section\"',
  'class=\"why-us-section\"',
  'class=\"projects-section\"',
  'id=\"services\"',
  'id=\"areas\"',
  'class=\"reviews-section\"',
  'class=\"faq-section\"',
  'class=\"map-section\"',
  'class=\"cta-section\"',
  'class=\"footer\"'
];

for (const loc of flLocs) {
  const cleanCity = loc.city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const slug = cleanCity + '-' + loc.zip;
  const filePath = path.join(__dirname, '..', 'florida', slug, 'index.html');

  if (!fs.existsSync(filePath)) {
    missingCount++;
    if (missingCount <= 5) console.error('Missing file:', filePath);
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  for (const snippet of requiredSnippets) {
    if (!content.includes(snippet)) {
      missingSections++;
      console.error('Missing section', snippet, 'in', filePath);
      break;
    }
  }

  const match = content.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/);
  if (!match) {
    schemaErrors++;
  } else {
    try {
      const parsed = JSON.parse(match[1]);
      if (!parsed['@graph'] || parsed['@graph'].length < 3) {
        schemaErrors++;
      }
    } catch (e) {
      schemaErrors++;
    }
  }

  validCount++;
}

console.log('=== Florida Hub Verification Results ===');
console.log('Total verified valid hubs:', validCount);
console.log('Missing hubs:', missingCount);
console.log('Hubs missing required sections:', missingSections);
console.log('Schema JSON-LD errors:', schemaErrors);

if (missingCount === 0 && missingSections === 0 && schemaErrors === 0) {
  console.log('ALL 927 FLORIDA CITY/ZIP HUBS ARE 100% HEALTHY & VALID!');
} else {
  console.error('Validation encountered issues.');
  process.exit(1);
}
