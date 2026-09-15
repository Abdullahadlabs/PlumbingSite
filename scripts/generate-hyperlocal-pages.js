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

function normalizeCanonicalUrl(url) {
  if (!url) return '';
  const normalized = url.replace(/(https?:\/\/)|(\/)+/g, (m, proto) => proto || '/');
  return normalized.endsWith('/') ? normalized : `${normalized}/`;
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
        h1: `Burst Pipe Repair Services in ${cityName}, ${stateCode} (${zip})`,
        problemTitle: `Sudden Freeze & Soil Shift Pipe Fractures in ${cityName}`,
        problem: `Winter freezes and expansive blackland clay soil movement in ${cityName} (${zip}) subject residential plumbing lines to extreme stress. When uninsulated attic pipes freeze or shifting foundations stress rigid copper lines, sudden pipe ruptures can discharge hundreds of gallons of pressurized water inside your home within minutes.`,
        techniqueTitle: `Rapid Line Isolation & Structural PEX / Copper Replacement`,
        technique: `Our 24/7 emergency repair crews in ${cityName} immediately isolate ruptured supply manifolds, excise damaged pipe segments, and install freeze-tolerant PEX-A expansion piping or heavy-gauge copper with seismic-grade fittings to safeguard against future pressure ruptures.`
      };
    } else if (isFL) {
      return {
        h1: `Burst Pipe Repair Services in ${cityName}, ${stateCode} (${zip})`,
        problemTitle: `High-Pressure Pipe Ruptures & Salt Air Corrosion in ${cityName}`,
        problem: `Corrosive coastal humidity, water hammer surges, and aging copper pipe deterioration in ${cityName} (${zip}) can cause sudden supply line ruptures. Pressurized pipe bursts flood drywall, attic spaces, and flooring, requiring immediate professional isolation to halt property damage and prevent mold growth.`,
        techniqueTitle: `Emergency Water Isolation & Long-Lasting Pipe Restoration`,
        technique: `Our licensed ${cityName} plumbers arrive with fully stocked emergency vehicles to shut off main feeds, perform hydraulic crimp repairs, and replace failed lines with corrosion-resistant CPVC or PEX tubing built to withstand Florida's coastal climate.`
      };
    } else {
      return {
        h1: `Burst Pipe Repair Services in ${cityName}, ${stateCode} (${zip})`,
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
        h1: `Water Heater Repair Services in ${cityName}, ${stateCode} (${zip})`,
        problemTitle: `Mineral Scale Build-Up & Heating Element Failure in ${cityName}`,
        problem: `High calcium hardness in ${cityName} (${zip}) water creates heavy sediment crusting along the bottom of tank water heaters and inside tankless heat exchangers. This mineral buildup causes popping noises, burner flameouts, lukewarm water, and premature tank corrosion throughout ${cityName} homes.`,
        techniqueTitle: `Tankless Descaling, Element Testing & Code-Compliant Installs`,
        technique: `Our certified technicians test thermocouples, gas valves, and heating elements. We perform chemical descaling on tankless systems and install high-efficiency Rheem and Bradford White units equipped with expansion tanks and pressure relief lines meeting ${stateName} codes.`
      };
    } else if (isFL) {
      return {
        h1: `Water Heater Repair Services in ${cityName}, ${stateCode} (${zip})`,
        problemTitle: `Rapid Anode Depletion & Thermostat Breakdown in ${cityName}`,
        problem: `High ambient humidity and mineral-rich groundwater in ${cityName} (${zip}) accelerate sacrificial anode rod degradation and thermostat failures. Homeowners frequently encounter leaking temperature-pressure relief valves, pilot light failures, or total loss of hot water during peak morning demand.`,
        techniqueTitle: `Comprehensive Diagnostics & Energy-Efficient Replacements`,
        technique: `We test electrical circuits, gas burner manifolds, and heating elements for maximum safety. When replacement is required, we install energy-efficient hybrid heat pump or gas tankless water heaters engineered to reduce utility costs across ${cityName}.`
      };
    } else {
      return {
        h1: `Water Heater Repair Services in ${cityName}, ${stateCode} (${zip})`,
        problemTitle: `Extreme Cold Water Thermal Shock in ${cityName}`,
        problem: `Near-freezing incoming groundwater in ${cityName} (${zip}) forces residential water heaters to run under heavy thermal load. Our licensed water heater specialists provide same-day diagnostics, heating element swaps, gas valve tuning, and code-compliant installations.`,
        techniqueTitle: `High-Efficiency Northern-Climate Water Heater Installs`,
        technique: `We inspect gas burner assemblies, electric thermostats, and relief valves. When systems reach the end of their lifespan, we supply and install top-tier cold-climate tankless and heavy-insulated tank heaters with seismic safety strapping.`
      };
    }
  }

  if (serviceSlug === 'sewer-line-repair') {
    return {
      h1: `Sewer Line Repair Services in ${cityName}, ${stateCode} (${zip})`,
      problemTitle: `Underground Sewer Main Fractures & Root Intrusion in ${cityName}`,
      problem: `Ground shifting, soil moisture fluctuations, and aggressive tree root invasion in ${cityName} (${zip}) cause underground sewer pipes to crack, offset, or belly. When sewer lines collapse, hazardous wastewater backs up into household floor drains, toilets, and showers, demanding swift professional repair.`,
      techniqueTitle: `Non-Invasive Trenchless CIPP Relining & Video Locating`,
      technique: `We deploy high-resolution CCTV sewer cameras with sonic locators to identify exact line defects in ${cityName}. We then install seamless epoxy-saturated CIPP liners or perform hydraulic pipe bursting to renew the sewer main without digging up yards or driveways.`
    };
  }

  if (serviceSlug === 'emergency-plumbing') {
    return {
      h1: `Emergency Plumbing Services in ${cityName}, ${stateCode} (${zip})`,
      problemTitle: `Urgent Plumbing Failures Requiring Immediate Dispatch in ${cityName}`,
      problem: `Major water main breaks, sewer overflows, gas leaks, and failed main shut-off valves in ${cityName} (${zip}) cause rapid property damage and acute safety hazards. Home Plumbing USA connects you with vetted, licensed emergency plumbers available 24/7/365 with average arrival times under 45 minutes.`,
      techniqueTitle: `Emergency System Stabilization & Precision Repairs`,
      technique: `Upon arrival in ${cityName}, technicians isolate active water and gas feeds, perform rapid pressure diagnostics, execute emergency bypasses or component replacements, and fully restore your property's plumbing integrity.`
    };
  }

  if (serviceSlug === 'leak-detection') {
    return {
      h1: `Leak Detection Services in ${cityName}, ${stateCode} (${zip})`,
      problemTitle: `Hidden Pipe Leaks & Concrete Slab Fractures in ${cityName}`,
      problem: `Under-slab copper line erosion and shifting foundations in ${cityName} (${zip}) cause concealed water leaks beneath concrete floors and inside walls. Hot floor spots, mold odors, unexplained sound of running water, and spiking utility bills indicate an urgent hidden leak.`,
      techniqueTitle: `Non-Destructive Acoustic & Thermal Imaging Diagnostics`,
      technique: `Our ${cityName} leak specialists utilize ultrasonic listening microphones, digital pressure decay testing, and infrared thermal imaging to pinpoint leak locations to the inch, enabling targeted spot repairs with minimal drywall or concrete removal.`
    };
  }

  if (serviceSlug === 'gas-line-repair') {
    return {
      h1: `Gas Line Repair Services in ${cityName}, ${stateCode} (${zip})`,
      problemTitle: `Gas Line Corrosion & Leak Hazards in ${cityName}`,
      problem: `Natural gas and propane line deterioration in ${cityName} (${zip}) presents severe fire and health risks. Rotten-egg mercaptan odors, hissing pipes near water heaters or furnaces, and dead vegetation over gas feeds require immediate professional pressure testing and licensed repair.`,
      techniqueTitle: `Electronic Gas Sniffing, Pressure Manifold Tests & Code Approval`,
      technique: `Our licensed ${cityName} gas technicians execute digital combustible gas detection, replace corroded black iron or CSST lines, install emergency automatic shut-off valves, and facilitate municipal safety inspections and utility re-connections.`
    };
  }

  if (serviceSlug === 'water-line-repair') {
    return {
      h1: `Water Line Repair Services in ${cityName}, ${stateCode} (${zip})`,
      problemTitle: `Main Water Supply Breaks & Pressure Loss in ${cityName}`,
      problem: `Corrosion, tree roots, and underground soil pressure in ${cityName} (${zip}) can rupture your main water service line between the street meter and your home. Soggy lawn patches, discolored tap water, and sudden drops in household water pressure signal a water main rupture.`,
      techniqueTitle: `Trenchless Directional Boring & Seamless HDPE Lines`,
      technique: `We pull heavy-duty, seamless high-density polyethylene (HDPE) or copper water lines beneath driveways and sidewalks in ${cityName} using trenchless boring equipment, installing durable brass curb stops and backflow preventers.`
    };
  }

  return {
    h1: `${serviceSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Services in ${cityName}, ${stateCode} (${zip})`,
    problemTitle: `Reliable Plumbing Solutions in ${cityName}`,
    problem: `For residential and commercial properties in ${cityName} (${zip}), our licensed contractors provide complete plumbing repairs, installations, and 24/7 emergency dispatch.`,
    techniqueTitle: `State-Certified Craftsmanship & Upfront Pricing`,
    technique: `Every plumbing job in ${cityName} is executed using premium code-compliant materials, transparent flat-rate quotes, and multi-point flow testing.`
  };
}

