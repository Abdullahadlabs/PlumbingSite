/**
 * scripts/template-service-page.js
 * =====================================================================
 * Standardized High-Converting Service Page Template for Home Plumbing USA
 * Follows the approved reference page structure with rich aesthetics,
 * 24/7 Live Dispatch Board, Trust Badges, Service Scope, 4-Step Process,
 * Why Trust Us, Service Map, Interactive FAQ Accordion, and Schema.org JSON-LD.
 * =====================================================================
 */

const DOMAIN = 'https://homeplumbingusa.com';
const PHONE = '888-217-4803';
const PHONE_DISPLAY = '(888) 217-4803';

const DEFAULT_SERVICES = [
  { slug: 'drain-cleaning', name: 'Drain Cleaning', icon: 'fa-broom' },
  { slug: 'burst-pipe-repair', name: 'Burst Pipe Repair', icon: 'fa-water' },
  { slug: 'water-heater-repair', name: 'Water Heater Repair', icon: 'fa-temperature-high' },
  { slug: 'sewer-line-repair', name: 'Sewer Line Repair', icon: 'fa-screwdriver-wrench' },
  { slug: 'emergency-plumbing', name: 'Emergency Plumbing', icon: 'fa-bolt' },
  { slug: 'leak-detection', name: 'Leak Detection', icon: 'fa-magnifying-glass' },
  { slug: 'gas-line-repair', name: 'Gas Line Repair', icon: 'fa-fire' },
  { slug: 'water-line-repair', name: 'Water Line Repair', icon: 'fa-faucet-drip' }
];

