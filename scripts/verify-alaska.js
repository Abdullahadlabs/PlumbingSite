const fs = require('fs');
const path = require('path');

const alaskaDir = path.join(__dirname, '..', 'alaska');
const dirs = fs.readdirSync(alaskaDir).filter(d => fs.statSync(path.join(alaskaDir, d)).isDirectory());

console.log(`Verifying ${dirs.length} Alaska zip landing pages...\n`);

let stats = {
  totalPages: dirs.length,
  validJsonLd: 0,
  invalidJsonLd: 0,
  validSections: 0,
  invalidSections: 0,
  zeroFloridaLeaks: 0,
  validCanonicals: 0
};

dirs.forEach(d => {
  const p = path.join(alaskaDir, d, 'index.html');
  if (!fs.existsSync(p)) {
    console.error(`Missing index.html in ${d}`);
    return;
  }
  const content = fs.readFileSync(p, 'utf8');

  // Check JSON-LD
  const jsonMatch = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      if (parsed['@graph'] && parsed['@graph'].length === 3) {
        stats.validJsonLd++;
      } else {
        stats.invalidJsonLd++;
        console.warn(`${d}: @graph length not 3`);
      }
    } catch (err) {
      stats.invalidJsonLd++;
      console.error(`${d}: JSON parse error: ${err.message}`);
    }
  } else {
    stats.invalidJsonLd++;
  }

  // Check 14 sections (hero, trust, featured, about, process, why-us, projects, services, maintenance, areas, reviews, faq, map, cta)
  const sections = content.match(/<section[^>]*>/gi);
  if (sections && sections.length === 14) {
    stats.validSections++;
  } else {
    stats.invalidSections++;
    console.warn(`${d}: Section count is ${sections ? sections.length : 0} (expected 14)`);
  }

  // Check for unwanted Florida text leaks
  if (!/silver springs/i.test(content) && !/florida/i.test(content)) {
    stats.zeroFloridaLeaks++;
  } else {
    console.warn(`${d}: Contains Florida or Silver Springs reference`);
  }

  // Check canonical link
  const canonicalExpected = `https://homeplumbingusa.com/alaska/${d}/`;
  if (content.includes(`<link rel="canonical" href="${canonicalExpected}">`)) {
    stats.validCanonicals++;
  } else {
    console.warn(`${d}: Canonical tag mismatch`);
  }
});

console.log('--- Verification Summary ---');
console.log(`Total Pages Checked:    ${stats.totalPages}`);
console.log(`Valid JSON-LD Schemas:  ${stats.validJsonLd} / ${stats.totalPages}`);
console.log(`Valid 14-Section Layout: ${stats.validSections} / ${stats.totalPages}`);
console.log(`Zero Florida Leaks:     ${stats.zeroFloridaLeaks} / ${stats.totalPages}`);
console.log(`Valid Canonical URLs:   ${stats.validCanonicals} / ${stats.totalPages}`);

if (stats.validJsonLd === stats.totalPages &&
    stats.validSections === stats.totalPages &&
    stats.zeroFloridaLeaks === stats.totalPages &&
    stats.validCanonicals === stats.totalPages) {
  console.log('\nALL 245 ALASKA ZIP PAGES PASSED VERIFICATION WITH 100% SUCCESS!');
} else {
  console.log('\nSOME CHECKS FAILED. Please review above.');
}