function getQuickInfo(serviceSlug, cityName, stateCode, zip) {
  const configs = {
    'drain-cleaning': {
      costRange: '$149 – $485',
      responseTime: '30–45 Minutes',
      warrantyText: '30–90 Day No-Clog Warranty'
    },
    'burst-pipe-repair': {
      costRange: '$350 – $1,200',
      responseTime: '20–35 Minutes',
      warrantyText: 'Complete Line Integrity Warranty'
    },
    'water-heater-repair': {
      costRange: '$225 – $1,800',
      responseTime: '30–45 Minutes',
      warrantyText: '1-Year Parts & Labor Guarantee'
    },
    'sewer-line-repair': {
      costRange: '$1,200 – $4,500',
      responseTime: '30–60 Minutes',
      warrantyText: 'Up to 10-Year Trenchless Warranty'
    },
    'emergency-plumbing': {
      costRange: '$195 – $550',
      responseTime: '20–40 Minutes',
      warrantyText: '100% Workmanship Guarantee'
    },
    'leak-detection': {
      costRange: '$175 – $425',
      responseTime: '30–45 Minutes',
      warrantyText: 'Pinpoint Accuracy Guarantee'
    },
    'gas-line-repair': {
      costRange: '$250 – $950',
      responseTime: '20–35 Minutes',
      warrantyText: 'Certified Safety & Code Guarantee'
    },
    'water-line-repair': {
      costRange: '$750 – $3,200',
      responseTime: '30–60 Minutes',
      warrantyText: 'Durable HDPE Lifetime Guarantee'
    }
  };

  return configs[serviceSlug] || {
    costRange: '$175 – $495',
    responseTime: '30–45 Minutes',
    warrantyText: '100% Satisfaction Guarantee'
  };
}

