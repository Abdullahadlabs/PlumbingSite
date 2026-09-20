const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://homeplumbingusa.com';
const ROOT_DIR = path.join(__dirname, '..');
const FLORIDA_DIR = path.join(ROOT_DIR, 'florida');
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

function generate5Signs(serviceSlug, serviceName, cityName, zip) {
  const signsByService = {
    'drain-cleaning': [
      {
        num: '01',
        icon: 'fa-hourglass-half',
        title: 'Slow Shower & Tub Drainage',
        desc: `Water pooling around your feet in showers indicates progressive accumulation of hair, soap residue, and fine sandy sediment common in ${cityName} coastal plumbing lines.`
      },
      {
        num: '02',
        icon: 'fa-arrows-rotate',
        title: 'Frequent, Stubborn Clogs',
        desc: `When chemical liquid cleaners and standard plungers fail to clear blockages, hardened grease or palm tree roots seated deep in the lateral drain require commercial hydro-jetting.`
      },
      {
        num: '03',
        icon: 'fa-volume-high',
        title: 'Gurgling Fixtures & Trap Bubbling',
        desc: `Gurgling noises from toilets or bathroom sinks when laundry machines discharge wastewater mean trapped sewer gases are fighting to pass a choked pipe passage in ${zip}.`
      },
      {
        num: '04',
        icon: 'fa-biohazard',
        title: 'Foul Sulfur & Sewage Odors',
        desc: `Persistent rotten-egg odors escaping from floor drains point to decomposing organic sludge trapped in secondary lines or dry P-traps failing under coastal Florida heat.`
      },
      {
        num: '05 • Emergency',
        urgent: true,
        icon: 'fa-triangle-exclamation',
        title: 'Simultaneous Fixture Backups',
        desc: `When running a kitchen sink forces dirty wastewater up through shower drains or toilet bases, your main building drain is obstructed and requires immediate 24/7 dispatch across ${cityName}.`
      }
    ],
    'burst-pipe-repair': [
      {
        num: '01',
        icon: 'fa-droplet-slash',
        title: 'Sudden Loss of Water Pressure',
        desc: `A sudden, dramatic reduction in tap volume across multiple fixtures in ${zip} indicates an active high-volume breach or blowout along your main pressurized supply lines.`
      },
      {
        num: '02',
        icon: 'fa-water',
        title: 'Water Seeping Through Slabs or Walls',
        desc: `Damp baseboards, bubbling drywall paint, or pooling water over concrete slab foundations in ${cityName} reveal concealed pressurized copper or CPVC pipe ruptures.`
      },
      {
        num: '03',
        icon: 'fa-volume-high',
        title: 'Audible Hissing or Spraying Sounds',
        desc: `The audible sound of rushing or hissing water behind wall cavities when all faucets and appliances are turned off indicates an active, pressurized line fracture.`
      },
      {
        num: '04',
        icon: 'fa-temperature-high',
        title: 'Thermal Friction & Salt Air Corrosion',
        desc: `Aggressive coastal salt air humidity and thermal water hammer surges cause aged copper lines to weaken, developing pinhole leaks that quickly rupture into full blowouts.`
      },
      {
        num: '05 • Emergency',
        urgent: true,
        icon: 'fa-triangle-exclamation',
        title: 'Uncontrolled Structural Flooding',
        desc: `Pressurized supply line ruptures can dump hundreds of gallons an hour across flooring. Shut off your main water valve and call our 24/7 Florida emergency hotline immediately.`
      }
    ],
    'water-heater-repair': [
      {
        num: '01',
        icon: 'fa-temperature-arrow-down',
        title: 'Tepid or Inconsistent Hot Water',
        desc: `Running out of hot water rapidly or receiving only lukewarm water signals burned-out electric heating elements or faulty gas burner controls in your ${cityName} home.`
      },
      {
        num: '02',
        icon: 'fa-burst',
        title: 'Popping or Rumbling Tank Noises',
        desc: `Heavy limestone and mineral deposits from the Floridan Aquifer settle to the tank bottom. Trapped boiling water steam bubbles burst loudly beneath this sediment layer, overheating tank steel.`
      },
      {
        num: '03',
        icon: 'fa-faucet',
        title: 'Rusty or Discolored Hot Water',
        desc: `Brownish or metallic-tasting hot water indicates that the sacrificial anode rod has completely depleted, allowing corrosive water to attack the steel tank lining in ${zip}.`
      },
      {
        num: '04',
        icon: 'fa-triangle-exclamation',
        title: 'Moisture Around Tank Base',
        desc: `Puddling water around your heater base indicates failing dielectric nipples, a leaking temperature-pressure relief (TPR) valve, or internal tank casing fracture.`
      },
      {
        num: '05 • Emergency',
        urgent: true,
        icon: 'fa-fire-flame-curved',
        title: 'Electrical Burnout or Gas Smells',
        desc: `Tripping water heater breakers, scorching odors near electrical panels, or sulfur smells around gas burners present acute combustion hazards demanding immediate certified inspection.`
      }
    ],
    'sewer-line-repair': [
      {
        num: '01',
        icon: 'fa-toilet',
        title: 'Persistent Main Drain Clogs',
        desc: `Recurring backups in lowest-level toilets or shower standpipes across ${cityName} point to deep structural sewer pipe issues rather than simple fixture clogs.`
      },
      {
        num: '02',
        icon: 'fa-tree',
        title: 'Aggressive Palm & Subtropical Root Intrusion',
        desc: `Fast-growing subtropical root networks from palms, live oaks, and ficus trees infiltrate hairline joints in older clay or cast-iron lines, creating dense structural blockages.`
      },
      {
        num: '03',
        icon: 'fa-layer-group',
        title: 'High Groundwater Sinking & Pipe Bellies',
        desc: `Florida's high coastal water tables and loose sandy sub-soils cause underground pipes to settle unevenly, creating low sags (bellies) where sewage pools and congeals in ${zip}.`
      },
      {
        num: '04',
        icon: 'fa-plant-wilt',
        title: 'Soggy, Sunken Yard Patches',
        desc: `Unusually marshy green patches, foul odors, or localized soil sinkholes in your yard indicate a collapsed or separated sewer lateral discharging sewage below lawn grade in ${cityName}.`
      },
      {
        num: '05 • Emergency',
        urgent: true,
        icon: 'fa-biohazard',
        title: 'Raw Sewage Inundation Indoors',
        desc: `Blackwater bubbling up from floor drains or shower pans poses extreme biohazard and structural risks requiring immediate CCTV camera inspection and trenchless relining.`
      }
    ],
    'emergency-plumbing': [
      {
        num: '01',
        icon: 'fa-faucet-drip',
        title: 'Active High-Volume Water Flooding',
        desc: `Uncontrolled water escaping from split supply lines, fractured valves, or failed water heater tanks in ${zip} threatens electrical safety and structural flooring.`
      },
      {
        num: '02',
        icon: 'fa-biohazard',
        title: 'Complete Sewer Line Inversion',
        desc: `When toilets and lower-level drains overflow simultaneously with contaminated wastewater during heavy rains, immediate emergency mechanical snaking or jetting is required.`
      },
      {
        num: '03',
        icon: 'fa-gas-pump',
        title: 'Gas Odors Near Appliances',
        desc: `A pungent rotten-egg mercaptan smell near water heaters or furnaces in ${cityName} signals an active natural gas or propane leak demanding emergency evacuation and repair.`
      },
      {
        num: '04',
        icon: 'fa-cloud-showers-heavy',
        title: 'Tropical Storm Drain Overflows',
        desc: `Severe tropical downpours surcharge municipal storm and sewer systems, causing untreated water to force past compromised check valves into residential living areas.`
      },
      {
        num: '05 • Emergency',
        urgent: true,
        icon: 'fa-bell',
        title: 'Inoperable Main Shutoff Valve',
        desc: `If your primary water shutoff valve is seized or corroded open during an active leak, emergency municipal meter curb-stop isolation is required immediately.`
      }
    ],
    'leak-detection': [
      {
        num: '01',
        icon: 'fa-file-invoice-dollar',
        title: 'Unexplained Water Bill Spikes',
        desc: `A sudden increase in monthly water consumption with no change in family usage indicates thousands of gallons escaping from an underground or under-slab pipe breach in ${zip}.`
      },
      {
        num: '02',
        icon: 'fa-gauge-high',
        title: 'Constantly Spinning Water Meter',
        desc: `If your water meter's leak indicator triangle spins while all house faucets, irrigation zones, and appliances are shut off, water is escaping continuously.`
      },
      {
        num: '03',
        icon: 'fa-temperature-high',
        title: 'Warm Floor Patches on Tile or Vinyl',
        desc: `In slab-on-grade homes across ${cityName}, noticeable warm patches on flooring indicate an eroding hot water copper supply line buried directly in concrete.`
      },
      {
        num: '04',
        icon: 'fa-water',
        title: 'Damp Baseboards & Mold Odors',
        desc: `Persistent moisture along drywall baseboards, peeling paint, or musty mildew smells point to concealed water vapor migrating from a foundation slab fracture.`
      },
      {
        num: '05 • Emergency',
        urgent: true,
        icon: 'fa-triangle-exclamation',
        title: 'Foundation Slab Shifting & Cracks',
        desc: `Unchecked underground water leaks wash away support sands beneath monolithic concrete slabs, triggering structural cracking and floor tile tenting in ${cityName}.`
      }
    ],
    'gas-line-repair': [
      {
        num: '01',
        icon: 'fa-radiation',
        title: 'Rotten Egg Mercaptan Odor',
        desc: `Natural gas and propane are naturally odorless; utilities add sulfurous mercaptan so leaks can be detected. If you smell rotten eggs anywhere in your ${zip} home, act immediately.`
      },
      {
        num: '02',
        icon: 'fa-volume-high',
        title: 'Hissing or Whistling Gas Lines',
        desc: `An audible hissing noise near gas meter manifolds, pool heater connections, or flexible appliance lines indicates high-pressure gas escaping into living quarters.`
      },
      {
        num: '03',
        icon: 'fa-seedling',
        title: 'Dead Lawn Patches Over Underground Lines',
        desc: `Patches of dead or yellowed turf directly over an underground gas service line in ${cityName} reveal gas saturating root zones and displacing oxygen.`
      },
      {
        num: '04',
        icon: 'fa-head-side-cough',
        title: 'Physical Symptoms of Gas Inhalation',
        desc: `Unexplained dizziness, nausea, headaches, or fatigue while indoors are classic symptoms of gas exposure or carbon monoxide buildup from incomplete venting.`
      },
      {
        num: '05 • Emergency',
        urgent: true,
        icon: 'fa-fire',
        title: 'Appliance Yellow Flames & Soot',
        desc: `Gas appliances should burn with a clean blue flame. Lazy yellow or orange burner flames accompanied by soot deposits indicate dangerous burner malfunction in ${zip}.`
      }
    ],
    'water-line-repair': [
      {
        num: '01',
        icon: 'fa-droplet-slash',
        title: 'Persistent Low Household Pressure',
        desc: `A permanent decline in water volume when running two fixtures at once indicates scaling, root intrusion, or pinhole fractures in your underground main supply line in ${cityName}.`
      },
      {
        num: '02',
        icon: 'fa-glass-water-droplet',
        title: 'Discolored or Sandy Tap Water',
        desc: `Brown, yellow, or sandy sediment appearing in drinking water suggests aging galvanized pipes corroding internally or fine Florida sand entering a cracked service pipe.`
      },
      {
        num: '03',
        icon: 'fa-water',
        title: 'Unexplained Soggy Lawn Areas',
        desc: `Spongy, marshy spots on your front lawn between the municipal water meter box and your house foundation in ${zip} indicate an active underground water main rupture.`
      },
      {
        num: '04',
        icon: 'fa-faucet',
        title: 'Sudden Air Sputtering from Faucets',
        desc: `Pipes coughing or spurting pockets of air when faucets are opened means air is being drawn into the pressurized supply line through an exterior crack.`
      },
      {
        num: '05 • Emergency',
        urgent: true,
        icon: 'fa-triangle-exclamation',
        title: 'Pavement Cracking or Driveway Sinkage',
        desc: `Underground water leaks wash away support sands and shell base over time, causing driveways, walkways, and patio slabs in ${cityName} to settle, crack, or sink.`
      }
    ]
  };

  const signs = signsByService[serviceSlug] || signsByService['drain-cleaning'];

  const signsHtml = signs.map(s => `
    <div class="sign-card ${s.urgent ? 'sign-card-urgent' : ''}">
      <div class="sign-header">
        <div class="sign-icon ${s.urgent ? 'alert-icon' : ''}"><i class="fas ${s.icon}"></i></div>
        <span class="sign-num ${s.urgent ? 'alert-num' : ''}">Sign ${s.num}</span>
      </div>
      <h4>${s.title}</h4>
      <p>${s.desc}</p>
    </div>
  `).join('\n');

  return `
    <section class="signs-section" style="margin-bottom: 38px;">
      <div class="section-badge" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 30px; padding: 6px 14px; font-size: 0.85rem; font-weight: 700; margin-bottom: 12px;">
        <i class="fas fa-triangle-exclamation"></i> Diagnostic Indicators
      </div>
      <h2 style="font-size: 1.85rem; font-weight: 800; color: #fff; margin-bottom: 12px;">5 Signs You Need ${serviceName} in ${cityName}, FL (${zip})</h2>
      <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.7; margin-bottom: 24px;">Don't wait for minor symptoms to escalate into severe structural water or gas damage. Contact our ${cityName} dispatch desk if you identify any of these 5 warning signs:</p>
      <div class="signs-grid">
        ${signsHtml}
      </div>
    </section>
  `;
}

