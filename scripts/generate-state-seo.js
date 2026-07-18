const fs = require('fs');
const path = require('path');

// Credentials (matching sync-db.js)
const SUPABASE_URL = 'https://rokjdhlqigfmfpbkaqlq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJva2pkaGxxaWdmbWZwYmthcWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5ODI2NzAsImV4cCI6MjA5ODU1ODY3MH0.x5n0OI8sVRafJYPlEGuysv8xGFnEOP8wRiuCevJgTzI';

const COLD_STATES = ['AK', 'OH', 'ME', 'NH', 'VT', 'MA', 'NY', 'PA', 'MI', 'WI', 'MN', 'ND', 'SD', 'MT', 'WY', 'ID', 'WA', 'CO', 'IL', 'IN', 'IA', 'NE'];
const HARD_WATER_STATES = ['TX', 'FL', 'AZ', 'NM', 'NV', 'CA', 'UT', 'OK', 'KS', 'CO'];

const SERVICES = [
  { slug: 'emergency-plumbing', name: 'Emergency Plumbing' },
  { slug: 'water-heater-repair', name: 'Water Heater Repair' },
  { slug: 'gas-line-repair', name: 'Gas Line Repair' },
  { slug: 'sewer-line-repair', name: 'Sewer Line Repair' },
  { slug: 'drain-cleaning', name: 'Drain Cleaning' },
  { slug: 'leak-detection', name: 'Leak Detection' },
  { slug: 'burst-pipe-repair', name: 'Burst Pipe Repair' },
  { slug: 'water-line-repair', name: 'Water Line Repair' }
];

const stateMap = {
  'ak': { code: 'AK', name: 'Alaska', rawTable: '"Alaska"' },
  'alaska': { code: 'AK', name: 'Alaska', rawTable: '"Alaska"' },
  'tx': { code: 'TX', name: 'Texas', rawTable: '"Texas"' },
  'texas': { code: 'TX', name: 'Texas', rawTable: '"Texas"' },
  'fl': { code: 'FL', name: 'Florida', rawTable: null },
  'florida': { code: 'FL', name: 'Florida', rawTable: null }
};

