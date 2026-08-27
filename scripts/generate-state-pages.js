const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://homeplumbingusa.com';
const baseHtmlPath = path.join(__dirname, '..', 'state.html');
const outputBaseDir = path.join(__dirname, '..', 'state');
const seoPagesPath = path.join(__dirname, '..', 'database', 'seo-pages.json');

const STATES = [
  { code: 'AL', name: 'Alabama', slug: 'alabama' },
  { code: 'AK', name: 'Alaska', slug: 'alaska' },
  { code: 'AZ', name: 'Arizona', slug: 'arizona' },
  { code: 'AR', name: 'Arkansas', slug: 'arkansas' },
  { code: 'CA', name: 'California', slug: 'california' },
  { code: 'CO', name: 'Colorado', slug: 'colorado' },
  { code: 'CT', name: 'Connecticut', slug: 'connecticut' },
  { code: 'DE', name: 'Delaware', slug: 'delaware' },
  { code: 'DC', name: 'District of Columbia', slug: 'district-of-columbia' },
  { code: 'FL', name: 'Florida', slug: 'florida' },
  { code: 'GA', name: 'Georgia', slug: 'georgia' },
  { code: 'HI', name: 'Hawaii', slug: 'hawaii' },
  { code: 'ID', name: 'Idaho', slug: 'idaho' },
  { code: 'IL', name: 'Illinois', slug: 'illinois' },
  { code: 'IN', name: 'Indiana', slug: 'indiana' },
  { code: 'IA', name: 'Iowa', slug: 'iowa' },
  { code: 'KS', name: 'Kansas', slug: 'kansas' },
  { code: 'KY', name: 'Kentucky', slug: 'kentucky' },
  { code: 'LA', name: 'Louisiana', slug: 'louisiana' },
  { code: 'ME', name: 'Maine', slug: 'maine' },
  { code: 'MD', name: 'Maryland', slug: 'maryland' },
  { code: 'MA', name: 'Massachusetts', slug: 'massachusetts' },
  { code: 'MI', name: 'Michigan', slug: 'michigan' },
  { code: 'MN', name: 'Minnesota', slug: 'minnesota' },
  { code: 'MS', name: 'Mississippi', slug: 'mississippi' },
  { code: 'MO', name: 'Missouri', slug: 'missouri' },
  { code: 'MT', name: 'Montana', slug: 'montana' },
  { code: 'NE', name: 'Nebraska', slug: 'nebraska' },
  { code: 'NV', name: 'Nevada', slug: 'nevada' },
  { code: 'NH', name: 'New Hampshire', slug: 'new-hampshire' },
  { code: 'NJ', name: 'New Jersey', slug: 'new-jersey' },
  { code: 'NM', name: 'New Mexico', slug: 'new-mexico' },
  { code: 'NY', name: 'New York', slug: 'new-york' },
  { code: 'NC', name: 'North Carolina', slug: 'north-carolina' },
  { code: 'ND', name: 'North Dakota', slug: 'north-dakota' },
  { code: 'OH', name: 'Ohio', slug: 'ohio' },
  { code: 'OK', name: 'Oklahoma', slug: 'oklahoma' },
  { code: 'OR', name: 'Oregon', slug: 'oregon' },
  { code: 'PA', name: 'Pennsylvania', slug: 'pennsylvania' },
  { code: 'RI', name: 'Rhode Island', slug: 'rhode-island' },
  { code: 'SC', name: 'South Carolina', slug: 'south-carolina' },
  { code: 'SD', name: 'South Dakota', slug: 'south-dakota' },
  { code: 'TN', name: 'Tennessee', slug: 'tennessee' },
  { code: 'TX', name: 'Texas', slug: 'texas' },
  { code: 'UT', name: 'Utah', slug: 'utah' },
  { code: 'VT', name: 'Vermont', slug: 'vermont' },
  { code: 'VA', name: 'Virginia', slug: 'virginia' },
  { code: 'WA', name: 'Washington', slug: 'washington' },
  { code: 'WV', name: 'West Virginia', slug: 'west-virginia' },
  { code: 'WI', name: 'Wisconsin', slug: 'wisconsin' },
  { code: 'WY', name: 'Wyoming', slug: 'wyoming' }
];