const SERVICE_CONTENT = {
  'drain-cleaning': {
    heroParagraph: (c, s, z) => `Clearing persistent clogs, hardened grease buildup, and heavy mineral scale from residential and commercial drains across ${c}, ${s} (${z}). Licensed local plumbers equipped with high-velocity hydro-jetters and mechanized drain snakes are on standby 24/7.`,
    p1: (c, s, sn, z) => `When sink basins, tubs, or floor drains back up in ${c}, slow drainage is often just the surface symptom of deeper obstruction. Our vetted local plumbing network provides comprehensive drain cleaning across ${c} (${z}) using professional mechanical snaking and high-pressure hydro-jetting.`,
    p2: (c, s, sn, z) => `We eliminate organic grease, soap scum, foreign debris, and invasive roots clinging to pipe walls. Every service includes complete flow restoration, multi-fixture testing, and preventative maintenance recommendations tailored to ${c}'s municipal sewer and septic lines.`,
    scope: (c, s) => [
      `High-definition fiber-optic camera inspection of lateral lines and cleanouts.`,
      `Industrial hydro-jetting up to 4,000 PSI to strip grease, roots, and scale.`,
      `Post-clearance hydrostatic flow verification across all connected household fixtures.`
    ],
    benefits: (c, sn) => [
      { title: '1. Flow & Efficiency', desc: `<strong>Restored Performance:</strong> Eliminates stubborn grease, hair, and scale restrictions to ensure optimal gravity drainage throughout your property.` },
      { title: '2. Pipe Longevity', desc: `<strong>Non-Destructive Cleaning:</strong> High-pressure water scouring cleans interior pipe walls thoroughly without harmful corrosive chemicals.` },
      { title: '3. Long-Term Value', desc: `<strong>Backup Prevention:</strong> Scheduled line clearing eliminates hidden root intrusion before it causes disastrous foundation flooding.` }
    ],
    warningTitle: (c) => `Emergency Warning Signs of Severe Blockage`,
    warningDesc: (c, z) => `Multiple drains backing up simultaneously, gurgling toilet bowls, or sewer odor rising from floor drains in ${c} indicate an urgent main line stoppage requiring immediate rooter service.`,
    faqs: (c, s, sn, z) => [
      { q: `What is the typical emergency response window for drain cleaning in ${c} ${z}?`, a: `For urgent drain emergencies in ${c} (${z}), our dispatch network maintains a standard response window of 30 to 45 minutes under normal conditions. An on-call independent licensed plumber is matched to your location immediately.` },
      { q: `What is the difference between motorized snaking and hydro-jetting?`, a: `Motorized drain augers punch through solid clogs and retrieve foreign objects. Hydro-jetting uses high-pressure water streams (up to 4,000 PSI) to scrub the entire interior pipe wall free of grease, sludge, and scale.` },
      { q: `Can chemical liquid drain cleaners damage pipes in ${c}?`, a: `Yes. Harsh chemical solvents generate intense exothermic heat that can warp PVC fittings, weaken pipe joints, and corrode aging cast iron lines. Mechanical snaking and hydro-jetting are far safer and more effective.` },
      { q: `Are the plumbers dispatched to ${c} licensed and insured?`, a: `Yes. Every plumber matched through Home Plumbing USA holds active state-level licensing, liability insurance, and adheres strictly to ${sn} building and safety codes.` },
      { q: `Do network plumbers provide upfront flat-rate pricing in ${c}?`, a: `Yes. Dispatched plumbers evaluate the issue on-site and provide an upfront, transparent written estimate before any work begins. There are zero hidden fees or unexpected surcharges.` }
    ]
  },
  'burst-pipe-repair': {
    heroParagraph: (c, s, z) => `Rapid emergency response for burst pipes, ruptured supply lines, and frozen plumbing across ${c}, ${s} (${z}). On-call licensed contractors arrive quickly to isolate breaches, stop water intrusion, and rebuild pipe integrity.`,
    p1: (c, s, sn, z) => `A pressurized water line rupture can discharge hundreds of gallons an hour, inflicting severe structural damage on flooring, drywall, and electrical systems in ${c}. Our emergency dispatch network immediately connects property owners in ${c} (${z}) with emergency plumbing crews equipped with commercial water extraction tools and pipe replacement equipment.`,
    p2: (c, s, sn, z) => `From seasonal freeze-thaw cycles and temperature swings to aging galvanized lines and excessive municipal pressure, our technicians pinpoint concealed ruptures, excise compromised sections, and install durable PEX or copper replacements with full pressure testing.`,
    scope: (c, s) => [
      `Immediate emergency shutoff assistance and high-priority active leak isolation.`,
      `Precision line excision and code-compliant PEX or Type L copper reconstruction.`,
      `Hydrostatic pressure testing and structural moisture damage containment guidance.`
    ],
    benefits: (c, sn) => [
      { title: '1. Damage Containment', desc: `<strong>Fast Isolation:</strong> Rapid shutoff and line isolation prevents catastrophic water damage to subflooring, insulation, and drywall.` },
      { title: '2. Code-Approved Piping', desc: `<strong>Durable Materials:</strong> Replaces weakened pipe sections with commercial-grade PEX-A expansion piping or rigid copper.` },
      { title: '3. Peace of Mind', desc: `<strong>Pressure Balancing:</strong> Technicians inspect whole-house water pressure to ensure future water hammer won't cause new pipe fractures.` }
    ],
    warningTitle: (c) => `Emergency Burst Pipe Action Plan`,
    warningDesc: (c, z) => `Shut off your main water isolation valve immediately. If water is near electrical outlets or breaker panels, avoid standing in water, switch off power if safe, and call our 24/7 emergency dispatch.`,
    faqs: (c, s, sn, z) => [
      { q: `What should I do immediately when a pipe bursts in ${c}?`, a: `Immediately locate and close your property's main water shutoff valve. Turn off power at the main breaker if water is near electrical systems, and call 888-217-4803 for emergency dispatch.` },
      { q: `How quickly can an emergency plumber arrive in ${c} (${z})?`, a: `Our emergency dispatch routes active technicians to arrive within 30 to 45 minutes on average for active flooding emergencies in ${c}.` },
      { q: `Will insurance cover burst pipe repairs in ${c}?`, a: `Most homeowner policies cover water damage resulting from sudden and accidental pipe bursts. Our matched plumbers provide detailed itemized diagnostic reports and invoices to support your insurance claim.` },
      { q: `Do technicians replace or patch ruptured pipes?`, a: `For long-term reliability and code compliance, our plumbers excise damaged sections completely and install durable PEX or copper couplings rather than temporary surface patches.` },
      { q: `How can I prevent pipes from bursting during cold weather in ${c}?`, a: `Keep home heating above 55°F, insulate exposed pipes in crawlspaces or exterior walls, and let cold water faucets drip slowly during freezing alerts.` }
    ]
  },
  'water-heater-repair': {
    heroParagraph: (c, s, z) => `Expert water heater diagnostics, repair, and same-day replacement in ${c}, ${s} (${z}). Servicing conventional tank and modern tankless gas, electric, and hybrid units with genuine factory components.`,
    p1: (c, s, sn, z) => `Reliable hot water is indispensable for daily sanitation and comfort. If your water heater in ${c} is producing lukewarm water, rumbling with mineral sediment, or leaking from tank fittings, our certified technicians diagnose the exact failure quickly.`,
    p2: (c, s, sn, z) => `We service all major brands including Rheem, Bradford White, A.O. Smith, Rinnai, and Navien. Whether your system requires thermocouple replacement, new electric heating elements, thermostat recalibration, or a full code-compliant replacement, we provide upfront flat-rate pricing before work starts.`,
    scope: (c, s) => [
      `Digital multimeter electrical diagnostics and burner assembly inspection.`,
      `Sacrificial anode rod inspection, TPR valve safety testing, and sediment tank flushing.`,
      `Code-compliant venting, gas flex line, and thermal expansion tank verification.`
    ],
    benefits: (c, sn) => [
      { title: '1. Constant Hot Water', desc: `<strong>Consistent Temperatures:</strong> Restores peak heating efficiency so your household never runs out of hot water unexpectedly.` },
      { title: '2. Energy Efficiency', desc: `<strong>Lower Utility Costs:</strong> Descaling and element tuning reduce standby heat loss and lower monthly electric or gas utility bills.` },
      { title: '3. Extended Lifespan', desc: `<strong>Corrosion Protection:</strong> Timely anode rod replacement and sediment flushing prevent premature steel tank rupture.` }
    ],
    warningTitle: (c) => `Water Heater Emergency Warning Signs`,
    warningDesc: (c, z) => `Puddling water beneath your water heater tank, rotten egg gas smells, popping tank noises, or scorch marks near the burner indicate imminent failure or combustion hazards. Disconnect power/gas and contact dispatch.`,
    faqs: (c, s, sn, z) => [
      { q: `How do I know if my water heater in ${c} needs repair or replacement?`, a: `If your water heater is under 8–10 years old and has a failed element, thermostat, or valve, repair is typically cost-effective. If the tank itself is leaking or over 10–12 years old, full replacement is recommended.` },
      { q: `What causes popping or rumbling noises in a water heater tank?`, a: `Mineral sediment accumulates at the tank bottom over time. Water trapped beneath this sediment boils and creates popping sounds. Flushing the tank clears sediment and restores quiet operation.` },
      { q: `How fast can a technician arrive in ${c} (${z}) for water heater repair?`, a: `We maintain 30 to 45-minute dispatch windows for urgent water heater leaks and same-day scheduling for routine diagnostics across ${c}.` },
      { q: `Do you service tankless water heaters in ${c}?`, a: `Yes. Our network technicians are factory-trained on high-efficiency tankless gas and electric water heaters, including annual descaling, error code clearing, and heat exchanger servicing.` },
      { q: `Are replacements backed by manufacturer and labor warranties?`, a: `Yes. Replacement units include standard 6 to 10-year manufacturer tank warranties, plus our network contractor workmanship guarantees.` }
    ]
  },
  'sewer-line-repair': {
    heroParagraph: (c, s, z) => `Advanced trenchless sewer line repair, root removal, and main line replacement in ${c}, ${s} (${z}). Restoring underground sewer laterals with minimal disruption to your landscape.`,
    p1: (c, s, sn, z) => `A damaged or collapsed sewer lateral can back up raw wastewater into residential basements and commercial floors in ${c}. Our network brings non-invasive diagnostic cameras and modern trenchless repair technologies to property owners across ${c} (${z}).`,
    p2: (c, s, sn, z) => `From invasive tree roots and ground shifting to aged clay or cast-iron decomposition, our certified sewer specialists provide accurate pipeline video inspections, CIPP epoxy relining, and directional pipe bursting to restore your sewer lines without digging up driveways.`,
    scope: (c, s) => [
      `High-resolution color video camera inspection with digital depth mapping.`,
      `Hydro-mechanical root cutting and sectional trenchless epoxy relining (CIPP).`,
      `Municipal code permitting and city inspector signoff coordination.`
    ],
    benefits: (c, sn) => [
      { title: '1. Landscape Preservation', desc: `<strong>No-Dig Solutions:</strong> Trenchless epoxy pipe lining restores damaged lines from existing cleanouts without destroying lawns or driveways.` },
      { title: '2. Root-Proof Barrier', desc: `<strong>Seamless Interior:</strong> Seamless CIPP epoxy sleeves seal joint gaps, permanently blocking tree roots from re-entering pipes.` },
      { title: '3. 50+ Year Longevity', desc: `<strong>Structural Renewal:</strong> Modern cured-in-place pipe materials match or exceed the durability of new schedule 40 PVC.` }
    ],
    warningTitle: (c) => `Sewer Line Emergency Alert`,
    warningDesc: (c, z) => `Raw sewage backing up into tubs or toilets, foul sulfur odors across the yard, or sunken soft spots in your lawn indicate a compromised main sewer line requiring immediate professional remediation.`,
    faqs: (c, s, sn, z) => [
      { q: `What causes sewer line backups in ${c}?`, a: `Tree root intrusion, ground shifting, grease buildup, sagging pipe sections ('bellies'), and aging cast iron or clay pipes are the primary causes of sewer lateral failure in ${c}.` },
      { q: `What is trenchless sewer repair and how does it work?`, a: `Trenchless repair uses epoxy resin-saturated liners pulled through existing cleanouts. The resin cures into a new, seamless, root-proof pipe inside the old one without excavating trenches.` },
      { q: `How do plumbers determine the exact sewer line problem in ${c}?`, a: `A high-definition fiber-optic camera is fed through your cleanout to provide real-time footage of cracks, roots, or collapses, with exact depth and location radio-transmitted above ground.` },
      { q: `Who is responsible for the sewer line in ${c}?`, a: `Property owners are typically responsible for the lateral line running from the building foundation up to the municipal main connection point in the street or utility easement.` },
      { q: `Do your sewer repairs comply with ${sn} municipal codes?`, a: `Yes. All repairs and replacements follow ${sn} plumbing codes and include necessary city permits and inspections.` }
    ]
  },
  'emergency-plumbing': {
    heroParagraph: (c, s, z) => `24/7 emergency plumbing dispatch across ${c}, ${s} (${z}). Certified, insured local plumbers on call day, night, weekends, and holidays with average 45-minute response times.`,
    p1: (c, s, sn, z) => `Plumbing disasters do not adhere to business hours. Whether you face an uncontrolled ceiling leak at midnight, an overflowing toilet during holiday gatherings, or complete loss of water pressure, Home Plumbing USA's emergency dispatch center in ${c} connects you with active on-call technicians.`,
    p2: (c, s, sn, z) => `Every dispatched plumber arrives in a fully equipped mobile unit carrying commercial pumps, diagnostic thermal cameras, pipe freezing equipment, and code-approved replacement valves to secure your property immediately.`,
    scope: (c, s) => [
      `24/7 rapid dispatch priority with live tracking and coordination.`,
      `Immediate mitigation of active flooding, gas leaks, and sewage overflows.`,
      `Transparent upfront emergency estimates with zero hidden overtime fees.`
    ],
    benefits: (c, sn) => [
      { title: '1. 24/7 Immediate Dispatch', desc: `<strong>Always Open:</strong> Live routing coordinators answer calls 24 hours a day, 365 days a year to dispatch local trucks.` },
      { title: '2. Rapid Arrival', desc: `<strong>30–45 Min Window:</strong> Local on-call plumbers arrive swiftly to stop active flooding before structural damage multiplies.` },
      { title: '3. Upfront Pricing', desc: `<strong>No Surprise Charges:</strong> You approve the exact repair cost before work starts, even on holidays and late nights.` }
    ],
    warningTitle: (c) => `Immediate Safety Protocol`,
    warningDesc: (c, z) => `In the event of uncontrolled flooding or electrical exposure, evacuate the flooded area, shut off the main water isolation valve, and call our 24/7 emergency dispatch hotline immediately.`,
    faqs: (c, s, sn, z) => [
      { q: `What qualifies as an emergency plumbing situation in ${c}?`, a: `Burst pipes, uncontrollable water leaks, sewer backups into living areas, gas leaks, and complete loss of water supply are emergency situations requiring immediate dispatch.` },
      { q: `Do you charge higher rates for nights, weekends, or holidays in ${c}?`, a: `No hidden surcharges. Dispatched technicians provide an upfront flat-rate price quote on-site before performing any repair work.` },
      { q: `What should I do while waiting for the emergency plumber to arrive?`, a: `Turn off your property's main water shutoff valve. If water is near electrical fixtures, turn off power at the main breaker panel from a dry location.` },
      { q: `Are the emergency plumbers licensed in ${sn}?`, a: `Yes. Every technician in our network holds active state licensing, full insurance, and carries professional equipment for same-day resolution.` },
      { q: `How do I request emergency service in ${c} (${z})?`, a: `Call our 24/7 toll-free dispatch hotline at 888-217-4803. A representative will dispatch the nearest available technician to your home immediately.` }
    ]
  },
  'leak-detection': {
    heroParagraph: (c, s, z) => `Non-invasive electronic leak detection and hidden moisture mapping in ${c}, ${s} (${z}). Locating concealed pinhole leaks beneath concrete slabs, behind finished drywall, and underground without destruction.`,
    p1: (c, s, sn, z) => `Hidden water leaks can quietly erode structural framing, foster hazardous mold growth, and inflate water bills by hundreds of dollars in ${c}. Our network deploys state-of-the-art acoustic sensors, infrared thermal imaging, and tracer gas detection to pinpoint leaks without cutting unnecessary holes.`,
    p2: (c, s, sn, z) => `Once the exact leak location is marked, our licensed technicians explain minimal-access repair options, such as single-tile slab access or targeted drywall openings, saving property owners thousands of dollars in restoration expenses.`,
    scope: (c, s) => [
      `Acoustic frequency amplification and ultrasonic pipe scanning.`,
      `High-resolution FLIR thermal imaging to trace moisture boundaries behind walls.`,
      `Precision isolation and minimal-invasive surgical pipe repair.`
    ],
    benefits: (c, sn) => [
      { title: '1. Zero Unnecessary Damage', desc: `<strong>Non-Invasive Diagnostics:</strong> Electronic acoustic and thermal equipment locates leaks within inches without ripping open walls or floors.` },
      { title: '2. Prevent Mold & Rot', desc: `<strong>Early Detection:</strong> Finding concealed moisture quickly prevents dangerous black mold growth and subfloor rot.` },
      { title: '3. Lower Water Bills', desc: `<strong>Eliminate Waste:</strong> Stopping continuous hidden leaks restores normal municipal water utility bills immediately.` }
    ],
    warningTitle: (c) => `Concealed Leak Warning Indicators`,
    warningDesc: (c, z) => `Spinning water meter dials when taps are closed, warm spots on tile floors, persistent damp odors, or unexpected water bill spikes in ${c} indicate active concealed leaks.`,
    faqs: (c, s, sn, z) => [
      { q: `How do plumbers find leaks behind walls without tearing them down in ${c}?`, a: `Technicians use acoustic listening devices that amplify the sound of escaping pressurized water, combined with infrared thermal imaging cameras that detect temperature variations caused by hidden moisture.` },
      { q: `What is a slab leak and how is it detected?`, a: `A slab leak occurs when supply pipes beneath a home's concrete foundation corrode or rupture. We detect them using electromagnetic line locators, ultrasonic sensors, and hydrostatic pressure testing.` },
      { q: `How can I check if I have a hidden leak in my ${c} home?`, a: `Turn off all faucets and water-using appliances. Check your water meter: if the leak indicator dial is spinning, water is actively escaping somewhere in your system.` },
      { q: `Will insurance pay for leak detection services?`, a: `Many homeowners insurance policies cover the cost of locating and accessing hidden leaks ('tear out and access'). We provide comprehensive digital reports for your claims adjuster.` },
      { q: `How quickly can a leak detection specialist arrive in ${c} (${z})?`, a: `We schedule same-day leak detection appointments across ${c}, with 30 to 45-minute emergency response for high-volume active leaks.` }
    ]
  },
  'gas-line-repair': {
    heroParagraph: (c, s, z) => `Certified natural gas and propane line repair, leak detection, and gas piping installation in ${c}, ${s} (${z}). Licensed Master Gas Fitters ensuring airtight safety and strict code compliance.`,
    p1: (c, s, sn, z) => `Natural gas line integrity is critical to property safety. Even minor gas leaks pose explosive hazards and carbon monoxide risks. In ${c}, our certified gas plumbing specialists utilize electronic gas sniffers and micro-manometer pressure testing to verify line safety.`,
    p2: (c, s, sn, z) => `We handle gas line sizing, appliance hookups (furnaces, water heaters, stoves, generators), threaded iron pipe repairs, and yellow poly underground gas lines with complete municipal utility coordination.`,
    scope: (c, s) => [
      `Electronic PPM combustible gas sniffer detection and bubble pressure testing.`,
      `Heavy-gauge schedule 40 black iron and CSST flexible gas pipe repair.`,
      `Utility shutoff restoration and municipal pressure test certification.`
    ],
    benefits: (c, sn) => [
      { title: '1. Life-Safety Protection', desc: `<strong>Certified Gas Fitters:</strong> All gas repairs are executed by licensed professionals adhering to strict NFPA 54 and local fuel gas codes.` },
      { title: '2. PPM Pinpoint Accuracy', desc: `<strong>Electronic Sniffers:</strong> High-sensitivity electronic sensors detect combustible gas down to parts-per-million levels.` },
      { title: '3. Utility Re-Connection', desc: `<strong>Fast Restoration:</strong> We perform mandatory pressure tests and supply documentation required for the gas utility to restore service.` }
    ],
    warningTitle: (c) => `CRITICAL GAS EMERGENCY PROTOCOL`,
    warningDesc: (c, z) => `If you smell sulfur or rotten eggs, hear a hissing gas line, or experience dizziness: EVACUATE THE BUILDING IMMEDIATELY. Do not touch light switches or cell phones indoors. Call 911, your gas utility, and our certified dispatch.`,
    faqs: (c, s, sn, z) => [
      { q: `What should I do if I smell natural gas in my ${c} home?`, a: `Evacuate all occupants and pets immediately. Do not operate light switches, appliances, or phones indoors. Once safely outside, call 911, your local gas utility, and 888-217-4803.` },
      { q: `Can any plumber work on gas lines in ${sn}?`, a: `No. Only plumbers who carry specific gas fitter licensing and fuel gas endorsements are legally authorized to install or repair natural gas and propane systems in ${sn}.` },
      { q: `Why did the gas company turn off my gas meter?`, a: `If the utility detects a leak during inspection, they shut and lock the meter for safety. A licensed plumber must repair the line, pass a pressure test, and provide certification to restore service.` },
      { q: `Do you install new gas lines for outdoor kitchens and generators in ${c}?`, a: `Yes. We install underground poly lines and high-capacity CSST or rigid iron lines sized properly for outdoor kitchens, pool heaters, and standby generators.` },
      { q: `How is gas pipe tightness tested?`, a: `Lines are isolated and pressurized with air using a precision test gauge. The pressure must hold steady over a code-mandated period without any pressure drop.` }
    ]
  },
  'water-line-repair': {
    heroParagraph: (c, s, z) => `Main water service line repair, replacement, and lead line upgrades in ${c}, ${s} (${z}). Restoring clean, high-pressure municipal water flow from meter to home.`,
    p1: (c, s, sn, z) => `Your main water service line delivers clean, pressurized water from the city meter or private well into your ${c} property. Deteriorated underground lines cause low water pressure, discolored tap water, soggy lawn sinkholes, and costly water loss.`,
    p2: (c, s, sn, z) => `Our network specializes in trenchless horizontal directional boring, heavy-duty PEX-A installations, and copper service replacements that preserve your driveway and landscaping while restoring optimal water flow for decades to come.`,
    scope: (c, s) => [
      `Underground pipe location and hydrostatic pressure profiling.`,
      `Trenchless pipe pull and directional boring replacement methods.`,
      `Full municipal water meter tie-in and lead line abatement verification.`
    ],
    benefits: (c, sn) => [
      { title: '1. Restored Water Pressure', desc: `<strong>Optimal Flow:</strong> Replaces corroded, constricted underground pipes to deliver full household water volume.` },
      { title: '2. Clean, Safe Water', desc: `<strong>Eliminate Contamination:</strong> Eliminates rust, sediment, and soil infiltration caused by cracked underground supply pipes.` },
      { title: '3. Trenchless Installation', desc: `<strong>Preserve Your Yard:</strong> Directional boring pulls new seamless lines underground without digging long trenches across driveways.` }
    ],
    warningTitle: (c) => `Main Water Line Failure Symptoms`,
    warningDesc: (c, z) => `Unexplained puddles in your front yard, sudden drops in household water pressure, or brownish sediment in tap water in ${c} signal a main water line fracture requiring immediate repair.`,
    faqs: (c, s, sn, z) => [
      { q: `How do I know if my main water line is leaking in ${c}?`, a: `Key signs include soggy patches in the lawn when it hasn't rained, a noticeable drop in tap water pressure throughout the house, dirty tap water, or high water bills.` },
      { q: `Can water lines be replaced without digging up my entire yard in ${c}?`, a: `Yes. We use trenchless directional boring or pipe pulling techniques that require only small access pits, preserving your lawn, landscaping, and driveway.` },
      { q: `What pipe material is best for water service lines in ${sn}?`, a: `High-density PEX-A expansion tubing and Type K/L copper are the gold standards, offering superior corrosion resistance and durability against freezing and ground shifting.` },
      { q: `Who is responsible for repairing the water line in ${c}?`, a: `The property owner is typically responsible for the water service line from the municipal meter pit or property boundary to the home.` },
      { q: `How long does a water service line replacement take?`, a: `Most residential trenchless water line replacements in ${c} are completed within a single day, minimizing water interruption.` }
    ]
  }
};

