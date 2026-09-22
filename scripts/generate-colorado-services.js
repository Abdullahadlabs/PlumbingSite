const fs = require('fs');
const path = require('path');
const { LAKEWOOD_ZIPS, SERVICES, DOMAIN, COLORADO_DIR, ensureDir } = require('./colorado-data');

// ======================================================================
// 1. GENERATE 5 SIGNS SECTION
// ======================================================================
function generate5Signs(serviceSlug, serviceName, zipObj) {
  const signsByService = {
    'drain-cleaning': [
      {
        num: '01',
        icon: 'fa-hourglass-half',
        title: 'Slow Shower & Sink Drainage',
        desc: `Water standing in tub or sink basins indicates progressive buildup of hair, soap scum, and hard mineral scale clinging to interior pipe walls in your ${zipObj.neighborhood} home.`
      },
      {
        num: '02',
        icon: 'fa-arrows-rotate',
        title: 'Frequent, Stubborn Clogs',
        desc: `When simple plunging only provides temporary relief, hardened food grease or root intrusion deep in the underground lateral requires high-velocity hydro-jetting.`
      },
      {
        num: '03',
        icon: 'fa-volume-high',
        title: 'Gurgling Fixtures & Vents',
        desc: `Bubbling toilet bowls or gurgling sounds when laundry standpipes drain indicate displaced sewer gases trapped behind an advancing pipe blockage.`
      },
      {
        num: '04',
        icon: 'fa-biohazard',
        title: 'Sewer Odors Indoors',
        desc: `Foul sulfur or sewer gas odors escaping floor drains in ${zipObj.zip} point to decomposing organic matter trapped in secondary branch lines or compromised vent stacks.`
      },
      {
        num: '05 • Emergency',
        urgent: true,
        icon: 'fa-triangle-exclamation',
        title: 'Simultaneous Fixture Backups',
        desc: `When using the kitchen sink forces dirty water up into a basement shower drain, your main building drain is fully blocked and requires immediate 24/7 emergency rooter dispatch.`
      }
    ],
    'burst-pipe-repair': [
      {
        num: '01',
        icon: 'fa-droplet-slash',
        title: 'Sudden Loss of Water Pressure',
        desc: `A dramatic, unexplained drop in tap pressure across multiple faucets in ${zipObj.zip} indicates an active high-volume breach or rupture along your main supply lines.`
      },
      {
        num: '02',
        icon: 'fa-snowflake',
        title: 'Frozen Pipes Following Front Range Freezes',
        desc: `Sub-zero Rocky Mountain cold fronts cause exposed pipes in unheated crawlspaces, exterior walls, or uninsulated cantilevers to freeze solid. Once ice thaws, split lines burst immediately.`
      },
      {
        num: '03',
        icon: 'fa-water',
        title: 'Water Stains on Drywall or Ceilings',
        desc: `Dark bubbling damp spots, soft drywall, or water dripping through light fixtures reveal concealed pressurized pipe splits inside wall cavities in ${zipObj.neighborhood}.`
      },
      {
        num: '04',
        icon: 'fa-volume-high',
        title: 'Hissing Sounds Inside Walls',
        desc: `The audible sound of continuous running or spraying water when all faucets are turned off signals an active pinhole or solder joint failure behind finished walls.`
      },
      {
        num: '05 • Emergency',
        urgent: true,
        icon: 'fa-triangle-exclamation',
        title: 'Uncontrolled Basement Flooding',
        desc: `Pressurized supply line ruptures can discharge hundreds of gallons an hour into finished basements. Shut off your main water valve and call our 24/7 emergency dispatch line immediately.`
      }
    ],
    'water-heater-repair': [
      {
        num: '01',
        icon: 'fa-temperature-arrow-down',
        title: 'Inadequate or Tepid Hot Water',
        desc: `Running out of hot water rapidly or receiving only lukewarm water signals burned-out electric heating elements, faulty dip tubes, or impaired gas burner assemblies.`
      },
      {
        num: '02',
        icon: 'fa-burst',
        title: 'Popping or Rumbling Tank Sounds',
        desc: `At Lakewood's elevation of ${zipObj.elevation}, hard water minerals settle to the tank bottom. Water trapped beneath dense calcium sediment boils violently and overheats tank steel.`
      },
      {
        num: '03',
        icon: 'fa-faucet',
        title: 'Discolored or Rusty Hot Water',
        desc: `Brownish or metallic-tasting hot water indicates that the sacrificial anode rod has fully depleted, allowing corrosive water to attack the steel tank lining.`
      },
      {
        num: '04',
        icon: 'fa-triangle-exclamation',
        title: 'Moisture Around Tank Base',
        desc: `Puddling water around your tank in ${zipObj.zip} indicates failing dielectric nipples, a leaking temperature-pressure relief (TPR) valve, or internal tank fracture.`
      },
      {
        num: '05 • Emergency',
        urgent: true,
        icon: 'fa-fire-flame-curved',
        title: 'Pilot Light or Gas Burner Failures',
        desc: `Frequent thermocouple lockouts, lazy yellow flames, or sulfur odors near gas water heaters represent combustion hazards that require immediate certified technician service.`
      }
    ],
    'sewer-line-repair': [
      {
        num: '01',
        icon: 'fa-toilet',
        title: 'Persistent Main Drain Clogs',
        desc: `Recurring backups in basement toilets or laundry standpipes across ${zipObj.neighborhood} point to deep structural lateral pipe defects rather than simple fixture clogs.`
      },
      {
        num: '02',
        icon: 'fa-tree',
        title: 'Cottonwood & Willow Tree Root Intrusion',
        desc: `Mature root systems seek moisture through hairline joints in older clay or cast-iron lines, expanding into dense flow-blocking root mats.`
      },
      {
        num: '03',
        icon: 'fa-layer-group',
        title: 'Bentonite Soil Heave & Pipe Bellies',
        desc: `Expansive ${zipObj.soilType} shifts during wet-dry cycles, causing underground sewer laterals to sag. Waste pools in the belly, creating recurrent blockages.`
      },
      {
        num: '04',
        icon: 'fa-plant-wilt',
        title: 'Soggy, Sunken Yard Depressions',
        desc: `Unusually green grass patches, sewage odors, or ground sinkage in your yard indicate a collapsed or separated sewer lateral leaking below grade.`
      },
      {
        num: '05 • Emergency',
        urgent: true,
        icon: 'fa-biohazard',
        title: 'Raw Sewage Backing Up Indoors',
        desc: `Contaminated blackwater bubbling up from basement floor drains poses severe health and structural risks requiring immediate CCTV inspection and trenchless relining.`
      }
    ],
    'emergency-plumbing': [
      {
        num: '01',
        icon: 'fa-faucet-drip',
        title: 'Active High-Volume Flooding',
        desc: `Uncontrolled water escaping from split supply pipes, ruptured valves, or failed appliance connectors in ${zipObj.zip} threatens structural and electrical safety.`
      },
      {
        num: '02',
        icon: 'fa-biohazard',
        title: 'Complete Sewer Line Inversion',
        desc: `When toilets and lower-level fixtures overflow simultaneously with wastewater, your property requires immediate priority mechanical snaking or hydro-jetting.`
      },
      {
        num: '03',
        icon: 'fa-gas-pump',
        title: 'Gas Odors Near Appliances',
        desc: `A pungent rotten-egg mercaptan smell near water heaters or furnaces in ${zipObj.neighborhood} signals an active natural gas leak demanding emergency evacuation and licensed repair.`
      },
      {
        num: '04',
        icon: 'fa-snowflake',
        title: 'Frozen Main Lines Before Freeze Thaw',
        desc: `Completely frozen water feeds during Lakewood sub-zero snaps can rupture violently as weather warms. Emergency line thawing prevents destructive wall blowouts.`
      },
      {
        num: '05 • Emergency',
        urgent: true,
        icon: 'fa-bell',
        title: 'Inoperable Main Water Shutoff Valve',
        desc: `If your primary interior water shutoff valve is seized open during an active leak, emergency municipal curb-stop isolation is required immediately.`
      }
    ],
    'leak-detection': [
      {
        num: '01',
        icon: 'fa-file-invoice-dollar',
        title: 'Unexplained Water Bill Spikes',
        desc: `A sudden increase in monthly water consumption with no changes in family usage indicates thousands of gallons escaping from an underground or under-slab breach.`
      },
      {
        num: '02',
        icon: 'fa-gauge-high',
        title: 'Constantly Spinning Water Meter',
        desc: `If your water meter's leak indicator triangle spins while all house faucets and irrigation valves are shut off, water is escaping continuously under pressure.`
      },
      {
        num: '03',
        icon: 'fa-temperature-high',
        title: 'Warm Spots on Concrete Floors',
        desc: `In slab-on-grade homes across ${zipObj.neighborhood}, noticeable warm floor patches indicate an eroding hot water copper supply line buried beneath concrete.`
      },
      {
        num: '04',
        icon: 'fa-water',
        title: 'Damp Baseboards & Musty Odors',
        desc: `Persistent moisture under baseboards, buckling hardwood, or musty mildew odors point to concealed pressurized water vapor migrating from sub-slab cracks.`
      },
      {
        num: '05 • Emergency',
        urgent: true,
        icon: 'fa-triangle-exclamation',
        title: 'Foundation Cracks & Ground Settlement',
        desc: `Unchecked underground water leaks wash away support gravel and trigger rapid swelling in ${zipObj.soilType}, causing structural foundation fractures.`
      }
    ],
    'gas-line-repair': [
      {
        num: '01',
        icon: 'fa-radiation',
        title: 'Rotten Egg Mercaptan Odor',
        desc: `Natural gas is odorless; utilities add sulfurous mercaptan so leaks are detectable. If you smell rotten eggs in your ${zipObj.zip} home, evacuate immediately.`
      },
      {
        num: '02',
        icon: 'fa-volume-high',
        title: 'Hissing or Whistling Gas Pipes',
        desc: `An audible hissing noise near gas meters, furnace connections, or appliance flex lines indicates high-pressure gas escaping into living quarters.`
      },
      {
        num: '03',
        icon: 'fa-seedling',
        title: 'Dead Lawn Patches Over Gas Lines',
        desc: `Patches of dead or yellowed turf directly above buried gas supply piping in ${zipObj.neighborhood} reveal gas saturating root zones and displacing oxygen.`
      },
      {
        num: '04',
        icon: 'fa-head-side-cough',
        title: 'Physical Symptoms of Gas Exposure',
        desc: `Unexplained dizziness, nausea, headaches, or fatigue while indoors are classic symptoms of natural gas inhalation or carbon monoxide accumulation.`
      },
      {
        num: '05 • Emergency',
        urgent: true,
        icon: 'fa-fire',
        title: 'Appliance Yellow Flames & Soot',
        desc: `Gas burners should produce steady blue flames. Lazy yellow or orange flames accompanied by soot deposits indicate dangerous incomplete combustion.`
      }
    ],
    'water-line-repair': [
      {
        num: '01',
        icon: 'fa-droplet-slash',
        title: 'Persistent Low Household Pressure',
        desc: `A permanent decline in water volume when running two fixtures at once indicates mineral scaling, root intrusion, or pinhole fractures in your underground main supply line.`
      },
      {
        num: '02',
        icon: 'fa-glass-water-droplet',
        title: 'Discolored or Sediment-Heavy Water',
        desc: `Brown, yellow, or gritty water at your faucets indicates that aging galvanized or copper service lines are corroding internally or drawing in exterior soil.`
      },
      {
        num: '03',
        icon: 'fa-water',
        title: 'Unexplained Wet Patches in Yard',
        desc: `Spongy, soggy turf or standing puddles between your street meter pit and foundation wall in ${zipObj.zip} indicate an active underground water main break.`
      },
      {
        num: '04',
        icon: 'fa-faucet',
        title: 'Air Sputtering from Faucets',
        desc: `Faucets coughing air pockets when turned on indicate that exterior air is being siphoned into pressurized service lines through subterranean fracture points.`
      },
      {
        num: '05 • Emergency',
        urgent: true,
        icon: 'fa-triangle-exclamation',
        title: 'Driveway Sinkage & Concrete Cracking',
        desc: `Subterranean water leaks erode structural gravel and subsoil over time, causing driveways, sidewalks, and front porches to settle, crack, or collapse.`
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
      <h2 style="font-size: 1.85rem; font-weight: 800; color: #fff; margin-bottom: 12px;">5 Signs You Need ${serviceName} in Lakewood, CO (${zipObj.zip})</h2>
      <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.7; margin-bottom: 24px;">Don't wait for minor symptoms to escalate into catastrophic structural water or gas damage. Contact our Lakewood dispatch desk if you notice any of these 5 warning signs:</p>
      <div class="signs-grid">
        ${signsHtml}
      </div>
    </section>
  `;
}

// ======================================================================
// 2. GENERATE LOCAL CONTENT
// ======================================================================
function generateLocalContent(serviceSlug, serviceName, zipObj) {
  const localCopy = {
    'drain-cleaning': {
      p1Title: `High-Altitude Grease Solidification & Mineral Scale in ${zipObj.neighborhood}`,
      p1: `In Lakewood (${zipObj.zip}), elevation reaches approximately ${zipObj.elevation}. Cooler subterranean soil temperatures and mountain air cause kitchen grease, cooking oils, and soap scum to solidify inside residential drain laterals far more rapidly than at sea level. Combined with dissolved calcium and magnesium minerals from ${zipObj.waterSource}, drains in ${zipObj.neighborhood} develop rock-hard calcified scaling that chokes gravity flow. Our network contractors utilize commercial-grade electric snake rooters and 4,000 PSI hydro-jetting to blast lines clean without caustic chemicals.`,
      p2Title: `Video Sewer Scoping & Bentonite Clay Diagnostics in ${zipObj.zip}`,
      p2: `Because homes in ${zipObj.neighborhood} are built over ${zipObj.soilType}, ground shifting during seasonal moisture cycles frequently creates pipe sags (bellies) where water pools and accumulates solids. Matched plumbing technicians run high-resolution color CCTV cameras with digital locators down your lateral line to verify whether your stoppage is caused by grease, tree root intrusion, or soil shear fractures before clearing.`
    },
    'burst-pipe-repair': {
      p1Title: `Sub-Zero Freeze Swings & Attic Pipe Ruptures in ${zipObj.zip}`,
      p1: `Lakewood's position along the Front Range exposes homes in ${zipObj.neighborhood} to rapid Arctic cold fronts where temperatures plummet 40°F in hours. Uninsulated pipes in crawlspaces, cantilevered bump-outs, and exterior hose bibs freeze rapidly. Water expansion inside rigid copper lines creates thousands of pounds of hydrostatic pressure, resulting in violent splits once the line begins thawing.`,
      p2Title: `Freeze-Resistant PEX-A Expansion Piping & Emergency Line Isolation`,
      p2: `Network plumbers dispatched to ${zipObj.zip} quickly isolate failed supply manifolds, excise ruptured pipe segments, and replace them with high-ductility PEX-A expansion piping or type-L copper with frost-free sillcocks. Every repair undergoes rigorous hydrostatic pressure testing to verify code compliance under Colorado plumbing standards.`
    },
    'water-heater-repair': {
      p1Title: `High-Altitude Boiling Points & Rapid Element Scaling at ${zipObj.elevation}`,
      p1: `At an elevation of ${zipObj.elevation} in Lakewood (${zipObj.zip}), atmospheric pressure is lower and water boils at approximately 202°F. This elevation dynamic changes heating cycle requirements and increases thermal stress on tank components. Furthermore, mineral content from ${zipObj.waterSource} causes calcium carbonate to bake onto electric heating elements, leading to noisy popping tanks, element burnout, and reduced hot water output.`,
      p2Title: `Thermal Expansion Tank Calibration & Gas Burner Optimization`,
      p2: `Colorado plumbing codes require thermal expansion tanks on closed water systems. In ${zipObj.neighborhood}, network technicians calibrate expansion tanks to exact municipal street pressure, inspect temperature-pressure relief (TPR) valves, flush mineral sediment, and adjust gas orifices for high-altitude combustion safety.`
    },
    'sewer-line-repair': {
      p1Title: `Bentonite Clay Soil Movement & Sewer Line Bellies in ${zipObj.neighborhood}`,
      p1: `Homes in Lakewood (${zipObj.zip}) sit above ${zipObj.soilType}. These expansive clay soils expand dramatically when saturated with spring snowmelt and shrink during summer dry spells. This repeated ground movement exerts immense vertical and lateral pressure on underground sewer laterals, creating low sags (bellies), cracked joints, and offset pipes that snag household waste.`,
      p2Title: `Trenchless CIPP Epoxy Relining & Yard Preservation in ${zipObj.zip}`,
      p2: `Rather than excavating manicured lawns, driveways, or mature landscaping in ${zipObj.neighborhood}, network sewer specialists deploy trenchless cured-in-place pipe (CIPP) relining. By inserting an epoxy-saturated sleeve that cures into a structural pipe inside the existing host line, homeowners receive a seamless, root-proof lateral with up to 50-year structural life.`
    },
    'emergency-plumbing': {
      p1Title: `24/7 Rapid Priority Dispatch for Critical Emergencies in Lakewood (${zipObj.zip})`,
      p1: `Plumbing emergencies do not follow business hours. Whether an uncontained pipe burst is flooding finished living space, a main sewer line is backing up contaminated wastewater, or a gas line has developed a leak in ${zipObj.neighborhood}, Home Plumbing USA coordinates 24/7 on-call dispatch with licensed local independent contractors.`,
      p2Title: `Fully Equipped Mobile Vehicles & Upfront Flat-Rate Estimates`,
      p2: `Network contractors arrive in fully-equipped service vehicles carrying utility pumps, pipe-freezing kits, commercial rooters, and replacement manifolds. The technician quickly stops active flooding, inspects the issue in person, and provides a clear flat-rate written quote before repairs begin.`
    },
    'leak-detection': {
      p1Title: `Non-Invasive Acoustic & Thermal Slab Leak Detection in ${zipObj.neighborhood}`,
      p1: `Slab-on-grade foundation construction across Lakewood frequently conceals copper pipe pinhole leaks caused by aggressive soil minerals, ground shifting, and thermal friction. Homeowners in ${zipObj.zip} often notice unexplained spikes in water bills, hot floor spots, or musty foundation humidity before water surfaces visually.`,
      p2Title: `Ultrasonic Ground Microphones & Digital Infrared Diagnostics`,
      p2: `Technicians dispatched in ${zipObj.zip} utilize sensitive ultrasonic ground microphones, nitrogen pressure-decay testing, and FLIR thermal imaging cameras. We pinpoint the exact leak coordinate to within inches without tearing up your flooring, enabling minimally invasive spot repairs or overhead PEX reroutes.`
    },
    'gas-line-repair': {
      p1Title: `Certified Gas Pressure Testing & Mercaptan Leak Location in ${zipObj.zip}`,
      p1: `Natural gas leaks present acute safety risks. In ${zipObj.neighborhood}, aging black iron lines, ground shifting in ${zipObj.soilType}, and corroded appliance flex connectors can develop leaks. Mercaptan rotten-egg smells or hissing lines near furnaces require immediate evacuation and licensed repair.`,
      p2Title: `Code Compliance, Heavy-Duty Black Iron Piping & Municipal Sign-Off`,
      p2: `Licensed gas fitters in our network use digital combustible gas sniffers, replace deteriorated piping with heavy-duty black iron or CSST, perform digital manometer pressure drop tests, and ensure full compliance with City of Lakewood and Xcel Energy safety inspection standards.`
    },
    'water-line-repair': {
      p1Title: `Main Water Service Line Replacements in Lakewood (${zipObj.zip})`,
      p1: `The underground water service line connecting the municipal water meter to your home in ${zipObj.neighborhood} operates under high Front Range water pressure. Over decades, freeze-thaw frost heave, acidic soils, and shifting ${zipObj.soilType} cause copper or legacy galvanized lines to corrode, rupture, or leak underground.`,
      p2Title: `Trenchless Directional Boring & Seamless HDPE Lines`,
      p2: `Network specialists utilize directional underground boring to pull seamless, high-density polyethylene (HDPE) or heavy copper lines beneath manicured lawns, sidewalks, and driveways in ${zipObj.zip}, restoring strong water pressure with zero disruptive trenching.`
    }
  };

  return localCopy[serviceSlug] || localCopy['drain-cleaning'];
}

// ======================================================================
// 3. GENERATE EXACTLY 20 SERVICE-SPECIFIC FAQs
// ======================================================================
function generateFAQs(serviceSlug, serviceName, zipObj) {
  const faqs = [];

  // Group 1: 5 Baseline Colorado / Regional Questions
  faqs.push({
    q: `What is the typical emergency response window for ${serviceName.toLowerCase()} in Lakewood ${zipObj.zip}?`,
    a: `For urgent plumbing emergencies in Lakewood (${zipObj.zip}), our dispatch network maintains a standard response window of 30 to 45 minutes under normal traffic and weather conditions. An on-call independent licensed contractor is matched to your specific location.`
  });

  faqs.push({
    q: `How does Lakewood's elevation of ${zipObj.elevation} impact ${serviceName.toLowerCase()}?`,
    a: `At ${zipObj.elevation} in ${zipObj.neighborhood}, atmospheric pressure is lower than at sea level. This changes water boiling temperatures, affects water heater thermal expansion tank calibration, and requires plumbing systems to be fitted with properly adjusted pressure reducing valves (PRVs).`
  });

  faqs.push({
    q: `Are the technicians dispatched to Lakewood (${zipObj.zip}) licensed and insured in Colorado?`,
    a: `Yes. Every contractor in our network is fully vetted, holds active licensure in good standing with the Colorado State Plumbing Board, and carries comprehensive commercial general liability insurance.`
  });

  faqs.push({
    q: `How do expansive clay soils in ${zipObj.neighborhood} affect my underground pipes?`,
    a: `The ${zipObj.soilType} prevalent throughout ${zipObj.neighborhood} (${zipObj.zip}) expands significantly when saturated and contracts during dry spells. This cyclical soil heave frequently causes sewer bellies, joint separation, and underground water line stress.`
  });

  faqs.push({
    q: `Do network plumbers provide flat-rate pricing for ${serviceName.toLowerCase()} in Lakewood?`,
    a: `Yes. Technicians provide transparent, upfront flat-rate written estimates on-site before any physical repair begins. You know the exact total cost with no hidden fees or surprise hourly overages.`
  });

  // Group 2: 8 Deep Technical Service-Specific Questions
  if (serviceSlug === 'drain-cleaning') {
    faqs.push({
      q: `Is high-pressure hydro-jetting safe for older pipes in Lakewood ${zipObj.zip}?`,
      a: `Yes, provided the pipe structure is intact. Technicians perform an initial CCTV camera inspection to examine pipe integrity before deploying hydro-jetting nozzles, ensuring blockages and roots are cleared without damaging pipe walls.`
    });
    faqs.push({
      q: `Why do drains in ${zipObj.neighborhood} clog more frequently during winter?`,
      a: `Sub-zero winter temperatures along the Front Range cool underground building drains. When warm cooking grease and soap scum hit cold pipes in ${zipObj.zip}, they congeal and solidify far faster, rapidly forming thick obstructions.`
    });
    faqs.push({
      q: `Can chemical liquid drain cleaners damage my Lakewood home's plumbing?`,
      a: `Yes. Caustic chemical drain cleaners generate high heat that can warp PVC pipes, soften rubber seals, and corrode aging cast iron. Mechanical motorized snaking and hydro-jetting are far safer and longer-lasting solutions.`
    });
    faqs.push({
      q: `How far can your motorized drain snake reach in Lakewood homes?`,
      a: `Commercial drain snakes on network service trucks carry heavy-duty cables extending 100 to 150 feet, allowing technicians to reach all the way from cleanout ports to the municipal main in Lakewood.`
    });
    faqs.push({
      q: `What is the difference between clearing a single fixture clog versus a main sewer stoppage?`,
      a: `A single fixture clog affects only one sink or shower and is resolved with a small portable auger. A main sewer stoppage causes wastewater to back up into multiple lower-level fixtures simultaneously and requires heavy-duty rooters or hydro-jetting through the main cleanout.`
    });
    faqs.push({
      q: `How does video camera inspection help identify drain clogs in ${zipObj.zip}?`,
      a: `High-definition waterproof cameras with digital depth locators travel through lines to reveal the exact nature of the obstruction—whether grease buildup, invasive tree roots, or pipe collapses—eliminating guesswork.`
    });
    faqs.push({
      q: `Can tree roots be permanently cleared from Lakewood drains with hydro-jetting?`,
      a: `Hydro-jetting with specialized rotating root-cutting nozzles shears roots flush with pipe walls and flushes debris away. To prevent regrowth, trenchless epoxy pipe relining or pipe replacement is recommended.`
    });
    faqs.push({
      q: `What preventive maintenance keeps kitchen drains running smoothly in Lakewood?`,
      a: `Avoid pouring grease or coffee grounds down disposals, scrape dinner plates into trash bins, flush drains with boiling water weekly, and use bio-enzymatic drain cleaners rather than harsh corrosive acids.`
    });
  } else if (serviceSlug === 'burst-pipe-repair') {
    faqs.push({
      q: `What causes pipes to burst in Lakewood homes during sudden Front Range freezes?`,
      a: `When sub-zero air chills uninsulated pipes, ice forms a solid plug. Continued freezing expands water volume, trapping extreme hydrostatic pressure between the ice and closed faucets, which ruptures the pipe wall.`
    });
    faqs.push({
      q: `Why is PEX-A expansion tubing preferred over rigid copper for Lakewood freeze repairs?`,
      a: `PEX-A cross-linked polyethylene expands up to three times its diameter if water freezes inside, allowing it to survive freeze-thaw cycles without rupturing, making it ideal for Colorado mountain climates.`
    });
    faqs.push({
      q: `Where is the main water shut-off valve located in typical Lakewood homes?`,
      a: `In ${zipObj.neighborhood}, main shutoffs are typically found in the basement near the front wall where the water service enters, in the crawlspace, or adjacent to the water meter pit near the street curb.`
    });
    faqs.push({
      q: `Will homeowners insurance cover frozen burst pipe repairs in Lakewood?`,
      a: `Most Colorado homeowners policies cover sudden, accidental burst pipe water damage, provided the home was properly heated. Network plumbers provide detailed itemized diagnostic reports for insurance claims.`
    });
    faqs.push({
      q: `What should I do immediately after shutting off water for a burst pipe?`,
      a: `Open lowest faucets to drain residual line pressure, turn off electrical circuit breakers in flooded areas, move valuables away from water, and contact our 24/7 dispatch desk for priority emergency dispatch.`
    });
    faqs.push({
      q: `Can pinhole pipe leaks cause burst pipe damage over time?`,
      a: `Yes. Undetected pinhole leaks in copper supply lines gradually weaken pipe integrity while soaking drywall and insulation. Eventually, weakened pipe joints can rupture catastrophically under normal municipal pressure.`
    });
    faqs.push({
      q: `How do plumbers locate burst pipes behind drywall without tearing down entire walls?`,
      a: `Technicians use sensitive acoustic listening tools, thermal imaging FLIR cameras, and moisture meters to pinpoint the exact leak location, minimizing drywall cutting to a surgical access panel.`
    });
    faqs.push({
      q: `Are exterior hose bibs prone to freezing and bursting in Lakewood?`,
      a: `Yes. Standard hose bibs trap water inside outside walls. We install freeze-proof sillcocks featuring extended shutoff valves located deep within heated wall cavities, paired with self-draining vacuum breakers.`
    });
  } else if (serviceSlug === 'water-heater-repair') {
    faqs.push({
      q: `How often should I flush my water heater in Lakewood (${zipObj.zip})?`,
      a: `Because water from ${zipObj.waterSource} carries dissolved calcium, we recommend a professional tank flush at least once a year in Lakewood to eliminate sediment crust and preserve heating efficiency.`
    });
    faqs.push({
      q: `Why does my water heater make popping sounds in ${zipObj.neighborhood}?`,
      a: `Popping or knocking sounds occur when water gets trapped underneath a layer of hard calcium sediment at the bottom of the tank. As the water boils, steam bubbles pop violently through the sediment.`
    });
    faqs.push({
      q: `Why is a thermal expansion tank required on Lakewood water heaters?`,
      a: `Municipal backflow check valves create a closed plumbing system. When water heats up, thermal expansion increases pressure. An expansion tank absorbs this pressure, preventing relief valve blowouts.`
    });
    faqs.push({
      q: `How long do water heaters last at Lakewood's elevation?`,
      a: `Standard tank water heaters in Lakewood typically last 8 to 12 years. Regular anode rod replacement and annual sediment flushing can extend equipment lifespan significantly.`
    });
    faqs.push({
      q: `Do network plumbers service both gas and electric water heaters in Lakewood?`,
      a: `Yes. Network technicians are fully equipped to diagnose and repair gas burners, thermocouples, pilot assemblies, electric heating elements, thermostats, and TPR safety valves.`
    });
    faqs.push({
      q: `Are tankless water heaters efficient at Lakewood's high altitude?`,
      a: `Yes, modern condensing tankless water heaters feature automatic high-altitude fan calibration. They supply continuous hot water and eliminate standby energy losses common in mountain climates.`
    });
    faqs.push({
      q: `What causes yellow pilot flames on gas water heaters in ${zipObj.zip}?`,
      a: `A lazy yellow or orange flame indicates incomplete combustion, dirty burner orifices, or restricted intake airflow. Technicians adjust air-gas ratios to restore clean, efficient blue flames.`
    });
    faqs.push({
      q: `What is the role of the sacrificial anode rod in protecting my tank?`,
      a: `The magnesium or aluminum anode rod corrodes in place of the steel tank lining. Replacing the depleted anode rod every 3 to 5 years prevents tank interior rust and catastrophic leaks.`
    });
  } else if (serviceSlug === 'sewer-line-repair') {
    faqs.push({
      q: `What is trenchless sewer pipe relining, and is it available in Lakewood ${zipObj.zip}?`,
      a: `Trenchless CIPP relining inserts a resin-saturated fiberglass felt tube through an existing cleanout into your damaged pipe. It cures in place, forming a brand-new structural pipe without digging up your yard.`
    });
    faqs.push({
      q: `How do tree roots penetrate sewer lines in ${zipObj.neighborhood}?`,
      a: `Mature cottonwood and willow roots seek moisture and warmth escaping from tiny hairline fissures or clay pipe seams. Once inside, roots feed on nutrient-rich wastewater, multiplying into dense blockages.`
    });
    faqs.push({
      q: `What is a sewer pipe belly, and what causes it in Lakewood?`,
      a: `A belly is a sunken low section of sewer pipe caused by settling or swelling in ${zipObj.soilType}. Waste and solids pool in the sag rather than draining by gravity, leading to recurring backups.`
    });
    faqs.push({
      q: `Do City of Lakewood sewer repairs require permits?`,
      a: `Yes. Major sewer excavations and lateral replacements require permits from the City of Lakewood Building Commission and relevant sanitation districts. Network contractors handle all permitting.`
    });
    faqs.push({
      q: `Who is responsible for the sewer line connecting my house to the street in Lakewood?`,
      a: `The property owner is responsible for the entire sewer lateral connecting the home's foundation to the municipal sewer main under the street, including lines running across the private yard.`
    });
    faqs.push({
      q: `How does pipe bursting compare to open trench sewer replacement?`,
      a: `Pipe bursting pulls a heavy conical expansion head through old deteriorated pipe, fracturing it outward while simultaneously pulling a new seamless HDPE pipe into place with minimal surface excavation.`
    });
    faqs.push({
      q: `How long does a trenchless epoxy relined sewer lateral last?`,
      a: `CIPP epoxy sewer liners are structurally rated for 50+ years of reliable service. They resist corrosion, tree root penetration, and ground movement far better than legacy clay or cast iron.`
    });
    faqs.push({
      q: `What diagnostic steps precede any sewer line repair recommendation?`,
      a: `Plumbers conduct a multi-angle high-resolution CCTV camera inspection, record digital footage, pinpoint defect depths with electronic locators, and review options with the homeowner.`
    });
  } else if (serviceSlug === 'emergency-plumbing') {
    faqs.push({
      q: `Do you charge extra emergency dispatch fees for nights or holidays in Lakewood?`,
      a: `Our network coordinates 24/7/365 emergency dispatch with upfront flat-rate quotes. You receive the exact pricing quote on-site before any physical work starts, with no surprise fee markups.`
    });
    faqs.push({
      q: `What should I do while waiting for the emergency plumber to arrive in ${zipObj.zip}?`,
      a: `Shut off your main water valve immediately, switch off electric breakers to water heaters or flooded rooms, open lowest faucets to drain residual line pressure, and clear access paths for the technician.`
    });
    faqs.push({
      q: `Can emergency plumbers handle gas leaks as well as water leaks?`,
      a: `Yes. Matched emergency contractors carry gas diagnostic tools, electronic sniffers, and replacement black iron and CSST materials to isolate and repair hazardous natural gas leaks safely.`
    });
    faqs.push({
      q: `What types of plumbing situations constitute a true emergency?`,
      a: `True emergencies include burst pressurized water pipes, uncontrolled sewage backing up into living quarters, strong gas odors, water heater tank ruptures, and total loss of water service in winter.`
    });
    faqs.push({
      q: `Are emergency plumbing dispatch operators available 24 hours a day?`,
      a: `Yes. Our dispatch phone line (877-516-8705) is staffed by live operators 24 hours a day, 7 days a week, 365 days a year, coordinating fast arrivals across Lakewood and Jefferson County.`
    });
    faqs.push({
      q: `Do emergency plumbers arrive with replacement parts on service trucks?`,
      a: `Yes. Network service trucks are stocked with commercial snake cables, PEX and copper piping, standard valves, fittings, submersible sump pumps, and water heater repair components.`
    });
    faqs.push({
      q: `How do emergency plumbers protect my home during water extraction and repair?`,
      a: `Technicians lay protective floor runners, use clean shoe covers, deploy commercial wet vacs and submersible utility pumps, and quickly contain moisture to protect floors and walls.`
    });
    faqs.push({
      q: `Can emergency plumbers restore temporary water if repairs require multiple days?`,
      a: `Whenever possible, technicians install temporary isolation bypasses or capped manifolds so unaffected bathrooms and kitchen fixtures retain running water during multi-day projects.`
    });
  } else if (serviceSlug === 'leak-detection') {
    faqs.push({
      q: `How do technicians locate hidden slab leaks without breaking concrete in ${zipObj.zip}?`,
      a: `Technicians use acoustic listening sensors that amplify water hissing sounds through concrete, combined with thermal imaging cameras to track hot water temperature signatures along the floor.`
    });
    faqs.push({
      q: `What are the dangers of ignoring a hidden slab leak in Lakewood?`,
      a: `Water escaping beneath a concrete slab continuously saturates ${zipObj.soilType}, causing bentonite clay to heave and buckle foundations, creating structural cracks and thousands in structural damage.`
    });
    faqs.push({
      q: `Can a leak detection diagnostic lower my high Lakewood water bill?`,
      a: `Yes. Once a hidden leak is pinpointed and repaired, Lakewood and Denver Water often provide sewer or water bill adjustments upon submission of a licensed plumber's repair receipt.`
    });
    faqs.push({
      q: `What non-destructive diagnostic tools are used for leak detection?`,
      a: `Technicians deploy ultrasonic ground sensors, FLIR infrared thermal cameras, electronic gas tracer detectors, and digital manometer pressure decay instruments.`
    });
    faqs.push({
      q: `What repair options exist for slab leaks under Lakewood foundations?`,
      a: `Depending on the pipe's location and condition, technicians can perform a localized direct slab access repair or execute an overhead PEX bypass through walls or attics, avoiding floor demolition.`
    });
    faqs.push({
      q: `How does pressure decay testing confirm the presence of a hidden leak?`,
      a: `Plumbers isolate the home's plumbing lines, attach a precision digital pressure gauge, and monitor for pressure drops over time. A dropping gauge confirms an active closed-system breach.`
    });
    faqs.push({
      q: `Can leak detection identify irrigation line leaks outside the home?`,
      a: `Yes. Network technicians test exterior sprinkler lines, backflow prevention devices, and underground main service lines between the street water meter and foundation.`
    });
    faqs.push({
      q: `Does homeowner's insurance cover the cost of professional leak detection?`,
      a: `Many insurance policies cover the cost of locating and accessing concealed leaks when resulting in accidental water damage. Network plumbers provide detailed diagnostic reports for claims.`
    });
  } else if (serviceSlug === 'gas-line-repair') {
    faqs.push({
      q: `What should I do immediately if I smell gas in my Lakewood home?`,
      a: `Evacuate all occupants and pets immediately. Do not flip light switches, use phones, or light matches indoors. Call Xcel Energy or 911 from outside, then contact our 24/7 emergency dispatch.`
    });
    faqs.push({
      q: `Who is responsible for gas piping repairs between the meter and house in Lakewood?`,
      a: `The utility company is responsible for piping up to the gas meter. All piping extending from the meter outlet into your home is the property owner's responsibility, requiring a licensed plumber.`
    });
    faqs.push({
      q: `How do network gas plumbers test for micro-leaks?`,
      a: `Technicians hook up digital manometers to gas manifolds and perform pressurized decay tests, verifying zero pressure drop over time to confirm 100% airtight integrity under Colorado code.`
    });
    faqs.push({
      q: `Are plumbing contractors licensed to repair gas lines in Colorado?`,
      a: `Yes. Master and Journeyman plumbers licensed by the Colorado State Plumbing Board are fully certified and tested for natural gas and propane fuel piping installation and repair.`
    });
    faqs.push({
      q: `What pipe materials are approved for indoor residential gas lines in Lakewood?`,
      a: `Approved materials include heavy-wall black iron pipe with threaded malleable fittings and corrugated stainless steel tubing (CSST) with certified mechanical fittings and electrical bonding.`
    });
    faqs.push({
      q: `How do expansive clay soils impact underground gas yard lines?`,
      a: `Cyclical soil swelling in ${zipObj.soilType} exerts shear force on buried gas lines leading to fire pits or outbuildings. We install flexible PE gas piping with tracer wire to absorb ground movement.`
    });
    faqs.push({
      q: `Does Xcel Energy inspect gas line repairs before restoring gas service?`,
      a: `Yes. When gas is shut off for repairs, local building permits and utility safety pressure inspections are typically required before Xcel Energy will unlock the gas meter.`
    });
    faqs.push({
      q: `Can network plumbers install new gas lines for outdoor kitchens and fire pits?`,
      a: `Yes. Technicians calculate appliance BTU demands, size gas supply lines appropriately, trench and install underground gas piping, and perform pressure tests to municipal code.`
    });
  } else if (serviceSlug === 'water-line-repair') {
    faqs.push({
      q: `What are the signs that my main water service line is leaking underground in ${zipObj.neighborhood}?`,
      a: `Look for unusually soggy or muddy patches in your lawn during dry weather, sinkholes near sidewalks, persistent drops in house water volume, or hissing sounds near your basement water meter.`
    });
    faqs.push({
      q: `How does trenchless water line replacement work in Lakewood?`,
      a: `Technicians dig small access pits at the meter and foundation, then use pneumatic boring or pipe-pulling equipment to slide a seamless HDPE pipe through the ground without trenching your lawn.`
    });
    faqs.push({
      q: `What depth are water service lines buried in Lakewood to prevent freezing?`,
      a: `Per Jefferson County and Colorado building codes, municipal water supply lines must be buried at least 4.5 to 5 feet deep, well below the local winter frost penetration line.`
    });
    faqs.push({
      q: `What pipe materials are recommended for new water service lines in Lakewood?`,
      a: `Plumbers install heavy-gauge seamless Type K copper or 200 PSI certified High-Density Polyethylene (HDPE), both of which resist corrosive mountain soils and ground shifting.`
    });
    faqs.push({
      q: `Can a leaking water service line damage my home's concrete foundation?`,
      a: `Yes. Water escaping near foundation footings saturates ${zipObj.soilType}, causing bentonite clay to heave and exert extreme upward hydraulic pressure against basement walls and floors.`
    });
    faqs.push({
      q: `Who is responsible for repairs to the water service line in Lakewood?`,
      a: `The property owner is responsible for the water service lateral from the curb stop or meter pit all the way into the home. Municipal water utilities maintain only the street main.`
    });
    faqs.push({
      q: `How long does a trenchless water service line replacement take?`,
      a: `Most residential trenchless water line installations are completed in a single working day (4 to 8 hours), minimizing water outage time and preserving yard landscaping.`
    });
    faqs.push({
      q: `Does Denver Water or local Lakewood water districts require permits for water line repairs?`,
      a: `Yes. Water service replacements require excavation and tapping permits from the governing water district and the City of Lakewood. Network contractors coordinate all permits and inspections.`
    });
  }

  // Group 3: 3 Neighborhood/Micro-geographic Questions
  if (zipObj.zip === '80226') {
    faqs.push({
      q: `How does Belmar commercial development affect plumbing infrastructure in 80226?`,
      a: `In Central Lakewood and Belmar (80226), high municipal sewer demand and mixed-use commercial kitchens put heavy grease loads on municipal trunk lines, requiring grease trap maintenance and frequent hydro-jetting.`
    });
    faqs.push({
      q: `What type of water pipes are common in 1950s-1970s homes around Alameda and Wadsworth?`,
      a: `Many mid-century homes in 80226 feature aging galvanized supply lines and cast-iron drains that suffer from internal tuberculation and rust, often requiring whole-home PEX repiping.`
    });
    faqs.push({
      q: `Who handles water service in Central Lakewood (80226)?`,
      a: `Properties in 80226 are primarily served by Denver Water and Consolidated Mutual Water Company, delivering water with 7 to 9 grains of hardness per gallon.`
    });
  } else if (zipObj.zip === '80214') {
    faqs.push({
      q: `Why do historic homes along West Colfax in 80214 experience chronic drain clogs?`,
      a: `Northeast Lakewood and the West Colfax corridor (80214) feature older post-war residences with original 4-inch cast-iron and clay sewer laterals that have corroded and developed internal scale over 60+ years.`
    });
    faqs.push({
      q: `Are lead service lines still present in older sections of Lakewood 80214?`,
      a: `Some older residential properties built prior to the 1960s in 80214 still possess legacy lead or galvanized customer-side service lines, which Denver Water's replacement initiative and our network contractors replace with safe copper.`
    });
    faqs.push({
      q: `How does lower elevation in 80214 (5,380 ft) compare to foothill Lakewood?`,
      a: `At 5,380 feet along the Colfax corridor, atmospheric pressure is slightly higher than the foothills, but water boiling points still remain 10°F below sea level, necessitating calibrated water heater expansion tanks.`
    });
  } else if (zipObj.zip === '80228') {
    faqs.push({
      q: `How do Green Mountain's steep foothill grades in 80228 affect sewer drainage?`,
      a: `West Lakewood and Green Mountain (80228) feature dramatic hillside topography ranging up to 6,200 feet elevation. Steep drop angles accelerate liquid flow but can leave heavy solids stranded in sewer lines without adequate volume.`
    });
    faqs.push({
      q: `Why is Green Mountain in 80228 prone to severe winter pipe freezes?`,
      a: `High foothill winds and intense winter temperature inversions cause rapid frost penetration into exterior foundation walls and uninsulated cantilevered rooms in 80228.`
    });
    faqs.push({
      q: `What water district serves homes in West Lakewood 80228?`,
      a: `Most homes on Green Mountain are served by the Green Mountain Water and Sanitation District, operating under high distribution pressures that require reliable pressure reducing valves (PRVs).`
    });
  } else if (zipObj.zip === '80215') {
    faqs.push({
      q: `How do large lots and mature trees in Eiber (80215) impact sewer lines?`,
      a: `Eiber and Morse Park (80215) feature acre-sized residential parcels with expansive root systems from century-old cottonwoods and silver maples that aggressively invade clay pipe joints in search of water.`
    });
    faqs.push({
      q: `Does Consolidated Mutual Water Company serve all of Lakewood 80215?`,
      a: `Yes, Consolidated Mutual is the primary provider for 80215, supplying treated water from Clear Creek and Ralston reservoirs with seasonal hardness variations.`
    });
    faqs.push({
      q: `What plumbing precautions apply to semi-rural agricultural parcels in 80215?`,
      a: `Properties utilizing irrigation ditches, historic well hookups, or outbuildings require code-compliant backflow preventers (RPZ valves) to isolate drinking water from agricultural contaminants.`
    });
  } else if (zipObj.zip === '80227') {
    faqs.push({
      q: `How does Bear Creek's high groundwater table in 80227 affect basements?`,
      a: `South Lakewood and Bear Creek (80227) lie within alluvial riparian floodplains. Spring mountain runoff elevates groundwater levels, requiring redundant battery-backup sump pumps to prevent basement inundation.`
    });
    faqs.push({
      q: `Are backwater prevention valves recommended near Bear Creek in 80227?`,
      a: `Yes. During heavy spring rain and snowmelt surges, municipal sewer mains can become surcharged, making full-port backwater check valves essential to prevent street wastewater backing up into lower-level fixtures.`
    });
    faqs.push({
      q: `What water district manages service in South Lakewood 80227?`,
      a: `Service in 80227 is provided via Denver Water and the Bancroft-Clover Water and Sanitation District, delivering water under monitored regional distribution pressures.`
    });
  } else if (zipObj.zip === '80232') {
    faqs.push({
      q: `What plumbing issues are common in 1960s-1970s Kendrick Lake homes (80232)?`,
      a: `Subdivisions around Kendrick Lake and Lochwood (80232) frequently contain aging copper drain-waste-vent (DWV) piping that has thinned from acid waste, as well as early polybutylene supply runs requiring replacement.`
    });
    faqs.push({
      q: `How does clay soil swelling affect driveway water mains in 80232?`,
      a: `Cyclical expansion in 80232's bentonite clay exerts differential shear force against buried water lines beneath driveways, causing joint leaks and pavement cracking.`
    });
    faqs.push({
      q: `Who supplies drinking water to Lakewood 80232 residences?`,
      a: `Consolidated Mutual Water Company supplies 80232 residences, delivering treated mountain runoff that benefits from regular annual water heater flushing.`
    });
  } else if (zipObj.zip === '80235') {
    faqs.push({
      q: `How do Bear Creek Lake park conditions in 80235 influence plumbing?`,
      a: `Properties bordering Bear Creek Lake Park (80235) sit near riparian runoff corridors with high seasonal water tables, requiring dedicated perimeter drain scoping and sump pump maintenance.`
    });
    faqs.push({
      q: `What is the elevation impact in 80235 near the Morrison boundary?`,
      a: `Reaching 5,680 feet near Morrison, water heaters in 80235 experience accelerated thermal mineral precipitation and require calibrated high-altitude gas orifices.`
    });
    faqs.push({
      q: `What sewer sanitation districts operate near the Morrison border in 80235?`,
      a: `Sanitation is coordinated between local special districts and Denver Water networks, requiring specialized permitting for private lateral connections.`
    });
  } else if (zipObj.zip === '80123') {
    faqs.push({
      q: `How do South Platte river terrace soils impact plumbing in South Lakewood 80123?`,
      a: `Gravelly alluvial clay terrace soils in 80123 create shifting subterranean friction on buried lines during freeze-thaw cycles, making flexible PEX supply lines and seamless HDPE drains the preferred repair choices.`
    });
    faqs.push({
      q: `What water utilities serve shared boundary communities in 80123?`,
      a: `Properties along the Lakewood and Littleton boundary in 80123 are served by Denver Water and Platte Canyon Water and Sanitation District.`
    });
    faqs.push({
      q: `Why do mature neighborhoods in 80123 face frequent sewer root blockages?`,
      a: `Homes established in the 1960s-1970s feature large mature deciduous shade trees whose root systems penetrate older clay lateral joints in search of winter moisture.`
    });
  } else if (zipObj.zip === '80236') {
    faqs.push({
      q: `What slab-on-grade plumbing risks affect East Lakewood homes in 80236?`,
      a: `Many mid-century residences in Harvey Park and East Lakewood (80236) were built on concrete slab foundations with under-slab copper plumbing prone to pinhole leaks from soil mineral reactions.`
    });
    faqs.push({
      q: `Who manages water supply lines in Lakewood 80236?`,
      a: `Denver Water directly supplies 80236 properties, delivering treated mountain water that meets all state and federal drinking standards.`
    });
    faqs.push({
      q: `How are under-slab copper pipe leaks resolved in 80236 without breaking floors?`,
      a: `Plumbers perform an overhead PEX repipe, routing brand new water lines through walls and ceiling joists to bypass failed under-slab pipes entirely.`
    });
  } else if (zipObj.zip === '80401') {
    faqs.push({
      q: `How do rocky foothill soils affect underground plumbing in West Lakewood 80401?`,
      a: `Bordering Golden at 5,800 feet, 80401 features decomposed granite and shallow bedrock. Excavation requires pneumatic rock-breaking tools or trenchless directional boring.`
    });
    faqs.push({
      q: `What winter freeze precautions apply to foothill elevations in 80401?`,
      a: `Higher foothill elevations bring colder wind chills and deeper frost penetration, making pipe insulation and frost-proof sillcocks mandatory.`
    });
    faqs.push({
      q: `What water districts serve residences in 80401?`,
      a: `Water is supplied by Consolidated Mutual Water Company and Golden Municipal Water, with distribution networks operating under elevated mountain pressures.`
    });
  } else {
    faqs.push({
      q: `How do network contractors handle border jurisdiction codes in ${zipObj.zip}?`,
      a: `In border ZIPs like ${zipObj.zip}, network technicians cross-reference both Jefferson County and local municipal ordinances to ensure 100% permitted compliance.`
    });
    faqs.push({
      q: `What water source supplies properties in ${zipObj.zip}?`,
      a: `Drinking water in ${zipObj.zip} is supplied via ${zipObj.waterSource}, maintaining treated mountain snowmelt with moderate calcium-carbonate hardness.`
    });
    faqs.push({
      q: `What pipe materials are best for Lakewood homes in ${zipObj.zip}?`,
      a: `Plumbers recommend PEX-A expansion tubing for water supply lines and schedule-40 PVC or HDPE for drains to withstand Colorado freeze-thaw cycles and clay ground heave.`
    });
  }

  // Group 4: 4 Network Standards & Colorado Climate Care Questions
  faqs.push({
    q: `What workmanship warranties cover ${serviceName.toLowerCase()} in Lakewood (${zipObj.zip})?`,
    a: `All service repairs executed through our contractor network come with a 100% workmanship warranty backed by the executing licensed contractor, alongside manufacturer guarantees on parts and piping.`
  });

  faqs.push({
    q: `How do I schedule non-emergency service for a future date in ${zipObj.neighborhood}?`,
    a: `You can call our dispatch desk at 877-516-8705 anytime 24/7 to schedule an appointment at your convenience, with morning, afternoon, and weekend arrival windows available.`
  });

  faqs.push({
    q: `How can I prevent winter pipe freeze emergencies while away from my Colorado home?`,
    a: `Never set thermostats below 55°F, leave cabinet doors open under sinks, disconnect exterior garden hoses, shut off water at the main valve if leaving for extended periods, and have someone inspect the home during extreme freezes.`
  });

  faqs.push({
    q: `What payment options are accepted by network plumbing contractors in Lakewood?`,
    a: `Matched plumbing contractors accept all major credit cards (Visa, MasterCard, Amex, Discover), personal checks, debit cards, and electronic payments upon satisfactory service completion.`
  });

  // Guarantee exactly 20 FAQs
  return faqs.slice(0, 20);
}

// ======================================================================
// 4. GENERATE HYPER-LOCAL SERVICE PAGE (/colorado/lakewood-[zip]/[service-slug]/index.html)
// ======================================================================
function generateServicePage(zipObj, serviceObj) {
  const cityZipSlug = `lakewood-${zipObj.zip}`;
  const serviceSlug = serviceObj.slug;
  const serviceName = serviceObj.name;
  const serviceDir = path.join(COLORADO_DIR, cityZipSlug, serviceSlug);
  ensureDir(serviceDir);

  const pageUrl = `${DOMAIN}/colorado/${cityZipSlug}/${serviceSlug}/`;
  const cityHubUrl = `${DOMAIN}/colorado/${cityZipSlug}/`;
  const stateUrl = `${DOMAIN}/colorado/`;

  const metaTitle = `${serviceName} in Lakewood, CO (${zipObj.zip}) | 24/7 Pro Dispatch`;
  const metaDesc = `Fast, reliable ${serviceName.toLowerCase()} in Lakewood, CO (${zipObj.zip}). Vetted licensed pros, upfront flat-rate pricing & 24/7 emergency dispatch. Call 877-516-8705!`;
  const serviceImageUrl = `${DOMAIN}/public/images/services/${serviceSlug}.webp`;

  const localCopy = generateLocalContent(serviceSlug, serviceName, zipObj);
  const signsHtml = generate5Signs(serviceSlug, serviceName, zipObj);
  const faqs = generateFAQs(serviceSlug, serviceName, zipObj);

  const faqsHtml = faqs.map(f => `
    <div class="faq-item" style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: var(--bg-card); margin-bottom: 12px;">
      <details style="padding: 18px 22px;">
        <summary style="font-weight: 700; color: var(--text-white); cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-size: 1.05rem;">
          <span>${f.q}</span>
          <i class="fas fa-chevron-down" style="color: var(--primary); font-size: 0.85rem;"></i>
        </summary>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.7; margin-top: 14px; margin-bottom: 0;">${f.a}</p>
      </details>
    </div>
  `).join('\n');

  // Other services in this ZIP
  const otherServices = SERVICES.filter(s => s.slug !== serviceSlug);
  const otherServicesHtml = otherServices.map(s => `
    <a href="/colorado/${cityZipSlug}/${s.slug}/" class="list-link" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-bottom: 8px; font-size: 0.92rem; color: var(--text-muted); text-decoration: none; transition: var(--transition);">
      <span><i class="fas ${s.icon}" style="margin-right: 8px; color: var(--primary);"></i> ${s.name}</span>
      <i class="fas fa-chevron-right" style="font-size: 0.8rem;"></i>
    </a>
  `).join('\n');

  // Nearby ZIPs for the same service
  const nearbyZips = LAKEWOOD_ZIPS.filter(z => z.zip !== zipObj.zip);
  const nearbyZipsHtml = nearbyZips.map(nz => `
    <a href="/colorado/lakewood-${nz.zip}/${serviceSlug}/" class="list-link" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-bottom: 8px; font-size: 0.92rem; color: var(--text-muted); text-decoration: none; transition: var(--transition);">
      <span><i class="fas fa-map-marker-alt" style="margin-right: 8px; color: var(--primary);"></i> Lakewood (${nz.zip})</span>
      <i class="fas fa-chevron-right" style="font-size: 0.8rem;"></i>
    </a>
  `).join('\n');

  const schemaObj = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "PlumbingService",
        "@id": `${pageUrl}#plumbingservice`,
        "name": `Home Plumbing USA - ${serviceName} in Lakewood (${zipObj.zip})`,
        "description": metaDesc,
        "url": pageUrl,
        "telephone": "877-516-8705",
        "priceRange": "$$",
        "image": serviceImageUrl,
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": zipObj.lat,
          "longitude": zipObj.lng
        },
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Lakewood",
          "addressRegion": "CO",
          "postalCode": zipObj.zip,
          "addressCountry": "US"
        },
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
        "@id": `${pageUrl}#breadcrumb`,
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
            "name": "Colorado",
            "item": stateUrl
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `Lakewood (${zipObj.zip})`,
            "item": cityHubUrl
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

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metaTitle}</title>
  <meta name="description" content="${metaDesc}">
  <meta name="keywords" content="${serviceName.toLowerCase()} Lakewood CO, ${serviceName.toLowerCase()} ${zipObj.zip}, emergency plumber Lakewood, 24/7 plumbing repair Lakewood CO">
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
${JSON.stringify(schemaObj, null, 2)}
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
        <span>24/7 ${serviceName} in <strong>Lakewood, CO (${zipObj.zip})</strong> &bull; Vetted Independent Network &bull; <a href="tel:877-516-8705" style="color: inherit; text-decoration: none; font-weight: 700;">877-516-8705</a></span>
      </div>
    </div>
    <div class="header-inner container" style="min-height: 80px; height: 80px; display: flex; align-items: center; justify-content: space-between;">
      <a href="/" class="logo" style="width: 247px; max-width: 100%; display: flex; align-items: center;">
        <img src="/public/images/logo.svg" alt="Home Plumbing USA Logo" class="logo-img" width="247" height="52">
      </a>
      <nav class="nav" id="mainNav">
        <a href="/" class="nav-link">Home</a>
        <a href="/colorado/" class="nav-link">Colorado</a>
        <a href="${cityHubUrl}" class="nav-link">Lakewood (${zipObj.zip})</a>
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
          <a href="${stateUrl}" style="color: var(--primary-light); text-decoration: none;">Colorado</a>
          <i class="fas fa-chevron-right" style="font-size: 0.75rem;"></i>
          <a href="${cityHubUrl}" style="color: var(--primary-light); text-decoration: none;">Lakewood (${zipObj.zip})</a>
          <i class="fas fa-chevron-right" style="font-size: 0.75rem;"></i>
          <span style="color: #fff;">${serviceName}</span>
        </div>

        <div class="grid-2 hero-grid" style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 3rem; align-items: center;">
          <div class="hero-content">
            <div class="hero-badge" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(37,99,235,0.15); border: 1px solid rgba(37,99,235,0.3); color: var(--primary-light); padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; margin-bottom: 16px;">
              <i class="fas fa-shield-alt" style="color: var(--accent);"></i> Vetted Local Contractor Dispatch &bull; ${zipObj.neighborhood}
            </div>
            <h1 style="font-size: 2.75rem; line-height: 1.2; color: #fff; margin-bottom: 1.25rem; font-weight: 800;">
              ${serviceName} in <span style="color: var(--accent);">Lakewood, CO (${zipObj.zip})</span>
            </h1>
            <p style="font-size: 1.1rem; color: var(--text-light); margin-bottom: 2rem; line-height: 1.7;">
              In ${zipObj.neighborhood} (${zipObj.zip}), elevation ranges around ${zipObj.elevation} amidst shifting ${zipObj.soilType}. Extreme Rocky Mountain cold fronts and hard water from ${zipObj.waterSource} demand experienced local plumbing technicians equipped with specialized diagnostic tools. Our dispatch network connects you directly with independent licensed Colorado contractors 24/7/365.
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
            <img src="/public/images/services/${serviceSlug}.webp" srcset="/public/images/services/${serviceSlug}-mobile.webp 480w, /public/images/services/${serviceSlug}.webp 1200w" sizes="(max-width: 600px) 480px, 1200px" alt="Technician performing ${serviceName.toLowerCase()} in Lakewood, CO (${zipObj.zip})" style="width: 100%; height: auto; display: block; aspect-ratio: 4 / 5; object-fit: cover;">
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
              <strong class="quick-info-value">${serviceObj.costRange}</strong>
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
              <span class="quick-info-sub">Active Lakewood Coverage</span>
            </div>
          </div>

          <div class="quick-info-card">
            <div class="quick-info-icon" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">
              <i class="fas fa-shield-halved"></i>
            </div>
            <div class="quick-info-text">
              <span class="quick-info-label">Workmanship Warranty</span>
              <strong class="quick-info-value">100% Guaranteed</strong>
              <span class="quick-info-sub">${serviceObj.warranty}</span>
            </div>
          </div>

          <div class="quick-info-card highlight-card">
            <div class="quick-info-icon" style="background: rgba(239, 68, 68, 0.25); color: #f87171;">
              <i class="fas fa-headset"></i>
            </div>
            <div class="quick-info-text">
              <span class="quick-info-label">Live Dispatch Coordination</span>
              <a href="tel:877-516-8705" style="font-size: 1.15rem; color: #fff; font-weight: 800; text-decoration: none; display: block;">877-516-8705</a>
              <span class="quick-info-sub">24/7 Colorado Operator</span>
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
            ${signsHtml}

            <!-- LOCALIZED PAIN POINTS -->
            <h2>${localCopy.p1Title}</h2>
            <p>${localCopy.p1}</p>

            <h2>${localCopy.p2Title}</h2>
            <p>${localCopy.p2}</p>

            <!-- 5-STEP WORKFLOW -->
            <h2 style="margin-top: 36px;">Our 5-Step Service Process in Lakewood (${zipObj.zip})</h2>
            <div class="workflow-list">
              <div class="workflow-step">
                <div class="step-num">1</div>
                <div>
                  <h4>Direct Dispatch Coordination</h4>
                  <p>Contact our 24/7 dispatch desk for ${zipObj.neighborhood}. We match your address with the nearest active, certified independent plumbing contractor available in ${zipObj.zip}.</p>
                </div>
              </div>
              <div class="workflow-step">
                <div class="step-num">2</div>
                <div>
                  <h4>On-Site Physical Diagnosis</h4>
                  <p>The licensed technician arrives on-site in ${zipObj.neighborhood} with a fully-equipped service vehicle to inspect pipe conditions, pressures, and local soil movement.</p>
                </div>
              </div>
              <div class="workflow-step">
                <div class="step-num">3</div>
                <div>
                  <h4>Upfront Flat-Rate Estimate</h4>
                  <p>You receive an itemized, transparent written quote before any physical repair or excavation starts in ${zipObj.zip}. Zero surprise fees or unexpected hourly add-ons.</p>
                </div>
              </div>
              <div class="workflow-step">
                <div class="step-num">4</div>
                <div>
                  <h4>Precision Execution & Code Compliance</h4>
                  <p>Work is carried out using commercial-grade materials compliant with Colorado State Plumbing Board regulations and local Jefferson County codes.</p>
                </div>
              </div>
              <div class="workflow-step">
                <div class="step-num">5</div>
                <div>
                  <h4>Pressure Testing & Quality Verification</h4>
                  <p>The technician completes multi-point hydrostatic flow checks and pressure diagnostics to confirm flawless operation and complete cleanout at ${zipObj.elevation} elevation.</p>
                </div>
              </div>
            </div>

            <!-- FAQS ACCORDION -->
            <h2 style="margin-top: 40px; margin-bottom: 20px;">Frequently Asked Questions in Lakewood (${zipObj.zip})</h2>
            <div>
              ${faqsHtml}
            </div>
          </div>

          <!-- SIDEBAR COLUMN -->
          <div class="detail-sidebar">
            <div class="sidebar-widget cta-widget">
              <div style="font-size: 2.4rem; color: var(--accent); margin-bottom: 10px;"><i class="fas fa-phone-volume"></i></div>
              <h3>Need Immediate Help in Lakewood?</h3>
              <p style="color: var(--text-light); font-size: 0.95rem; margin-bottom: 18px;">Independent contractors on-call 24/7 across ${zipObj.neighborhood}. Typical dispatch response in 30–45 minutes.</p>
              <a href="tel:877-516-8705" class="btn btn-accent" style="width: 100%; padding: 14px; font-weight: 800; font-size: 1.05rem; display: inline-flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; border-radius: 8px; background: var(--gradient-accent); color: #fff; box-shadow: var(--shadow-accent-glow);">
                <i class="fas fa-phone"></i> 877-516-8705
              </a>
            </div>

            <div class="sidebar-widget">
              <h3>Other Services in ${zipObj.zip}</h3>
              ${otherServicesHtml}
            </div>

            <div class="sidebar-widget">
              <h3>${serviceName} in Nearby Lakewood ZIPs</h3>
              ${nearbyZipsHtml}
            </div>

            <div class="sidebar-widget">
              <h3>Colorado Coverage</h3>
              <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 12px;">Explore full Colorado state coverage and western Denver metro service areas.</p>
              <a href="/colorado/" style="color: var(--primary-light); font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; font-size: 0.92rem;">
                View Colorado Directory <i class="fas fa-arrow-right" style="font-size: 0.8rem;"></i>
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
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.65; margin-bottom: 16px;">Providing ${serviceName.toLowerCase()} referral and emergency dispatch services in Lakewood, CO (${zipObj.zip}) and surrounding communities 24/7/365.</p>
          <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5;">24/7 Dispatch Hotline: <a href="tel:877-516-8705" style="color: var(--accent); text-decoration: none; font-weight: 700;">877-516-8705</a></p>
        </div>

        <div>
          <h4 style="color: #fff; font-size: 1.1rem; font-weight: 700; margin-bottom: 16px;">Quick Links</h4>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.92rem;">
            <a href="/" style="color: var(--text-muted); text-decoration: none;">Home</a>
            <a href="/colorado/" style="color: var(--text-muted); text-decoration: none;">Colorado Plumbers</a>
            <a href="${cityHubUrl}" style="color: var(--text-muted); text-decoration: none;">Lakewood (${zipObj.zip}) Hub</a>
            <a href="/contact" style="color: var(--text-muted); text-decoration: none;">Contact Support</a>
          </div>
        </div>

        <div>
          <h4 style="color: #fff; font-size: 1.1rem; font-weight: 700; margin-bottom: 16px;">Services in ${zipObj.zip}</h4>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.92rem;">
            <a href="/colorado/${cityZipSlug}/drain-cleaning/" style="color: var(--text-muted); text-decoration: none;">Drain Cleaning</a>
            <a href="/colorado/${cityZipSlug}/burst-pipe-repair/" style="color: var(--text-muted); text-decoration: none;">Burst Pipe Repair</a>
            <a href="/colorado/${cityZipSlug}/water-heater-repair/" style="color: var(--text-muted); text-decoration: none;">Water Heater Repair</a>
            <a href="/colorado/${cityZipSlug}/sewer-line-repair/" style="color: var(--text-muted); text-decoration: none;">Sewer Line Repair</a>
            <a href="/colorado/${cityZipSlug}/emergency-plumbing/" style="color: var(--text-muted); text-decoration: none;">Emergency Plumbing</a>
          </div>
        </div>

        <div>
          <h4 style="color: #fff; font-size: 1.1rem; font-weight: 700; margin-bottom: 16px;">Network Standards</h4>
          <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.6; margin-bottom: 12px;">Workmanship guarantees and flat-rate pricing provided directly by independent, licensed Colorado contractors matched through our platform.</p>
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

  fs.writeFileSync(path.join(serviceDir, 'index.html'), html, 'utf8');
}

module.exports = {
  generateServicePage
};