// Helper: capitalize words
function capitalize(str) {
  if (!str) return '';
  return str
    .split(/[- ]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

// Helper: slugify
function slugify(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Dynamic Component 1: 5-step workflow
function generateWorkflowSteps(serviceName, city, state) {
  const service = serviceName || 'Plumbing Service';
  return [
    {
      title: "Schedule Dispatch",
      description: `Contact our ${city} dispatch team to schedule a certified technician for your ${service.toLowerCase()} needs.`
    },
    {
      title: "On-Site Assessment",
      description: `Our local ${state} plumber performs a physical inspection of your plumbing systems in ${city}.`
    },
    {
      title: "Upfront Diagnostic Quote",
      description: `You receive a flat-rate written quote for the ${service.toLowerCase()} work before any physical repairs begin.`
    },
    {
      title: "Precision Execution",
      description: `We complete the plumbing repairs or installations using high-grade materials and professional tools.`
    },
    {
      title: "Diagnostic Verification & Flow-Check QA",
      description: `We conduct hydrostatic pressure testing and code compliance verification to guarantee a leak-free system in ${city}.`
    }
  ];
}

// Dynamic Component 2: 12-15 rich FAQs
function generateLocalizedFAQs(serviceName, city, state, zip) {
  const service = serviceName || 'Plumbing Service';
  const isCold = COLD_STATES.includes(state.toUpperCase());
  const isHardWater = HARD_WATER_STATES.includes(state.toUpperCase());
  
  const faqs = [];
  
  faqs.push({
    question: `Is 24/7 emergency ${service.toLowerCase()} available in ${city}?`,
    answer: `Yes! Our dispatch network operates 24 hours a day, 7 days a week, including weekends and holidays. We can connect you with an emergency plumber in ${city} immediately to resolve urgent leaks, backups, or system failures.`
  });
  
  faqs.push({
    question: `How quickly can a plumber arrive at my property in ${city} ${zip}?`,
    answer: `On average, emergency plumbers in our network can arrive at your address in ${city} (${zip}) within 45 minutes. Response times may vary slightly depending on road conditions and current call volume, but we always dispatch the closest available specialist.`
  });
  
  faqs.push({
    question: `Are the technicians licensed and insured in ${state}?`,
    answer: `Absolutely. Every plumber matched through our system holds active state-level licensing and comprehensive liability insurance. This guarantees that your ${service.toLowerCase()} will be handled safely, professionally, and in complete compliance with ${state} building codes.`
  });
  
  faqs.push({
    question: `Do you charge by the hour or provide flat-rate pricing?`,
    answer: `We provide transparent flat-rate written estimates before any physical repairs begin. The technician will inspect the issue in person at your ${city} property and present your options, ensuring there are no surprise charges or hidden fees.`
  });
  
  if (isCold) {
    faqs.push({
      question: `How do I prevent my plumbing lines from freezing during sub-zero temperatures in ${city}?`,
      answer: `To protect your pipes in ${city}'s cold weather, let faucets drip slowly during freezes, open under-sink cabinets to circulate heat, and wrap exposed pipes in crawl spaces with foam insulation. If a pipe freezes, shut off the main water valve immediately to prevent burst water lines.`
    });
  } else if (isHardWater) {
    faqs.push({
      question: `Does ${city} have hard water, and does it affect my plumbing?`,
      answer: `Yes, many parts of ${state} have high concentrations of calcium and magnesium minerals, resulting in hard water. Over time, this leads to scale scaling in your water lines, clogging faucets, and shortening the lifespan of your water heater and appliances.`
    });
  } else {
    faqs.push({
      question: `What are the most common plumbing problems in ${city}?`,
      answer: `The most common plumbing issues in the ${city} area include clogged kitchen or bathroom drains, leaking fixtures, water heater deterioration, and sewer line intrusions. Our local plumbers carry full inventories on their trucks to resolve these issues in a single visit.`
    });
  }
  
  if (isCold) {
    faqs.push({
      question: `Do you offer professional plumbing winterization services in ${city}?`,
      answer: `Yes, we offer complete winterization for seasonal properties and vacant homes in ${city}. We drain all water lines, blow out pipe residuals, add non-toxic antifreeze to drain traps, and secure the main supply valve to protect your home while vacant.`
    });
  } else if (isHardWater) {
    faqs.push({
      question: `How can I protect my water heater and fixtures from hard water damage in ${city}?`,
      answer: `Installing a whole-house water softener is the best defense against hard water scale in ${city}. It neutralizes hard minerals before they enter your plumbing system, extending the life of your water heater, preserving water pressure, and preventing faucet spots.`
    });
  } else {
    faqs.push({
      question: `How can I maintain healthy water pressure throughout my home?`,
      answer: `We recommend regular pressure regulator checks and descaling your fixtures. If you notice a sudden drop in pressure in ${city}, it could indicate a hidden slab leak or water line rupture, which should be inspected immediately.`
    });
  }
  
  faqs.push({
    question: `Is there a warranty or guarantee on the ${service.toLowerCase()} work?`,
    answer: `Yes! All ${service.toLowerCase()} repairs are backed by a workmanship guarantee from the matching plumbing provider. Replaced parts, fixtures, and appliances are also covered by their respective manufacturer warranties.`
  });
  
  faqs.push({
    question: `What should I do immediately if I find a water leak?`,
    answer: `Locate your main water shutoff valve (usually found near the water meter or street connection) and turn it completely clockwise. This cuts off the supply and stops active water damage at your ${city} home while you call us for emergency dispatch.`
  });
  
  faqs.push({
    question: `Is high-pressure hydro-jetting safe for older pipes in ${city}?`,
    answer: `Yes. Our plumbers conduct a fiber-optic sewer camera inspection first to check the pipe structure. If the sewer line is structurally sound, hydro-jetting is the safest, most effective way to clear grease, sludge, and tree roots.`
  });
  
  faqs.push({
    question: `How do you ensure plumbing installations comply with ${state} building codes?`,
    answer: `Our network plumbers are fully versed in local building codes and the ${state} Plumbing Code. We ensure correct slope, venting, and material selection for all installations in ${city}, passing any municipal inspections.`
  });
  
  faqs.push({
    question: `Do you offer commercial ${service.toLowerCase()} services in ${city}?`,
    answer: `Yes, we match businesses in ${city} with commercial plumbing specialists. We handle retail, restaurant, office, and multi-family plumbing systems, prioritizing minimal downtime and code-compliant installations.`
  });
  
  faqs.push({
    question: `How often should I have my water heater serviced in ${city}?`,
    answer: `We recommend professional water heater service at least once a year in ${city} (${zip}). Servicing includes flushing the tank to remove sediment buildup, testing the relief valve, and checking the anode rod to prevent tank rust.`
  });
  
  faqs.push({
    question: `What tools do technicians use to find hidden leaks in ${city}?`,
    answer: `Technicians in ${city} utilize state-of-the-art non-invasive tools such as electronic ground microphones, tracer gas sniffers, and thermal imaging cameras. This allows us to locate hidden pipe leaks under concrete slabs or inside walls without tearing up your property.`
  });
  
  faqs.push({
    question: `How can I prevent water damage from plumbing failures?`,
    answer: `Installing smart water leak detectors near water heaters, washing machines, and under sinks is highly recommended. These systems alert you on your phone and can even trigger automatic shutoff valves if a leak is detected in your ${city} home.`
  });
  
  faqs.push({
    question: `What should I avoid putting down my garbage disposal?`,
    answer: `To prevent clogs and disposal motor burnout in ${city}, never put coffee grounds, eggshells, potato peels, grease, oils, or fibrous vegetables down the drain. Always run cold water while operating the disposal to help flush particles.`
  });
  
  return faqs;
}

// Dynamic Component 3: 8-service grid data
function generateServiceGridData(city, state) {
  return [
    {
      service_slug: 'emergency-plumbing',
      service_name: 'Emergency Plumbing',
      description: `Emergency plumbing issues require immediate action to prevent severe property damage. Our certified dispatch team in ${city} is active 24/7, arriving with high-capacity utility pumps and emergency pipe clamps to secure your home.`
    },
    {
      service_slug: 'water-heater-repair',
      service_name: 'Water Heater Repair',
      description: `Restore your hot water supply quickly with our professional water heater repair services in ${city}. Our experienced technicians use digital multimeters and tank flushing hoses to diagnose heating element failures and clear out sediment buildup.`
    },
    {
      service_slug: 'gas-line-repair',
      service_name: 'Gas Line Repair',
      description: `Gas line issues present serious safety hazards that demand certified expertise. In ${city}, we resolve gas leaks quickly using electronic gas sniffers and professional iron pipe threaders to ensure a 100% airtight seal.`
    },
    {
      service_slug: 'sewer-line-repair',
      service_name: 'Sewer Line Repair',
      description: `Sewer backups require advanced diagnostic and repair equipment. We inspect your main sewer line in ${city} using fiber-optic sewer cameras and perform repairs with heavy-duty pipe excavators to restore proper flow.`
    },
    {
      service_slug: 'drain-cleaning',
      service_name: 'Drain Cleaning',
      description: `Clear out stubborn blockages and grease buildup from your drains. Our local plumbers in ${city} utilize high-velocity hydro-jetters and mechanical snakes to scrub pipe walls clean without using harsh chemicals.`
    },
    {
      service_slug: 'leak-detection',
      service_name: 'Leak Detection',
      description: `Locate hidden water leaks behind walls or under concrete slabs before they cause structural damage. We pinpoint the exact leak location in ${city} using acoustic listening devices and infrared thermal imaging cameras.`
    },
    {
      service_slug: 'burst-pipe-repair',
      service_name: 'Burst Pipe Repair',
      description: `A burst pipe can flood a home in minutes, especially during extreme weather events. We replace split lines in ${city} using copper pipe cutters and PEX crimping tools to execute a durable, leak-free connection.`
    },
    {
      service_slug: 'water-line-repair',
      service_name: 'Water Line Repair',
      description: `Fix low water pressure or discolored water caused by deteriorated supply lines. Our technicians in ${city} deploy underground pipe locators and trenchless pipe pullers to repair water lines with minimal yard disruption.`
    }
  ];
}

// Enriched paragraphs for service pages
function generateParagraphs(serviceSlug, city, state, zip) {
  const serviceNames = {
    'emergency-plumbing': 'Emergency Plumbing',
    'water-heater-repair': 'Water Heater Repair',
    'gas-line-repair': 'Gas Line Repair',
    'sewer-line-repair': 'Sewer Line Repair',
    'drain-cleaning': 'Drain Cleaning',
    'leak-detection': 'Leak Detection',
    'burst-pipe-repair': 'Burst Pipe Repair',
    'water-line-repair': 'Water Line Repair'
  };
  const serviceName = serviceNames[serviceSlug] || 'Plumbing Service';

  let intro = `Home Plumbing USA provides licensed ${serviceName.toLowerCase()} throughout ${city}, ${state} ${zip}, with a mobile team dispatched directly to your location.`;
  let problem = '';
  let technique = '';

  switch (serviceSlug) {
    case 'emergency-plumbing':
      problem = `A common reason ${city} residents call for emergency plumbing is a sudden pipe failure or sewer backup flooding their property.`;
      technique = `Our approach involves rapid dispatch, immediate water shut-off, leak isolation, and executing code-compliant repairs to restore safety.`;
      break;
    case 'water-heater-repair':
      problem = `Homeowners in ${city} often experience water heater issues like no hot water, discolored water, or structural leaks from the tank.`;
      technique = `Our technicians perform diagnostic checks on thermostats and heating elements, flush sediment buildup, and replace worn anode rods.`;
      break;
    case 'gas-line-repair':
      problem = `Gas line leaks or low pressure can disrupt your home appliances and pose severe health hazards to families in ${city}.`;
      technique = `We perform system pressure tests, use electronic gas sniffers to pinpoint leaks, and run durable fresh gas lines to restore safe service.`;
      break;
    case 'sewer-line-repair':
      problem = `Main sewer line backups lead to unsanitary conditions and multiple clogged drains throughout homes in ${city}.`;
      technique = `We utilize high-resolution sewer cameras to inspect line integrity and perform targeted excavations or repairs to remove root intrusions.`;
      break;
    case 'drain-cleaning':
      problem = `Slow drains and recurring clogs in sinks or tubs are a frequent headache for residents in ${city}.`;
      technique = `We clear lines using mechanical drain snakes and high-pressure hydro-jetters, scrubbing the pipe walls clean without damage.`;
      break;
    case 'leak-detection':
      problem = `Hidden slab leaks and pinhole pipe breaches behind walls can silently damage foundations and drive up water bills in ${city}.`;
      technique = `Our team uses advanced acoustic listening sensors and thermal imaging cameras to pinpoint leaks without demolition.`;
      break;
    case 'burst-pipe-repair':
      problem = `Frozen or corroded pipes can rupture suddenly, causing extensive water damage and disruption to your home in ${city}.`;
      technique = `We locate the burst section, cut away the damaged line, and install durable copper or flexible PEX pipe connections.`;
      break;
    case 'water-line-repair':
      problem = `Deteriorated main water lines in ${city} cause drop in water pressure, rusty tap water, or soggy spots in lawns.`;
      technique = `We trace the water supply line using electronic locators and perform trenchless pipe replacements to minimize yard damage.`;
      break;
    default:
      problem = `Plumbing issues in ${city} can cause significant property damage and disrupt daily routines if left unaddressed.`;
      technique = `We utilize state-of-the-art tools and code-compliant materials to diagnose, repair, and test the affected plumbing system.`;
  }

  return { intro, problem, technique };
}

// Dynamic Component 4: Rich nearby areas
function resolveNearbyAreas(loc, allUniqueLocations) {
  let nearbyList = [];
  
  if (loc.nearbyRaw && loc.nearbyRaw.length > 0) {
    for (const item of loc.nearbyRaw) {
      const matched = allUniqueLocations.find(l => l.zip === item.zip);
      if (matched) {
        nearbyList.push(matched);
      } else {
        const slugCity = slugify(item.city || loc.city);
        nearbyList.push({
          zip: item.zip,
          city: item.city || loc.city,
          state: loc.state,
          folderName: `${loc.state.toLowerCase()}-${slugCity}-${item.zip}`
        });
      }
    }
  } else {
    // Dynamic fallback based on numeric distance in ZIP code
    const zipNum = parseInt(loc.zip, 10);
    if (!isNaN(zipNum)) {
      const candidates = allUniqueLocations
        .filter(l => l.zip !== loc.zip)
        .map(l => ({
          loc: l,
          distance: Math.abs(parseInt(l.zip, 10) - zipNum)
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10);
        
      nearbyList = candidates.map(c => c.loc);
    }
  }

  return nearbyList.map(n => {
    const cleanCity = capitalize(n.city);
    return {
      zip: n.zip,
      city: cleanCity,
      state: n.state,
      slug: n.folderName,
      url: `/service-areas/${n.folderName}/`,
      badge: `${cleanCity} District`,
      description: `Emergency plumber dispatch and comprehensive plumbing services available in ${cleanCity}, ${n.state} ${n.zip}.`
    };
  });
}

function processLocations(locations, stateCode) {
  const processedZips = new Set();
  const uniqueLocations = [];

  for (const loc of locations) {
    const zip = String(loc.zip).trim();
    if (!zip || processedZips.has(zip)) {
      continue;
    }
    processedZips.add(zip);

    const cleanCity = slugify(loc.city);
    const folderName = `${stateCode.toLowerCase()}-${cleanCity}-${zip}`;

    uniqueLocations.push({
      zip,
      city: loc.city,
      state: stateCode,
      folderName,
      nearbyRaw: loc.nearby || []
    });
  }

  return uniqueLocations;
}

function parseRawTableData(data, stateCode) {
  return data.map(row => {
    const zip = String(row['Target Zip'] || row['target_zip'] || '').trim();
    const city = String(row['City'] || row['city'] || '').trim();
    const state = String(row['State'] || row['state'] || stateCode).trim().toUpperCase();
    
    const nearby = [];
    for (let i = 1; i <= 10; i++) {
      const area = row[`Areas we serve ${i}`] || row[`area_${i}`];
      if (area && String(area).trim() !== '') {
        const parts = String(area).split(',');
        const areaCity = parts[0].trim();
        const areaZip = parts[1] ? parts[1].trim() : '';
        if (areaZip) {
          nearby.push({ city: areaCity, zip: areaZip });
        } else {
          const zipMatch = areaCity.match(/\d+/);
          if (zipMatch) {
            nearby.push({ city: '', zip: zipMatch[0] });
          }
        }
      }
    }
    
    return { zip, city, state, nearby };
  });
}

async function fetchRawData(stateObj) {
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`
  };
  
  if (stateObj.rawTable) {
    console.log(`Checking raw table: ${stateObj.rawTable}`);
    const tableName = stateObj.rawTable.replace(/"/g, '');
    let allData = [];
    let offset = 0;
    const limit = 1000;
    let hasMore = true;

    while (hasMore) {
      console.log(`Fetching raw table ${tableName} rows ${offset} to ${offset + limit}...`);
      const url = `${SUPABASE_URL}/rest/v1/${tableName}?select=*&limit=${limit}&offset=${offset}`;
      const res = await fetch(url, { headers });
      if (!res.ok) {
        console.warn(`Could not fetch from ${tableName}: ${res.statusText}`);
        break;
      }
      const data = await res.json();
      allData = allData.concat(data);
      if (data.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    if (allData.length > 0) {
      console.log(`Fetched ${allData.length} records from raw table ${tableName}`);
      return parseRawTableData(allData, stateObj.code);
    }
  }

  // Fallback to seo_pages (FL case)
  console.log(`Checking seo_pages for state ${stateObj.code}...`);
  const seoPagesUrl = `${SUPABASE_URL}/rest/v1/seo_pages?select=zip,city,state,folder_name,url_path&state=eq.${stateObj.code}`;
  const resSeo = await fetch(seoPagesUrl, { headers });
  if (resSeo.ok) {
    const data = await resSeo.json();
    if (data && data.length > 0) {
      console.log(`Fetched ${data.length} existing records from seo_pages for ${stateObj.code}`);
      return data.map(row => ({
        zip: row.zip,
        city: row.city,
        state: row.state,
        nearby: []
      }));
    }
  }

  // Fallback to standard tables
  console.log(`Checking standard database tables for state ${stateObj.name}...`);
  const standardUrl = `${SUPABASE_URL}/rest/v1/zips?select=zip_code,cities(name,slug,counties(name,slug,states(name,slug)))&cities.counties.states.slug=eq.${stateObj.name.toLowerCase()}`;
  const resStd = await fetch(standardUrl, { headers });
  if (resStd.ok) {
    const data = await resStd.json();
    if (data && data.length > 0) {
      console.log(`Fetched ${data.length} records from standard tables`);
      const records = [];
      for (const item of data) {
        if (item.cities && item.cities.counties && item.cities.counties.states) {
          records.push({
            zip: item.zip_code,
            city: item.cities.name,
            state: stateObj.code,
            nearby: []
          });
        }
      }
      return records;
    }
  }

  console.error(`No raw data found for state ${stateObj.code}`);
  process.exit(1);
}

async function upsertData(tableName, records, conflictColumns) {
  const url = `${SUPABASE_URL}/rest/v1/${tableName}?on_conflict=${conflictColumns}`;
  
  // Decrease chunk size to 100 to prevent database statement timeouts
  const chunkSize = 100;
  
  for (let i = 0; i < records.length; i += chunkSize) {
    const chunk = records.slice(i, i + chunkSize);
    console.log(`Upserting batch of ${chunk.length} records into ${tableName}...`);
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(chunk)
    });
    
    if (!res.ok) {
      const errMsg = await res.text();
      console.error(`Failed to upsert batch: ${res.statusText} (${res.status}) - ${errMsg}`);
      process.exit(1);
    }
  }
  console.log(`Successfully completed all upserts for ${tableName}.`);
}

async function main() {
  const args = process.argv.slice(2);
  let stateArg = '';
  args.forEach(arg => {
    if (arg.startsWith('--state=')) {
      stateArg = arg.split('=')[1];
    }
  });

  if (!stateArg) {
    console.error('Error: Please specify state using --state=<StateCode/Name> (e.g., --state=TX or --state=Texas)');
    process.exit(1);
  }

  const key = stateArg.toLowerCase();
  const stateObj = stateMap[key];

  if (!stateObj) {
    console.log(`State '${stateArg}' not in predefined map. Treating as dynamic state...`);
    // Create a dynamic state object
    const code = stateArg.toUpperCase();
    const name = capitalize(stateArg);
    stateObj = { code, name, rawTable: `"${name}"` };
  }

  console.log(`Starting ingestion & generation pipeline for state: ${stateObj.name} (${stateObj.code})`);

  // 1. Fetch raw data
  const rawData = await fetchRawData(stateObj);
  console.log(`Processing ${rawData.length} locations...`);

  // 2. Normalize and Deduplicate locations
  const locations = processLocations(rawData, stateObj.code);
  console.log(`Deduplicated to ${locations.length} unique locations.`);

  // 3. Generate pages content
  const seoPages = [];
  const serviceAreaPages = [];

  locations.forEach(loc => {
    const cleanCity = capitalize(loc.city);
    const stateName = stateObj.name;
    
    // Resolve rich nearby areas
    const richNearbyAreas = resolveNearbyAreas(loc, locations);
    
    // a. Generate seo_pages record
    const faqs = generateLocalizedFAQs('Plumbing Services', cleanCity, loc.state, loc.zip);
    const serviceGrid = generateServiceGridData(cleanCity, loc.state);
    
    seoPages.push({
      zip: loc.zip,
      city: cleanCity,
      state: loc.state,
      folder_name: loc.folderName,
      url_path: `/service-areas/${loc.folderName}`,
      title_tag: `Plumber in ${cleanCity}, ${loc.state} ${loc.zip} | 24/7 Plumbing Services`,
      meta_description: `Looking for a reliable plumber in ${cleanCity}, ${loc.state} (${loc.zip})? We offer 24/7 emergency plumbing, drain cleaning, water heater repair & more. Call today!`,
      h1: `Plumbing Services in ${cleanCity}, ${loc.state} (${loc.zip})`,
      intro_paragraph: `When you need fast, reliable plumbing services in ${cleanCity}, ${stateName} (${loc.zip}), our team of experienced professionals is here to help 24/7. Whether you are dealing with an emergency leak, a clogged drain, or need a routine water heater installation, we provide top-rated service tailored to local residents and businesses.`,
      service_spotlight: `Premium Plumbing handles the full range of residential and commercial plumbing needs in ${cleanCity}, ${loc.zip} — from urgent calls to routine maintenance.`,
      nearby_areas: richNearbyAreas,
      all_areas_served: null,
      faqs: faqs,
      service_grid: serviceGrid
    });

    // b. Generate 8 service area pages records
    SERVICES.forEach(service => {
      const zipFolderName = loc.folderName;
      const serviceFolderName = `${zipFolderName}/${service.slug}`;
      const urlPath = `/service-areas/${zipFolderName}/${service.slug}/`;
      
      const workflowSteps = generateWorkflowSteps(service.name, cleanCity, loc.state);
      const serviceFAQs = generateLocalizedFAQs(service.name, cleanCity, loc.state, loc.zip);
      
      const paragraphs = generateParagraphs(service.slug, cleanCity, loc.state, loc.zip);
      
      const otherServices = SERVICES
        .filter(s => s.slug !== service.slug)
        .map(s => ({
          service_slug: s.slug,
          service_name: s.name,
          url: `/service-areas/${zipFolderName}/${s.slug}/`
        }));

      serviceAreaPages.push({
        service_slug: service.slug,
        service_name: service.name,
        zip: loc.zip,
        city: cleanCity,
        state: loc.state,
        zip_folder_name: zipFolderName,
        folder_name: serviceFolderName,
        url_path: urlPath,
        title_tag: `${service.name} in ${cleanCity}, ${loc.state} ${loc.zip} | Home Plumbing USA`,
        meta_description: `Home Plumbing USA provides ${service.name.toLowerCase()} in ${cleanCity}, ${loc.state} ${loc.zip}. Licensed, insured, and available for same-day service. Call 877-516-8705.`,
        h1: `${service.name} in ${cleanCity}, ${loc.state} ${loc.zip}`,
        intro_paragraph: paragraphs.intro,
        problem_paragraph: paragraphs.problem,
        technique_paragraph: paragraphs.technique,
        workflow_steps: workflowSteps,
        faqs: serviceFAQs,
        other_services: otherServices,
        nearby_areas: richNearbyAreas
      });
    });
  });

  console.log(`Generated ${seoPages.length} seo_pages records.`);
  console.log(`Generated ${serviceAreaPages.length} service_area_pages records.`);

  // 4. Perform idempotent upserts
  console.log(`Writing seo_pages...`);
  await upsertData('seo_pages', seoPages, 'zip');
  
  console.log(`Writing service_area_pages...`);
  await upsertData('service_area_pages', serviceAreaPages, 'service_slug,zip');

  console.log(`Pipeline completed successfully for state: ${stateObj.name}`);
}

main().catch(err => {
  console.error('Unhandled pipeline execution error:', err);
  process.exit(1);
});
