const fs = require('fs');
const path = require('path');
const { LAKEWOOD_ZIPS, SERVICES, DOMAIN, COLORADO_DIR } = require('./colorado-data');

let totalPages = 0;
let titleLengthWarnings = 0;
let descLengthWarnings = 0;
let h1Issues = 0;
let canonicalIssues = 0;
let geoMissing = 0;

LAKEWOOD_ZIPS.forEach(z => {
  const cityZipSlug = `lakewood-${z.zip}`;
  SERVICES.forEach(s => {
    totalPages++;
    const filePath = path.join(COLORADO_DIR, cityZipSlug, s.slug, 'index.html');
    const content = fs.readFileSync(filePath, 'utf8');

    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    const descMatch = content.match(/<meta name="description" content="(.*?)">/);
    const canonicalMatch = content.match(/<link rel="canonical" href="(.*?)">/);
    const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);

    const title = titleMatch ? titleMatch[1] : '';
    const desc = descMatch ? descMatch[1] : '';
    const canonical = canonicalMatch ? canonicalMatch[1] : '';
    const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';

    const expectedCanonical = `${DOMAIN}/colorado/${cityZipSlug}/${s.slug}/`;
    if (canonical !== expectedCanonical) {
      console.error(`Canonical mismatch in ${filePath}: got ${canonical}, expected ${expectedCanonical}`);
      canonicalIssues++;
    }

    if (title.length > 65 || title.length < 30) {
      titleLengthWarnings++;
    }

    if (desc.length > 165 || desc.length < 130) {
      descLengthWarnings++;
    }

    const expectedH1 = `${s.name} in Lakewood, CO (${z.zip})`;
    if (h1 !== expectedH1) {
      console.error(`H1 mismatch in ${filePath}: got "${h1}", expected "${expectedH1}"`);
      h1Issues++;
    }

    if (!content.includes(`"latitude": ${z.lat}`) || !content.includes(`"longitude": ${z.lng}`)) {
      console.error(`Geo coordinate missing in ${filePath}`);
      geoMissing++;
    }
  });
});

console.log('=== Service Pages Tag & Schema Inspection ===');
console.log(`Total Service Pages Inspected: ${totalPages}`);
console.log(`Canonical Issues: ${canonicalIssues}`);
console.log(`H1 Issues: ${h1Issues}`);
console.log(`Geo Coordinate Issues: ${geoMissing}`);
console.log(`Title Length Outside 30-65 chars: ${titleLengthWarnings}`);
console.log(`Description Length Outside 130-165 chars: ${descLengthWarnings}`);

const sampleFile = path.join(COLORADO_DIR, 'lakewood-80226', 'drain-cleaning', 'index.html');
const sampleContent = fs.readFileSync(sampleFile, 'utf8');
const sampleTitle = sampleContent.match(/<title>(.*?)<\/title>/)[1];
const sampleDesc = sampleContent.match(/<meta name="description" content="(.*?)">/)[1];
const sampleH1 = sampleContent.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
console.log('\nSample Lakewood 80226 Drain Cleaning Tags:');
console.log('Title (' + sampleTitle.length + ' chars):', sampleTitle);
console.log('Description (' + sampleDesc.length + ' chars):', sampleDesc);
console.log('H1:', sampleH1);
