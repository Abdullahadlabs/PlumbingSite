const fs = require('fs');
const path = require('path');
const { LAKEWOOD_ZIPS, SERVICES, DOMAIN, COLORADO_DIR } = require('./colorado-data');

function main() {
  console.log('====================================================');
  console.log('=== VERIFYING COLORADO SERVICE PAGES & HUBS ===');
  console.log('====================================================\n');

  let totalChecked = 0;
  let passedCount = 0;
  let failedCount = 0;
  const issues = [];

  // Verify State Hub
  const stateHubPath = path.join(COLORADO_DIR, 'index.html');
  totalChecked++;
  if (!fs.existsSync(stateHubPath)) {
    failedCount++;
    issues.push(`Missing State Hub: ${stateHubPath}`);
  } else {
    const stateContent = fs.readFileSync(stateHubPath, 'utf8');
    if (!stateContent.includes('class="hero"')) issues.push('State hub missing .hero');
    if (!stateContent.includes('Colorado')) issues.push('State hub missing Colorado text');
    if (!stateContent.includes('<script type="application/ld+json">')) issues.push('State hub missing schema');
    passedCount++;
  }

  // Verify City-ZIP Hubs
  LAKEWOOD_ZIPS.forEach(zipObj => {
    const cityZipSlug = `lakewood-${zipObj.zip}`;
    const hubPath = path.join(COLORADO_DIR, cityZipSlug, 'index.html');
    totalChecked++;

    if (!fs.existsSync(hubPath)) {
      failedCount++;
      issues.push(`Missing City-ZIP Hub: ${hubPath}`);
      return;
    }

    const hubContent = fs.readFileSync(hubPath, 'utf8');
    const requiredHubSnippets = [
      'class="hero"',
      'quick-info-bar',
      'class="trust-badges"',
      'id="services"',
      'id="areas"',
      'class="footer"'
    ];

    for (const snippet of requiredHubSnippets) {
      if (!hubContent.includes(snippet)) {
        issues.push(`Hub ${cityZipSlug} missing snippet "${snippet}"`);
        failedCount++;
        return;
      }
    }

    // Verify Hub Schema
    const hubSchemaMatch = hubContent.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!hubSchemaMatch) {
      issues.push(`Hub ${cityZipSlug} missing JSON-LD schema`);
      failedCount++;
      return;
    }

    try {
      const parsed = JSON.parse(hubSchemaMatch[1]);
      const graph = parsed['@graph'] || [parsed];
      const hasPlumbing = graph.some(item => item['@type'] === 'PlumbingService' && item.geo && item.geo.latitude && item.geo.longitude);
      if (!hasPlumbing) {
        issues.push(`Hub ${cityZipSlug} missing PlumbingService or GeoCoordinates in schema`);
        failedCount++;
        return;
      }
    } catch (err) {
      issues.push(`Hub ${cityZipSlug} JSON-LD parse error: ${err.message}`);
      failedCount++;
      return;
    }

    passedCount++;
  });

  // Verify All Hyper-Local Service Pages
  LAKEWOOD_ZIPS.forEach(zipObj => {
    const cityZipSlug = `lakewood-${zipObj.zip}`;
    const cityZipDir = path.join(COLORADO_DIR, cityZipSlug);

    SERVICES.forEach(serviceObj => {
      const serviceSlug = serviceObj.slug;
      const serviceName = serviceObj.name;
      const pagePath = path.join(cityZipDir, serviceSlug, 'index.html');
      totalChecked++;

      if (!fs.existsSync(pagePath)) {
        failedCount++;
        issues.push(`Missing service page: ${pagePath}`);
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

      // 2. Verify Key Sections & Audit Checklist Compliance
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

      // 3. Verify Exact H1 Match
      const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
      const h1Text = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
      const expectedH1 = `${serviceName} in Lakewood, CO (${zipObj.zip})`;
      if (h1Text !== expectedH1) {
        issues.push(`H1 mismatch on ${cityZipSlug}/${serviceSlug}: got "${h1Text}", expected "${expectedH1}"`);
        failedCount++;
        return;
      }

      // 4. Verify Canonical URL
      const expectedCanonical = `${DOMAIN}/colorado/${cityZipSlug}/${serviceSlug}/`;
      const canonicalMatch = content.match(/<link rel="canonical" href="(.*?)">/);
      const canonical = canonicalMatch ? canonicalMatch[1] : '';
      if (canonical !== expectedCanonical) {
        issues.push(`Canonical mismatch on ${cityZipSlug}/${serviceSlug}: got "${canonical}", expected "${expectedCanonical}"`);
        failedCount++;
        return;
      }

      // 5. Verify 20 Service-Specific FAQs
      const faqMatches = content.match(/<div class="faq-item"/g);
      const faqCount = faqMatches ? faqMatches.length : 0;
      if (faqCount !== 20) {
        issues.push(`FAQ count on ${cityZipSlug}/${serviceSlug} is ${faqCount}, expected 20`);
        failedCount++;
        return;
      }

      // 6. Verify Schema JSON-LD
      const schemaMatches = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
      if (!schemaMatches || schemaMatches.length === 0) {
        issues.push(`Missing JSON-LD schema on ${cityZipSlug}/${serviceSlug}`);
        failedCount++;
        return;
      }

      let parsedCleanly = true;
      let hasPlumbingService = false;
      let hasGeo = false;
      let hasBreadcrumb = false;
      let hasFAQPage = false;

      schemaMatches.forEach(sm => {
        const rawJson = sm.replace(/<script type="application\/ld\+json">|<\/script>/g, '').trim();
        try {
          const parsed = JSON.parse(rawJson);
          if (!parsed['@context']) parsedCleanly = false;
          const graph = parsed['@graph'] || [parsed];
          graph.forEach(item => {
            if (item['@type'] === 'PlumbingService') {
              hasPlumbingService = true;
              if (item.geo && item.geo.latitude && item.geo.longitude) {
                hasGeo = true;
              }
            }
            if (item['@type'] === 'BreadcrumbList') hasBreadcrumb = true;
            if (item['@type'] === 'FAQPage') {
              if (item.mainEntity && item.mainEntity.length === 20) {
                hasFAQPage = true;
              }
            }
          });
        } catch (e) {
          parsedCleanly = false;
        }
      });

      if (!parsedCleanly || !hasPlumbingService || !hasGeo || !hasBreadcrumb || !hasFAQPage) {
        issues.push(`Schema validation failed on ${cityZipSlug}/${serviceSlug}: clean=${parsedCleanly}, plumbing=${hasPlumbingService}, geo=${hasGeo}, breadcrumbs=${hasBreadcrumb}, 20-faq=${hasFAQPage}`);
        failedCount++;
        return;
      }

      // 7. Verify No Leaks of Other States
      const leaks = [
        'Texas', 'Houston', 'Dallas', 'TSBPE', 'Texas State Board',
        'Florida', 'Miami', 'Orlando', 'Florida Building Code',
        'Alaska', 'Anchorage', 'Fairbanks'
      ];
      for (const leak of leaks) {
        if (content.includes(leak)) {
          issues.push(`Detected foreign state leak "${leak}" on ${cityZipSlug}/${serviceSlug}`);
          failedCount++;
          return;
        }
      }

      // 8. Verify Colorado Climate & Geological Nuances
      const localKeywords = ['Colorado', 'Lakewood', 'elevation', 'clay', 'freeze'];
      for (const kw of localKeywords) {
        if (!content.toLowerCase().includes(kw.toLowerCase())) {
          issues.push(`Missing local nuance keyword "${kw}" on ${cityZipSlug}/${serviceSlug}`);
          failedCount++;
          return;
        }
      }

      passedCount++;
    });
  });

  // Link Crawl Verification for Broken Internal Links
  console.log('--- Checking for Broken Relative & Internal Links ---');
  let checkedLinks = 0;
  let brokenLinks = 0;

  function checkLinksInFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const linkRegex = /href="(\/colorado\/[^"#?]*)"/g;
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      checkedLinks++;
      const linkPath = match[1];
      const relPath = linkPath.replace(/^\/colorado\/?/, '');
      let targetFile;
      if (!relPath) {
        targetFile = path.join(COLORADO_DIR, 'index.html');
      } else {
        targetFile = path.join(COLORADO_DIR, relPath, 'index.html');
      }

      if (!fs.existsSync(targetFile)) {
        issues.push(`Broken link in ${filePath} -> ${linkPath}`);
        brokenLinks++;
      }
    }
  }

  checkLinksInFile(stateHubPath);
  LAKEWOOD_ZIPS.forEach(z => {
    const cityZipSlug = `lakewood-${z.zip}`;
    checkLinksInFile(path.join(COLORADO_DIR, cityZipSlug, 'index.html'));
    SERVICES.forEach(s => {
      checkLinksInFile(path.join(COLORADO_DIR, cityZipSlug, s.slug, 'index.html'));
    });
  });

  console.log(`Total Internal Links Checked: ${checkedLinks}`);
  console.log(`Broken Links: ${brokenLinks}\n`);

  console.log('=== VERIFICATION SUMMARY ===');
  console.log(`Total Entities Verified: ${totalChecked} (1 State Hub + 10 City Hubs + 80 Service Pages)`);
  console.log(`Passed: ${passedCount} (${((passedCount / totalChecked) * 100).toFixed(1)}%)`);
  console.log(`Failed: ${failedCount}`);
  console.log(`Broken Links: ${brokenLinks}`);

  if (issues.length > 0) {
    console.error('\nIssues Detected:');
    issues.slice(0, 15).forEach(iss => console.error(' - ' + iss));
    process.exit(1);
  } else {
    console.log('\nSUCCESS: All Colorado pages passed 100% checklist verification with zero errors and zero leaks!');
  }
}

if (require.main === module) {
  main();
}