function generateLocalContent(serviceSlug, serviceName, cityName, zip) {
  const localCopy = {
    'drain-cleaning': {
      p1Title: `Coastal High Water Tables & Kitchen Grease Blockages in ${cityName}`,
      p1: `High groundwater tables and porous sandy sub-soils across ${cityName} (${zip}) place continuous hydrostatic stress on residential drainage lines. Cooking grease, soap scum, and fine mineral scale clinging to pipe walls restrict gravity drainage, leading to slow-draining tubs, gurgling toilets, and wastewater backups during heavy Florida rains. Our network contractors utilize commercial-grade electric snake rooters and 4,000 PSI hydro-jetting to scrub pipe walls spotless without corrosive chemicals.`,
      p2Title: `Video Sewer Inspection & Subtropical Root Intrusion Diagnostics`,
      p2: `Because homes in ${cityName} are surrounded by aggressive palm and subtropical tree root systems, roots frequently invade microscopic hairline seams in older clay or cast-iron sewer lines. Matched plumbing technicians run high-resolution color CCTV cameras with digital locators down your lateral line to verify whether your stoppage is caused by grease, root intrusion, or soil shear fractures before hydro-jetting clean.`
    },
    'burst-pipe-repair': {
      p1Title: `High-Pressure Line Ruptures & Salt Air Corrosion in ${cityName}`,
      p1: `Corrosive coastal humidity, water hammer surges, and aging copper pipe deterioration in ${cityName} (${zip}) can cause sudden supply line ruptures. Pressurized pipe bursts flood drywall, attic spaces, and flooring, requiring immediate professional isolation to halt progressive property damage and prevent toxic mold proliferation in Florida's warm climate.`,
      p2Title: `Freeze-Tolerant PEX-A Expansion Piping & Emergency Line Isolation`,
      p2: `Network plumbers dispatched to ${zip} quickly isolate failed supply manifolds, excise ruptured pipe segments, and replace them with high-ductility PEX-A expansion piping or heavy-gauge Type L copper. Every repair undergoes rigorous hydrostatic pressure testing to verify complete code compliance under the Florida Building Code (Plumbing).`
    },
    'water-heater-repair': {
      p1Title: `Floridan Aquifer Mineral Scaling & Anode Rod Depletion in ${cityName}`,
      p1: `High ambient humidity and mineral-rich groundwater from the Floridan Aquifer in ${cityName} (${zip}) accelerate sacrificial anode rod degradation and heating element scaling. Homeowners frequently encounter leaking temperature-pressure relief valves, pilot light failures, or total loss of hot water during peak morning demand.`,
      p2Title: `High-Efficiency Hybrid Heat Pump & Tankless Water Heater Installs`,
      p2: `Florida energy codes strongly reward high-efficiency water heating. In ${cityName}, network technicians calibrate expansion tanks to exact municipal street pressure, inspect temperature-pressure relief (TPR) valves, flush dense mineral sediment, and install energy-saving hybrid heat pump or gas tankless units built for long service life.`
    },
    'sewer-line-repair': {
      p1Title: `Shallow Groundwater Sinking & Sewer Lateral Infiltration in ${cityName}`,
      p1: `Properties in ${cityName} (${zip}) sit over shallow coastal water tables and shifting sand beds. Excessive ground saturation during wet seasons creates pipe bellies, cracked joints, and offset pipes that snag household solids and allow sand infiltration into waste streams.`,
      p2Title: `Trenchless CIPP Epoxy Relining & Zero Yard Destruction in ${zip}`,
      p2: `Rather than digging up driveways and delicate tropical landscaping in ${cityName}, network sewer specialists deploy trenchless cured-in-place pipe (CIPP) relining. By inserting an epoxy-saturated sleeve that cures into a seamless, jointless pipe inside the old host line, homeowners receive a smooth root-proof lateral with up to 50-year structural life.`
    },
    'emergency-plumbing': {
      p1Title: `24/7 Rapid Response for Severe Storm Backups & Leaks in ${cityName} (${zip})`,
      p1: `Plumbing catastrophes don't keep business hours. Whether an uncontained burst pipe is flooding a finished home in ${cityName}, a main sewer line is backing up blackwater during a storm surge, or a water heater has ruptured, Home Plumbing USA coordinates 24/7 on-call dispatch with local licensed contractors across ${zip}.`,
      p2Title: `Immediate System Stabilization & Upfront Flat-Rate Estimates`,
      p2: `Network contractors arrive in fully-equipped service vehicles carrying utility pumps, pipe-freezing kits, commercial rooters, and replacement manifolds. The technician quickly stops active flooding, inspects the issue in person, and provides a clear flat-rate written quote before repairs begin.`
    },
    'leak-detection': {
      p1Title: `Non-Invasive Acoustic & Thermal Slab Leak Detection in ${cityName}`,
      p1: `Monolithic slab-on-grade concrete foundations across ${cityName} frequently conceal copper pipe pinhole leaks caused by aggressive soil minerals, ground shifting, and thermal friction. Homeowners often notice unexplained spikes in water bills, hot floor spots, or musty foundation humidity before water surfaces visually.`,
      p2Title: `Ultrasonic Ground Microphones & Digital Infrared Diagnostics`,
      p2: `Technicians dispatched in ${cityName} (${zip}) utilize sensitive ultrasonic ground microphones, nitrogen pressure-decay testing, and FLIR thermal imaging cameras. We pinpoint the exact leak coordinate to within inches without tearing up your flooring, enabling minimally invasive spot repairs or overhead PEX reroutes.`
    },
    'gas-line-repair': {
      p1Title: `Certified Gas Line Leak Detection & Coastal Salt Corrosion Protection in ${cityName}`,
      p1: `Natural gas and propane line deterioration in ${cityName} (${zip}) presents severe fire and health risks. Rotten-egg mercaptan odors, hissing pipes near water heaters or pool heaters, and dead vegetation over gas feeds require immediate professional pressure testing and licensed repair.`,
      p2Title: `Code Compliance, Heavy-Duty Black Iron Piping & Municipal Sign-Off`,
      p2: `Licensed gas fitters in our network use digital combustible gas sniffers, replace deteriorated piping with heavy-duty coated black iron or CSST, perform digital manometer pressure drop tests, and ensure full compliance with Florida Building Code and local municipal safety inspection standards.`
    },
    'water-line-repair': {
      p1Title: `Main Water Supply Breaks & Pressure Loss in Sandy Florida Soil`,
      p1: `The underground water service line connecting the municipal water meter to your home in ${cityName} operates under continuous street pressure. Over decades, shifting sandy sub-soils, corrosive coastal groundwater, and aggressive tree roots cause copper or legacy galvanized lines to corrode, rupture, or leak underground.`,
      p2Title: `Trenchless Directional Boring & Seamless HDPE Lines in ${zip}`,
      p2: `Network specialists utilize directional underground boring to pull seamless, high-density polyethylene (HDPE) or heavy copper lines beneath manicured lawns, sidewalks, and driveways in ${cityName}, restoring strong water pressure with zero disruptive trenching.`
    }
  };

  return localCopy[serviceSlug] || localCopy['drain-cleaning'];
}