function generateQuickInfoHtml(serviceSlug, cityName, stateCode, zip) {
  const info = getQuickInfo(serviceSlug, cityName, stateCode, zip);
  return `
    <section class="quick-info-bar" aria-label="Key Service Information">
      <div class="container">
        <div class="quick-info-grid">
          <div class="quick-info-card">
            <div class="quick-info-icon" style="background: rgba(37, 99, 235, 0.2); color: #38bdf8;">
              <i class="fas fa-tag"></i>
            </div>
            <div class="quick-info-text">
              <span class="quick-info-label">Estimated Cost Range</span>
              <strong class="quick-info-value">${info.costRange}</strong>
              <span class="quick-info-sub">Transparent Flat-Rate Pricing</span>
            </div>
          </div>

          <div class="quick-info-card">
            <div class="quick-info-icon" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">
              <i class="fas fa-clock"></i>
            </div>
            <div class="quick-info-text">
              <span class="quick-info-label">Local Response Time</span>
              <strong class="quick-info-value">${info.responseTime}</strong>
              <span class="quick-info-sub">24/7 Active Dispatch in ${zip}</span>
            </div>
          </div>

          <div class="quick-info-card">
            <div class="quick-info-icon" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">
              <i class="fas fa-shield-halved"></i>
            </div>
            <div class="quick-info-text">
              <span class="quick-info-label">Warranty Guarantee</span>
              <strong class="quick-info-value">100% Workmanship</strong>
              <span class="quick-info-sub">${info.warrantyText}</span>
            </div>
          </div>

          <div class="quick-info-card highlight-card">
            <div class="quick-info-icon" style="background: rgba(239, 68, 68, 0.25); color: #f87171;">
              <i class="fas fa-headset"></i>
            </div>
            <div class="quick-info-text">
              <span class="quick-info-label">Direct 24/7 Dispatch</span>
              <a href="tel:877-516-8705" class="quick-info-phone">877-516-8705</a>
              <span class="quick-info-sub">Live ${cityName} Operator</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function generateSignsHtml(serviceSlug, serviceName, cityName, stateCode, zip) {
  if (serviceSlug === 'drain-cleaning') {
    return `
      <section class="signs-section" style="margin-bottom: 36px;">
        <div class="section-badge" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 30px; padding: 6px 14px; font-size: 0.85rem; font-weight: 700; margin-bottom: 12px;">
          <i class="fas fa-triangle-exclamation"></i> Warning Signs & Diagnostics
        </div>
        <h2 style="font-size: 1.85rem; font-weight: 800; color: #fff; margin-bottom: 12px;">5 Signs You Need Immediate Drain Cleaning in ${cityName}, ${stateCode}</h2>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.7; margin-bottom: 24px;">Drainage problems rarely resolve without professional intervention and can escalate rapidly from an annoying slow drain into an unsanitary wastewater backup. If you notice any of these 5 warning signs in your ${cityName} home, immediate motorized snake augering or hydro-jetting is required:</p>

        <div class="signs-grid">
          <div class="sign-card">
            <div class="sign-header">
              <div class="sign-icon"><i class="fas fa-hourglass-half"></i></div>
              <span class="sign-num">Sign 01</span>
            </div>
            <h4>Slow-Draining Sinks, Tubs & Showers</h4>
            <p>Water pooling around your ankles in the shower or lingering in bathroom and kitchen basins indicates progressive waste buildup—hair, soap scum, and coagulated grease clinging to interior pipe walls and restricting gravity flow.</p>
          </div>

          <div class="sign-card">
            <div class="sign-header">
              <div class="sign-icon"><i class="fas fa-arrows-rotate"></i></div>
              <span class="sign-num">Sign 02</span>
            </div>
            <h4>Recurring & Stubborn Backups</h4>
            <p>If plunging or off-the-shelf liquid drain cleaners only provide temporary relief before the clog returns days later, the real blockage is seated deep within your lateral drain pipe and requires commercial motorized rooter clearing.</p>
          </div>

          <div class="sign-card">
            <div class="sign-header">
              <div class="sign-icon"><i class="fas fa-volume-high"></i></div>
              <span class="sign-num">Sign 03</span>
            </div>
            <h4>Gurgling Sounds & Bubbling Fixtures</h4>
            <p>Odd gurgling noises from your toilet when running the washing machine or bathroom faucet mean displaced air is being pulled through water traps because wastewater is struggling to squeeze past a choked pipe passage.</p>
          </div>

          <div class="sign-card">
            <div class="sign-header">
              <div class="sign-icon"><i class="fas fa-biohazard"></i></div>
              <span class="sign-num">Sign 04</span>
            </div>
            <h4>Foul Sewage Odors & Sewer Gas</h4>
            <p>Persistent rotten egg or sulfur odors escaping from floor drains or fixtures indicate rotting organic food solids trapped in secondary lines or trapped sewer gases venting backward into your ${cityName} living space.</p>
          </div>

          <div class="sign-card sign-card-urgent">
            <div class="sign-header">
              <div class="sign-icon alert-icon"><i class="fas fa-triangle-exclamation"></i></div>
              <span class="sign-num alert-num">Sign 05 &bull; Emergency</span>
            </div>
            <h4>Multiple Backed-Up Fixtures Simultaneously</h4>
            <p>When running a bathroom sink causes contaminated water to bubble up into your bathtub, or flushing a toilet backs up wastewater into a basement shower drain, you have a critical main sewer line stoppage requiring immediate 24/7 emergency dispatch.</p>
          </div>
        </div>
      </section>
    `;
  }

  // Fallback / standard 5 signs for other services
  return `
    <section class="signs-section" style="margin-bottom: 36px;">
      <div class="section-badge" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 30px; padding: 6px 14px; font-size: 0.85rem; font-weight: 700; margin-bottom: 12px;">
        <i class="fas fa-triangle-exclamation"></i> Diagnostic Checklist
      </div>
      <h2 style="font-size: 1.85rem; font-weight: 800; color: #fff; margin-bottom: 12px;">5 Signs You Need Immediate ${serviceName} in ${cityName}, ${stateCode}</h2>
      <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.7; margin-bottom: 24px;">Don't wait for minor symptoms to become structural plumbing disasters. Contact our ${cityName} dispatch team if you notice any of these 5 indicators:</p>

      <div class="signs-grid">
        <div class="sign-card">
          <div class="sign-header">
            <div class="sign-icon"><i class="fas fa-droplet-slash"></i></div>
            <span class="sign-num">Sign 01</span>
          </div>
          <h4>Sudden Pressure Fluctuations</h4>
          <p>Sudden drops in household water flow or sputtering fixtures point to line restrictions, underground leaks, or supply manifold failures in ${cityName}.</p>
        </div>

        <div class="sign-card">
          <div class="sign-header">
            <div class="sign-icon"><i class="fas fa-temperature-arrow-down"></i></div>
            <span class="sign-num">Sign 02</span>
          </div>
          <h4>Abnormal Thermal Performance</h4>
          <p>Lukewarm water, rapid hot water exhaustion, or icy spots along supply pipes signal heating element burnouts or imminent freeze risks.</p>
        </div>

        <div class="sign-card">
          <div class="sign-header">
            <div class="sign-icon"><i class="fas fa-volume-high"></i></div>
            <span class="sign-num">Sign 03</span>
          </div>
          <h4>Audible Rushing or Banging Pipes</h4>
          <p>Hissing water behind walls, popping tank sediment noises, or severe water hammer vibrations reveal hidden pressure anomalies.</p>
        </div>

        <div class="sign-card">
          <div class="sign-header">
            <div class="sign-icon"><i class="fas fa-faucet-drip"></i></div>
            <span class="sign-num">Sign 04</span>
          </div>
          <h4>Concealed Moisture & Spiking Bills</h4>
          <p>Unexplained damp patches on foundation slabs, peeling paint, or soaring utility statements indicate active hidden leaks.</p>
        </div>

        <div class="sign-card sign-card-urgent">
          <div class="sign-header">
            <div class="sign-icon alert-icon"><i class="fas fa-triangle-exclamation"></i></div>
            <span class="sign-num alert-num">Sign 05 &bull; Emergency</span>
          </div>
          <h4>Structural Discharge or Wastewater Backflow</h4>
          <p>Active standing water, sewage odors, or gas smells demand immediate line isolation and emergency dispatch across ${cityName} (${zip}).</p>
        </div>
      </div>
    </section>
  `;
}

function generatePricingAndWarrantyHtml(serviceSlug, serviceName, cityName, stateCode, stateName, zip) {
  let pricingRows = '';

  if (serviceSlug === 'drain-cleaning') {
    pricingRows = `
      <tr>
        <td><strong>Standard Sink, Tub or Shower Snaking</strong><br><small style="color: #64748b;">Localized hair, soap scum, food grease in branch lines</small></td>
        <td class="price-val">$149 – $249</td>
        <td>30–60 mins</td>
        <td>Secondary fixture clogs</td>
      </tr>
      <tr>
        <td><strong>Toilet Trap Obstruction & Mechanical Auger</strong><br><small style="color: #64748b;">Heavy paper blockages, foreign objects, trap stoppages</small></td>
        <td class="price-val">$165 – $285</td>
        <td>30–45 mins</td>
        <td>Individual toilet backflow</td>
      </tr>
      <tr>
        <td><strong>Main Sewer Lateral Mechanical Rooter</strong><br><small style="color: #64748b;">Motorized heavy-duty blades clearing 3" to 4" sewer lines</small></td>
        <td class="price-val">$295 – $485</td>
        <td>1–2 hours</td>
        <td>Whole-house drainage backups</td>
      </tr>
      <tr>
        <td><strong>High-Pressure Hydro-Jetting (3,000–4,000 PSI)</strong><br><small style="color: #64748b;">Full circumference pipe scour, grease & glacial silt removal</small></td>
        <td class="price-val">$375 – $595</td>
        <td>1.5–3 hours</td>
        <td>Severe scale, silt & grease</td>
      </tr>
      <tr>
        <td><strong>High-Definition CCTV Sewer Camera Inspection</strong><br><small style="color: #64748b;">Digital fiber-optic recording & sonic depth locating</small></td>
        <td class="price-val">$125 – $250</td>
        <td>30–60 mins</td>
        <td>Included / credited with jetting</td>
      </tr>
      <tr>
        <td><strong>Emergency 24/7 & Freeze Thaw Clearing</strong><br><small style="color: #64748b;">Urgent dispatch, frozen waste defrosting, midnight backups</small></td>
        <td class="price-val">$195 – $395</td>
        <td>Rapid 30–45m</td>
        <td>Urgent after-hours emergencies</td>
      </tr>
    `;
  } else {
    pricingRows = `
      <tr>
        <td><strong>Standard Diagnostic & Minor Repair</strong></td>
        <td class="price-val">$149 – $275</td>
        <td>45–60 mins</td>
        <td>Localized component issues</td>
      </tr>
      <tr>
        <td><strong>Comprehensive System Repair / Rebuild</strong></td>
        <td class="price-val">$295 – $650</td>
        <td>1–3 hours</td>
        <td>Primary line / unit repairs</td>
      </tr>
      <tr>
        <td><strong>High-Demand Emergency Dispatch</strong></td>
        <td class="price-val">$195 – $395</td>
        <td>Rapid 30–45m</td>
        <td>Nights, weekends & holidays</td>
      </tr>
      <tr>
        <td><strong>Major Replacement / Code Upgrade</strong></td>
        <td class="price-val">$750 – $2,800</td>
        <td>Same-day</td>
        <td>Complete fixture or pipe replacement</td>
      </tr>
    `;
  }

  return `
    <section class="pricing-warranty-section" style="margin-top: 36px; margin-bottom: 40px;">
      <h2>Transparent ${serviceName} Pricing in ${cityName}, ${stateCode} (${zip})</h2>
      <p>At Home Plumbing USA, we believe in 100% upfront pricing transparency. You will always receive an itemized, written quote detailing parts and labor before any work commences—with zero hidden dispatch charges, travel mileage add-ons, or surprise overtime fees.</p>

      <div class="pricing-table-wrap">
        <table class="pricing-table">
          <thead>
            <tr>
              <th>Service Procedure</th>
              <th>Estimated Cost Range</th>
              <th>Typical Duration</th>
              <th>Best Suited For</th>
            </tr>
          </thead>
          <tbody>
            ${pricingRows}
          </tbody>
        </table>
      </div>

      <div class="warranty-card">
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(16, 185, 129, 0.2); color: #34d399; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0;">
            <i class="fas fa-shield-check"></i>
          </div>
          <div>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: #fff; margin: 0;">Our Workmanship Warranty & Service Guarantee</h3>
            <span style="font-size: 0.85rem; color: #34d399; font-weight: 600;">100% Customer Protection in ${cityName}, ${stateCode}</span>
          </div>
        </div>

        <p style="color: var(--text-muted); font-size: 0.96rem; line-height: 1.7; margin-bottom: 18px;">Every service completed through our network is backed by robust contractor warranties on both replacement hardware and manual craftsmanship. Your satisfaction and property safety are guaranteed.</p>

        <div class="warranty-grid">
          <div class="warranty-item">
            <i class="fas fa-circle-check"></i>
            <div>
              <h5>100% No-Clog Guarantee</h5>
              <p>Standard mechanical drain clearings carry a 30 to 90-day guarantee. Comprehensive hydro-jetting cleanouts feature up to 1-year coverage. If the line clogs again under normal usage, we return free of charge.</p>
            </div>
          </div>

          <div class="warranty-item">
            <i class="fas fa-circle-check"></i>
            <div>
              <h5>Licensed & Insured in ${stateName}</h5>
              <p>Work is executed exclusively by state-licensed master plumbers carrying at least $1,000,000 in liability protection, adhering strictly to ${stateName} Uniform Plumbing Code.</p>
            </div>
          </div>

          <div class="warranty-item">
            <i class="fas fa-circle-check"></i>
            <div>
              <h5>Upfront Price Lock Guarantee</h5>
              <p>The price quoted on-site is the exact price you pay. No bait-and-switch estimates, no extra charges for challenging weather, and zero surprise diagnostic markups.</p>
            </div>
          </div>

          <div class="warranty-item">
            <i class="fas fa-circle-check"></i>
            <div>
              <h5>Clean Home Protection</h5>
              <p>Technicians wear heavy-duty sanitizing shoe covers, deploy protective drop cloths around work areas, and fully disinfect fixtures prior to departure.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
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

function getFaqsData(serviceSlug, serviceName, cityName, stateCode, stateName, zip) {
  if (serviceSlug === 'drain-cleaning') {
    return [
      {
        q: `How quickly can an emergency drain cleaning plumber arrive in Anchorage (99507)?`,
        a: `For urgent drain emergencies in Anchorage (zip code 99507), emergency plumbers in our network maintain an average response arrival time of 30 to 45 minutes. Our dispatch network operates 24 hours a day, 7 days a week, 365 days a year—including harsh sub-zero winter blizzard conditions, weekends, and holidays.`
      },
      {
        q: `What are the most common causes of clogged drains in Anchorage, AK homes?`,
        a: `In Anchorage, severe freeze-thaw cycles and cold ground temperatures cause cooking fats, oils, and grease (FOG) to congeal rapidly against exterior foundation pipe walls. Other frequent culprits include mineral scale from Southcentral water supplies, glacial silt settling in low-slope pipes, hair accumulation in bathroom p-traps, and aggressive spruce or birch tree roots invading older sewer lines.`
      },
      {
        q: `How does sub-zero Anchorage winter weather impact residential drainage systems?`,
        a: `When temperatures drop well below zero in Anchorage, unheated crawlspaces and foundation penetrations subject drain lines to extreme thermal shock. Waste water moves slower and can freeze in thin layers along pipe interiors, creating ice dams that catch toilet paper and debris. Our Anchorage technicians utilize safe thermal line thawing and heated hydro-jetting to open frozen drains without damaging cast iron or ABS pipes.`
      },
      {
        q: `What is the difference between mechanical drain snaking and high-pressure hydro-jetting?`,
        a: `Motorized drain snaking (rooting) uses a flexible steel cable with a rotating cutting head to bore a hole through localized clogs like hair plugs or paper stoppages. In contrast, hydro-jetting uses commercial-grade machinery delivering water up to 4,000 PSI to scour 100% of the pipe wall circumference clean of grease, scale, silt, and tree roots, restoring pipes to their original interior diameter.`
      },
      {
        q: `How much does professional drain cleaning cost in Anchorage (99507)?`,
        a: `Standard localized drain clearing (such as single sinks, tubs, or toilets) typically ranges from $149 to $249 in Anchorage. Main sewer lateral clearing or high-pressure hydro-jetting generally costs between $295 and $595. Before any work begins, our licensed plumbers conduct a physical inspection and provide an upfront, flat-rate written quote with zero hidden dispatch or mileage fees.`
      },
      {
        q: `Can frozen drain pipes mimic a regular drain clog during Alaska winters?`,
        a: `Yes. In sub-arctic climates like Anchorage, partial ice damming inside crawlspace waste pipes often causes slow draining, gurgling, or bubbling that homeowners mistake for a hair or grease clog. Plunging or chemical cleaners will not resolve an ice blockage and can rupture cold-brittle pipes. A certified Anchorage technician uses thermal imaging and gentle heated flushing to safely restore flow.`
      },
      {
        q: `Are commercial liquid chemical drain cleaners safe for my Anchorage plumbing?`,
        a: `We strongly advise against using caustic store-bought chemical drain cleaners. These harsh acidic chemicals generate extreme exothermic heat that can warp PVC pipes, corrode vintage cast iron joints, and create hazardous chemical backsplashes for plumbers. Chemical solutions also fail against deep main line stoppages, tree roots, or frozen slush. Mechanical augering and hydro-jetting provide a 100% safe, chemical-free solution.`
      },
      {
        q: `Do your plumbers conduct video camera sewer inspections before clearing lines in 99507?`,
        a: `Yes. For recurring, stubborn, or main sewer line clogs, our technicians deploy high-definition digital CCTV sewer cameras equipped with sonic locators. This enables us to inspect the exact internal condition of the line, pinpoint tree root intrusion, bellies, or joint fractures beneath Anchorage foundations, and verify that the line is completely clear after cleaning.`
      },
      {
        q: `What emergency steps should I take if sewage starts backing up into my basement or shower?`,
        a: `Immediately stop running all water inside your home—including dishwashers, washing machines, and sink faucets. Keep family members and pets away from contaminated wastewater to avoid biohazard risks. Locate and shut off your main water valve if water continues overflowing, and immediately call our 24/7 Anchorage dispatch hotline at 877-516-8705 for urgent priority service.`
      },
      {
        q: `Do you charge extra fees for night, weekend, or holiday dispatch in Anchorage?`,
        a: `No. Plumbing disasters don't adhere to business hours. Home Plumbing USA operates on a flat-rate transparent pricing structure, ensuring Anchorage homeowners receive prompt 24/7 emergency dispatch without punitive after-hours premiums or surprise holiday trip charges.`
      },
      {
        q: `How do glacial silt and local mineral conditions impact Anchorage drains?`,
        a: `Municipal and private well water in Southcentral Alaska can carry fine mineral deposits and suspended glacial silt. Over time, these fine sediments settle in low-slope drainage pipes and bond with cooking grease and detergent film, creating dense silt deposits that standard mechanical snakes cannot easily displace. High-velocity hydro-jetting is the industry-recommended method to flush silt out into the municipal main.`
      },
      {
        q: `Where is the main drain cleanout located in most Anchorage homes?`,
        a: `In 99507 and surrounding Anchorage neighborhoods, the primary sewer cleanout is typically located in the basement, utility room, or crawlspace near the foundation wall where the waste pipe exits toward the street. On homes built with slab foundations, exterior cleanouts may be found in a ground riser box near the exterior siding, though winter snow cover often requires locator equipment to find them.`
      },
      {
        q: `Can tree roots penetrate sewer lines in South Anchorage residential areas?`,
        a: `Yes. Older mature birch, spruce, and willow trees common in Anchorage develop aggressive root systems that seek moisture and warm vapor emitted by microscopic pipe seams. Once hairline roots penetrate clay or cast iron pipe joints, they expand into dense root masses that snag paper and grease, requiring mechanical root-cutting blades or high-pressure hydro-jetting to eradicate.`
      },
      {
        q: `How frequently should Anchorage homeowners invest in preventative drain cleaning?`,
        a: `For single-family residences with standard plumbing, preventative hydro-jetting or professional mechanical cleaning every 18 to 24 months prevents severe emergencies. For larger households, homes with older cast iron plumbing, or properties with mature trees near sewer laterals, an annual preventative maintenance inspection is strongly recommended.`
      },
      {
        q: `What workmanship warranties cover drain cleaning services in Alaska?`,
        a: `All drain cleaning work performed by our licensed network contractors comes backed by a comprehensive workmanship warranty. Standard residential drain snaking includes a 30 to 90-day "no-clog" guarantee, while comprehensive hydro-jetting and main sewer restorations carry extended warranties up to 1 full year, ensuring that if the same line backs up under normal use, a technician returns to rectify it at zero charge.`
      },
      {
        q: `Are your Anchorage plumbing contractors fully licensed and insured in Alaska?`,
        a: `Absolutely. Every plumbing contractor in our Anchorage network holds current State of Alaska specialty plumbing contractor licenses, carries mandatory general liability coverage of at least $1,000,000, and maintains worker's compensation insurance in full compliance with Alaska Department of Commerce regulations.`
      },
      {
        q: `Can your technicians repair or unclog kitchen garbage disposals and sink traps?`,
        a: `Yes. Kitchen sink clogs frequently stem from fibrous food waste (such as celery, potato peels, and coffee grounds) jamming disposal impellers or settling inside the under-sink p-trap. Our technicians clear jammed disposal units, disassemble and clean trap assemblies, and clear the downstream secondary waste arm to ensure rapid drainage.`
      },
      {
        q: `How can I prevent drain lines from freezing or clogging during sub-zero Anchorage cold snaps?`,
        a: `Maintain indoor crawlspace temperatures above 55°F using insulated skirting and foundation vents closed during winter. Avoid pouring cooking oils, bacon grease, or coffee grounds down kitchen sinks. Never flush wipes, paper towels, or hygiene products down toilets. During extreme -20°F cold snaps, allowing a pencil-thin trickle of warm water to run through vulnerable fixtures can prevent stationary ice formation in unheated crawlspace drain runs.`
      },
      {
        q: `What is the difference between clearing a single fixture clog versus a main sewer stoppage?`,
        a: `A single fixture clog affects only one localized drain (such as one shower or bathroom sink) while all other plumbing fixtures drain normally, typically resolved with a small portable auger. A main sewer stoppage blocks the primary 3-to-4-inch building lateral, causing wastewater from upper fixtures to bubble up through the lowest drains (like basement toilets or shower pans). Main line clogs require heavy-duty truck-mounted rooter equipment or hydro-jetting through the main cleanout.`
      },
      {
        q: `How do I schedule same-day or emergency drain cleaning in Anchorage (99507)?`,
        a: `Simply call our 24/7 Anchorage dispatch hotline directly at 877-516-8705. Our dispatch coordinators will record your address in 99507, assess the severity of your drainage issue, and route the closest licensed on-call technician with an arrival window typically under 45 minutes.`
      }
    ];
  }

  // Generic 20 FAQs for other services
  return [
    {
      q: `How quickly can an emergency plumber arrive for ${serviceName.toLowerCase()} in ${cityName} (${zip})?`,
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
    },
    {
      q: `What should I do immediately while waiting for a plumber in ${cityName}?`,
      a: `Locate your main water or gas shut-off valve and turn it completely off to prevent progressive structural flooding or safety hazards while our technician is en route.`
    },
    {
      q: `How do you determine the cost of ${serviceName.toLowerCase()} in ${cityName}?`,
      a: `We provide transparent flat-rate pricing based on an initial physical assessment. You receive an itemized quote with zero hidden fees before any work starts.`
    },
    {
      q: `Can cold weather in ${cityName} trigger sudden plumbing failures?`,
      a: `Yes. Sub-freezing temperatures or rapid temperature drops cause rapid pipe contraction, frozen water expansion, and valve failures that demand emergency intervention.`
    },
    {
      q: `Do you provide commercial plumbing services in ${cityName} (${zip})?`,
      a: `Yes. We match commercial facility managers, restaurants, and residential property owners with certified commercial plumbing specialists.`
    },
    {
      q: `Are camera inspections recommended for recurring plumbing issues?`,
      a: `Yes. Video inspections allow technicians to see the internal state of piping, pinpointing bellies, root intrusion, or hairline cracks without excavation.`
    },
    {
      q: `What payment options are accepted by technicians in ${cityName}?`,
      a: `Our matched technicians accept all major credit cards, debit cards, cash, checks, and offer financing options for major repair or replacement projects.`
    },
    {
      q: `How do I prevent my supply lines from freezing in ${cityName}?`,
      a: `Insulate exposed pipes in crawl spaces, maintain thermostat settings above 55°F, and let faucets drip slowly during extreme freeze alerts.`
    },
    {
      q: `Do you handle municipal permitting for major repairs in ${cityName}?`,
      a: `Yes. Our licensed contractors pull all required municipal building and plumbing permits in ${cityName} and coordinate city inspections upon job completion.`
    },
    {
      q: `What materials are used for plumbing pipe replacements in ${cityName}?`,
      a: `We install durable, code-compliant materials including PEX-A expansion tubing, Type L copper, and heavy-gauge PVC/CPVC engineered for longevity.`
    },
    {
      q: `How can I tell if a leak is hidden beneath my foundation slab?`,
      a: `Warm spots on flooring, unexplained sounds of running water, damp baseboards, and sudden spikes in your water bill all signal a slab leak.`
    },
    {
      q: `Is trenchless repair available for underground piping in ${cityName}?`,
      a: `Yes. Trenchless methods like epoxy CIPP relining and directional pipe bursting allow us to renew underground lines without excavating yards.`
    },
    {
      q: `How often should I have my residential plumbing inspected in ${cityName}?`,
      a: `We recommend a comprehensive multi-point plumbing inspection every 18 to 24 months to detect minor wear before it causes major water damage.`
    },
    {
      q: `What should I avoid putting down household drains in ${cityName}?`,
      a: `Avoid cooking grease, fibrous food scraps, eggshells, coffee grounds, flushable wipes, and harsh chemical solvents that erode pipes.`
    },
    {
      q: `Do your plumbers carry parts on their service vehicles for same-day repairs?`,
      a: `Yes. Technicians arrive in fully stocked mobile workshops carrying industrial tools, fittings, valves, and common replacement parts.`
    },
    {
      q: `What is the difference between emergency dispatch and scheduled service?`,
      a: `Emergency dispatch prioritizes immediate arrival within 30–45 minutes for active disasters, while scheduled service offers flexible appointment windows.`
    },
    {
      q: `How do I book service with Home Plumbing USA in ${cityName} (${zip})?`,
      a: `Simply call our 24/7 hotline at 877-516-8705 to speak directly with an active dispatch supervisor and get connected with a local technician.`
    }
  ];
}

function generateFaqsHtml(serviceSlug, serviceName, cityName, stateCode, stateName, zip) {
  const faqs = getFaqsData(serviceSlug, serviceName, cityName, stateCode, stateName, zip);

  return faqs.map((faq, index) => `
    <div class="faq-item">
      <details>
        <summary>
          <span><span style="color: var(--primary); font-weight: 800; margin-right: 8px;">Q${index + 1}.</span> ${faq.q}</span>
          <i class="fas fa-chevron-down"></i>
        </summary>
        <p>${faq.a}</p>
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

  const cleanBase = DOMAIN.replace(/\/+$/, '');
  const pageUrl = normalizeCanonicalUrl(`${cleanBase}/${stateSlug}/${cityZipSlug}/${serviceSlug}/`);
  const hubUrl = normalizeCanonicalUrl(`${cleanBase}/${stateSlug}/${cityZipSlug}/`);
  const stateUrl = normalizeCanonicalUrl(`${cleanBase}/state/${stateSlug}/`);

  // Strict H1 Matching & Title Tag (<= 60 chars)
  let title = `${serviceName} Services in ${cityName}, ${stateCode} (${zip}) | 24/7`;
  if (title.length > 60) {
    title = `${serviceName} Services in ${cityName}, ${stateCode} (${zip})`;
  }
  if (title.length > 60) {
    title = `${serviceName} Services in ${cityName} ${zip} | 24/7`;
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
  const quickInfoHtml = generateQuickInfoHtml(serviceSlug, cityName, stateCode, zip);
  const signsHtml = generateSignsHtml(serviceSlug, serviceName, cityName, stateCode, zip);
  const pricingAndWarrantyHtml = generatePricingAndWarrantyHtml(serviceSlug, serviceName, cityName, stateCode, stateName, zip);
  const workflowHtml = generateWorkflowHtml(serviceName, cityName, stateCode);
  const faqsHtml = generateFaqsHtml(serviceSlug, serviceName, cityName, stateCode, stateName, zip);
  const faqsData = getFaqsData(serviceSlug, serviceName, cityName, stateCode, stateName, zip);

  const otherServicesHtml = SERVICES.filter(s => s.slug !== serviceSlug).map(s => `
    <a href="${normalizeCanonicalUrl(`/${stateSlug}/${cityZipSlug}/${s.slug}/`)}" class="list-link">
      <span><i class="fas fa-wrench" style="margin-right: 8px; color: var(--primary);"></i> ${s.name}</span>
      <i class="fas fa-chevron-right"></i>
    </a>
  `).join('\n');

  const nearbyHtml = nearbyZips.slice(0, 8).map(nz => `
    <a href="${normalizeCanonicalUrl(`/${stateSlug}/${nz.slug}/${serviceSlug}/`)}" class="list-link">
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

  const faqSchemaObj = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqsData.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.a
      }
    }))
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
  <script type="application/ld+json">
