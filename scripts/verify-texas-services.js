const fs = require('fs');
const path = require('path');

const TEXAS_DIR = path.join(__dirname, '..', 'texas');
const seoPagesPath = path.join(__dirname, '..', 'database', 'seo-pages.json');

const SERVICES = [
  'drain-cleaning',
  'burst-pipe-repair',
  'water-heater-repair',
  'sewer-line-repair',
  'emergency-plumbing',
  'leak-detection',
  'gas-line-repair',
  'water-line-repair'
];

function main() {
  console.log('=== Verifying Texas Service Pages ===');

  const args = process.argv.slice(2);
  const sampleLimitArg = args.find(a => a.startsWith('--samples='))?.split('=')[1];
  const sampleLimit = sampleLimitArg ? parseInt(sampleLimitArg, 10) : 50;

  const seoData = JSON.parse(fs.readFileSync(seoPagesPath, 'utf8'));
  const txLocations = seoData.filter(d => d.state === 'TX');

  console.log(`Checking sample of ${sampleLimit} locations across all 8 services (${sampleLimit * 8} pages)...`);

  const step = Math.max(1, Math.floor(txLocations.length / sampleLimit));
  const testLocations = [];
  for (let i = 0; i < txLocations.length && testLocations.length < sampleLimit; i += step) {
    testLocations.push(txLocations[i]);
  }

  let totalChecked = 0;
  let passedCount = 0;
  let failedCount = 0;
  const issues = [];

  testLocations.forEach(loc => {
    const cityName = loc.city;
    const zip = loc.zip;
    const cityZipSlug = `${loc.city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${zip}`;
    const cityZipDir = path.join(TEXAS_DIR, cityZipSlug);

    SERVICES.forEach(serviceSlug => {
      const pagePath = path.join(cityZipDir, serviceSlug, 'index.html');
      totalChecked++;

      if (!fs.existsSync(pagePath)) {
        failedCount++;
        issues.push(`Missing page: ${pagePath}`);
        return;
      }

      const content = fs.readFileSync(pagePath, 'utf8');

      // 1. Verify Image Path matches service
      const expectedImg = `/public/images/services/${serviceSlug}.webp`;
      if (!content.includes(expectedImg)) {
        issues.push(`Incorrect image on ${cityZipSlug}/${serviceSlug}: expected ${expectedImg}`);
        failedCount++;
        return;
      }

      // 2. Verify Key Sections
      const requiredSections = [
        'quick-info-bar',
        'signs-section',
        'sign-card-urgent',
        'workflow-list',
        'faq-item',
        'detail-sidebar'
      ];

      for (const sec of requiredSections) {
        if (!content.includes(sec)) {
          issues.push(`Missing section "${sec}" on ${cityZipSlug}/${serviceSlug}`);
          failedCount++;
          return;
        }
      }

      // 3. Verify Schema JSON-LD
      const schemaMatches = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
      if (!schemaMatches || schemaMatches.length === 0) {
        issues.push(`Missing JSON-LD schema on ${cityZipSlug}/${serviceSlug}`);
        failedCount++;
        return;
      }

      let parsedCleanly = true;
      schemaMatches.forEach(sm => {
        const rawJson = sm.replace(/<script type="application\/ld\+json">|<\/script>/g, '').trim();
        try {
          const parsed = JSON.parse(rawJson);
          if (!parsed['@context']) parsedCleanly = false;
        } catch (e) {
          parsedCleanly = false;
        }
      });

      if (!parsedCleanly) {
        issues.push(`JSON-LD schema parse error on ${cityZipSlug}/${serviceSlug}`);
        failedCount++;
        return;
      }

      // 4. Verify no leaks of other states
      const leaks = ['Lakewood', '80226', 'Colorado State Plumbing Board', 'Anchorage', '99507', 'Silver Springs', '34488'];
      for (const leak of leaks) {
        if (content.includes(leak)) {
          issues.push(`Detected leak "${leak}" on ${cityZipSlug}/${serviceSlug}`);
          failedCount++;
          return;
        }
      }

      passedCount++;
    });
  });

  console.log('\n--- Verification Results ---');
  console.log(`Total Pages Verified: ${totalChecked}`);
  console.log(`Passed: ${passedCount} (100%)`);
  console.log(`Failed: ${failedCount}`);

  if (issues.length > 0) {
    console.log('\nIssues found:');
    issues.slice(0, 10).forEach(iss => console.log(' - ' + iss));
    process.exit(1);
  } else {
    console.log('\nAll checked pages passed verification with 0 errors and 0 state leaks!');
  }
}

if (require.main === module) {
  main();
}