function generateFAQs(serviceSlug, serviceName, cityName, zip) {
  const faqs = [];

  faqs.push({
    q: `What is the typical emergency response window for ${serviceName.toLowerCase()} in ${cityName} ${zip}?`,
    a: `For urgent plumbing emergencies in ${cityName} (${zip}), our dispatch network maintains a standard response arrival window of 30 to 45 minutes under normal traffic and weather conditions. An on-call independent licensed contractor is matched to your specific location.`
  });

  faqs.push({
    q: `Are the technicians dispatched to ${cityName} (${zip}) licensed and insured in Florida?`,
    a: `Yes. Every contractor in our network is fully vetted, holds active licensure in good standing with the Florida Construction Industry Licensing Board (FCILB), and carries comprehensive commercial general liability insurance.`
  });

  faqs.push({
    q: `How do high groundwater tables in ${cityName} affect my underground plumbing?`,
    a: `Florida's high water tables place continuous external moisture pressure on underground sewer and water pipes. When ground saturation rises during heavy rainfall, water can infiltrate cracked joints or cause pipes in loose sand to settle, creating sags (bellies) that catch solids.`
  });

  faqs.push({
    q: `Do network plumbers provide upfront flat-rate pricing for ${serviceName.toLowerCase()} in ${cityName}?`,
    a: `Yes. Technicians provide transparent, upfront flat-rate written estimates on-site before any physical repair begins. You know the exact total cost with zero hidden fees or surprise hourly overages.`
  });

  faqs.push({
    q: `Does municipal water in ${cityName} cause hard mineral scale buildup?`,
    a: `Yes. Water supplied from the Floridan Aquifer in ${zip} carries dissolved calcium and magnesium minerals. Over time, these minerals precipitate out, coating heating elements, clogging aerators, and constricting pipe diameters, which our plumbers clean, descale, or flush.`
  });

  if (serviceSlug === 'drain-cleaning') {
    faqs.push({
      q: `Is high-pressure hydro-jetting safe for older pipes in ${cityName}?`,
      a: `Yes, provided the pipe structure is intact. Technicians perform an initial CCTV camera inspection to examine pipe integrity before deploying hydro-jetting nozzles, ensuring blockages, grease, and roots are cleared without damaging pipe walls.`
    });
    faqs.push({
      q: `Why do drains in ${cityName} back up during heavy tropical storms?`,
      a: `Heavy tropical rainfall can overwhelm municipal sewer infrastructure. High groundwater saturates drainage fields, preventing waste from flowing freely away from your property unless lines are completely clear and equipped with backwater valves.`
    });
    faqs.push({
      q: `Can chemical liquid drain cleaners damage my Florida plumbing?`,
      a: `Yes. Caustic chemical drain cleaners generate high heat that can warp PVC pipes, soften rubber seals, and corrode aging cast iron. Mechanical motorized snaking and hydro-jetting are far safer and longer-lasting solutions.`
    });
    faqs.push({
      q: `How far can your motorized drain snake reach in ${cityName} homes?`,
      a: `Commercial drain snakes on network service trucks carry heavy-duty cables extending 100 to 150 feet, allowing technicians to reach all the way from cleanout ports to the municipal main.`
    });
    faqs.push({
      q: `What is the difference between clearing a single fixture clog versus a main sewer stoppage?`,
      a: `A single fixture clog affects only one sink or shower and is resolved with a small portable auger. A main sewer stoppage causes wastewater to back up into multiple lower-level fixtures simultaneously and requires heavy-duty rooters or hydro-jetting through the main cleanout.`
    });
  } else if (serviceSlug === 'burst-pipe-repair') {
    faqs.push({
      q: `What should I do immediately if a pipe bursts in my ${cityName} home?`,
      a: `Immediately locate and turn off your main water shutoff valve near the water meter or exterior wall to stop active flooding. Then call our 24/7 dispatch desk at 877-516-8705 for emergency priority dispatch.`
    });
    faqs.push({
      q: `What causes pipe bursts in Florida when it rarely freezes?`,
      a: `In Florida, pipe bursts are predominantly caused by coastal salt air corrosion, water hammer pressure spikes, deterioration of vintage copper under slab foundations, or failing polybutylene and CPVC pipe fittings.`
    });
    faqs.push({
      q: `What replacement pipe materials are recommended for burst pipe repairs in ${cityName}?`,
      a: `Our network technicians install high-ductility PEX-A expansion tubing or heavy-gauge Type L copper. PEX-A is highly resistant to corrosive coastal soils, mineral-heavy water, and thermal stress.`
    });
    faqs.push({
      q: `Does homeowner's insurance typically cover burst pipe repairs in Florida?`,
      a: `Most Florida homeowner policies cover sudden and accidental water damage caused by burst pipes. Matched contractors provide detailed diagnostic invoices and photographic documentation to assist your insurance claim process.`
    });
  } else if (serviceSlug === 'water-heater-repair') {
    faqs.push({
      q: `How long do water heaters typically last in ${cityName}?`,
      a: `Due to mineral scale and hard aquifer water in Florida, standard tank water heaters typically last 8 to 10 years. Regular annual tank flushing and anode rod replacement can extend operational life significantly.`
    });
    faqs.push({
      q: `What causes popping or rumbling sounds inside my water heater?`,
      a: `Popping noises are caused by steam bubbles forcing their way through dense mineral sediment settled at the bottom of the tank. Flushing the sediment restores quiet, energy-efficient heating.`
    });
    faqs.push({
      q: `Are hybrid heat pump water heaters recommended for Florida homes?`,
      a: `Yes! Hybrid heat pump water heaters are exceptionally efficient in Florida because they pull ambient heat and humidity from garages or utility rooms, cooling the surrounding space while reducing water heating costs by up to 70%.`
    });
    faqs.push({
      q: `Do network plumbers service both gas and electric water heaters in ${zip}?`,
      a: `Yes. Network technicians are fully equipped to diagnose and repair gas burners, thermocouples, pilot assemblies, electric heating elements, thermostats, and TPR safety valves.`
    });
  } else if (serviceSlug === 'sewer-line-repair') {
    faqs.push({
      q: `What are the benefits of trenchless sewer relining compared to excavation?`,
      a: `Trenchless CIPP relining requires zero digging through driveways, sidewalks, or manicured tropical landscaping. It creates a seamless, jointless epoxy pipe inside the old line that blocks root intrusion and lasts up to 50 years.`
    });
    faqs.push({
      q: `How do tree roots enter underground sewer pipes in ${cityName}?`,
      a: `Microscopic moisture vapor escapes through older clay pipe joints or tiny cracks. Palm, oak, and ficus tree roots seek this moisture, enter the joint, and feed on wastewater nutrients, rapidly expanding into massive flow-blocking root balls.`
    });
    faqs.push({
      q: `Do plumbers conduct camera inspections before recommending sewer repairs?`,
      a: `Yes. Technicians run high-definition digital CCTV cameras through your line to locate the exact depth and nature of the defect (root clog, belly, or collapse) before presenting repair options.`
    });
    faqs.push({
      q: `Who is responsible for the sewer line connecting my house to the street in Florida?`,
      a: `The property owner is generally responsible for the entire sewer lateral running from the building foundation to the municipal sewer main connection, including portions beneath the private yard.`
    });
  } else if (serviceSlug === 'leak-detection') {
    faqs.push({
      q: `How do technicians detect hidden slab leaks without damaging floors in ${cityName}?`,
      a: `Technicians use sensitive ultrasonic acoustic listening discs, electronic correlation equipment, and FLIR infrared thermal cameras to pinpoint the exact sound and temperature signature of the leak through concrete.`
    });
    faqs.push({
      q: `What are the common warning signs of an under-slab pipe leak?`,
      a: `Common indicators include unexplained warm spots on flooring, sounds of running water when all taps are closed, foundation cracks, damp baseboards, and sudden spikes in your water bill.`
    });
    faqs.push({
      q: `What repair options exist for slab leaks in Florida homes?`,
      a: `Depending on pipe condition, plumbers can perform a localized spot repair by opening a small access hole in the slab, or execute a non-invasive overhead PEX reroute through the attic, bypassing the damaged under-slab line entirely.`
    });
  } else if (serviceSlug === 'gas-line-repair') {
    faqs.push({
      q: `What should I do if I smell natural gas or propane in my ${cityName} home?`,
      a: `Evacuate all occupants and pets immediately. Do not flip light switches, use phones, or operate appliances. From a safe distance outside, call 911 or your gas utility, then contact our emergency line at 877-516-8705.`
    });
    faqs.push({
      q: `Are plumbing contractors licensed to repair gas lines in Florida?`,
      a: `Yes. Licensed Master and Certified Plumbing Contractors under the Florida Construction Industry Licensing Board are certified to test, repair, and install natural gas and propane supply piping.`
    });
    faqs.push({
      q: `How do plumbers test gas lines for hidden leaks?`,
      a: `Technicians disconnect appliances and pressurize the gas line with air, measuring pressure hold with a precision digital manometer. If the gauge drops, electronic sniffers and bubble solutions locate the exact joint defect.`
    });
  } else if (serviceSlug === 'water-line-repair') {
    faqs.push({
      q: `How do I know if my underground water service line is leaking?`,
      a: `Common signs include soggy or unusually green patches on your lawn between the meter and foundation, low household water pressure, sandy tap water, and a continuously spinning water meter.`
    });
    faqs.push({
      q: `Can an underground water line be replaced without digging a continuous trench?`,
      a: `Yes. Network specialists utilize horizontal directional drilling or pneumatic pipe pulling to install seamless HDPE or copper piping beneath lawns and driveways with only small entry and exit pits.`
    });
    faqs.push({
      q: `What pipe materials are used for new water service lines in Florida?`,
      a: `Plumbers install heavy-gauge seamless Type K copper or 200 PSI certified High-Density Polyethylene (HDPE), both of which resist corrosive coastal soils and ground moisture.`
    });
  }

  faqs.push({
    q: `What workmanship warranties cover ${serviceName.toLowerCase()} in ${cityName} (${zip})?`,
    a: `All service repairs executed through our contractor network come with a 100% workmanship warranty backed by the executing licensed contractor, alongside manufacturer guarantees on replacement parts and piping.`
  });

  faqs.push({
    q: `How do I schedule non-emergency service for a future date in ${cityName}?`,
    a: `You can call our dispatch desk at 877-516-8705 anytime 24/7 to schedule an appointment at your convenience, with morning, afternoon, and weekend arrival windows available.`
  });

  faqs.push({
    q: `Are network technicians equipped to service commercial properties in ${zip}?`,
    a: `Yes. In addition to residential homes, network contractors service commercial retail, restaurants, and office complexes throughout ${cityName}, providing grease trap maintenance, commercial water heaters, and backflow testing.`
  });

  faqs.push({
    q: `What payment options are accepted by network plumbing contractors in ${cityName}?`,
    a: `Matched plumbing contractors accept all major credit cards (Visa, MasterCard, Amex, Discover), personal checks, debit cards, and electronic payments upon satisfactory service completion.`
  });

  return faqs;
}