function slugify(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildAllStateCitiesIndex() {
  const stateIndex = new Map();

  // 1. Index physical static state directories first (alaska, texas, florida)
  const physicalStates = [
    { code: 'AK', slug: 'alaska' },
    { code: 'TX', slug: 'texas' },
    { code: 'FL', slug: 'florida' }
  ];
  physicalStates.forEach(stObj => {
    const stDir = path.join(__dirname, '..', stObj.slug);
    if (fs.existsSync(stDir)) {
      try {
        const folders = fs.readdirSync(stDir, { withFileTypes: true });
        if (!stateIndex.has(stObj.code)) {
          stateIndex.set(stObj.code, new Map());
        }
        const citiesMap = stateIndex.get(stObj.code);
        folders.forEach(dir => {
          if (dir.isDirectory()) {
            const name = dir.name;
            const match = name.match(/^(.*?)-(\d{5})$/);
            if (match) {
              const citySlug = match[1];
              const zip = match[2];
              const cityName = citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
              const key = cityName.toLowerCase().trim();
              citiesMap.set(key, {
                city: cityName,
                zip: zip,
                url: `/${stObj.slug}/${name}/`
              });
            }
          }
        });
      } catch (e) {}
    }
  });

  // 2. Try loading from database/seo-pages.json if available
  if (fs.existsSync(seoPagesPath)) {
    try {
      console.log('Loading database/seo-pages.json for city index...');
      const seoData = JSON.parse(fs.readFileSync(seoPagesPath, 'utf8'));
      if (Array.isArray(seoData)) {
        const stateSlugMap = { 'AK': 'alaska', 'TX': 'texas', 'FL': 'florida' };
        seoData.forEach(item => {
          if (item.state && item.city) {
            const st = item.state.toUpperCase();
            if (!stateIndex.has(st)) {
              stateIndex.set(st, new Map());
            }
            const citiesMap = stateIndex.get(st);
            const key = item.city.toLowerCase().trim();
            if (!citiesMap.has(key)) {
              const stSlug = stateSlugMap[st] || slugify(item.state);
              const cSlug = slugify(item.city);
              citiesMap.set(key, {
                city: item.city,
                zip: item.zip || '',
                url: `/${stSlug}/${cSlug}-${item.zip || ''}/`
              });
            }
          }
        });
      }
    } catch (e) {
      console.warn(`Could not parse seo-pages.json: ${e.message}`);
    }
  }

  return stateIndex;
}

function generateStateMetaDescription(stateName, stateCode) {
  const s = stateName === 'District of Columbia' ? 'Washington DC' : stateName;

  const templates = [
    // Base 152-155 (For short states 4-8 chars)
    `Need trusted plumbers in ${s}? Home Plumbing USA connects you with licensed local technicians for 24/7 emergency repairs & drain cleaning. Call 877-516-8705!`,
    `Looking for emergency plumbers in ${s}? Home Plumbing USA matches you with vetted local specialists for 24/7 fast pipe & leak repairs. Call 877-516-8705!`,
    `Need 24/7 emergency plumbers in ${s}? Home Plumbing USA connects you with licensed local experts for fast repairs, drains & leak service. Call 877-516-8705!`,
    `Need emergency plumbing in ${s}? Home Plumbing USA connects you with licensed local contractors for 24/7 pipe repairs & drain cleaning. Call 877-516-8705!`,
    // Base 145-150 (For medium states 7-11 chars)
    `Need reliable plumbers in ${s}? Home Plumbing USA connects you with licensed local technicians for 24/7 emergency repairs & drain service. Call 877-516-8705!`,
    `Need fast emergency plumbers in ${s}? Home Plumbing USA connects you with licensed local technicians for 24/7 repairs & leak detection. Call 877-516-8705!`,
    `Find trusted local plumbers in ${s}. Home Plumbing USA connects you with licensed, vetted technicians for 24/7 emergency plumbing repairs. Call 877-516-8705!`,
    `Looking for trusted plumbers in ${s}? Home Plumbing USA connects you with licensed local technicians for 24/7 emergency repairs. Call 877-516-8705 today!`,
    // Base 138-145 (For long states 11-15 chars)
    `Fast, reliable plumbing in ${s}. Home Plumbing USA connects you with licensed, local plumbers 24/7 for emergency repairs & drains. Call 877-516-8705!`,
    `Looking for reliable plumbers in ${s}? Home Plumbing USA connects you with licensed local experts for 24/7 emergency repairs. Call 877-516-8705!`,
    `Get 24/7 plumbing services in ${s}. Home Plumbing USA matches you with vetted, licensed local plumbers for fast emergency repairs. Call 877-516-8705!`,
    `Need trusted plumbers in ${s}? Home Plumbing USA connects you with licensed local experts for 24/7 emergency repairs & service. Call 877-516-8705!`,
    `Find licensed plumbers in ${s}. Home Plumbing USA connects you with vetted, local contractors for 24/7 emergency plumbing repairs. Call 877-516-8705!`
  ];

  // Rotate starting offset per state for maximum natural variation
  const hash = s.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const startIdx = hash % templates.length;

  for (let i = 0; i < templates.length; i++) {
    const candidate = templates[(startIdx + i) % templates.length];
    if (candidate.length >= 150 && candidate.length <= 160) {
      return candidate;
    }
  }

  // Fallback if none in range
  for (const c of templates) {
    if (c.length >= 150 && c.length <= 160) return c;
  }

  return `Need trusted plumbing services in ${s}? Home Plumbing USA connects you with vetted, licensed local plumbers for 24/7 emergency repairs. Call 877-516-8705!`;
}

function generateStateHtml(templateHtml, state, stateCitiesIndex) {
  const stateName = state.name;
  const stateSlug = state.slug;
  const stateCode = state.code;
  const canonicalUrl = `${DOMAIN}/state/${stateSlug}`;

  // Unique Title Tag (strictly optimized <= 60 characters)
  let titleTag = `24/7 Plumbers in ${stateName} | Emergency Plumbing Services`;
  if (titleTag.length > 60) {
    titleTag = `24/7 Plumbers in ${stateName} | Emergency Plumbing`;
  }
  if (titleTag.length > 60) {
    titleTag = `Plumbers in ${stateName} | Home Plumbing USA`;
  }

  // Unique Meta Description (Strictly 150 - 160 characters)
  const metaDesc = generateStateMetaDescription(stateName, stateCode);

  // Unique Meta Keywords
  const metaKeywords = `plumbers in ${stateName}, emergency plumbing ${stateName}, 24/7 local plumber ${stateName}, ${stateName} plumbing experts, water heater repair ${stateName}, affordable plumber ${stateName}, licensed plumbers ${stateCode}`;

  // Schema.org JSON-LD
  const schemaObj = {
    "@context": "https://schema.org",
    "@type": "PlumbingService",
    "name": `Home Plumbing USA - ${stateName}`,
    "description": `Professional plumbing and emergency repair services across ${stateName}. Licensed, vetted plumbers available 24/7.`,
    "url": canonicalUrl,
    "telephone": "877-516-8705",
    "priceRange": "$$",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": stateName
    },
    "provider": {
      "@type": "LocalBusiness",
      "name": "Home Plumbing USA",
      "image": "https://homeplumbingusa.com/images/logo.png"
    }
  };

  const schemaHtml = `<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n  </script>`;

  // Build Pre-rendered City Cards
  const citiesMap = stateCitiesIndex.get(stateCode.toUpperCase()) || new Map();
  const cities = Array.from(citiesMap.values()).sort((a, b) => a.city.localeCompare(b.city));
  let citiesHtml = '';
  if (cities.length > 0) {
    citiesHtml = cities.map(c => `
          <a href="${c.url}" class="area-card">
            <i class="fas fa-map-marker-alt"></i>
            <span class="area-title">${c.city}</span>
            <div class="area-zip">${c.zip}</div>
          </a>`).join('\n');
  } else {
    citiesHtml = `
          <div class="no-providers-container" style="text-align: center; padding: 50px 30px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); max-width: 600px; margin: 0 auto; grid-column: 1 / -1;">
            <i class="fas fa-exclamation-circle" style="font-size: 2.5rem; color: var(--accent); margin-bottom: 16px; display: block;"></i>
            <h3 style="color: var(--text-white); margin-bottom: 12px; font-size: 1.5rem;">No Local Providers Found Yet</h3>
            <p style="color: var(--text-muted); margin-bottom: 24px; font-size: 0.95rem; line-height: 1.6;">We are currently expanding our network of vetted plumbers in ${stateName}. Enter your email below to be notified as soon as local plumbing technicians become active in your region.</p>
            <form onsubmit="event.preventDefault(); alert('Thank you! We will notify you when coverage becomes active in ${stateName}.'); this.reset();" style="max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px;">
              <input type="email" placeholder="Enter your email" style="padding: 12px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-white); font-size: 0.95rem;" required>
              <button type="submit" class="btn btn-accent" style="padding: 12px; font-weight: 600; cursor: pointer; border: none; border-radius: var(--radius-sm);">Notify Me</button>
            </form>
          </div>`;
  }

  let html = templateHtml;

  // 1. Replace Title Tag
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${titleTag}</title>`);

  // 2. Replace Meta Description
  html = html.replace(/<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="description" content="${metaDesc}">`);

  // 3. Replace Meta Keywords
  html = html.replace(/<meta\s+name=["']keywords["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="keywords" content="${metaKeywords}">`);

  // 4. Update or add Canonical Tag
  const canonicalTag = `<link rel="canonical" href="${canonicalUrl}">`;
  if (html.includes('<link rel="canonical"')) {
    html = html.replace(/<link\s+rel=["']canonical["']\s+href=["'][\s\S]*?["']\s*\/?>/i, canonicalTag);
  } else {
    html = html.replace('</head>', `  ${canonicalTag}\n</head>`);
  }

  // 5. Add Open Graph & Twitter meta tags
  const ogTags = `
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${titleTag}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:image" content="https://homeplumbingusa.com/public/images/hero-plumbing.webp">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${canonicalUrl}">
  <meta name="twitter:title" content="${titleTag}">
  <meta name="twitter:description" content="${metaDesc}">
  <meta name="twitter:image" content="https://homeplumbingusa.com/public/images/hero-plumbing.webp">
  ${schemaHtml}
  `;
  html = html.replace('</head>', `${ogTags}\n</head>`);

  // 6. Pre-render state name throughout page elements
  html = html.replace(/<span class="state-name">.*?<\/span>/g, `<span class="state-name">${stateName}</span>`);
  html = html.replace(/Professional <span>Plumbing Services<\/span> in <span class="state-name">.*?<\/span>/g, `Professional <span>Plumbing Services</span> in <span class="state-name">${stateName}</span>`);

  // 7. Inject pre-rendered area cards into #areas-grid
  html = html.replace(/<div class="areas-grid" id="areas-grid">[\s\S]*?<\/div>/i, `<div class="areas-grid" id="areas-grid">${citiesHtml}\n        </div>`);

  return html;
}

function main() {
  console.log('--- Generating Pre-rendered State Pages ---');
  if (!fs.existsSync(baseHtmlPath)) {
    console.error(`Base template not found at ${baseHtmlPath}`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');

  if (!fs.existsSync(outputBaseDir)) {
    fs.mkdirSync(outputBaseDir, { recursive: true });
  }

  const stateCitiesIndex = buildAllStateCitiesIndex();

  let count = 0;
  STATES.forEach(state => {
    const stateFolder = path.join(outputBaseDir, state.slug);
    if (!fs.existsSync(stateFolder)) {
      fs.mkdirSync(stateFolder, { recursive: true });
    }

    const stateHtml = generateStateHtml(baseHtml, state, stateCitiesIndex);
    const outputFile = path.join(stateFolder, 'index.html');
    fs.writeFileSync(outputFile, stateHtml, 'utf8');
    count++;
  });

  console.log(`Successfully generated ${count} unique state pages in /state/<state-slug>/index.html`);
}

main();
