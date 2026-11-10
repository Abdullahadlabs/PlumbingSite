const fs = require('fs');
const path = require('path');
const { LAKEWOOD_ZIPS, SERVICES, DOMAIN, COLORADO_DIR, ensureDir } = require('./colorado-data');
const { renderServicePage } = require('./template-service-page');

function generateServicePage(zipObj, serviceObj) {
  const cityZipSlug = `lakewood-${zipObj.zip}`;
  const serviceDir = path.join(COLORADO_DIR, cityZipSlug, serviceObj.slug);
  ensureDir(serviceDir);

  const nearbyAreas = LAKEWOOD_ZIPS
    .filter(z => z.zip !== zipObj.zip)
    .map(z => ({
      city: 'Lakewood',
      zip: z.zip,
      slug: `lakewood-${z.zip}`
    }));

  const isPilotedLakewoodDrain = (serviceObj.slug === 'drain-cleaning' && zipObj.zip === '80226');

  const params = {
    cityName: 'Lakewood',
    zip: zipObj.zip,
    stateCode: 'CO',
    stateName: 'Colorado',
    stateSlug: 'colorado',
    serviceSlug: serviceObj.slug,
    serviceName: serviceObj.name,
    serviceObj: serviceObj,
    lat: zipObj.lat,
    lng: zipObj.lng,
    nearbyAreas: nearbyAreas
  };

  if (isPilotedLakewoodDrain) {
    params.heroParagraph = `Clearing stubborn clogs, main sewer line backups, and persistent blockages across Lakewood (80226) and nearby Front Range communities. Our licensed Colorado plumbers arrive fully equipped with advanced hydro-jetters and motorized rooters for prompt, 24/7 service.`;
    params.p1 = `Dealing with plumbing system malfunctions or planning a preventative line cleanout with professional drain cleaning at your Lakewood property requires expert attention. We begin every job with a comprehensive diagnostic check, using advanced color sewer cameras to inspect your lines and locate the exact source of the problem—whether hardened grease, scale accumulation, or invasive tree root mats. This thorough inspection allows us to provide a highly accurate, flat-rate estimate before any physical work begins.`;
    params.p2 = `We take pride in maintaining a clean work zone and respecting your property throughout the entire service process. Depending on pipe age and material, our plumbers deploy commercial-grade motorized augers or 4,000 PSI hydro-jetting systems to scrub lines spotless without damaging aging pipes. We leave your work area completely clean and ensure your plumbing system is fully code-compliant with Colorado regulations.`;
    params.scopeBullets = [
      `Full structural system diagnostic inspects cleanout ports and junctions.`,
      `High-velocity hydro-jetting and motorized snaking for stubborn clogs.`,
      `Post-clearing hydrostatic flow check and camera inspection to confirm 100% line restoration.`
    ];
    params.benefits = [
      {
        title: '1. Flow & Efficiency',
        desc: `<strong>Restored Flow & Pressure:</strong> Eliminates stubborn grease, hair, and scale restrictions to ensure optimal gravity drainage throughout your property.`
      },
      {
        title: '2. Prevent Backups',
        desc: `<strong>Proactive Protection:</strong> Clears advancing tree roots and mineral buildup before they cause catastrophic sewer line backups into your home.`
      },
      {
        title: '3. Long-Term Value',
        desc: `<strong>Extended Pipe Lifespan:</strong> High-pressure water scouring cleans interior pipe walls thoroughly without harmful corrosive chemicals.`
      }
    ];
    params.warningTitle = `Emergency Warning Signs in Lakewood`;
    params.warningDesc = `If you notice water backing up in tubs when flushing the toilet, gurgling sounds from floor drains, or unpleasant sewer odors in your home, shut off your main water line and contact our emergency dispatch team immediately.`;
  } else {
    params.heroParagraph = `Professional ${serviceObj.name.toLowerCase()} in ${zipObj.neighborhood}, Lakewood CO (${zipObj.zip}). Operating at ${zipObj.elevation} elevation, our vetted network plumbers arrive fully equipped for 24/7 emergency dispatch and routine maintenance.`;
    params.p1 = `Property owners across ${zipObj.neighborhood} in Lakewood (${zipObj.zip}) encounter unique plumbing demands related to Front Range freeze cycles and local elevation (${zipObj.elevation}). When you need reliable ${serviceObj.name.toLowerCase()}, our network connects you immediately with licensed Colorado professionals equipped with industrial-grade diagnostic tools.`;
    params.warningTitle = `Emergency Warning Signs in ${zipObj.neighborhood}`;
    params.warningDesc = `If you experience sudden pressure loss, gurgling fixtures, sewage odor, or moisture near foundation walls in ${zipObj.neighborhood} (${zipObj.zip}), turn off your main water valve and call our 24/7 dispatch hotline immediately.`;
  }

  const html = renderServicePage(params);
  fs.writeFileSync(path.join(serviceDir, 'index.html'), html, 'utf8');
}

module.exports = {
  generateServicePage
};