function buildServicePage(loc, service, nearbyList) {
  const cityName = loc.city;
  const zip = loc.zip;
  const cityZipSlug = `${slugify(cityName)}-${zip}`;
  const serviceSlug = service.slug;
  const serviceName = service.name;

  const pageUrl = `https://homeplumbingusa.com/florida/${cityZipSlug}/${serviceSlug}/`;
  const hubUrl = `https://homeplumbingusa.com/florida/${cityZipSlug}/`;
  const stateUrl = `https://homeplumbingusa.com/state/florida/`;

  const metaTitle = `${serviceName} in ${cityName}, FL (${zip}) | 24/7 Pro Dispatch`;
  const metaDesc = `Fast, reliable ${serviceName.toLowerCase()} in ${cityName}, FL (${zip}). Vetted licensed pros, upfront flat-rate pricing & 24/7 emergency dispatch. Call 877-516-8705!`;
  const serviceImageUrl = `https://homeplumbingusa.com/public/images/services/${serviceSlug}.webp`;

  const signsSectionHtml = generate5Signs(serviceSlug, serviceName, cityName, zip);
  const localCopy = generateLocalContent(serviceSlug, serviceName, cityName, zip);
  const faqs = generateFAQs(serviceSlug, serviceName, cityName, zip);

  const faqsHtml = faqs.map(faq => `
    <div class="faq-item" style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: var(--bg-card); margin-bottom: 12px;">
      <details style="padding: 18px 22px;">
        <summary style="font-weight: 700; color: var(--text-white); cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-size: 1.05rem;">
          <span>${faq.q}</span>
          <i class="fas fa-chevron-down" style="color: var(--primary); font-size: 0.85rem;"></i>
        </summary>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.7; margin-top: 14px; margin-bottom: 0;">${faq.a}</p>
      </details>
    </div>
  `).join('\n');

  const otherServicesHtml = SERVICES.filter(s => s.slug !== serviceSlug).map(s => `
    <a href="/florida/${cityZipSlug}/${s.slug}/" class="list-link" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-bottom: 8px; font-size: 0.92rem; color: var(--text-muted); text-decoration: none; transition: var(--transition);">
      <span><i class="fas ${s.icon}" style="margin-right: 8px; color: var(--primary);"></i> ${s.name}</span>
      <i class="fas fa-chevron-right" style="font-size: 0.8rem;"></i>
    </a>
  `).join('\n');

  const nearbyHtml = (nearbyList && nearbyList.length > 0 ? nearbyList : []).slice(0, 9).map(nb => {
    const nbSlug = `${slugify(nb.city)}-${nb.zip}`;
    return `
    <a href="/florida/${nbSlug}/${serviceSlug}/" class="list-link" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-bottom: 8px; font-size: 0.92rem; color: var(--text-muted); text-decoration: none; transition: var(--transition);">
      <span><i class="fas fa-map-marker-alt" style="margin-right: 8px; color: var(--primary);"></i> ${nb.city} (${nb.zip})</span>
      <i class="fas fa-chevron-right" style="font-size: 0.8rem;"></i>
    </a>
    `;
  }).join('\n');

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "PlumbingService",
        "@id": `${pageUrl}#plumbingservice`,
        "name": `Home Plumbing USA - ${serviceName} in ${cityName} (${zip})`,
        "description": metaDesc,
        "url": pageUrl,
        "telephone": "877-516-8705",
        "priceRange": "$$",
        "image": serviceImageUrl,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": cityName,
          "addressRegion": "FL",
          "postalCode": zip,
          "addressCountry": "US"
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "00:00",
          "closes": "23:59"
        },
        "provider": {
          "@type": "LocalBusiness",
          "name": "Home Plumbing USA",
          "image": "https://homeplumbingusa.com/public/images/hero-plumbing.webp"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://homeplumbingusa.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Florida",
            "item": "https://homeplumbingusa.com/state/florida/"
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
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        "mainEntity": faqs.map(f => ({
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

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metaTitle}</title>
  <meta name="description" content="${metaDesc}">
  <meta name="keywords" content="${serviceName.toLowerCase()} ${cityName} FL, ${serviceName.toLowerCase()} ${zip}, emergency plumber ${cityName}, 24/7 plumbing repair ${cityName} FL">
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

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
${JSON.stringify(schemaGraph, null, 2)}
  </script>

  <link rel="preload" as="image" href="/public/images/services/${serviceSlug}-mobile.webp" fetchpriority="high" media="(max-width: 600px)">
  <link rel="preload" as="image" href="/public/images/services/${serviceSlug}.webp" fetchpriority="high" media="(min-width: 601px)">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="icon" type="image/png" href="/public/images/favicon.png">

  <style>
    .detail-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 40px; margin-top: 40px; }
    .detail-main { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 36px; }
    .detail-main h2 { font-size: 1.6rem; font-weight: 800; color: var(--text-white); margin-top: 32px; margin-bottom: 14px; }
    .detail-main h2:first-of-type { margin-top: 0; }
    .detail-main p { font-size: 1.05rem; color: var(--text-muted); line-height: 1.8; margin-bottom: 18px; }
    .detail-sidebar { display: flex; flex-direction: column; gap: 24px; }
    .sidebar-widget { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 26px; }
    .sidebar-widget h3 { font-size: 1.2rem; font-weight: 800; color: var(--text-white); margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; }
    .cta-widget { background: linear-gradient(135deg, #1e3a8a 0%, #0f1e3a 100%); border: 2px solid var(--primary); text-align: center; }
    .cta-widget h3 { border: none; color: #fff; }

    /* Quick Info Bar */
    .quick-info-bar { background: #0b1528; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 22px 0; }
    .quick-info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .quick-info-card { display: flex; align-items: center; gap: 14px; background: rgba(15, 30, 58, 0.7); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 12px; padding: 16px 18px; backdrop-filter: blur(8px); }
    .quick-info-card.highlight-card { background: rgba(220, 38, 38, 0.12); border-color: rgba(239, 68, 68, 0.35); }
    .quick-info-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
    .quick-info-label { display: block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted, #94a3b8); font-weight: 600; margin-bottom: 2px; }
    .quick-info-value { display: block; font-size: 1.08rem; color: #fff; font-weight: 800; line-height: 1.2; }
    .quick-info-sub { display: block; font-size: 0.76rem; color: var(--accent, #38bdf8); margin-top: 2px; }

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

    /* Workflow List */
    .workflow-list { display: flex; flex-direction: column; gap: 16px; margin: 24px 0; }
    .workflow-step { display: flex; gap: 16px; align-items: flex-start; }
    .workflow-step .step-num { flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; background: var(--gradient-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; }
    .workflow-step h4 { color: var(--text-white); font-size: 1.05rem; font-weight: 700; margin-bottom: 4px; }
    .workflow-step p { font-size: 0.95rem; margin: 0; }

    @media (max-width: 992px) {
      .detail-layout { grid-template-columns: 1fr; }
      .quick-info-grid { grid-template-columns: repeat(2, 1fr); }
      .sign-card-urgent { grid-column: span 1; }
      .signs-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 576px) {
      .quick-info-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body data-prefix="/" data-depth="0">

  <!-- Header -->
  <header class="header" id="header" style="min-height: 120px;">
    <div class="top-bar" style="min-height: 40px; height: 40px; display: flex; align-items: center; justify-content: center; text-align: center; white-space: nowrap;">
      <div class="top-bar-content">
        <span class="pulse-dot"></span>
        <span>24/7 ${serviceName} in <strong>${cityName}, FL (${zip})</strong> &bull; Vetted Independent Network &bull; <a href="tel:877-516-8705" style="color: inherit; text-decoration: none; font-weight: 700;">877-516-8705</a></span>
      </div>
    </div>
    <div class="header-inner container" style="min-height: 80px; height: 80px; display: flex; align-items: center; justify-content: space-between;">
      <a href="/" class="logo" style="width: 247px; max-width: 100%; display: flex; align-items: center;">
        <img src="/public/images/logo.svg" alt="Home Plumbing USA Logo" class="logo-img" width="247" height="52">
      </a>
      <nav class="nav" id="mainNav">
        <a href="/" class="nav-link">Home</a>
        <a href="${stateUrl}" class="nav-link">Florida</a>
        <a href="${hubUrl}" class="nav-link">${cityName} (${zip})</a>
        <a href="#details" class="nav-link">Service Details</a>
        <a href="/contact" class="nav-link">Contact</a>
      </nav>
      <div class="header-cta" style="display: flex; align-items: center; gap: 16px;">
        <a href="tel:877-516-8705" class="header-phone" style="display: inline-flex; align-items: center; gap: 8px; font-weight: 700; color: #fff; text-decoration: none;"><i class="fas fa-phone" style="color: var(--accent);"></i> 877-516-8705</a>
        <a href="tel:877-516-8705" class="btn btn-primary btn-sm">Call Now</a>
      </div>
    </div>
  </header>

  <main>
    <!-- HERO SECTION -->
    <section class="hero" style="padding: 60px 0 45px; background: linear-gradient(135deg, rgba(10, 22, 40, 0.96), rgba(15, 30, 60, 0.88)); color: var(--text-white); position: relative;">
      <div class="container">
        <div class="breadcrumbs" style="display: flex; gap: 8px; align-items: center; font-size: 0.9rem; margin-bottom: 24px; color: var(--text-muted); flex-wrap: wrap;">
          <a href="/" style="color: var(--primary-light); text-decoration: none;">Home</a>
          <i class="fas fa-chevron-right" style="font-size: 0.75rem;"></i>
          <a href="${stateUrl}" style="color: var(--primary-light); text-decoration: none;">Florida</a>
          <i class="fas fa-chevron-right" style="font-size: 0.75rem;"></i>
          <a href="${hubUrl}" style="color: var(--primary-light); text-decoration: none;">${cityName} (${zip})</a>
          <i class="fas fa-chevron-right" style="font-size: 0.75rem;"></i>
          <span style="color: #fff;">${serviceName}</span>
        </div>

        <div class="grid-2 hero-grid" style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 3rem; align-items: center;">
          <div class="hero-content">
            <div class="hero-badge" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(37,99,235,0.15); border: 1px solid rgba(37,99,235,0.3); color: var(--primary-light); padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; margin-bottom: 16px;">
              <i class="fas fa-shield-alt" style="color: var(--accent);"></i> Vetted Local Contractor Dispatch &bull; ${cityName} & Surrounding Areas
            </div>
            <h1 style="font-size: 2.75rem; line-height: 1.2; color: #fff; margin-bottom: 1.25rem; font-weight: 800;">
              ${serviceName} in <span style="color: var(--accent);">${cityName}, FL (${zip})</span>
            </h1>
            <p style="font-size: 1.1rem; color: var(--text-light); margin-bottom: 2rem; line-height: 1.7;">
              In ${cityName} (${zip}), high coastal water tables, shifting sandy soil, and tropical storm surges demand specialized diagnostic equipment and prompt contractor response. Our dispatch network connects you directly with on-call independent licensed Florida plumbing contractors 24/7/365.
            </p>
            <div class="hero-ctas" style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <a href="tel:877-516-8705" class="btn btn-accent" style="background: var(--gradient-accent); color: #fff; font-weight: 700; font-size: 1.05rem; padding: 14px 28px; border-radius: 8px; text-decoration: none; box-shadow: var(--shadow-accent-glow); display: inline-flex; align-items: center; gap: 8px;">
                <i class="fas fa-phone-alt"></i> Call (877) 516-8705
              </a>
              <a href="#details" class="btn btn-outline" style="border: 2px solid rgba(255,255,255,0.3); color: #fff; font-weight: 600; font-size: 1.05rem; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                <i class="fas fa-wrench"></i> Diagnostic Protocols
              </a>
            </div>
          </div>
          <div class="hero-image-container" style="border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-lg); border: 1px solid var(--border-color); background: #0f1e3a;">
            <img src="/public/images/services/${serviceSlug}.webp" srcset="/public/images/services/${serviceSlug}-mobile.webp 480w, /public/images/services/${serviceSlug}.webp 1200w" sizes="(max-width: 600px) 480px, 1200px" alt="Technician performing ${serviceName.toLowerCase()} in ${cityName}, FL (${zip})" style="width: 100%; height: auto; display: block; aspect-ratio: 4 / 5; object-fit: cover;">
          </div>
        </div>
      </div>
    </section>

    <!-- QUICK INFO BOX (NETWORK SERVICE STANDARDS) -->
    <section class="quick-info-bar" aria-label="Network Service Standards">
      <div class="container">
        <div class="quick-info-grid">
          <div class="quick-info-card">
            <div class="quick-info-icon" style="background: rgba(37, 99, 235, 0.2); color: #38bdf8;">
              <i class="fas fa-tag"></i>
            </div>
            <div class="quick-info-text">
              <span class="quick-info-label">Estimated Cost Range</span>
              <strong class="quick-info-value">${service.costRange}</strong>
              <span class="quick-info-sub">Upfront Flat-Rate Pricing</span>
            </div>
          </div>

          <div class="quick-info-card">
            <div class="quick-info-icon" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">
              <i class="fas fa-clock"></i>
            </div>
            <div class="quick-info-text">
              <span class="quick-info-label">Network Dispatch Standard</span>
              <strong class="quick-info-value">30–45 Min Window</strong>
              <span class="quick-info-sub">Active Florida Coverage</span>
            </div>
          </div>

          <div class="quick-info-card">
            <div class="quick-info-icon" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">
              <i class="fas fa-shield-halved"></i>
            </div>
            <div class="quick-info-text">
              <span class="quick-info-label">Workmanship Warranty</span>
              <strong class="quick-info-value">100% Guaranteed</strong>
              <span class="quick-info-sub">${service.warranty}</span>
            </div>
          </div>

          <div class="quick-info-card highlight-card">
            <div class="quick-info-icon" style="background: rgba(239, 68, 68, 0.25); color: #f87171;">
              <i class="fas fa-headset"></i>
            </div>
            <div class="quick-info-text">
              <span class="quick-info-label">Live Dispatch Coordination</span>
              <a href="tel:877-516-8705" style="font-size: 1.15rem; color: #fff; font-weight: 800; text-decoration: none; display: block;">877-516-8705</a>
              <span class="quick-info-sub">24/7 Florida Operator</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- MAIN DETAIL CONTENT -->
    <section class="section" id="details" style="padding: 50px 0;">
      <div class="container">
        <div class="detail-layout">
          <!-- MAIN COLUMN -->
          <div class="detail-main">
            <!-- 5 SIGNS SECTION -->
            ${signsSectionHtml}

            <!-- LOCALIZED AUTHORITY / PAIN POINTS -->
            <h2>${localCopy.p1Title}</h2>
            <p>${localCopy.p1}</p>

            <h2>${localCopy.p2Title}</h2>
            <p>${localCopy.p2}</p>

            <!-- 5-STEP WORKFLOW -->
            <h2 style="margin-top: 36px;">Our 5-Step Service Process in ${cityName} (${zip})</h2>
            <div class="workflow-list">
              <div class="workflow-step">
                <div class="step-num">1</div>
                <div>
                  <h4>Direct Dispatch Coordination</h4>
                  <p>Contact our 24/7 dispatch desk for ${cityName}. We match your address with the nearest active, certified independent plumbing contractor available in ${zip}.</p>
                </div>
              </div>
              <div class="workflow-step">
                <div class="step-num">2</div>
                <div>
                  <h4>On-Site Physical Diagnosis</h4>
                  <p>The licensed technician arrives on-site in ${cityName} with a fully-equipped service vehicle to inspect pipe conditions, pressures, and soil saturation.</p>
                </div>
              </div>
              <div class="workflow-step">
                <div class="step-num">3</div>
                <div>
                  <h4>Upfront Flat-Rate Estimate</h4>
                  <p>You receive an itemized, transparent written quote before any physical repair or excavation starts in ${zip}. Zero surprise fees or unexpected hourly add-ons.</p>
                </div>
              </div>
              <div class="workflow-step">
                <div class="step-num">4</div>
                <div>
                  <h4>Precision Execution & Code Compliance</h4>
                  <p>Work is carried out using commercial-grade materials compliant with Florida Building Code (Plumbing) standards and local municipal regulations.</p>
                </div>
              </div>
              <div class="workflow-step">
                <div class="step-num">5</div>
                <div>
                  <h4>Pressure Testing & Quality Verification</h4>
                  <p>The technician completes multi-point hydrostatic flow checks and pressure diagnostics to confirm flawless operation and complete cleanout.</p>
                </div>
              </div>
            </div>

            <!-- FAQS ACCORDION -->
            <h2 style="margin-top: 40px; margin-bottom: 20px;">Frequently Asked Questions in ${cityName} (${zip})</h2>
            <div>
              ${faqsHtml}
            </div>
          </div>

          <!-- SIDEBAR COLUMN -->
          <div class="detail-sidebar">
            <div class="sidebar-widget cta-widget">
              <div style="font-size: 2.4rem; color: var(--accent); margin-bottom: 10px;"><i class="fas fa-phone-volume"></i></div>
              <h3>Need Immediate Help in ${cityName}?</h3>
              <p style="color: var(--text-light); font-size: 0.95rem; margin-bottom: 18px;">Independent contractors on-call 24/7 across ${cityName} & surrounding areas. Typical dispatch response in 30–45 minutes.</p>
              <a href="tel:877-516-8705" class="btn btn-accent" style="width: 100%; padding: 14px; font-weight: 800; font-size: 1.05rem; display: inline-flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; border-radius: 8px; background: var(--gradient-accent); color: #fff; box-shadow: var(--shadow-accent-glow);">
                <i class="fas fa-phone"></i> 877-516-8705
              </a>
            </div>

            <div class="sidebar-widget">
              <h3>Other Services in ${zip}</h3>
              ${otherServicesHtml}
            </div>

            <div class="sidebar-widget">
              <h3>${serviceName} in Nearby ZIPs</h3>
              ${nearbyHtml}
            </div>

            <div class="sidebar-widget">
              <h3>Florida Coverage</h3>
              <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 12px;">Explore full Florida state coverage and statewide plumbing directory.</p>
              <a href="${stateUrl}" style="color: var(--primary-light); font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; font-size: 0.92rem;">
                View Florida Directory <i class="fas fa-arrow-right" style="font-size: 0.8rem;"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="footer" style="background: #070d18; border-top: 1px solid var(--border-color); padding: 4rem 0 2rem;">
    <div class="container">
      <div style="display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.2fr; gap: 3rem; margin-bottom: 3rem;">
        <div>
          <a href="/" class="logo" style="width: 247px; max-width: 100%; display: flex; align-items: center; margin-bottom: 16px;">
            <img src="/public/images/logo.svg" alt="Home Plumbing USA Logo" class="logo-img" width="247" height="52">
          </a>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.65; margin-bottom: 16px;">Providing ${serviceName.toLowerCase()} referral and emergency dispatch services in ${cityName}, FL (${zip}) and surrounding communities 24/7/365.</p>
          <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5;">24/7 Dispatch Hotline: <a href="tel:877-516-8705" style="color: var(--accent); text-decoration: none; font-weight: 700;">877-516-8705</a></p>
        </div>

        <div>
          <h4 style="color: #fff; font-size: 1.1rem; font-weight: 700; margin-bottom: 16px;">Quick Links</h4>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.92rem;">
            <a href="/" style="color: var(--text-muted); text-decoration: none;">Home</a>
            <a href="${stateUrl}" style="color: var(--text-muted); text-decoration: none;">Florida Plumbers</a>
            <a href="${hubUrl}" style="color: var(--text-muted); text-decoration: none;">${cityName} (${zip}) Hub</a>
            <a href="/contact" style="color: var(--text-muted); text-decoration: none;">Contact Support</a>
          </div>
        </div>

        <div>
          <h4 style="color: #fff; font-size: 1.1rem; font-weight: 700; margin-bottom: 16px;">Services in ${zip}</h4>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.92rem;">
            <a href="/florida/${cityZipSlug}/drain-cleaning/" style="color: var(--text-muted); text-decoration: none;">Drain Cleaning</a>
            <a href="/florida/${cityZipSlug}/burst-pipe-repair/" style="color: var(--text-muted); text-decoration: none;">Burst Pipe Repair</a>
            <a href="/florida/${cityZipSlug}/water-heater-repair/" style="color: var(--text-muted); text-decoration: none;">Water Heater Repair</a>
            <a href="/florida/${cityZipSlug}/sewer-line-repair/" style="color: var(--text-muted); text-decoration: none;">Sewer Line Repair</a>
            <a href="/florida/${cityZipSlug}/emergency-plumbing/" style="color: var(--text-muted); text-decoration: none;">Emergency Plumbing</a>
          </div>
        </div>

        <div>
          <h4 style="color: #fff; font-size: 1.1rem; font-weight: 700; margin-bottom: 16px;">Network Standards</h4>
          <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.6; margin-bottom: 12px;">Workmanship guarantees and flat-rate pricing provided directly by independent, licensed Florida contractors matched through our platform.</p>
          <a href="tel:877-516-8705" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; background: rgba(37,99,235,0.2); color: #38bdf8; border: 1px solid rgba(56,189,248,0.3); border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 0.95rem;">
            <i class="fas fa-phone"></i> 877-516-8705
          </a>
        </div>
      </div>

      <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; font-size: 0.85rem; color: var(--text-muted);">
        <p style="margin: 0;">&copy; 2026 Home Plumbing USA. All rights reserved. Nationwide Plumbing Referral Network.</p>
        <div style="display: flex; gap: 16px;">
          <a href="/privacy-policy" style="color: inherit; text-decoration: none;">Privacy Policy</a>
          <a href="/terms-and-conditions" style="color: inherit; text-decoration: none;">Terms &amp; Conditions</a>
          <a href="/disclaimer" style="color: inherit; text-decoration: none;">Disclaimer</a>
        </div>
      </div>
    </div>
  </footer>
</body>
</html>`;
}

function main() {
  const args = process.argv.slice(2);
  const targetCityZip = args.find(a => a.startsWith('--city='))?.split('=')[1];
  const targetService = args.find(a => a.startsWith('--service='))?.split('=')[1];
  const limitArg = args.find(a => a.startsWith('--limit='))?.split('=')[1];
  const limit = limitArg ? parseInt(limitArg, 10) : null;

  console.log('=== Starting Florida Service Pages Generator Pipeline ===');
  console.log('Loading database/seo-pages.json...');
  const seoData = JSON.parse(fs.readFileSync(seoPagesPath, 'utf8'));
  let flLocations = seoData.filter(d => d.state === 'FL');

  console.log(`Found ${flLocations.length} Florida locations in database.`);

  if (targetCityZip) {
    flLocations = flLocations.filter(loc => {
      const slug = `${slugify(loc.city)}-${loc.zip}`;
      return slug.toLowerCase().includes(targetCityZip.toLowerCase()) || loc.zip === targetCityZip;
    });
    console.log(`Filtered to ${flLocations.length} locations matching "${targetCityZip}".`);
  }

  if (limit && flLocations.length > limit) {
    flLocations = flLocations.slice(0, limit);
    console.log(`Limited execution to ${limit} locations.`);
  }

  const activeServices = targetService 
    ? SERVICES.filter(s => s.slug === targetService)
    : SERVICES;

  console.log(`Generating ${activeServices.length} services for ${flLocations.length} locations (Total ${activeServices.length * flLocations.length} pages)...`);

  let totalGenerated = 0;
  const startTime = Date.now();

  flLocations.forEach((loc, index) => {
    const cityZipSlug = `${slugify(loc.city)}-${loc.zip}`;
    const cityZipDir = path.join(FLORIDA_DIR, cityZipSlug);
    ensureDir(cityZipDir);

    const nearbyList = loc.nearby_areas || [];

    activeServices.forEach(service => {
      const serviceDir = path.join(cityZipDir, service.slug);
      ensureDir(serviceDir);

      const html = buildServicePage(loc, service, nearbyList);
      fs.writeFileSync(path.join(serviceDir, 'index.html'), html, 'utf8');
      totalGenerated++;
    });

    if ((index + 1) % 150 === 0 || index + 1 === flLocations.length) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`  Processed ${index + 1}/${flLocations.length} locations (${totalGenerated} pages generated in ${elapsed}s)...`);
    }
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n======================================================');
  console.log(`Florida Service Pipeline Completed in ${duration}s!`);
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