${JSON.stringify(faqSchemaObj, null, 2)}
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

    /* Quick Info Bar */
    .quick-info-bar { background: #0b1528; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 22px 0; }
    .quick-info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .quick-info-card { display: flex; align-items: center; gap: 14px; background: rgba(15, 30, 58, 0.7); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 12px; padding: 16px 18px; backdrop-filter: blur(8px); }
    .quick-info-card.highlight-card { background: rgba(220, 38, 38, 0.12); border-color: rgba(239, 68, 68, 0.35); }
    .quick-info-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
    .quick-info-label { display: block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted, #94a3b8); font-weight: 600; margin-bottom: 2px; }
    .quick-info-value { display: block; font-size: 1.12rem; color: #fff; font-weight: 800; line-height: 1.2; }
    .quick-info-sub { display: block; font-size: 0.76rem; color: var(--accent, #38bdf8); margin-top: 2px; }
    .quick-info-phone { font-size: 1.15rem; color: #fff; font-weight: 800; text-decoration: none; display: block; }
    .quick-info-phone:hover { color: #f87171; }

    /* Signs Grid */
    .signs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; margin-top: 18px; }
    .sign-card { background: rgba(15, 30, 58, 0.6); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 12px; padding: 22px; transition: transform 0.2s ease, border-color 0.2s ease; }
    .sign-card:hover { transform: translateY(-2px); border-color: var(--primary, #2563eb); }
    .sign-card-urgent { grid-column: span 2; background: linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(15, 30, 58, 0.8) 100%); border-color: rgba(239, 68, 68, 0.4); }
    .sign-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .sign-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(37, 99, 235, 0.2); color: #38bdf8; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
    .sign-icon.alert-icon { background: rgba(239, 68, 68, 0.25); color: #f87171; }
    .sign-num { font-size: 0.75rem; text-transform: uppercase; font-weight: 800; letter-spacing: 0.8px; color: var(--text-muted, #94a3b8); }
    .sign-num.alert-num { color: #f87171; }
    .sign-card h4 { font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 8px; }
    .sign-card p { font-size: 0.95rem; color: var(--text-muted, #94a3b8); line-height: 1.65; margin: 0; }

    /* Pricing & Warranty */
    .pricing-table-wrap { overflow-x: auto; margin: 20px 0 28px; border-radius: 10px; border: 1px solid var(--border-color, #1e3a8a); }
    .pricing-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem; }
    .pricing-table th { background: rgba(30, 58, 138, 0.35); color: #fff; font-weight: 700; padding: 14px 16px; border-bottom: 1px solid var(--border-color, #1e3a8a); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .pricing-table td { padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); color: var(--text-muted, #94a3b8); }
    .pricing-table tr:last-child td { border-bottom: none; }
    .pricing-table tr:hover td { background: rgba(30, 58, 138, 0.15); }
    .pricing-table .price-val { font-weight: 800; color: #34d399; font-size: 1.05rem; }

    .warranty-card { background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 30, 58, 0.9) 100%); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 26px; margin: 24px 0 36px; }
    .warranty-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 18px; }
    .warranty-item { display: flex; gap: 12px; align-items: flex-start; }
    .warranty-item i { color: #34d399; font-size: 1.1rem; margin-top: 3px; flex-shrink: 0; }
    .warranty-item h5 { color: #fff; font-size: 0.98rem; font-weight: 700; margin-bottom: 4px; }
    .warranty-item p { color: var(--text-muted, #94a3b8); font-size: 0.88rem; line-height: 1.5; margin: 0; }

    /* FAQ accordion styling */
    .faq-item { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 12px; overflow: hidden; transition: border-color 0.2s ease; }
    .faq-item:hover { border-color: rgba(59, 130, 246, 0.5); }
    .faq-item details summary { padding: 18px 20px; font-weight: 700; color: var(--text-white); cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-size: 1.05rem; list-style: none; user-select: none; }
    .faq-item details summary::-webkit-details-marker { display: none; }
    .faq-item details summary i { color: var(--primary, #2563eb); font-size: 0.85rem; transition: transform 0.2s ease; }
    .faq-item details[open] summary i { transform: rotate(180deg); }
    .faq-item details p { padding: 0 20px 18px; color: var(--text-muted); font-size: 0.95rem; line-height: 1.7; margin: 0; }

    @media (max-width: 992px) {
      .detail-layout { grid-template-columns: 1fr; }
      .quick-info-grid { grid-template-columns: repeat(2, 1fr); }
      .signs-grid { grid-template-columns: 1fr; }
      .sign-card-urgent { grid-column: span 1; }
      .warranty-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 576px) {
      .quick-info-grid { grid-template-columns: 1fr; }
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

    <!-- QUICK INFO BOX -->
    ${quickInfoHtml}

    <!-- CONTENT BODY -->
    <section class="section" id="services-list">
      <div class="container">
        <div class="detail-layout">
          <!-- MAIN CONTENT -->
          <div class="detail-main">
            <!-- 5 SIGNS SECTION -->
            ${signsHtml}

            <h2>${copy.problemTitle}</h2>
            <p>${copy.problem}</p>

            <h2>${copy.techniqueTitle}</h2>
            <p>${copy.technique}</p>

            <!-- TRANSPARENT PRICING & WARRANTY -->
            ${pricingAndWarrantyHtml}

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
          <a href="${normalizeCanonicalUrl(`/${stateSlug}/${cityZipSlug}/emergency-plumbing/`)}">Emergency Plumbing</a>
          <a href="${normalizeCanonicalUrl(`/${stateSlug}/${cityZipSlug}/burst-pipe-repair/`)}">Burst Pipe Repair</a>
          <a href="${normalizeCanonicalUrl(`/${stateSlug}/${cityZipSlug}/water-heater-repair/`)}">Water Heater Repair</a>
          <a href="${normalizeCanonicalUrl(`/${stateSlug}/${cityZipSlug}/drain-cleaning/`)}">Drain Cleaning</a>
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
  const args = process.argv.slice(2);
  const isPilotOnly = args.includes('--pilot') || args.includes('--pilot-only');
  const filterState = args.find(a => a.startsWith('--state='))?.split('=')[1] || (isPilotOnly ? 'AK' : null);
  const filterZip = args.find(a => a.startsWith('--zip='))?.split('=')[1] || (isPilotOnly ? '99507' : null);
  const filterService = args.find(a => a.startsWith('--service='))?.split('=')[1] || (isPilotOnly ? 'drain-cleaning' : null);

  console.log('=== Starting Hyper-Local Static Generation Pipeline ===');
  if (isPilotOnly) {
    console.log(`[TARGETED PILOT MODE]: Generating ONLY State: ${filterState}, Zip: ${filterZip}, Service: ${filterService}`);
  }

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
    if (filterState && st !== filterState) return;
    if (filterZip && loc.zip !== filterZip) return;

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

  // Also collect all state locations for nearby links if in pilot mode
  let allStateZipsLookup = [];
  if (filterState) {
    allStateZipsLookup = seoData
      .filter(l => l.state && l.state.toUpperCase() === filterState && l.city && l.zip)
      .map(l => ({
        city: l.city.trim(),
        zip: l.zip,
        slug: `${slugify(l.city.trim())}-${l.zip}`
      }));
  }

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
    const allStateZips = allStateZipsLookup.length > 0 ? allStateZipsLookup : locList.map(l => ({
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

      // If not strictly pilot service-only, generate hub page
      if (!isPilotOnly || !filterService) {
        const hubHtml = buildCityZipHub(stateCfg, loc, nearbyForLoc);
        fs.writeFileSync(path.join(cityZipDir, 'index.html'), hubHtml, 'utf8');
        statePagesCount++;
      }

      // Generate service pages
      const targetServices = filterService ? SERVICES.filter(s => s.slug === filterService) : SERVICES;

      targetServices.forEach(service => {
        const serviceDir = path.join(cityZipDir, service.slug);
        if (!fs.existsSync(serviceDir)) {
          fs.mkdirSync(serviceDir, { recursive: true });
        }
        const serviceHtml = buildServicePage(stateCfg, loc, service, nearbyForLoc);
        const outFilePath = path.join(serviceDir, 'index.html');
        fs.writeFileSync(outFilePath, serviceHtml, 'utf8');
        statePagesCount++;
        console.log(`  -> Generated pilot service page: ${outFilePath}`);
      });

      if (!isPilotOnly && ((index + 1) % 250 === 0 || index + 1 === locList.length)) {
        console.log(`  [${stateCfg.name}] Generated ${index + 1}/${locList.length} locations (${statePagesCount} pages)...`);
      }
    });

    console.log(`Finished ${stateCfg.name}: Total ${statePagesCount} static pages generated.`);
    grandTotal += statePagesCount;
  }

  console.log(`\n======================================================`);
  console.log(`Execution complete! Total static pages created: ${grandTotal}`);
  console.log(`======================================================`);
}

main();
