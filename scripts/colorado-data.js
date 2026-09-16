const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://homeplumbingusa.com';
const ROOT_DIR = path.join(__dirname, '..');
const COLORADO_DIR = path.join(ROOT_DIR, 'colorado');

// Verified Lakewood ZIP Dataset from USGS / Census / USPS pipeline
const LAKEWOOD_ZIPS = [
  {
    zip: '80226',
    neighborhood: 'Central Lakewood & Belmar',
    county: 'Jefferson',
    lat: 39.71107,
    lng: -105.09142,
    population: 30930,
    elevation: '5,490 ft',
    soilType: 'expansive bentonite clay and Pierre shale',
    waterSource: 'Denver Water / Consolidated Mutual',
    notes: 'Core commercial & mixed-use municipal hub, Belmar shopping district.'
  },
  {
    zip: '80214',
    neighborhood: 'West Colfax & Northeast Lakewood',
    county: 'Jefferson',
    lat: 39.74214,
    lng: -105.0712,
    population: 24821,
    elevation: '5,380 ft',
    soilType: 'compact sandy clay loam with legacy urban fill',
    waterSource: 'Denver Water',
    notes: 'Historic post-war bungalows and mid-century cast iron infrastructure.'
  },
  {
    zip: '80215',
    neighborhood: 'Eiber & Morse Park',
    county: 'Jefferson',
    lat: 39.74409,
    lng: -105.11594,
    population: 17843,
    elevation: '5,420 ft',
    soilType: 'alluvial loam over expansive clay substrate',
    waterSource: 'Consolidated Mutual Water Company',
    notes: 'Large semi-rural lots with mature cottonwood tree root intrusions.'
  },
  {
    zip: '80227',
    neighborhood: 'South Lakewood & Bear Creek',
    county: 'Jefferson',
    lat: 39.66719,
    lng: -105.08948,
    population: 33667,
    elevation: '5,600 ft',
    soilType: 'Bear Creek alluvial sediments and swelling clay',
    waterSource: 'Denver Water / Bancroft-Clover Water District',
    notes: 'Riparian drainage corridor prone to spring snowmelt high water tables.'
  },
  {
    zip: '80228',
    neighborhood: 'Green Mountain & West Lakewood',
    county: 'Jefferson',
    lat: 39.68999,
    lng: -105.15679,
    population: 30138,
    elevation: '5,920 ft',
    soilType: 'steep foothill shale, gravelly outwash and high-shrink clay',
    waterSource: 'Green Mountain Water & Sanitation District',
    notes: 'Steep foothills topography, high winds, and severe winter frost penetration.'
  },
  {
    zip: '80232',
    neighborhood: 'Kendrick Lake & Lochwood',
    county: 'Jefferson',
    lat: 39.68853,
    lng: -105.09048,
    population: 21411,
    elevation: '5,550 ft',
    soilType: 'moderate to highly expansive clays',
    waterSource: 'Consolidated Mutual Water Company',
    notes: 'Established residential subdivisions from the 1960s-1970s.'
  },
  {
    zip: '80235',
    neighborhood: 'Bear Creek Lake & Morrison Border',
    county: 'Jefferson',
    lat: 39.6461,
    lng: -105.08993,
    population: 7571,
    elevation: '5,680 ft',
    soilType: 'creek basin gravels and shifting bentonite shale',
    waterSource: 'Denver Water / Local Sanitation Districts',
    notes: 'Recreational reservoir border with high seasonal runoff drainage.'
  },
  {
    zip: '80123',
    neighborhood: 'South Lakewood & Littleton Border',
    county: 'Jefferson',
    lat: 39.61583,
    lng: -105.06884,
    population: 44795,
    elevation: '5,400 ft',
    soilType: 'South Platte river terrace gravelly clay',
    waterSource: 'Denver Water / Platte Canyon Water',
    notes: 'Shared boundary community with older residential tracts.'
  },
  {
    zip: '80236',
    neighborhood: 'East Lakewood & Harvey Park Border',
    county: 'Denver',
    lat: 39.65162,
    lng: -105.03955,
    population: 16123,
    elevation: '5,350 ft',
    soilType: 'silty clay over sedimentary bedrock',
    waterSource: 'Denver Water',
    notes: 'Mid-century slab-on-grade homes with under-slab copper supply lines.'
  },
  {
    zip: '80401',
    neighborhood: 'West Lakewood & Golden Border',
    county: 'Jefferson',
    lat: 39.71643,
    lng: -105.23507,
    population: 39378,
    elevation: '5,800 ft',
    soilType: 'foothill colluvium and decomposed granite over shale',
    waterSource: 'Consolidated Mutual / Golden Municipal',
    notes: 'Foothills transition with steep grade and rocky terrain challenges.'
  }
];

const SERVICES = [
  {
    slug: 'drain-cleaning',
    name: 'Drain Cleaning',
    icon: 'fa-broom',
    costRange: '$149 – $485',
    duration: '1 – 2.5 Hours',
    warranty: '30–90 Day No-Clog Guarantee'
  },
  {
    slug: 'burst-pipe-repair',
    name: 'Burst Pipe Repair',
    icon: 'fa-water',
    costRange: '$350 – $1,250',
    duration: '2 – 5 Hours',
    warranty: 'Full Line Integrity Guarantee'
  },
  {
    slug: 'water-heater-repair',
    name: 'Water Heater Repair',
    icon: 'fa-temperature-high',
    costRange: '$220 – $1,750',
    duration: '1.5 – 4 Hours',
    warranty: '1-Year Parts & Labor Guarantee'
  },
  {
    slug: 'sewer-line-repair',
    name: 'Sewer Line Repair',
    icon: 'fa-screwdriver-wrench',
    costRange: '$1,350 – $4,800',
    duration: '1 – 2 Days',
    warranty: 'Up to 10-Year Pipe Guarantee'
  },
  {
    slug: 'emergency-plumbing',
    name: 'Emergency Plumbing',
    icon: 'fa-bolt',
    costRange: '$195 – $580',
    duration: '1 – 3 Hours',
    warranty: '100% Workmanship Warranty'
  },
  {
    slug: 'leak-detection',
    name: 'Leak Detection',
    icon: 'fa-magnifying-glass',
    costRange: '$180 – $450',
    duration: '1 – 2 Hours',
    warranty: 'Pinpoint Accuracy Guarantee'
  },
  {
    slug: 'gas-line-repair',
    name: 'Gas Line Repair',
    icon: 'fa-fire',
    costRange: '$260 – $980',
    duration: '2 – 4 Hours',
    warranty: 'Code-Compliant Safety Warranty'
  },
  {
    slug: 'water-line-repair',
    name: 'Water Line Repair',
    icon: 'fa-faucet-drip',
    costRange: '$750 – $3,400',
    duration: '4 – 8 Hours',
    warranty: 'Trenchless PEX/HDPE Guarantee'
  }
];

// Helper: Ensure directory
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Helper: slugify
function slugify(text) {
  if (!text) return '';
  return text.toLowerCase().replace(/[^a-z0-9\s-_]/g, '').trim().replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

console.log('Generating Colorado State & Lakewood Hubs and Service Pages...');
ensureDir(COLORADO_DIR);

module.exports = {
  LAKEWOOD_ZIPS,
  SERVICES,
  DOMAIN,
  COLORADO_DIR
};
