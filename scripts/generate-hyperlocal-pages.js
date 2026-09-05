const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://homeplumbingusa.com';
const seoPagesPath = path.join(__dirname, '..', 'database', 'seo-pages.json');

const STATE_CONFIG = {
  'AK': { name: 'Alaska', slug: 'alaska', region: 'arctic' },
  'TX': { name: 'Texas', slug: 'texas', region: 'hardwater_clay' },
  'FL': { name: 'Florida', slug: 'florida', region: 'coastal_humidity' }
};

const SERVICES = [
  { slug: 'drain-cleaning', name: 'Drain Cleaning' },
  { slug: 'burst-pipe-repair', name: 'Burst Pipe Repair' },
  { slug: 'water-heater-repair', name: 'Water Heater Repair' },
  { slug: 'sewer-line-repair', name: 'Sewer Line Repair' },
  { slug: 'emergency-plumbing', name: 'Emergency Plumbing' },
  { slug: 'leak-detection', name: 'Leak Detection' },
  { slug: 'gas-line-repair', name: 'Gas Line Repair' },
  { slug: 'water-line-repair', name: 'Water Line Repair' }
];

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

function getServiceCopy(serviceSlug, cityName, stateCode, stateName, zip) {
  const isAK = stateCode === 'AK';
  const isTX = stateCode === 'TX';
  const isFL = stateCode === 'FL';

  if (serviceSlug === 'drain-cleaning') {
    if (isTX) {
      return {
        h1: `Drain Cleaning Services in ${cityName}, ${stateCode} (${zip})`,
        problemTitle: `Stubborn Clogs & Hard Water Scale in ${cityName}`,
        problem: `Heavy limestone and mineral concentration in ${cityName}'s municipal water supply binds with household grease and soap scum, creating stubborn calcified scale inside residential drain pipes. In ${cityName} (${zip}), our certified drain cleaning specialists utilize industrial motorized snake augers and high-velocity hydro-jetting to strip pipe walls spotless without corrosive chemicals.`,
        techniqueTitle: `High-Velocity Hydro-Jetting & Video Camera Diagnostics`,
        technique: `We begin every drain service in ${cityName} with a high-definition digital sewer camera inspection to locate root intrusion and grease blockage. We then deploy precision 4,000 PSI hydro-jetting nozzles that scour lines down to the original pipe material, followed by hydrostatic flow checks to guarantee rapid drainage.`
      };
    } else if (isFL) {
      return {
        h1: `Drain Cleaning Services in ${cityName}, ${stateCode} (${zip})`,
        problemTitle: `Coastal Soil Drainage & Kitchen Grease Blockages in ${cityName}`,
        problem: `High groundwater tables and sandy sub-soils across ${cityName} (${zip}) place continuous stress on residential drainage systems. Kitchen grease, organic sludge, and aggressive tree roots frequently obstruct main sewer exits, leading to slow-draining showers, gurgling toilets, and unsanitary wastewater backups during heavy Florida rains.`,
        techniqueTitle: `Professional Rooter & Jetting Solutions in ${cityName}`,
        technique: `Our licensed ${cityName} plumbers utilize flexible motorized cutting heads to chop through thick tree root networks, paired with commercial hydro-jetting to liquefy trapped grease and sediment. We perform comprehensive cleanout inspections to restore free-flowing drainage throughout your property.`
      };
    } else {
      return {
        h1: `Drain Cleaning Services in ${cityName}, ${stateCode} (${zip})`,
        problemTitle: `Sub-Zero Freeze Clogs & Drain Blockages in ${cityName}`,
        problem: `In ${cityName} (${zip}), sub-zero winter temperatures cause wastewater fats and food solids to solidify rapidly as they travel through cold foundation lines. Our licensed ${cityName} technicians provide heavy-duty motorized rooter service, thermal defrosting, and hydro-jetting to blast through hardened obstructions and restore drainage capacity.`,
        techniqueTitle: `Precision Jetting & Camera Inspection Protocols`,
        technique: `Using digital CCTV camera locators, we inspect deep drainage conduits beneath your ${cityName} property. We then apply commercial hydro-jetting technology to scour pipe walls clean of glacial silt and grease, finishing with multi-point flow verification.`
      };
    }
  }

  if (serviceSlug === 'burst-pipe-repair') {
    if (isTX) {
      return {
        h1: `Emergency Burst Pipe Repair in ${cityName}, ${stateCode} (${zip})`,
        problemTitle: `Sudden Freeze & Soil Shift Pipe Fractures in ${cityName}`,
        problem: `Winter freezes and expansive blackland clay soil movement in ${cityName} (${zip}) subject residential plumbing lines to extreme stress. When uninsulated attic pipes freeze or shifting foundations stress rigid copper lines, sudden pipe ruptures can discharge hundreds of gallons of pressurized water inside your home within minutes.`,
        techniqueTitle: `Rapid Line Isolation & Structural PEX / Copper Replacement`,
        technique: `Our 24/7 emergency repair crews in ${cityName} immediately isolate ruptured supply manifolds, excise damaged pipe segments, and install freeze-tolerant PEX-A expansion piping or heavy-gauge copper with seismic-grade fittings to safeguard against future pressure ruptures.`
      };
    } else if (isFL) {
      return {
        h1: `Burst Pipe & Major Leak Repair in ${cityName}, ${stateCode} (${zip})`,
        problemTitle: `High-Pressure Pipe Ruptures & Salt Air Corrosion in ${cityName}`,
        problem: `Corrosive coastal humidity, water hammer surges, and aging copper pipe deterioration in ${cityName} (${zip}) can cause sudden supply line ruptures. Pressurized pipe bursts flood drywall, attic spaces, and flooring, requiring immediate professional isolation to halt property damage and prevent mold growth.`,
        techniqueTitle: `Emergency Water Isolation & Long-Lasting Pipe Restoration`,
        technique: `Our licensed ${cityName} plumbers arrive with fully stocked emergency vehicles to shut off main feeds, perform hydraulic crimp repairs, and replace failed lines with corrosion-resistant CPVC or PEX tubing built to withstand Florida's coastal climate.`
      };
    } else {
      return {
        h1: `Emergency Burst Pipe Repair in ${cityName}, ${stateCode} (${zip})`,
        problemTitle: `Arctic Freeze Pipe Ruptures in ${cityName}`,
        problem: `When arctic cold fronts drop temperatures below zero in ${cityName} (${zip}), unheated crawl space and wall pipes freeze rapidly. As expanding ice builds hydrostatic pressure, pipe walls split, causing massive flooding upon thaw. Our 24/7 crews provide emergency line thaw, freeze extraction, and permanent pipe reconstruction.`,
        techniqueTitle: `Safe Electrical Thaw & Heavy-Duty Pipe Reconstruction`,
        technique: `We utilize controlled thermal thaw machinery to eliminate freeze plugs safely without torch fire hazards. Damaged pipe sections are replaced with heavy-duty Type L copper or PEX-A expansions wrapped in commercial closed-cell thermal insulation.`
      };
    }
  }

  if (serviceSlug === 'water-heater-repair') {
    if (isTX) {
      return {
        h1: `Water Heater Repair & Replacement in ${cityName}, ${stateCode} (${zip})`,
        problemTitle: `Mineral Scale Build-Up & Heating Element Failure in ${cityName}`,
        problem: `High calcium hardness in ${cityName} (${zip}) water creates heavy sediment crusting along the bottom of tank water heaters and inside tankless heat exchangers. This mineral buildup causes popping noises, burner flameouts, lukewarm water, and premature tank corrosion throughout ${cityName} homes.`,
        techniqueTitle: `Tankless Descaling, Element Testing & Code-Compliant Installs`,
        technique: `Our certified technicians test thermocouples, gas valves, and heating elements. We perform chemical descaling on tankless systems and install high-efficiency Rheem and Bradford White units equipped with expansion tanks and pressure relief lines meeting ${stateName} codes.`
      };
    } else if (isFL) {
      return {
        h1: `Water Heater Repair & Installation in ${cityName}, ${stateCode} (${zip})`,
        problemTitle: `Rapid Anode Depletion & Thermostat Breakdown in ${cityName}`,
        problem: `High ambient humidity and mineral-rich groundwater in ${cityName} (${zip}) accelerate sacrificial anode rod degradation and thermostat failures. Homeowners frequently encounter leaking temperature-pressure relief valves, pilot light failures, or total loss of hot water during peak morning demand.`,
        techniqueTitle: `Comprehensive Diagnostics & Energy-Efficient Replacements`,
        technique: `We test electrical circuits, gas burner manifolds, and heating elements for maximum safety. When replacement is required, we install energy-efficient hybrid heat pump or gas tankless water heaters engineered to reduce utility costs across ${cityName}.`
      };
    } else {
      return {
        h1: `Water Heater Repair & Installation in ${cityName}, ${stateCode} (${zip})`,
        problemTitle: `Extreme Cold Water Thermal Shock in ${cityName}`,
        problem: `Near-freezing incoming groundwater in ${cityName} (${zip}) forces residential water heaters to run under heavy thermal load. Our licensed water heater specialists provide same-day diagnostics, heating element swaps, gas valve tuning, and code-compliant installations.`,
        techniqueTitle: `High-Efficiency Northern-Climate Water Heater Installs`,
        technique: `We inspect gas burner assemblies, electric thermostats, and relief valves. When systems reach the end of their lifespan, we supply and install top-tier cold-climate tankless and heavy-insulated tank heaters with seismic safety strapping.`
      };
    }
  }

  if (serviceSlug === 'sewer-line-repair') {
    return {
      h1: `Sewer Line Repair & Trenchless Replacement in ${cityName}, ${stateCode} (${zip})`,
      problemTitle: `Underground Sewer Main Fractures & Root Intrusion in ${cityName}`,
      problem: `Ground shifting, soil moisture fluctuations, and aggressive tree root invasion in ${cityName} (${zip}) cause underground sewer pipes to crack, offset, or belly. When sewer lines collapse, hazardous wastewater backs up into household floor drains, toilets, and showers, demanding swift professional repair.`,
      techniqueTitle: `Non-Invasive Trenchless CIPP Relining & Video Locating`,
      technique: `We deploy high-resolution CCTV sewer cameras with sonic locators to identify exact line defects in ${cityName}. We then install seamless epoxy-saturated CIPP liners or perform hydraulic pipe bursting to renew the sewer main without digging up yards or driveways.`
    };
  }

  if (serviceSlug === 'emergency-plumbing') {
    return {
      h1: `24/7 Emergency Plumbing Services in ${cityName}, ${stateCode} (${zip})`,
      problemTitle: `Urgent Plumbing Failures Requiring Immediate Dispatch in ${cityName}`,
      problem: `Major water main breaks, sewer overflows, gas leaks, and failed main shut-off valves in ${cityName} (${zip}) cause rapid property damage and acute safety hazards. Home Plumbing USA connects you with vetted, licensed emergency plumbers available 24/7/365 with average arrival times under 45 minutes.`,
      techniqueTitle: `Emergency System Stabilization & Precision Repairs`,
      technique: `Upon arrival in ${cityName}, technicians isolate active water and gas feeds, perform rapid pressure diagnostics, execute emergency bypasses or component replacements, and fully restore your property's plumbing integrity.`
    };
  }

  if (serviceSlug === 'leak-detection') {
    return {
      h1: `Precision Slab & Pipe Leak Detection in ${cityName}, ${stateCode} (${zip})`,
      problemTitle: `Hidden Pipe Leaks & Concrete Slab Fractures in ${cityName}`,
      problem: `Under-slab copper line erosion and shifting foundations in ${cityName} (${zip}) cause concealed water leaks beneath concrete floors and inside walls. Hot floor spots, mold odors, unexplained sound of running water, and spiking utility bills indicate an urgent hidden leak.`,
      techniqueTitle: `Non-Destructive Acoustic & Thermal Imaging Diagnostics`,
      technique: `Our ${cityName} leak specialists utilize ultrasonic listening microphones, digital pressure decay testing, and infrared thermal imaging to pinpoint leak locations to the inch, enabling targeted spot repairs with minimal drywall or concrete removal.`
    };
  }

  if (serviceSlug === 'gas-line-repair') {
    return {
      h1: `Gas Line Repair & Installation in ${cityName}, ${stateCode} (${zip})`,
      problemTitle: `Gas Line Corrosion & Leak Hazards in ${cityName}`,
      problem: `Natural gas and propane line deterioration in ${cityName} (${zip}) presents severe fire and health risks. Rotten-egg mercaptan odors, hissing pipes near water heaters or furnaces, and dead vegetation over gas feeds require immediate professional pressure testing and licensed repair.`,
      techniqueTitle: `Electronic Gas Sniffing, Pressure Manifold Tests & Code Approval`,
      technique: `Our licensed ${cityName} gas technicians execute digital combustible gas detection, replace corroded black iron or CSST lines, install emergency automatic shut-off valves, and facilitate municipal safety inspections and utility re-connections.`
    };
  }

  if (serviceSlug === 'water-line-repair') {
    return {
      h1: `Main Water Line Repair & Replacement in ${cityName}, ${stateCode} (${zip})`,
      problemTitle: `Main Water Supply Breaks & Pressure Loss in ${cityName}`,
      problem: `Corrosion, tree roots, and underground soil pressure in ${cityName} (${zip}) can rupture your main water service line between the street meter and your home. Soggy lawn patches, discolored tap water, and sudden drops in household water pressure signal a water main rupture.`,
      techniqueTitle: `Trenchless Directional Boring & Seamless HDPE Lines`,
      technique: `We pull heavy-duty, seamless high-density polyethylene (HDPE) or copper water lines beneath driveways and sidewalks in ${cityName} using trenchless boring equipment, installing durable brass curb stops and backflow preventers.`
    };
  }

  return {
    h1: `Professional Plumbing Services in ${cityName}, ${stateCode} (${zip})`,
    problemTitle: `Reliable Plumbing Solutions in ${cityName}`,
    problem: `For residential and commercial properties in ${cityName} (${zip}), our licensed contractors provide complete plumbing repairs, installations, and 24/7 emergency dispatch.`,
    techniqueTitle: `State-Certified Craftsmanship & Upfront Pricing`,
    technique: `Every plumbing job in ${cityName} is executed using premium code-compliant materials, transparent flat-rate quotes, and multi-point flow testing.`
  };
}