function renderServicePage(params) {
  const {
    cityName,
    zip,
    stateCode,
    stateName,
    stateSlug,
    serviceSlug,
    serviceName,
    serviceObj = {},
    lat,
    lng,
    heroParagraph,
    p1Title,
    p1,
    p2,
    scopeBullets = [],
    benefits = [],
    warningTitle,
    warningDesc,
    propertyBullets = [],
    processSteps = [],
    faqs = [],
    otherServices = DEFAULT_SERVICES.filter(s => s.slug !== serviceSlug),
    nearbyAreas = []
  } = params;

  const svcData = SERVICE_CONTENT[serviceSlug] || {};

  const finalHeroParagraph = heroParagraph || (typeof svcData.heroParagraph === 'function' 
    ? svcData.heroParagraph(cityName, stateCode, zip) 
    : `Professional ${serviceName.toLowerCase()} solutions in ${cityName}, ${stateCode} (${zip}). Fast emergency dispatch, upfront transparent estimates, and guaranteed code-compliant workmanship from licensed local contractors.`);

  const finalP1 = p1 || (typeof svcData.p1 === 'function'
    ? svcData.p1(cityName, stateCode, stateName, zip)
    : `When you require reliable ${serviceName.toLowerCase()} in ${cityName}, ${stateCode} (${zip}), our network provides prompt, professional assistance. We connect local homeowners and commercial property managers with certified, pre-vetted technicians equipped to resolve any plumbing emergency.`);

  const finalP2 = p2 || (typeof svcData.p2 === 'function'
    ? svcData.p2(cityName, stateCode, stateName, zip)
    : `Our certified local plumbing specialists arrive with heavy-duty diagnostic and repair equipment, ensuring your plumbing system is restored quickly, safely, and in full compliance with ${stateName} plumbing standards.`);

  const cityZipSlug = `${cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${zip}`;
  const pageUrl = `${DOMAIN}/${stateSlug}/${cityZipSlug}/${serviceSlug}/`;
  const hubUrl = `${DOMAIN}/${stateSlug}/${cityZipSlug}/`;
  const stateUrl = `${DOMAIN}/${stateSlug}/`;
  const serviceImageUrl = `${DOMAIN}/public/images/services/${serviceSlug}.webp`;

  const metaTitle = params.metaTitle || `${serviceName} Services in ${cityName}, ${stateCode} ${zip} | Home Plumbing USA`;
  const metaDesc = params.metaDesc || `Top-rated ${serviceName.toLowerCase()} in ${cityName}, ${stateCode} ${zip}. Fast emergency response, upfront transparent pricing, and guaranteed code compliance from Home Plumbing USA.`;

  // Default Scope Bullets if not provided
  const defaultScope = svcData.scope ? svcData.scope(cityName, stateCode) : [
    `Full structural diagnostic inspection of fixtures, lines, and cleanout junctions.`,
    `Commercial-grade precision equipment and code-approved replacement parts.`,
    `Post-service hydrostatic pressure checks and multi-point flow verification.`
  ];
  const finalScope = (scopeBullets.length === 3) ? scopeBullets : defaultScope;

  // Default Benefits if not provided
  const defaultBenefits = svcData.benefits ? svcData.benefits(cityName, stateName) : [
    {
      title: '1. Flow & Efficiency',
      desc: `<strong>Restored Performance:</strong> Eliminates system restrictions, optimizes flow rates, and restores reliable household water pressure.`
    },
    {
      title: '2. Compliance & Safety',
      desc: `<strong>Code-Compliant Repairs:</strong> All work strictly adheres to ${stateName} plumbing regulations, safety standards, and municipal ordinances.`
    },
    {
      title: '3. Long-term Value',
      desc: `<strong>Damage Prevention:</strong> Professional maintenance safeguards structural foundation elements, prevents water damage, and extends fixture lifespan.`
    }
  ];
  const finalBenefits = (benefits.length === 3) ? benefits : defaultBenefits;

  // Final Warning Info
  const finalWarningTitle = warningTitle || (typeof svcData.warningTitle === 'function' ? svcData.warningTitle(cityName) : 'Emergency Warning Signs');
  const finalWarningDesc = warningDesc || (typeof svcData.warningDesc === 'function' ? svcData.warningDesc(cityName, zip) : `If you observe active leaks, water pressure drops, foul odors, or strange system noises in ${cityName}, shut off your water supply and contact our dispatch line immediately.`);

  // Final FAQs
  const finalFaqs = (faqs && faqs.length > 0) ? faqs : (typeof svcData.faqs === 'function' ? svcData.faqs(cityName, stateCode, stateName, zip) : [
    { q: `What is the typical emergency response window in ${cityName}?`, a: `Under normal conditions, our emergency dispatch routes an on-call licensed plumber to your location in ${cityName} (${zip}) within 30 to 45 minutes.` },
    { q: `Are the technicians licensed and insured in ${stateName}?`, a: `Yes. All plumbers in our network are fully licensed, vetted, and carry comprehensive general liability insurance in accordance with ${stateName} regulations.` },
    { q: `Do you provide upfront pricing before starting work?`, a: `Yes. Technicians diagnose your issue on-site and present a clear, flat-rate quote before performing any repair work, with zero hidden charges.` },
    { q: `Do you offer warranties on parts and labor in ${cityName}?`, a: `Yes. All repairs and installations are backed by comprehensive contractor workmanship and manufacturer parts warranties.` },
    { q: `How do I book service with Home Plumbing USA?`, a: `Call our toll-free 24/7 hotline at ${PHONE_DISPLAY} to speak directly with an active dispatch supervisor and get matched with a local pro.` }
  ]);

  // Default Property Bullets
  const defaultPropertyBullets = [
    {
      label: 'Residential Homes',
      desc: `We protect household plumbing across ${cityName} by servicing kitchens, bathrooms, laundry standpipes, and basement drains.`
    },
    {
      label: 'Commercial Offices & Retail',
      desc: `We maintain restroom facilities, breakrooms, and drinking fountains to ensure smooth, uninterrupted business operations.`
    },
    {
      label: 'Restaurants & Multi-Family',
      desc: `We handle high-demand commercial kitchens, utility manifolds, and municipal sewer lateral connections safely.`
    }
  ];
  const finalPropertyBullets = (propertyBullets.length === 3) ? propertyBullets : defaultPropertyBullets;

  // Default Process Steps
  const defaultSteps = [
    {
      num: '01',
      title: 'Call Toll-Free',
      desc: `Contact ${PHONE_DISPLAY} to speak directly with our 24/7 national routing and dispatch center.`
    },
    {
      num: '02',
      title: 'Local Matching',
      desc: `We match your issue with the most qualified local plumber in ${cityName} (${zip}) immediately.`
    },
    {
      num: '03',
      title: 'Clear Diagnosis',
      desc: `The dispatched plumber diagnoses your issue on-site and provides an honest upfront quote before work begins.`
    },
    {
      num: '04',
      title: 'Work Completed',
      desc: `The repair is completed securely with premium quality tools. You review and pay only when fully satisfied.`
    }
  ];
  const finalSteps = (processSteps.length === 4) ? processSteps : defaultSteps;

  // Schema.org JSON-LD
  const schemaObj = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "PlumbingService",
        "@id": `${pageUrl}#organization`,
        "name": "Home Plumbing USA",
        "image": serviceImageUrl,
        "url": pageUrl,
        "telephone": PHONE,
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": `${cityName} Central`,
          "addressLocality": cityName,
          "addressRegion": stateCode,
          "postalCode": zip,
          "addressCountry": "US"
        },
        ...(lat && lng ? {
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": lat,
            "longitude": lng
          }
        } : {}),
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "00:00",
          "closes": "23:59"
        },
        "provider": {
          "@type": "LocalBusiness",
          "name": "Home Plumbing USA",
          "image": `${DOMAIN}/public/images/hero-plumbing.webp`
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${DOMAIN}/`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": stateName,
            "item": stateUrl
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `${cityName} (${zip})`,
            "item": hubUrl
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": serviceName,
            "item": pageUrl
          }
        ]
      },
      {
        "@type": "Service",
        "name": serviceName,
        "serviceType": "Plumbing",
        "provider": {
          "@type": "LocalBusiness",
          "name": "Home Plumbing USA",
          "telephone": PHONE
        },
        "areaServed": [
          {
            "@type": "City",
            "name": cityName
          }
        ],
        "description": metaDesc
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        "mainEntity": finalFaqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
          }
        }))
      }
    ]
  };

  // Nav Dropdowns HTML
  const servicesDropdownHtml = DEFAULT_SERVICES.map(s => `
    <li><a href="/${stateSlug}/${cityZipSlug}/${s.slug}/"><i class="fas ${s.icon}" style="color: var(--primary-light);"></i> <span>${s.name}</span></a></li>
  `).join('\n');

  const areasDropdownHtml = nearbyAreas.slice(0, 10).map(a => `
    <li><a href="/${stateSlug}/${a.slug}/"><i class="fas fa-location-dot" style="color: var(--primary-light);"></i> <span>${a.city} (${a.zip})</span></a></li>
  `).join('\n');

  // Other Services Sidebar / Footer HTML
  const otherServicesHtml = otherServices.map(s => `
    <li><a href="/${stateSlug}/${cityZipSlug}/${s.slug}/">${s.name}</a></li>
  `).join('\n');

  // Service Areas Footer HTML
  const serviceAreasFooterHtml = nearbyAreas.slice(0, 10).map(a => `
    <li><a href="/${stateSlug}/${a.slug}/">${a.city} ${a.zip}</a></li>
  `).join('\n');

  // FAQs Accordion HTML
  const faqsHtml = finalFaqs.map(f => `
    <div class="faq-item-custom">
      <button class="faq-trigger-btn">
        <h3>${f.q}</h3>
        <span class="faq-toggle-icon">+</span>
      </button>
      <div class="faq-body">
        <div class="faq-body-inner">
          ${f.a}
        </div>
      </div>
    </div>
  `).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metaTitle}</title>
  <meta name="description" content="${metaDesc}">
  <meta name="keywords" content="${serviceName} ${cityName} ${stateCode}, ${serviceName} ${zip}, Emergency Plumber ${cityName} ${stateCode}, Home Plumbing USA">
  <link rel="canonical" href="${pageUrl}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${metaTitle}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:image" content="${serviceImageUrl}">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${pageUrl}">
  <meta name="twitter:title" content="${metaTitle}">
  <meta name="twitter:description" content="${metaDesc}">
  <meta name="twitter:image" content="${serviceImageUrl}">

  <!-- Google Fonts & Font Awesome -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="icon" type="image/png" href="/public/images/favicon.png">

  <!-- JSON-LD Schemas -->
  <script type="application/ld+json">
${JSON.stringify(schemaObj, null, 2)}
  </script>

  <style>
    .service-page-wrapper { color: var(--text-light); }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2.5rem; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
    .flex-between { display: flex; justify-content: space-between; align-items: center; }
    .section-padding { padding: 5rem 0; }
    .bg-light-custom { background-color: #0d1a2d; }
    .bg-dark-custom { background-color: #070d18; }

    /* Header Nav */
    .header .top-bar { background: #060f1d; border-bottom: 1px solid rgba(255, 255, 255, 0.06); font-size: 0.85rem; padding: 0.4rem 0; }
    .header .top-bar a { color: var(--text-light); display: inline-flex; align-items: center; gap: 0.4rem; text-decoration: none; }
    .header .nav-container { padding: 0.8rem 0; display: flex; justify-content: space-between; align-items: center; }
    .header nav > ul { display: flex; align-items: center; gap: 1.75rem; list-style: none; margin: 0; padding: 0; }
    .header nav a { color: var(--text-light); font-weight: 500; font-size: 0.95rem; text-decoration: none; transition: color 0.2s ease; }
    .header nav a:hover, .header nav a.active { color: var(--primary-light); }
    .dropdown { position: relative; }
    .dropdown-trigger { display: inline-flex; align-items: center; gap: 0.4rem; cursor: pointer; }
    .dropdown-icon { transition: transform 0.2s ease; font-size: 0.75rem; }
    .dropdown:hover .dropdown-icon { transform: rotate(180deg); }
    .dropdown-menu { position: absolute; top: 100%; left: 0; min-width: 280px; background: #111d33; border: 1px solid var(--border-color); border-radius: var(--radius-md); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); padding: 0.75rem 0; display: flex; flex-direction: column; z-index: 1010; margin-top: 0.5rem; opacity: 0; visibility: hidden; transform: translateY(10px); transition: all 0.25s ease; list-style: none; }
    .dropdown:hover .dropdown-menu { opacity: 1; visibility: visible; transform: translateY(0); }
    .scrollable-menu { max-height: 380px; overflow-y: auto; }
    .scrollable-menu::-webkit-scrollbar { width: 6px; }
    .scrollable-menu::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
    .dropdown-menu li a { display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 1.25rem; color: var(--text-light); font-size: 0.88rem; white-space: nowrap; }
    .dropdown-menu li a:hover { background: rgba(37, 99, 235, 0.15); color: #38bdf8; }
    .menu-toggle { display: none; background: none; border: none; font-size: 1.75rem; color: #fff; cursor: pointer; }

    /* Hero */
    .hero-lead-text { font-size: 1.15rem; color: var(--text-light); margin-bottom: 2rem; line-height: 1.75; max-width: 640px; }
    .stats-strip { display: flex; gap: 2.5rem; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 2rem; margin-top: 2rem; }
    .stat-val { font-size: 2rem; font-weight: 800; color: #fff; font-family: var(--font-heading, 'Outfit', sans-serif); line-height: 1; }
    .stat-desc { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.35rem; }

    /* Live Dispatch Board Card */
    .dispatch-board-card { background: #0d1527; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: var(--radius-md); padding: 2.25rem; box-shadow: 0 20px 40px rgba(0,0,0,0.5); text-align: left; }
    .dispatch-board-badge { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.35); padding: 0.35rem 0.85rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em; display: inline-flex; align-items: center; gap: 0.5rem; }
    .pulse-dot-red { display: inline-block; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; box-shadow: 0 0 10px #ef4444; animation: pulseAnim 1.8s infinite; }
    @keyframes pulseAnim { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    .dispatch-feature-row { display: flex; gap: 1.25rem; align-items: flex-start; background: rgba(255, 255, 255, 0.02); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid rgba(255, 255, 255, 0.04); }
    .dispatch-feature-icon { width: 44px; height: 44px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1.15rem; }
    .btn-dispatch-call { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #fff !important; width: 100%; justify-content: center; padding: 1.15rem; font-size: 1.45rem; font-weight: 800; border-radius: 8px; display: flex; align-items: center; gap: 0.75rem; box-shadow: 0 10px 25px rgba(245, 158, 11, 0.35); border: none; text-decoration: none; transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .btn-dispatch-call:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(245, 158, 11, 0.5); }

    /* Trust Badge Cards */
    .trust-card { background: #111d33; padding: 2rem 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); text-align: center; transition: transform 0.2s ease, border-color 0.2s ease; }
    .trust-card:hover { transform: translateY(-3px); border-color: rgba(59, 130, 246, 0.4); }
    .trust-icon-circle { background: rgba(37, 99, 235, 0.15); border: 1px solid rgba(37, 99, 235, 0.3); border-radius: 50%; width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; color: #38bdf8; font-size: 1.25rem; }

    /* Scope & Benefits */
    .scope-card { background: #111d33; padding: 2.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-md); }
    .benefit-card { background: #111d33; padding: 2.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); transition: transform 0.2s ease; }
    .benefit-card:hover { transform: translateY(-3px); border-color: rgba(59, 130, 246, 0.4); }

    /* Process */
    .process-step-box { text-align: center; position: relative; z-index: 2; }
    .step-badge-num { background: rgba(37, 99, 235, 0.12); color: #38bdf8; font-weight: 800; border-radius: 8px; width: 54px; height: 54px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; border: 1px solid rgba(56, 189, 248, 0.3); font-size: 1.2rem; }

    /* FAQ Accordions */
    .faq-container-custom { max-width: 860px; margin: 0 auto; }
    .faq-item-custom { background: #111d33; border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 14px; overflow: hidden; transition: border-color 0.2s ease; }
    .faq-item-custom.active { border-color: var(--primary-light); }
    .faq-trigger-btn { width: 100%; text-align: left; padding: 1.25rem 1.5rem; background: none; border: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; outline: none; }
    .faq-trigger-btn h3 { font-size: 1.05rem; margin: 0; font-weight: 700; color: #fff; padding-right: 1.5rem; }
    .faq-toggle-icon { font-size: 1.4rem; font-weight: 300; color: #38bdf8; transition: transform 0.25s ease; flex-shrink: 0; }
    .faq-item-custom.active .faq-toggle-icon { transform: rotate(45deg); color: #f87171; }
    .faq-body { max-height: 0; overflow: hidden; transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .faq-body-inner { padding: 0 1.5rem 1.5rem 1.5rem; color: var(--text-muted); font-size: 0.95rem; line-height: 1.7; }

    /* Footer */
    .footer-grid-custom { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 3.5rem; }
    .footer-col h3 { color: #fff; font-size: 1.15rem; margin-bottom: 1.25rem; position: relative; padding-bottom: 0.5rem; }
    .footer-col h3::after { content: ''; position: absolute; bottom: 0; left: 0; width: 32px; height: 2px; background-color: var(--primary); }
    .footer-links-list { display: flex; flex-direction: column; gap: 0.75rem; padding: 0; margin: 0; list-style: none; }
    .footer-links-list a { color: var(--text-muted); font-size: 0.9rem; text-decoration: none; transition: color 0.2s, padding-left 0.2s; }
    .footer-links-list a:hover { color: #38bdf8; padding-left: 4px; }

    /* Responsive */
    @media (max-width: 992px) {
      .grid-2 { grid-template-columns: 1fr; gap: 3rem; }
      .grid-4 { grid-template-columns: repeat(2, 1fr); }
      .grid-3 { grid-template-columns: 1fr; }
      .footer-grid-custom { grid-template-columns: repeat(2, 1fr); }
      .timeline-track-desktop { display: none; }
      .menu-toggle { display: block; }
      .header nav { display: none; }
    }
    @media (max-width: 600px) {
      .grid-4 { grid-template-columns: 1fr; }
      .footer-grid-custom { grid-template-columns: 1fr; }
      .stats-strip { flex-direction: column; gap: 1.25rem; }
      .header .nav-ctas { display: none; }
    }
  </style>
</head>
<body class="service-page-wrapper">

  <!-- Header -->
  <header class="header" id="header">
    <div class="top-bar">
      <div class="container flex-between">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="pulse-dot-red" style="width: 6px; height: 6px;"></span>
          <span>Professional Plumbing Team Available 24/7 in ${cityName}, ${stateCode}</span>
        </div>
        <div>
          <a href="tel:${PHONE}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>Emergency Line: ${PHONE_DISPLAY}</span>
          </a>
        </div>
      </div>
    </div>
    
    <!-- Navigation Container -->
    <div class="nav-container container">
      <a href="/" class="logo">
        <img src="/public/images/logo.svg" alt="Home Plumbing USA Logo" width="220" height="46" style="display: block;">
      </a>
      <button class="menu-toggle" aria-expanded="false" aria-label="Toggle navigation menu">&#9776;</button>
      <nav id="mainNav">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about.html">About</a></li>
          <li class="dropdown">
            <a href="/services.html" class="dropdown-trigger active">
              <span>Services</span>
              <i class="fas fa-chevron-down dropdown-icon"></i>
            </a>
            <ul class="dropdown-menu scrollable-menu">
              ${servicesDropdownHtml}
            </ul>
          </li>
          <li class="dropdown">
            <a href="/${stateSlug}/" class="dropdown-trigger">
              <span>Areas We Serve</span>
              <i class="fas fa-chevron-down dropdown-icon"></i>
            </a>
            <ul class="dropdown-menu scrollable-menu">
              ${areasDropdownHtml}
            </ul>
          </li>
          <li><a href="/projects.html">Projects</a></li>
          <li><a href="/contact.html">Contact</a></li>
        </ul>
      </nav>
      <div class="nav-ctas">
        <a href="tel:${PHONE}" class="btn btn-primary" style="padding: 0.6rem 1.4rem; font-size: 0.95rem;">Call Now</a>
      </div>
    </div>
  </header>

  <main style="padding-top: 0;">
    <!-- HERO SECTION -->
    <section class="hero" style="padding: 5.5rem 0 4.5rem; background: linear-gradient(135deg, #0b1322 0%, #060b13 100%); color: #fff; position: relative; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: left;">
      <div class="container">
        <div class="grid-2" style="align-items: center; gap: 3.5rem;">
          
          <div class="hero-content">
            <div class="inner-hero-breadcrumbs" style="font-size: 0.85rem; margin-bottom: 1.5rem; opacity: 0.75;">
              <a href="/" style="color: #fff; text-decoration: none;">Home</a> &gt; <a href="/${stateSlug}/" style="color: #fff; text-decoration: none;">${stateName}</a> &gt; <a href="${hubUrl}" style="color: #fff; text-decoration: none;">${cityName} (${zip})</a> &gt; <span style="color: #38bdf8;">${serviceName}</span>
            </div>
            
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(37, 99, 235, 0.15); border: 1px solid rgba(59, 130, 246, 0.35); padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.85rem; font-weight: 600; margin-bottom: 1.5rem; color: #38bdf8;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#38bdf8" stroke="#38bdf8" stroke-width="1"><circle cx="12" cy="12" r="10"/></svg>
              Premium Certified Local Experts in ${cityName}
            </div>
            
            <h1 style="font-size: 3.25rem; margin-bottom: 1.5rem; line-height: 1.15; font-weight: 800; letter-spacing: -0.02em; color: #fff;">
              Expert ${serviceName} Services in ${cityName}, ${stateCode} ${zip}
            </h1>
            
            <p class="hero-lead-text">
              ${finalHeroParagraph}
            </p>
            
            <div class="stats-strip">
              <div>
                <div class="stat-val">45-Min</div>
                <div class="stat-desc">Avg. Response Time</div>
              </div>
              <div>
                <div class="stat-val">25k+</div>
                <div class="stat-desc">Verified Direct Repairs</div>
              </div>
              <div>
                <div class="stat-val">4.9/5</div>
                <div class="stat-desc">Customer Satisfaction</div>
              </div>
            </div>
          </div>
          
          <!-- Live Dispatch Board Card -->
          <div class="dispatch-board-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem;">
              <span class="dispatch-board-badge">
                <span class="pulse-dot-red"></span>
                Live Dispatch Board
              </span>
              <span style="font-size: 0.8rem; color: var(--text-muted);">Updated: Just Now</span>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 2rem;">
              <div class="dispatch-feature-row">
                <div class="dispatch-feature-icon" style="background: rgba(37, 99, 235, 0.15); border: 1px solid rgba(59, 130, 246, 0.3);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                </div>
                <div>
                  <h4 style="color: #fff; font-size: 1.05rem; font-weight: 700; margin-bottom: 0.25rem;">Emergency Dispatch Active</h4>
                  <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0;">All ${cityName} regions staffed with fully-vetted specialists</p>
                </div>
              </div>
              <div class="dispatch-feature-row">
                <div class="dispatch-feature-icon" style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3);">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <div>
                  <h4 style="color: #fff; font-size: 1.05rem; font-weight: 700; margin-bottom: 0.25rem;">No Hidden Dispatch Fees</h4>
                  <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0;">Get completely transparent flat-rates up-front</p>
                </div>
              </div>
            </div>
            
            <p style="font-size: 0.92rem; color: var(--text-light); text-align: center; margin-bottom: 1.25rem; line-height: 1.5;">
              Facing a plumbing emergency or need urgent repairs? Speak with a local plumbing pro instantly:
            </p>
            
            <a href="tel:${PHONE}" class="btn-dispatch-call">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              ${PHONE_DISPLAY}
            </a>
            
            <div style="font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 1rem; font-weight: 700; letter-spacing: 0.05em;">
              ZERO-OBLIGATION DIAGNOSTICS CALL
            </div>
          </div>
          
        </div>
      </div>
    </section>

    <!-- TRUST BADGES SECTION -->
    <section class="trust-badges" style="background-color: #0d1a2d; border-bottom: 1px solid var(--border-color); padding: 4rem 0;">
      <div class="container">
        <div class="grid-4" style="gap: 1.5rem;">
          <div class="trust-card">
            <div class="trust-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 style="color: #fff; margin-bottom: 0.5rem; font-size: 1.1rem; font-weight: 700;">100% Insured & Licensed</h3>
            <p style="font-size: 0.85rem; margin-bottom: 0; color: var(--text-muted); line-height: 1.5;">Guaranteed home safety protection</p>
          </div>
          <div class="trust-card">
            <div class="trust-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            </div>
            <h3 style="color: #fff; margin-bottom: 0.5rem; font-size: 1.1rem; font-weight: 700;">Upfront Honest Estimates</h3>
            <p style="font-size: 0.85rem; margin-bottom: 0; color: var(--text-muted); line-height: 1.5;">No surprise surcharges or fees</p>
          </div>
          <div class="trust-card">
            <div class="trust-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h3 style="color: #fff; margin-bottom: 0.5rem; font-size: 1.1rem; font-weight: 700;">24-Hour Active Support</h3>
            <p style="font-size: 0.85rem; margin-bottom: 0; color: var(--text-muted); line-height: 1.5;">Weekends & holidays are included</p>
          </div>
          <div class="trust-card">
            <div class="trust-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"/></svg>
            </div>
            <h3 style="color: #fff; margin-bottom: 0.5rem; font-size: 1.1rem; font-weight: 700;">Satisfaction Guaranteed</h3>
            <p style="font-size: 0.85rem; margin-bottom: 0; color: var(--text-muted); line-height: 1.5;">We won't leave till it's fixed right</p>
          </div>
        </div>
      </div>
    </section>

    <!-- WHAT OUR SERVICE INCLUDES SECTION -->
    <section class="section-padding" style="background-color: var(--bg-dark);">
      <div class="container">
        <div class="grid-2" style="gap: 3.5rem; align-items: start;">
          <div>
            <div style="margin-bottom: 1.5rem;">
              <h2 style="font-size: 2.25rem; font-weight: 800; color: #fff; margin-bottom: 1rem;">What Our ${serviceName} Includes in ${cityName}</h2>
              <div style="width: 50px; height: 3px; background: var(--primary); border-radius: 2px;"></div>
            </div>
            <p style="line-height: 1.8; color: var(--text-muted); font-size: 1.05rem; margin-bottom: 1.5rem;">
              ${finalP1}
            </p>
            <p style="line-height: 1.8; color: var(--text-muted); font-size: 1.05rem;">
              ${finalP2}
            </p>
          </div>
          
          <div class="scope-card">
            <h3 style="color: #fff; margin-bottom: 1.5rem; font-size: 1.25rem; font-weight: 700;">Service Scope Overview</h3>
            <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0;">
              <li style="margin-bottom: 1rem; display: flex; align-items: flex-start; gap: 0.75rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 0.25rem;"><polyline points="20 6 9 17 4 12"/></svg>
                <div style="font-size: 0.95rem; color: var(--text-light); line-height: 1.6;">${finalScope[0]}</div>
              </li>
              <li style="margin-bottom: 1rem; display: flex; align-items: flex-start; gap: 0.75rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 0.25rem;"><polyline points="20 6 9 17 4 12"/></svg>
                <div style="font-size: 0.95rem; color: var(--text-light); line-height: 1.6;">${finalScope[1]}</div>
              </li>
              <li style="margin-bottom: 0; display: flex; align-items: flex-start; gap: 0.75rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 0.25rem;"><polyline points="20 6 9 17 4 12"/></svg>
                <div style="font-size: 0.95rem; color: var(--text-light); line-height: 1.6;">${finalScope[2]}</div>
              </li>
            </ul>
            <div style="border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-color);">
              <img src="/public/images/services/${serviceSlug}.webp" alt="${serviceName} in ${cityName}, ${stateCode}" style="width: 100%; height: auto; display: block; object-fit: cover; max-height: 250px;">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BENEFITS SECTION -->
    <section class="section-padding bg-light-custom" style="border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
      <div class="container">
        <div style="text-align: center; max-width: 800px; margin: 0 auto 3.5rem;">
          <h2 style="font-size: 2.25rem; font-weight: 800; color: #fff; margin-bottom: 1rem;">Benefits of Professional ${serviceName}</h2>
          <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.7;">
            Getting expert ${serviceName.toLowerCase()} ensures that your plumbing system operates at peak efficiency and safety. By hiring Home Plumbing USA, you receive a reliable solution backed by upfront pricing and quality craftsmanship.
          </p>
        </div>
        
        <div class="grid-3" style="gap: 2rem;">
          <div class="benefit-card">
            <h3 style="color: #fff; margin-bottom: 0.75rem; font-size: 1.25rem; font-weight: 700;">${finalBenefits[0].title}</h3>
            <p style="font-size: 0.92rem; margin-bottom: 0; color: var(--text-muted); line-height: 1.65;">
              ${finalBenefits[0].desc}
            </p>
          </div>
          <div class="benefit-card">
            <h3 style="color: #fff; margin-bottom: 0.75rem; font-size: 1.25rem; font-weight: 700;">${finalBenefits[1].title}</h3>
            <p style="font-size: 0.92rem; margin-bottom: 0; color: var(--text-muted); line-height: 1.65;">
              ${finalBenefits[1].desc}
            </p>
          </div>
          <div class="benefit-card">
            <h3 style="color: #fff; margin-bottom: 0.75rem; font-size: 1.25rem; font-weight: 700;">${finalBenefits[2].title}</h3>
            <p style="font-size: 0.92rem; margin-bottom: 0; color: var(--text-muted); line-height: 1.65;">
              ${finalBenefits[2].desc}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ENVIRONMENTS & APPLICATIONS SERVED SECTION -->
    <section class="section-padding" style="background-color: var(--bg-dark);">
      <div class="container">
        <div class="grid-2" style="gap: 3.5rem; align-items: start;">
          <div>
            <div style="margin-bottom: 1.5rem;">
              <h2 style="font-size: 2.25rem; font-weight: 800; color: #fff; margin-bottom: 1rem;">Environments and Applications Served</h2>
              <div style="width: 50px; height: 3px; background: var(--primary); border-radius: 2px;"></div>
            </div>
            <p style="line-height: 1.8; margin-bottom: 1.5rem; color: var(--text-muted); font-size: 1.05rem;">
              We service all types of residential and commercial properties in ${cityName} (${zip}), adapting our equipment to the size, scale, and age of your plumbing infrastructure.
            </p>
            <div style="background-color: #111d33; padding: 1.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-top: 1.5rem;">
              <h4 style="color: #f87171; margin-bottom: 0.5rem; font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-triangle-exclamation"></i> ${finalWarningTitle}
              </h4>
              <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0; line-height: 1.6;">
                ${finalWarningDesc}
              </p>
            </div>
            <div style="margin-top: 2rem; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-color);">
              <img src="/public/images/services/${serviceSlug}-mobile.webp" alt="Professional ${serviceName} Solutions in ${cityName}" style="width: 100%; height: auto; display: block; object-fit: cover; max-height: 250px;">
            </div>
          </div>
          
          <div>
            <h3 style="color: #fff; margin-bottom: 1.5rem; font-size: 1.35rem; font-weight: 700;">Types of Properties We Service</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 1.5rem; display: flex; align-items: flex-start; gap: 0.75rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 0.25rem;"><polyline points="20 6 9 17 4 12"/></svg>
                <div style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6;">
                  <strong style="color: #fff;">${finalPropertyBullets[0].label}:</strong> ${finalPropertyBullets[0].desc}
                </div>
              </li>
              <li style="margin-bottom: 1.5rem; display: flex; align-items: flex-start; gap: 0.75rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 0.25rem;"><polyline points="20 6 9 17 4 12"/></svg>
                <div style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6;">
                  <strong style="color: #fff;">${finalPropertyBullets[1].label}:</strong> ${finalPropertyBullets[1].desc}
                </div>
              </li>
              <li style="margin-bottom: 0; display: flex; align-items: flex-start; gap: 0.75rem;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 0.25rem;"><polyline points="20 6 9 17 4 12"/></svg>
                <div style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6;">
                  <strong style="color: #fff;">${finalPropertyBullets[2].label}:</strong> ${finalPropertyBullets[2].desc}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 4-STEP SERVICE PROCESS SECTION -->
    <section class="section-padding bg-light-custom" style="border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
      <div class="container">
        <div style="text-align: center; margin-bottom: 4rem;">
          <span style="color: #38bdf8; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">How We Operate</span>
          <h2 style="margin-top: 0.5rem; font-size: 2.25rem; font-weight: 800; color: #fff;">Our 4-Step Local Service Process</h2>
          <p style="max-width: 600px; margin: 0.5rem auto 0; color: var(--text-muted); font-size: 1.05rem;">Getting expert plumbing support has never been easier or faster. We handle the hard work.</p>
        </div>
        
        <div style="position: relative;">
          <!-- Timeline horizontal line (Desktop) -->
          <div class="timeline-track-desktop" style="position: absolute; top: 27px; left: 10%; right: 10%; height: 2px; background: rgba(56, 189, 248, 0.2); z-index: 1;"></div>
          
          <div class="grid-4" style="gap: 2rem; position: relative; z-index: 2;">
            <div class="process-step-box">
              <div class="step-badge-num">${finalSteps[0].num}</div>
              <h3 style="color: #fff; font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem;">${finalSteps[0].title}</h3>
              <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 0;">${finalSteps[0].desc}</p>
            </div>
            <div class="process-step-box">
              <div class="step-badge-num">${finalSteps[1].num}</div>
              <h3 style="color: #fff; font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem;">${finalSteps[1].title}</h3>
              <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 0;">${finalSteps[1].desc}</p>
            </div>
            <div class="process-step-box">
              <div class="step-badge-num">${finalSteps[2].num}</div>
              <h3 style="color: #fff; font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem;">${finalSteps[2].title}</h3>
              <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 0;">${finalSteps[2].desc}</p>
            </div>
            <div class="process-step-box">
              <div class="step-badge-num">${finalSteps[3].num}</div>
              <h3 style="color: #fff; font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem;">${finalSteps[3].title}</h3>
              <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 0;">${finalSteps[3].desc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY PROPERTY OWNERS TRUST HOME PLUMBING USA (DARK BACKGROUND) -->
    <section class="section-padding bg-dark-custom" style="border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05);">
      <div class="container">
        <div class="grid-2" style="align-items: center; gap: 4rem;">
          
          <div>
            <span style="color: #38bdf8; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; display: block; margin-bottom: 0.5rem;">Premium Nationwide Network</span>
            <h2 style="color: #fff; font-size: 2.75rem; font-weight: 800; line-height: 1.2; margin-bottom: 1.5rem; letter-spacing: -0.01em;">Why Property Owners Trust Home Plumbing USA</h2>
            <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 2.5rem; max-width: 540px;">
              Our platform isn't just a list. We proactively background check, license-verify, and monitor customer reviews for every single plumbing provider within our national framework.
            </p>
            
            <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: var(--radius-md); padding: 1.25rem; display: flex; align-items: center; gap: 1rem; max-width: 440px;">
              <div style="background: rgba(37, 99, 235, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 50%; width: 46px; height: 46px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #38bdf8;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Direct Hotline: ${PHONE_DISPLAY}</div>
                <div style="font-size: 0.95rem; color: #fff; font-weight: 700; margin-top: 0.15rem;">Always Staffed by Real Coordinators</div>
              </div>
            </div>
          </div>
          
          <div class="grid-2" style="gap: 1.5rem; text-align: left;">
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 2rem 1.5rem; border-radius: var(--radius-md);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <h3 style="color: #fff; font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem;">Rapid Response Times</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 0;">Plumbing disasters won't wait. We coordinate swift-arrival plumbing trucks right to your doorstep immediately.</p>
            </div>
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 2rem 1.5rem; border-radius: var(--radius-md);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <h3 style="color: #fff; font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem;">Fully Vetted Pros</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 0;">All dispatched plumbers are drug tested, background-checked, and thoroughly certified in ${stateName}.</p>
            </div>
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 2rem 1.5rem; border-radius: var(--radius-md);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem;"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
              <h3 style="color: #fff; font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem;">Flat-Rate Pricing</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 0;">No tricks. You receive pricing that is clear, straightforward, and agreed upon beforehand.</p>
            </div>
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 2rem 1.5rem; border-radius: var(--radius-md);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem;"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <h3 style="color: #fff; font-size: 1.15rem; font-weight: 700; margin-bottom: 0.5rem;">Emergency & Routine</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 0;">Whether a midnight emergency rupture or routine plumbing repair, we resolve everything.</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>

    <!-- MAP SECTION -->
    <section class="section-padding" style="background-color: var(--bg-dark);">
      <div class="container" style="max-width: 900px; text-align: center;">
        <div style="margin-bottom: 2rem;">
          <h2 style="font-size: 2.25rem; font-weight: 800; color: #fff; margin-bottom: 0.75rem;">Our Service Area Map in ${cityName}, ${stateCode}</h2>
          <p style="color: var(--text-muted); font-size: 1.05rem;">We provide rapid response times across ${cityName} (${zip}) and surrounding areas.</p>
        </div>
        <div style="width: 100%; height: 450px; border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-md); border: 1px solid var(--border-color);">
          <iframe src="https://maps.google.com/maps?q=${encodeURIComponent(cityName)}%2C%20${stateCode}%20${zip}&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </section>

    <!-- FAQ SECTION -->
    <section class="section-padding bg-light-custom" style="border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
      <div class="container">
        <div style="text-align: center; max-width: 800px; margin: 0 auto 3rem;">
          <h2 style="font-size: 2.25rem; font-weight: 800; color: #fff; margin-bottom: 0.75rem;">Frequently Asked Questions About ${serviceName}</h2>
          <p style="color: var(--text-muted); font-size: 1.05rem;">Common questions about our professional ${serviceName.toLowerCase()} solutions in ${cityName}, ${stateCode} (${zip}).</p>
        </div>
        
        <div class="faq-container-custom">
          ${faqsHtml}
        </div>
      </div>
    </section>

    <!-- CALL TO ACTION (CTA) SECTION -->
    <section class="section-padding bg-dark-custom" style="text-align: center; border-bottom: 1px solid var(--border-color);">
      <div class="container" style="max-width: 750px; margin: 0 auto;">
        <h2 style="color: #fff; font-size: 2.35rem; margin-bottom: 1rem; font-weight: 800;">Need Professional ${serviceName}?</h2>
        <p style="font-size: 1.1rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 2rem;">
          Contact us now to get a transparent flat-rate quote for ${serviceName.toLowerCase()} in ${cityName}, ${stateCode} (${zip}). We offer no-obligation estimates and 24/7 emergency dispatch.
        </p>
        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          <a href="tel:${PHONE}" class="btn btn-primary" style="padding: 1rem 2.5rem; font-size: 1.15rem; font-weight: 700; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 10px;">
            <i class="fas fa-phone"></i> Call Now: ${PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  </main>

  <!-- FOOTER -->
  <footer class="footer" style="background: #070d18; border-top: 1px solid var(--border-color); padding: 5rem 0 2rem;">
    <div class="container">
      <div class="footer-grid-custom">
        <div class="footer-col">
          <div style="margin-bottom: 1.5rem;">
            <img src="/public/images/logo.svg" alt="Home Plumbing USA Logo" width="220" height="46" style="display: block;">
          </div>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.65; margin-bottom: 1.5rem;">
            We provide licensed and certified emergency plumbing repair, drain cleaning, and water pipe solutions across ${cityName}, ${stateCode} (${zip}) and surrounding communities. Available 24 hours a day to handle your repair requests.
          </p>
          <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9rem; color: var(--text-muted);">
            <div style="display: flex; align-items: center; gap: 8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <span>${PHONE_DISPLAY}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <span>contact@homeplumbingusa.com</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${cityName}, ${stateCode} ${zip}</span>
            </div>
          </div>
        </div>

        <div class="footer-col">
          <h3>Services Offered</h3>
          <ul class="footer-links-list">
            ${otherServicesHtml}
          </ul>
        </div>

        <div class="footer-col">
          <h3>Service Areas</h3>
          <ul class="footer-links-list">
            ${serviceAreasFooterHtml}
          </ul>
        </div>

        <div class="footer-col">
          <h3>Hours of Operation</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1rem;">
            We are open 24 hours a day, 7 days a week for emergency dispatches across ${cityName}.
          </p>
          <div style="font-size: 0.9rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.5rem;">
            <div><strong style="color: #fff;">Emergency Dispatch:</strong> 24 Hours / 7 Days</div>
            <div><strong style="color: #fff;">Office Hours:</strong> Mon - Sat: 8:00 AM - 6:00 PM</div>
          </div>
        </div>
      </div>

      <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 1.75rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; font-size: 0.85rem; color: var(--text-muted);">
        <p style="margin: 0;">&copy; 2026 Home Plumbing USA ${cityName}. All Rights Reserved. Nationwide Plumbing Referral Network.</p>
        <div style="display: flex; gap: 1.5rem;">
          <a href="/privacy-policy" style="color: inherit; text-decoration: none;">Privacy Policy</a>
          <a href="/terms-and-conditions" style="color: inherit; text-decoration: none;">Terms &amp; Conditions</a>
          <a href="/disclaimer" style="color: inherit; text-decoration: none;">Disclaimer</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Interactive Accordion & Mobile Navigation Script -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // FAQ Accordion
      const faqItems = document.querySelectorAll('.faq-item-custom');
      faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger-btn');
        const body = item.querySelector('.faq-body');
        
        trigger.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          
          faqItems.forEach(otherItem => {
            if (otherItem !== item) {
              otherItem.classList.remove('active');
              const otherBody = otherItem.querySelector('.faq-body');
              if (otherBody) otherBody.style.maxHeight = null;
            }
          });
          
          if (!isActive) {
            item.classList.add('active');
            body.style.maxHeight = body.scrollHeight + 'px';
          } else {
            item.classList.remove('active');
            body.style.maxHeight = null;
          }
        });
      });

      // Mobile Menu Toggle
      const menuToggle = document.querySelector('.menu-toggle');
      const mainNav = document.getElementById('mainNav');
      
      if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
          const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
          menuToggle.setAttribute('aria-expanded', !isExpanded);
          menuToggle.innerHTML = isExpanded ? '&#9776;' : '&times;';
          
          if (!isExpanded) {
            mainNav.style.display = 'block';
            mainNav.style.position = 'fixed';
            mainNav.style.top = '70px';
            mainNav.style.left = '0';
            mainNav.style.width = '100%';
            mainNav.style.height = 'calc(100vh - 70px)';
            mainNav.style.background = '#0a1628';
            mainNav.style.zIndex = '999';
            mainNav.style.padding = '2rem 1.5rem';
            mainNav.style.overflowY = 'auto';
            
            const ul = mainNav.querySelector('ul');
            if (ul) {
              ul.style.flexDirection = 'column';
              ul.style.alignItems = 'flex-start';
              ul.style.gap = '1.25rem';
            }
          } else {
            mainNav.style.display = '';
            mainNav.style.position = '';
            mainNav.style.top = '';
            mainNav.style.left = '';
            mainNav.style.width = '';
            mainNav.style.height = '';
            mainNav.style.background = '';
            mainNav.style.zIndex = '';
            mainNav.style.padding = '';
            mainNav.style.overflowY = '';
            
            const ul = mainNav.querySelector('ul');
            if (ul) {
              ul.style.flexDirection = '';
              ul.style.alignItems = '';
              ul.style.gap = '';
            }
          }
        });

        window.addEventListener('resize', () => {
          if (window.innerWidth > 992) {
            mainNav.removeAttribute('style');
            const ul = mainNav.querySelector('ul');
            if (ul) ul.removeAttribute('style');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.innerHTML = '&#9776;';
          }
        });
      }
    });
  </script>
</body>
</html>`;
}

module.exports = {
  renderServicePage,
  DEFAULT_SERVICES,
  DOMAIN,
  PHONE,
  PHONE_DISPLAY
};
