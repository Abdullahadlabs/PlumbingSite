const fs = require('fs');
const path = require('path');
const { renderServicePage, DEFAULT_SERVICES } = require('./template-service-page');

const DOMAIN = 'https://homeplumbingusa.com';
const ROOT_DIR = path.join(__dirname, '..');
const TEXAS_DIR = path.join(ROOT_DIR, 'texas');
const seoPagesPath = path.join(ROOT_DIR, 'database', 'seo-pages.json');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

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

const SERVICES = DEFAULT_SERVICES;

function buildServicePage(loc, service, nearbyList) {
  const cityName = loc.city;
  const zip = loc.zip;
  const nearbyAreas = (nearbyList || []).map(nb => ({
    city: nb.city,
    zip: nb.zip,
    slug: `${slugify(nb.city)}-${nb.zip}`
  }));

  const heroParagraph = `In ${cityName} (${zip}), expansive clay soils and sudden winter freeze-thaw cycles place severe stress on underground sewer lines and foundation slab pipes. Our dispatch network connects you directly with on-call independent licensed Texas plumbing contractors 24/7/365.`;
  const warningTitle = `Emergency Warning Signs in ${cityName}`;
  const warningDesc = `Due to cyclical clay soil heave and foundation movement across Texas, warm spots on flooring, sudden drops in household water pressure, or sewer backups in ${cityName} (${zip}) require immediate shutoff and professional inspection.`;

  return renderServicePage({
    cityName,
    zip,
    stateCode: 'TX',
    stateName: 'Texas',
    stateSlug: 'texas',
    serviceSlug: service.slug,
    serviceName: service.name,
    serviceObj: service,
    lat: loc.latitude,
    lng: loc.longitude,
    heroParagraph,
    warningTitle,
    warningDesc,
    nearbyAreas
  });
}

function main() {
  const args = process.argv.slice(2);
  const targetCityZip = args.find(a => a.startsWith('--city='))?.split('=')[1];
  const targetService = args.find(a => a.startsWith('--service='))?.split('=')[1];
  const limitArg = args.find(a => a.startsWith('--limit='))?.split('=')[1];
  const limit = limitArg ? parseInt(limitArg, 10) : null;

  console.log('=== Starting Texas Service Pages Generator Pipeline ===');
  console.log('Loading database/seo-pages.json...');
  const seoData = JSON.parse(fs.readFileSync(seoPagesPath, 'utf8'));
  let txLocations = seoData.filter(d => d.state === 'TX');

  console.log(`Found ${txLocations.length} Texas locations in database.`);

  if (targetCityZip) {
    txLocations = txLocations.filter(loc => {
      const slug = `${slugify(loc.city)}-${loc.zip}`;
      return slug.toLowerCase().includes(targetCityZip.toLowerCase()) || loc.zip === targetCityZip;
    });
    console.log(`Filtered to ${txLocations.length} locations matching "${targetCityZip}".`);
  }

  if (limit && txLocations.length > limit) {
    txLocations = txLocations.slice(0, limit);
    console.log(`Limited execution to ${limit} locations.`);
  }

  const activeServices = targetService 
    ? SERVICES.filter(s => s.slug === targetService)
    : SERVICES;

  console.log(`Generating ${activeServices.length} services for ${txLocations.length} locations (Total ${activeServices.length * txLocations.length} pages)...`);

  let totalGenerated = 0;
  const startTime = Date.now();

  txLocations.forEach((loc, index) => {
    const cityZipSlug = `${slugify(loc.city)}-${loc.zip}`;
    const cityZipDir = path.join(TEXAS_DIR, cityZipSlug);
    ensureDir(cityZipDir);

    const nearbyList = loc.nearby_areas || [];

    activeServices.forEach(service => {
      const serviceDir = path.join(cityZipDir, service.slug);
      ensureDir(serviceDir);

      const html = buildServicePage(loc, service, nearbyList);
      fs.writeFileSync(path.join(serviceDir, 'index.html'), html, 'utf8');
      totalGenerated++;
    });

    if ((index + 1) % 250 === 0 || index + 1 === txLocations.length) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`  Processed ${index + 1}/${txLocations.length} locations (${totalGenerated} pages generated in ${elapsed}s)...`);
    }
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n======================================================');
  console.log(`Texas Service Pipeline Completed in ${duration}s!`);
  console.log(`Total Pages Generated: ${totalGenerated}`);
  console.log('======================================================');
}

if (require.main === module) {
  main();
}

module.exports = {
  buildServicePage,
  SERVICES
};