function generateWorkflowHtml(serviceName, cityName, stateCode) {
  return `
    <div class="workflow-list">
      <div class="workflow-step">
        <div class="step-num">1</div>
        <div>
          <h4>Direct Dispatch Coordination</h4>
          <p>Contact our local ${cityName} dispatch team 24/7. We match you with an active, certified ${serviceName.toLowerCase()} technician stationed nearest to your address.</p>
        </div>
      </div>
      <div class="workflow-step">
        <div class="step-num">2</div>
        <div>
          <h4>On-Site Physical Diagnosis</h4>
          <p>Our licensed plumber arrives on-site in ${cityName} with a fully-equipped service vehicle to conduct a comprehensive structural and pressure inspection.</p>
        </div>
      </div>
      <div class="workflow-step">
        <div class="step-num">3</div>
        <div>
          <h4>Upfront Flat-Rate Estimate</h4>
          <p>You receive an itemized, transparent quote with zero hidden charges before any repair or excavation work commences.</p>
        </div>
      </div>
      <div class="workflow-step">
        <div class="step-num">4</div>
        <div>
          <h4>Precision Execution & Code Compliance</h4>
          <p>Repairs are completed utilizing commercial-grade materials compliant with ${stateCode} municipal building and safety regulations.</p>
        </div>
      </div>
      <div class="workflow-step">
        <div class="step-num">5</div>
        <div>
          <h4>Hydrostatic Verification & Flow Testing</h4>
          <p>We execute multi-point pressure and flow diagnostics to verify zero leaks and 100% operational restoration before concluding the service.</p>
        </div>
      </div>
    </div>
  `;
}

