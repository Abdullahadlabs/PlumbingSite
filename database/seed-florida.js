const fs = require('fs');
const path = require('path');

// 1. Raw sample dataset of Florida locations (including duplicate ZIP codes to test logic)
const rawLocations = [
  // Broward County
  { zip: '33301', city: 'Fort Lauderdale', county: 'Broward' },
  { zip: '33311', city: 'Fort Lauderdale', county: 'Broward' },
  { zip: '33312', city: 'Fort Lauderdale', county: 'Broward' },
  { zip: '33301', city: 'Fort Lauderdale', county: 'Broward' }, // DUPLICATE ZIP 1 (Exact match)
  { zip: '33304', city: 'Fort Lauderdale', county: 'Broward' },
  { zip: '33020', city: 'Hollywood', county: 'Broward' },
  { zip: '33021', city: 'Hollywood', county: 'Broward' },
  { zip: '33020', city: 'Hollywood', county: 'Broward' }, // DUPLICATE ZIP 2 (Exact match)
  { zip: '33060', city: 'Pompano Beach', county: 'Broward' },
  
  // Miami-Dade County
  { zip: '33101', city: 'Miami', county: 'Miami Dade' }, // Notice space in county name
  { zip: '33139', city: 'Miami Beach', county: 'Miami Dade' }, // Space in city & county
  { zip: '33139', city: 'Miami Beach', county: 'Miami-Dade' }, // DUPLICATE ZIP 3 (Same zip, slightly different spelling)
  { zip: '33145', city: 'Miami', county: 'Miami Dade' },
  { zip: '33101', city: 'Miami Downtown', county: 'Miami Dade' }, // DUPLICATE ZIP 4 (Same zip, different city name)
  { zip: '33010', city: 'Hialeah', county: 'Miami Dade' },

  // Hillsborough County
  { zip: '33602', city: 'Tampa', county: 'Hillsborough' },
  { zip: '33606', city: 'Tampa', county: 'Hillsborough' },
  { zip: '33607', city: 'Tampa', county: 'Hillsborough' },
  { zip: '33602', city: 'Tampa Bay', county: 'Hillsborough' }, // DUPLICATE ZIP 5 (Same zip, different city name)

  // Orange County
  { zip: '32801', city: 'Orlando', county: 'Orange' },
  { zip: '32803', city: 'Orlando', county: 'Orange' },
  { zip: '32806', city: 'Orlando', county: 'Orange' },

  // Duval County
  { zip: '32202', city: 'Jacksonville', county: 'Duval' },
  { zip: '32204', city: 'Jacksonville', county: 'Duval' }
];

// Helper function to slugify names (removes spaces, lowercases, handles hyphens)
function slugify(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Deduplicates and processes locations.
 * Automatically guarantees no raw spaces exist and every name is slugified.
 */
function processLocations(locations) {
  const processedZips = new Set();
  const uniqueLocations = [];
  const duplicatesLogged = [];

  for (const loc of locations) {
    const zip = String(loc.zip).trim();
    
    // Check for duplicate ZIP code
    if (processedZips.has(zip)) {
      duplicatesLogged.push(loc);
      continue;
    }
    processedZips.add(zip);

    // Slugify city and county names to remove raw spaces
    const cleanCity = slugify(loc.city);
    const cleanCounty = slugify(loc.county);
    const cleanState = 'florida'; // Fixed state

    uniqueLocations.push({
      zip,
      city: cleanCity,
      county: cleanCounty,
      state: cleanState,
      original: loc
    });
  }

  return { uniqueLocations, duplicatesLogged };
}

function main() {
  console.log(`=== Processing Florida Database Seeding ===`);
  console.log(`Total raw records in input: ${rawLocations.length}`);

  const { uniqueLocations, duplicatesLogged } = processLocations(rawLocations);

  console.log(`Successfully filtered out ${duplicatesLogged.length} duplicates.`);
  duplicatesLogged.forEach(dup => {
    console.log(` -> Ignored duplicate ZIP [${dup.zip}]: ${dup.city}, ${dup.county}`);
  });
  console.log(`Total unique records to seed: ${uniqueLocations.length}`);

  // Generate SQL insert statements
  let sqlStatements = [];
  
  // State insert (Florida)
  sqlStatements.push(`-- Seed State`);
  sqlStatements.push(`INSERT INTO public.states (name, slug) VALUES ('Florida', 'florida') ON CONFLICT (name) DO UPDATE SET slug = EXCLUDED.slug RETURNING id;`);
  
  // We'll write statements that resolve state_id, county_id, and city_id dynamically.
  // Using Common Table Expressions (CTEs) or simple subqueries is highly robust in single SQL script.
  sqlStatements.push(`\n-- Seed Counties, Cities, and Zips`);
  
  // For each unique location, generate SQL inserts with triggers handling the slugification automatically
  uniqueLocations.forEach(loc => {
    sqlStatements.push(`-- Processing ZIP ${loc.zip} (${loc.original.city}, ${loc.original.county})`);
    
    // 1. Insert county (referencing states table)
    sqlStatements.push(`
INSERT INTO public.counties (state_id, name, slug) 
VALUES (
    (SELECT id FROM public.states WHERE slug = 'florida'), 
    '${loc.original.county}', 
    '${loc.county}'
) 
ON CONFLICT (state_id, slug) DO UPDATE SET name = EXCLUDED.name;
    `.trim());

    // 2. Insert city (referencing counties table)
    sqlStatements.push(`
INSERT INTO public.cities (county_id, name, slug) 
VALUES (
    (SELECT id FROM public.counties WHERE slug = '${loc.county}' AND state_id = (SELECT id FROM public.states WHERE slug = 'florida')), 
    '${loc.original.city}', 
    '${loc.city}'
) 
ON CONFLICT (county_id, slug) DO UPDATE SET name = EXCLUDED.name;
    `.trim());

    // 3. Insert zip (referencing cities table)
    sqlStatements.push(`
INSERT INTO public.zips (zip_code, city_id) 
VALUES (
    '${loc.zip}', 
    (SELECT c.id FROM public.cities c 
     JOIN public.counties co ON c.county_id = co.id 
     WHERE c.slug = '${loc.city}' AND co.slug = '${loc.county}' AND co.state_id = (SELECT id FROM public.states WHERE slug = 'florida'))
) 
ON CONFLICT (zip_code) DO NOTHING;
    `.trim());
  });

  const sqlOutput = sqlStatements.join('\n\n');
  const sqlFilePath = path.join(__dirname, 'seed.sql');
  fs.writeFileSync(sqlFilePath, sqlOutput, 'utf8');
  console.log(`Generated SQL seed script saved to: ${sqlFilePath}`);

  // Generate output list of strict URL requirements
  console.log(`\n=== STRICT URL OUTPUT LIST ===`);
  const urlsList = uniqueLocations.map(loc => {
    // strict url format: .../city/florida/[county]/[city]/[zip]
    const url = `https://homeplumbingusa.com/city/florida/${loc.county}/${loc.city}/${loc.zip}`;
    console.log(url);
    return url;
  });

  // Save generated URLs list to a text file for verification
  const urlsFilePath = path.join(__dirname, 'generated-urls.txt');
  fs.writeFileSync(urlsFilePath, urlsList.join('\n'), 'utf8');
  console.log(`\nURL output list saved to: ${urlsFilePath}`);
}

main();