function generateFaqsHtml(serviceName, cityName, stateName, zip) {
  const faqs = [
    {
      q: `How quickly can an emergency plumber arrive for ${serviceName.toLowerCase()} in ${cityName} ${zip}?`,
      a: `In ${cityName} (${zip}), emergency response plumbers in our network maintain an average response arrival time of 30 to 45 minutes for urgent situations like major line bursts, leaks, or backups.`
    },
    {
      q: `Are your technicians licensed, bonded, and insured in ${stateName}?`,
      a: `Yes. Every plumber matched through Home Plumbing USA holds active state-level licensing, liability bonding, and comprehensive insurance in compliance with ${stateName} building codes.`
    },
    {
      q: `Do you charge extra for nights, weekends, or holidays in ${cityName}?`,
      a: `No. We provide 24/7 dispatch services 365 days a year with transparent, upfront flat-rate quotes so you know the exact cost before work begins.`
    },
    {
      q: `Do you offer warranties on parts and labor for ${serviceName.toLowerCase()}?`,
      a: `Yes. All service repairs and replacement installations come backed with comprehensive contractor warranties on both manufacturer materials and labor craftsmanship.`
    }
  ];

  return faqs.map(faq => `
    <div class="faq-item" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 12px; overflow: hidden;">
      <details style="padding: 18px 20px;">
        <summary style="font-weight: 700; color: var(--text-white); cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-size: 1.05rem;">
          <span>${faq.q}</span>
          <i class="fas fa-chevron-down" style="color: var(--primary); font-size: 0.85rem;"></i>
        </summary>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.7; margin-top: 14px; margin-bottom: 0;">${faq.a}</p>
      </details>
    </div>
  `).join('\n');
}

function buildServicePage(state, cityZip, service, nearbyZips) {
  const stateSlug = state.slug;
  const stateName = state.name;
  const stateCode = state.code;
  const cityName = cityZip.city;
  const zip = cityZip.zip;
  const cityZipSlug = cityZip.folder_name || `${slugify(cityName)}-${zip}`;
  const serviceSlug = service.slug;
  const serviceName = service.name;

  const pageUrl = `${DOMAIN}/${stateSlug}/${cityZipSlug}/${serviceSlug}/`;
  const hubUrl = `${DOMAIN}/${stateSlug}/${cityZipSlug}/`;
  const stateUrl = `${DOMAIN}/state/${stateSlug}/`;

  // Unique Title Tag (<= 60 chars)
  let title = `${serviceName} in ${cityName}, ${stateCode} ${zip} | 24/7 Plumbers`;
  if (title.length > 60) {
    title = `${serviceName} in ${cityName}, ${stateCode} ${zip} | Fast Repair`;
  }
  if (title.length > 60) {
    title = `${serviceName} in ${cityName} ${zip} | Home Plumbing USA`;
  }

  // Unique Meta Description (Strictly 150-160 chars)
  const metaDescriptions = [
    `Need ${serviceName.toLowerCase()} in ${cityName}, ${stateCode} (${zip})? Home Plumbing USA connects you with vetted, 24/7 licensed local plumbers. Call 877-516-8705 for fast service!`,
    `Looking for fast ${serviceName.toLowerCase()} in ${cityName} ${zip}? Home Plumbing USA matches you with licensed local plumbers for 24/7 emergency repairs. Call 877-516-8705!`,
    `Top-rated ${serviceName.toLowerCase()} in ${cityName}, ${stateCode} ${zip}. Connect with licensed local plumbers for same-day & 24/7 emergency repairs. Call 877-516-8705 now!`
  ];
  let metaDesc = metaDescriptions[0];
  for (const m of metaDescriptions) {
    if (m.length >= 150 && m.length <= 160) {
      metaDesc = m;
      break;
    }
  }

  const copy = getServiceCopy(serviceSlug, cityName, stateCode, stateName, zip);
  const workflowHtml = generateWorkflowHtml(serviceName, cityName, stateCode);
  const faqsHtml = generateFaqsHtml(serviceName, cityName, stateName, zip);

  const otherServicesHtml = SERVICES.filter(s => s.slug !== serviceSlug).map(s => `
    <a href="/${stateSlug}/${cityZipSlug}/${s.slug}/" class="list-link">
      <span><i class="fas fa-wrench" style="margin-right: 8px; color: var(--primary);"></i> ${s.name}</span>
      <i class="fas fa-chevron-right"></i>
    </a>
  `).join('\n');

  const nearbyHtml = nearbyZips.slice(0, 8).map(nz => `
    <a href="/${stateSlug}/${nz.slug}/${serviceSlug}/" class="list-link">
      <span><i class="fas fa-map-marker-alt" style="margin-right: 8px; color: var(--primary);"></i> ${nz.city} (${nz.zip})</span>
      <i class="fas fa-chevron-right"></i>
    </a>
  `).join('\n');

  const schemaObj = {
    "@context": "https://schema.org",
    "@type": "PlumbingService",
    "name": `Home Plumbing USA - ${serviceName} in ${cityName} (${zip})`,
    "description": metaDesc,
    "url": pageUrl,
    "telephone": "877-516-8705",
    "priceRange": "$$",
    "areaServed": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressRegion": stateCode,
      "postalCode": zip,
      "addressCountry": "US"
    },
    "provider": {
      "@type": "LocalBusiness",
      "name": "Home Plumbing USA",
      "image": "https://homeplumbingusa.com/public/images/hero-plumbing.webp"
    }
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${metaDesc}">
  <meta name="keywords" content="${serviceName.toLowerCase()} ${cityName} ${stateCode}, emergency plumbers ${cityName} ${zip}, 24/7 plumber ${cityName}, ${serviceName.toLowerCase()} repair ${zip}">
  <link rel="canonical" href="${pageUrl}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:image" content="https://homeplumbingusa.com/public/images/hero-plumbing.webp">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${pageUrl}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${metaDesc}">
  <meta name="twitter:image" content="https://homeplumbingusa.com/public/images/hero-plumbing.webp">

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
${JSON.stringify(schemaObj, null, 2)}
  </script>

  <link rel="preload" as="image" href="/public/images/hero-plumbing-mobile.webp" fetchpriority="high" media="(max-width: 600px)">
  <link rel="preload" as="image" href="/public/images/hero-plumbing.webp" fetchpriority="high" media="(min-width: 601px)">

  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-NHGT9PF7');</script>
  <!-- End Google Tag Manager -->

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="/css/style.css">

  <style>
    .detail-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 40px; margin-top: 40px; }
    .detail-main { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 36px; }
    .detail-main h2 { font-size: 1.6rem; font-weight: 800; color: var(--text-white); margin-top: 32px; margin-bottom: 14px; }
    .detail-main h2:first-of-type { margin-top: 0; }
    .detail-main p { font-size: 1.05rem; color: var(--text-muted); line-height: 1.8; margin-bottom: 18px; }
    .workflow-list { display: flex; flex-direction: column; gap: 16px; margin: 24px 0; }
    .workflow-step { display: flex; gap: 16px; align-items: flex-start; }
    .workflow-step .step-num { flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; background: var(--gradient-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; }
    .workflow-step h4 { color: var(--text-white); font-size: 1.05rem; font-weight: 700; margin-bottom: 4px; }
    .workflow-step p { font-size: 0.95rem; margin: 0; }
    .detail-sidebar { display: flex; flex-direction: column; gap: 24px; }
    .sidebar-widget { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 26px; }
    .sidebar-widget h3 { font-size: 1.2rem; font-weight: 800; color: var(--text-white); margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; }
    .sidebar-widget a.list-link { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-bottom: 8px; font-size: 0.92rem; color: var(--text-muted); transition: var(--transition); text-decoration: none; }
    .sidebar-widget a.list-link:hover { background: var(--primary); color: #fff; border-color: var(--primary); }
    .cta-widget { background: linear-gradient(135deg, #1e3a8a 0%, #0f1e3a 100%); border: 2px solid var(--primary); text-align: center; }
    .cta-widget h3 { border: none; color: #fff; }
    .breadcrumbs { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; font-size: 0.9rem; margin-bottom: 24px; color: var(--text-muted); }
    .breadcrumbs a { color: var(--primary); text-decoration: none; font-weight: 600; }
    .breadcrumbs a:hover { text-decoration: underline; }
    @media (max-width: 992px) {
      .detail-layout { grid-template-columns: 1fr; }
    }
  </style>
  <link rel="icon" type="image/png" href="/public/images/favicon.png">
</head>
<body data-prefix="/" data-depth="0">

  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NHGT9PF7"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->

  <!-- HEADER -->
  <header class="header" id="header" style="min-height: 120px;">
    <div class="top-bar" style="min-height: 40px; height: 40px; display: flex; align-items: center; justify-content: center; text-align: center; white-space: nowrap;">
      <div class="top-bar-content">
        <span class="pulse-dot"></span>
        <span>24/7 Emergency Plumbers in <strong>${cityName}, ${stateCode}</strong> - Fast Local Dispatch!</span>
      </div>
    </div>
    <div class="header-inner" style="min-height: 80px; height: 80px; display: flex; align-items: center; justify-content: space-between;">
      <a href="/" class="logo" style="width: 247px; max-width: 100%; display: flex; align-items: center;">
        <img src="/public/images/logo.svg" alt="Home Plumbing USA Logo" class="logo-img" width="247" height="52" style="width: 247px; height: 52px; display: block; object-fit: contain;">
      </a>

      <nav class="nav" id="mainNav">
        <a href="/" class="nav-link">Home</a>
        <a href="${stateUrl}" class="nav-link">${stateName} Plumbers</a>
        <a href="${hubUrl}" class="nav-link">${cityName} (${zip})</a>
        <a href="/contact" class="nav-link">Contact</a>
      </nav>

      <div class="header-cta">
        <a href="tel:877-516-8705" class="header-phone"><i class="fas fa-phone"></i> 877-516-8705</a>
        <a href="tel:877-516-8705" class="btn btn-primary btn-sm">Call 24/7</a>
      </div>
    </div>
  </header>

  <main>
    <!-- HERO SECTION -->
    <section class="hero" style="padding: 60px 0 40px; background: var(--gradient-hero);">
      <div class="container">
        <div class="breadcrumbs">
          <a href="/">Home</a>
          <i class="fas fa-chevron-right" style="font-size: 0.75rem;"></i>
          <a href="${stateUrl}">${stateName}</a>
          <i class="fas fa-chevron-right" style="font-size: 0.75rem;"></i>
          <a href="${hubUrl}">${cityName} (${zip})</a>
          <i class="fas fa-chevron-right" style="font-size: 0.75rem;"></i>
          <span style="color: var(--text-white);">${serviceName}</span>
        </div>

        <div class="hero-grid">
          <div class="hero-content">
            <div class="hero-badge"><i class="fas fa-shield-alt"></i> Licensed & Insured in ${stateName}</div>
            <h1 style="font-size: 2.8rem; font-weight: 900; line-height: 1.15; color: #fff; margin: 12px 0 18px;">${copy.h1}</h1>
            <p class="hero-text" style="font-size: 1.15rem; color: rgba(255,255,255,0.9); line-height: 1.6; margin-bottom: 24px;">${copy.problem}</p>
            <div class="hero-buttons">
              <a href="tel:877-516-8705" class="btn btn-accent btn-lg"><i class="fas fa-phone"></i> Call 877-516-8705</a>
              <a href="#services-list" class="btn btn-outline btn-lg"><i class="fas fa-list-check"></i> Service Details</a>
            </div>
          </div>
          <div class="hero-image-wrapper">
            <div class="hero-image-container" style="max-width: 420px; aspect-ratio: 4 / 5; background: #0f1e3a; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-color);">
              <img src="/public/images/hero-plumbing.webp" srcset="/public/images/hero-plumbing-mobile.webp 480w, /public/images/hero-plumbing.webp 1200w" sizes="(max-width: 600px) 480px, 1200px" alt="${serviceName} in ${cityName}, ${stateCode}" class="hero-image" width="600" height="750" fetchpriority="high" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTENT BODY -->
    <section class="section" id="services-list">
      <div class="container">
        <div class="detail-layout">
          <!-- MAIN CONTENT -->
          <div class="detail-main">
            <h2>${copy.problemTitle}</h2>
            <p>${copy.problem}</p>

            <h2>${copy.techniqueTitle}</h2>
            <p>${copy.technique}</p>

            <h2 style="margin-top: 36px;">Our 5-Step Service Process in ${cityName}</h2>
            ${workflowHtml}

            <h2 style="margin-top: 40px; margin-bottom: 20px;">Frequently Asked Questions in ${cityName} (${zip})</h2>
            ${faqsHtml}
          </div>

          <!-- SIDEBAR -->
          <div class="detail-sidebar">
            <div class="sidebar-widget cta-widget">
              <div style="font-size: 2.5rem; color: var(--accent); margin-bottom: 10px;"><i class="fas fa-phone-volume"></i></div>
              <h3>Need Help in ${cityName}?</h3>
              <p>Certified local technicians available 24/7. Average response time is 30–45 minutes in ${zip}.</p>
              <a href="tel:877-516-8705" class="btn btn-accent" style="width: 100%; padding: 14px; font-weight: 700; font-size: 1.05rem;"><i class="fas fa-phone"></i> 877-516-8705</a>
            </div>

            <div class="sidebar-widget">
              <h3>Plumbing Services in ${zip}</h3>
              ${otherServicesHtml}
            </div>

            <div class="sidebar-widget">
              <h3>Nearby Areas in ${stateName}</h3>
              ${nearbyHtml}
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-about">
          <a href="/" class="logo footer-logo">
            <img src="/public/images/logo.svg" alt="Home Plumbing USA Logo" class="logo-img" width="247" height="52">
          </a>
          <h3 class="footer-title">Top-Rated Plumbers in ${cityName}, ${stateCode}</h3>
          <p class="footer-brand-subheading">Connecting property owners across ${cityName} (${zip}) with vetted, certified local plumbing contractors for 24/7 repairs.</p>
        </div>
        <div class="footer-col">
          <div class="footer-title">Quick Links</div>
          <a href="/">Home</a>
          <a href="${stateUrl}">${stateName} Plumbers</a>
          <a href="${hubUrl}">${cityName} (${zip})</a>
          <a href="/contact">Contact Us</a>
        </div>
        <div class="footer-col">
          <div class="footer-title">Emergency Services</div>
          <a href="/${stateSlug}/${cityZipSlug}/emergency-plumbing/">Emergency Plumbing</a>
          <a href="/${stateSlug}/${cityZipSlug}/burst-pipe-repair/">Burst Pipe Repair</a>
          <a href="/${stateSlug}/${cityZipSlug}/water-heater-repair/">Water Heater Repair</a>
          <a href="/${stateSlug}/${cityZipSlug}/drain-cleaning/">Drain Cleaning</a>
        </div>
        <div class="footer-col">
          <div class="footer-title">24/7 Dispatch</div>
          <p>Call our active dispatch supervisor for ${cityName} right now:</p>
          <a href="tel:877-516-8705" class="footer-call-btn" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: var(--accent); color: #fff; border-radius: 8px; text-decoration: none; font-weight: 700;"><i class="fas fa-phone"></i> 877-516-8705</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Home Plumbing USA. All rights reserved. Nationwide Plumbing Referral Network.</p>
        <div class="footer-links" style="margin-top: 8px; font-size: 12px;">
          <a href="/privacy-policy">Privacy Policy</a> &middot;
          <a href="/terms-and-conditions">Terms & Conditions</a> &middot;
          <a href="/disclaimer">Disclaimer</a>
        </div>
      </div>
    </div>
  </footer>
</body>
</html>`;
}
const { buildCityZipHub } = require('./generate-city-hubs');

function main() {
  console.log('=== Starting Nationwide Hyper-Local Static Generation Pipeline ===');

  if (!fs.existsSync(seoPagesPath)) {
    console.error('database/seo-pages.json not found!');
    process.exit(1);
  }

  console.log('Loading database/seo-pages.json...');
  const seoData = JSON.parse(fs.readFileSync(seoPagesPath, 'utf8'));

  // Group locations by state code
  const locationsByState = new Map();
  seoData.forEach(loc => {
    if (!loc.state || !loc.city || !loc.zip) return;
    const st = loc.state.toUpperCase();
    if (!locationsByState.has(st)) {
      locationsByState.set(st, []);
    }
    const cleanCity = loc.city.trim();
    const cityZipSlug = `${slugify(cleanCity)}-${loc.zip}`;
    locationsByState.get(st).push({
      state: st,
      city: cleanCity,
      zip: loc.zip,
      folder_name: cityZipSlug,
      nearby: loc.nearby_areas || []
    });
  });

  let grandTotal = 0;

  for (const [stCode, locList] of locationsByState.entries()) {
    const stateCfg = STATE_CONFIG[stCode] || {
      name: stCode,
      slug: slugify(stCode),
      code: stCode
    };
    stateCfg.code = stCode;

    console.log(`\nProcessing ${stateCfg.name} (${stCode}): ${locList.length} locations...`);

    const stateOutDir = path.join(__dirname, '..', stateCfg.slug);
    if (!fs.existsSync(stateOutDir)) {
      fs.mkdirSync(stateOutDir, { recursive: true });
    }

    // Build nearby lookup list for this state
    const allStateZips = locList.map(l => ({
      city: l.city,
      zip: l.zip,
      slug: l.folder_name
    }));

    let statePagesCount = 0;

    locList.forEach((loc, index) => {
      const cityZipDir = path.join(stateOutDir, loc.folder_name);
      if (!fs.existsSync(cityZipDir)) {
        fs.mkdirSync(cityZipDir, { recursive: true });
      }

      // Pick nearby locations from the same state
      const nearbyForLoc = allStateZips.filter(z => z.zip !== loc.zip);

      // 1. Hub page
      const hubHtml = buildCityZipHub(stateCfg, loc, nearbyForLoc);
      fs.writeFileSync(path.join(cityZipDir, 'index.html'), hubHtml, 'utf8');
      statePagesCount++;

      // 2. Eight service pages
      SERVICES.forEach(service => {
        const serviceDir = path.join(cityZipDir, service.slug);
        if (!fs.existsSync(serviceDir)) {
          fs.mkdirSync(serviceDir, { recursive: true });
        }
        const serviceHtml = buildServicePage(stateCfg, loc, service, nearbyForLoc);
        fs.writeFileSync(path.join(serviceDir, 'index.html'), serviceHtml, 'utf8');
        statePagesCount++;
      });

      if ((index + 1) % 250 === 0 || index + 1 === locList.length) {
        console.log(`  [${stateCfg.name}] Generated ${index + 1}/${locList.length} locations (${statePagesCount} pages)...`);
      }
    });

    console.log(`Finished ${stateCfg.name}: Total ${statePagesCount} static pages generated.`);
    grandTotal += statePagesCount;
  }

  console.log(`\n======================================================`);
  console.log(`All target states complete! Total static pages created: ${grandTotal}`);
  console.log(`======================================================`);
}

main();
