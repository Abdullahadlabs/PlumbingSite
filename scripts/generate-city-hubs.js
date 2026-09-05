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

function capitalize(str) {
  if (!str) return '';
  return str
    .split(/[- ]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function buildCityZipHub(state, cityZip, nearbyZips) {
  const stateSlug = state.slug;
  const stateName = state.name;
  const stateCode = state.code;
  const cityName = cityZip.city;
  const zip = cityZip.zip;
  const cityZipSlug = cityZip.folder_name || `${slugify(cityName)}-${zip}`;

  const pageUrl = `${DOMAIN}/${stateSlug}/${cityZipSlug}/`;
  const stateUrl = `${DOMAIN}/state/${stateSlug}/`;

  // 1. Meta Tags
  const title = `Plumbers in ${cityName}, ${stateCode} ${zip} | 24/7 Emergency Plumbing`;
  const metaDesc = `Need emergency plumbing in ${cityName}, ${stateCode} (${zip})? Expect flat-rate estimates, licensed pros, and under 45-minute responses for residential and commercial pipe repairs. Call 877-516-8705!`;

  // 2. Services Grid Generation (Matching 8 primary services with local descriptions)
  const serviceIcons = {
    'drain-cleaning': 'fa-broom',
    'burst-pipe-repair': 'fa-water',
    'water-heater-repair': 'fa-temperature-high',
    'sewer-line-repair': 'fa-screwdriver-wrench',
    'emergency-plumbing': 'fa-bolt',
    'leak-detection': 'fa-magnifying-glass',
    'gas-line-repair': 'fa-fire',
    'water-line-repair': 'fa-faucet-drip'
  };

  const servicesGridHtml = SERVICES.map(s => {
    const icon = serviceIcons[s.slug] || 'fa-wrench';
    let serviceDesc = `Professional ${s.name.toLowerCase()} for residential and commercial properties in ${cityName} (${zip}). Fast dispatch and transparent upfront pricing.`;
    
    // Check if cityZip has localized service_grid from seo-pages.json
    if (cityZip.service_grid && Array.isArray(cityZip.service_grid)) {
      const found = cityZip.service_grid.find(item => item.service_slug === s.slug);
      if (found && found.description) {
        serviceDesc = found.description;
      }
    }

    return `
      <div class="service-card animate-on-scroll" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 28px; transition: var(--transition); display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div class="service-icon" style="width: 52px; height: 52px; border-radius: 12px; background: var(--gradient-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; margin-bottom: 20px;">
            <i class="fas ${icon}"></i>
          </div>
          <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--text-white); margin-bottom: 12px;">${s.name}</h3>
          <p style="color: var(--text-muted); font-size: 0.94rem; line-height: 1.65; margin-bottom: 20px;">${serviceDesc}</p>
        </div>
        <div>
          <a href="/${stateSlug}/${cityZipSlug}/${s.slug}/" style="color: var(--primary-light); font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-size: 0.95rem;">
            Learn More <i class="fas fa-arrow-right" style="font-size: 0.8rem;"></i>
          </a>
        </div>
      </div>
    `;
  }).join('\n');

  // 3. Nearby Areas Generation
  let coverageList = [];
  if (cityZip.nearby_areas && Array.isArray(cityZip.nearby_areas) && cityZip.nearby_areas.length > 0) {
    coverageList = cityZip.nearby_areas.slice(0, 10).map(area => {
      const areaCity = area.city || capitalize(area.slug.replace(/^(fl|ak|tx)-/, '').replace(/-\d{5}$/, '').replace(/-/g, ' '));
      const areaZip = area.zip || area.slug.split('-').pop();
      const areaSlug = `${slugify(areaCity)}-${areaZip}`;
      return {
        city: areaCity,
        zip: areaZip,
        slug: areaSlug
      };
    });
  } else {
    coverageList = nearbyZips.slice(0, 10).map(nz => ({
      city: nz.city,
      zip: nz.zip,
      slug: nz.slug
    }));
  }

  const nearbyHtml = coverageList.map(nz => `
    <div class="area-card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 18px 20px; display: flex; flex-direction: column; justify-content: space-between; transition: var(--transition);">
      <div>
        <h3 style="font-size: 1.05rem; color: var(--text-white); margin-bottom: 4px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
          <i class="fas fa-map-pin" style="color: var(--primary); font-size: 0.9rem;"></i> ${nz.city}, ${stateCode}
        </h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">ZIP Code: ${nz.zip} | Prompt emergency repairs, water line fixes, and drain cleaning.</p>
      </div>
      <a href="/${stateSlug}/${nz.slug}/" style="color: var(--accent); font-size: 0.88rem; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
        Schedule Service <i class="fas fa-arrow-right" style="font-size: 0.75rem;"></i>
      </a>
    </div>
  `).join('\n');

  // 4. FAQs Generation (From SEO data or localized fallbacks)
  let faqsList = [];
  if (cityZip.faqs && Array.isArray(cityZip.faqs) && cityZip.faqs.length > 0) {
    faqsList = cityZip.faqs.slice(0, 10);
  } else {
    faqsList = [
      {
        question: `How quickly can a plumber respond to an emergency in ${cityName}, ${stateCode}?`,
        answer: `Our network aims for an average under-45-minute response time for emergency plumbing in ${cityName} (${zip}), with technicians dispatched 24 hours a day, 7 days a week.`
      },
      {
        question: `Are your plumbers licensed and insured in ${stateName}?`,
        answer: `Yes, every plumbing specialist in our network is fully vetted, licensed under ${stateName} state regulations, and holds comprehensive liability insurance for your protection.`
      },
      {
        question: `Do you charge by the hour or provide upfront flat-rate pricing?`,
        answer: `We provide clear, upfront flat-rate written estimates on-site before any repairs begin, so you know the exact cost with zero hidden fees or surprise charges.`
      },
      {
        question: `What causes burst pipes in ${cityName}, and how can I prevent them?`,
        answer: `Burst pipes in ${cityName} often result from sudden pressure spikes, hidden foundation settlement, or water hammer shock. Prevention includes installing pressure reducing valves and scheduling annual plumbing inspections.`
      },
      {
        question: `How do you detect hidden slab leaks beneath foundations?`,
        answer: `We utilize non-invasive digital diagnostic tools, including acoustic ground microphones and thermal imaging cameras, to pinpoint hidden under-slab leaks without tearing up your flooring.`
      },
      {
        question: `Does ${cityName} have hard water, and do you install water softeners?`,
        answer: `Yes, groundwater across ${stateName} frequently carries high calcium and magnesium content. We diagnose mineral scale buildup and install high-efficiency whole-home water softening systems.`
      },
      {
        question: `What local plumbing codes do you follow in ${cityName}, ${stateCode}?`,
        answer: `All repairs and installations strictly follow the ${stateName} Building Code (Plumbing) and OSHA safety standards, ensuring reliable, code-compliant workmanship.`
      },
      {
        question: `Do you provide commercial plumbing services in ${cityName}?`,
        answer: `Yes, we match both commercial properties and residential homes in ${cityName} (${zip}) with specialists equipped for heavy-duty grease interceptors, commercial water heaters, and main line rooter snaking.`
      }
    ];
  }

  const faqsHtml = faqsList.map((faq) => `
    <div class="faq-item" style="border: 1px solid var(--border-color); border-radius: var(--radius-sm); overflow: hidden; background: var(--bg-card); transition: var(--transition);">
      <button class="faq-trigger" type="button" aria-expanded="false" style="width: 100%; text-align: left; padding: 18px 24px; background: none; border: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 16px;">
        <h3 class="faq-title" style="font-size: 1.05rem; font-weight: 700; color: var(--text-white); margin: 0;">${faq.question}</h3>
        <span class="faq-icon" style="font-size: 1.5rem; font-weight: 400; color: var(--primary-light); line-height: 1; flex-shrink: 0;">+</span>
      </button>
      <div class="faq-content" style="max-height: 0; overflow: hidden; transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);">
        <div class="faq-content-inner" style="padding: 0 24px 20px; color: var(--text-muted); font-size: 0.95rem; line-height: 1.7;">
          <p style="margin: 0;">${faq.answer}</p>
        </div>
      </div>
    </div>
  `).join('\n');

  // 5. Schema.org JSON-LD (PlumbingService + BreadcrumbList + FAQPage)
  const schemaObj = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "PlumbingService",
        "@id": `${pageUrl}#plumbingservice`,
        "name": `Home Plumbing USA - ${cityName} (${zip})`,
        "description": metaDesc,
        "url": pageUrl,
        "telephone": "877-516-8705",
        "priceRange": "$$",
        "image": `${DOMAIN}/public/images/hero-plumbing.webp`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": cityName,
          "addressRegion": stateCode,
          "postalCode": zip,
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
            "name": stateName,
            "item": stateUrl
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `${cityName} (${zip})`,
            "item": pageUrl
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        "mainEntity": faqsList.map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
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
  <title>${title}</title>
  <meta name="description" content="${metaDesc}">
  <meta name="keywords" content="plumbers ${cityName} ${zip}, emergency plumbing ${cityName}, 24 hour plumber ${cityName} ${stateCode}, local plumbers ${zip}, drain cleaning ${cityName}">
  <link rel="canonical" href="${pageUrl}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${metaDesc}">
  <meta property="og:image" content="${DOMAIN}/public/images/hero-plumbing.webp">

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
    /* Accordion & Interactive Styles */
    .faq-item.active {
      border-color: var(--primary) !important;
      box-shadow: 0 4px 16px rgba(37,99,235,0.15) !important;
    }
    .faq-item.active .faq-content {
      max-height: 500px !important;
    }
    .faq-item.active .faq-icon {
      transform: rotate(45deg);
      color: var(--accent) !important;
    }
    .process-timeline::before {
      content: '';
      position: absolute;
      top: 20px;
      bottom: 20px;
      left: 21px;
      width: 2px;
      background: rgba(37,99,235,0.3);
    }
    @media (max-width: 992px) {
      .hero-grid, .trust-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
      .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
    }
    @media (max-width: 768px) {
      .header-inner { height: auto !important; padding: 14px 20px !important; flex-wrap: wrap; }
      .menu-toggle { display: block !important; }
      .nav { display: none; width: 100%; flex-direction: column; gap: 12px; margin-top: 16px; }
      .nav.active { display: flex !important; }
      .header-cta { display: none !important; }
      .footer-grid { grid-template-columns: 1fr !important; }
      .trust-grid { grid-template-columns: 1fr !important; }
      .hero h1 { font-size: 2.15rem !important; }
    }
  </style>
  <link rel="icon" type="image/png" href="/public/images/favicon.png">
</head>
<body data-prefix="/" data-depth="0">

  <!-- Header -->
  <header class="header" id="header" style="min-height: 120px;">
    <div class="top-bar" style="min-height: 40px; height: 40px; display: flex; align-items: center; justify-content: center; text-align: center; white-space: nowrap; background: var(--bg-darker); border-bottom: 1px solid var(--border-color);">
      <div class="container flex-between" style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="pulse-dot"></span>
          <span>Professional Plumbing Team Available 24/7 in <strong>${cityName}, ${stateCode} (${zip})</strong></span>
        </div>
        <div>
          <a href="tel:877-516-8705" style="color: #fff; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fas fa-phone-alt" style="color: var(--accent);"></i> Emergency Line: (877) 516-8705
          </a>
        </div>
      </div>
    </div>
    <div class="header-inner container" style="min-height: 80px; height: 80px; display: flex; align-items: center; justify-content: space-between;">
      <a href="/" class="logo" style="width: 247px; max-width: 100%; display: flex; align-items: center;">
        <img src="/public/images/logo.svg" alt="Home Plumbing USA Logo" class="logo-img" width="247" height="52">
      </a>
      <button class="menu-toggle" id="mobileToggle" aria-expanded="false" aria-label="Toggle navigationMenu" style="background: none; border: none; font-size: 1.6rem; color: #fff; cursor: pointer; display: none;">&#9776;</button>
      <nav class="nav" id="mainNav">
        <a href="/" class="nav-link">Home</a>
        <a href="/about" class="nav-link">About</a>
        <a href="#services" class="nav-link">Services</a>
        <a href="#areas" class="nav-link">Areas We Serve</a>
        <a href="/projects" class="nav-link">Projects</a>
        <a href="/contact" class="nav-link">Contact</a>
      </nav>
      <div class="header-cta" style="display: flex; align-items: center; gap: 16px;">
        <a href="tel:877-516-8705" class="header-phone" style="display: inline-flex; align-items: center; gap: 8px; font-weight: 700; color: #fff; text-decoration: none;"><i class="fas fa-phone" style="color: var(--accent);"></i> 877-516-8705</a>
        <a href="tel:877-516-8705" class="btn btn-primary btn-sm">Call Now</a>
      </div>
    </div>
  </header>

  <main>
    <!-- 1. HERO SECTION -->
    <section class="hero" style="padding: 60px 0 50px; background: linear-gradient(135deg, rgba(10, 22, 40, 0.96), rgba(15, 30, 60, 0.88)); color: var(--text-white); position: relative;">
      <div class="container">
        <div class="breadcrumbs" style="display: flex; gap: 8px; align-items: center; font-size: 0.9rem; margin-bottom: 24px; color: var(--text-muted); flex-wrap: wrap;">
          <a href="/" style="color: var(--primary-light); text-decoration: none;">Home</a>
          <i class="fas fa-chevron-right" style="font-size: 0.75rem;"></i>
          <a href="${stateUrl}" style="color: var(--primary-light); text-decoration: none;">${stateName}</a>
          <i class="fas fa-chevron-right" style="font-size: 0.75rem;"></i>
          <span style="color: #fff;">${cityName} (${zip})</span>
        </div>

        <div class="grid-2 hero-grid" style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 3rem; align-items: center;">
          <div class="hero-content">
            <div class="hero-badge" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(37,99,235,0.15); border: 1px solid rgba(37,99,235,0.3); color: var(--primary-light); padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; margin-bottom: 16px;">
              <i class="fas fa-shield-alt" style="color: var(--accent);"></i> Licensed &amp; Insured Plumbing Specialists in ${cityName}
            </div>
            <h1 style="font-size: 2.75rem; line-height: 1.2; color: #fff; margin-bottom: 1.25rem; font-weight: 800;">
              Professional Plumbing Services in <span style="color: var(--accent);">${cityName}, ${stateCode} ${zip}</span>
            </h1>
            <p style="font-size: 1.1rem; color: var(--text-light); margin-bottom: 2rem; line-height: 1.7;">
              When burst pipes flood your property or a backed-up sewer brings your day to a halt, Home Plumbing USA connects you with prompt, effective solutions in ${cityName} (${zip}). We tackle everything from stubborn clogged drains and leaking water heaters to complex slab leaks with precision. Expect a licensed professional at your door in under 45 minutes with upfront flat-rate pricing and no hidden fees.
            </p>
            <div class="hero-ctas" style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <a href="tel:877-516-8705" class="btn btn-accent" style="background: var(--gradient-accent); color: #fff; font-weight: 700; font-size: 1.05rem; padding: 14px 28px; border-radius: 8px; text-decoration: none; box-shadow: var(--shadow-accent-glow); display: inline-flex; align-items: center; gap: 8px;">
                <i class="fas fa-phone-alt"></i> Call (877) 516-8705
              </a>
              <a href="#services" class="btn btn-outline" style="border: 2px solid rgba(255,255,255,0.3); color: #fff; font-weight: 600; font-size: 1.05rem; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                <i class="fas fa-wrench"></i> View Services in ${zip}
              </a>
            </div>
          </div>
          <div class="hero-image-container" style="border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-lg); border: 1px solid var(--border-color); background: #0f1e3a;">
            <img src="/public/images/hero-plumbing.webp" srcset="/public/images/hero-plumbing-mobile.webp 480w, /public/images/hero-plumbing.webp 1200w" sizes="(max-width: 600px) 480px, 1200px" alt="Professional plumber in ${cityName} ${stateCode}" style="width: 100%; height: auto; display: block; aspect-ratio: 4 / 5; object-fit: cover;">
          </div>
        </div>
      </div>
    </section>

    <!-- 2. TRUST BADGES SECTION (CRAFTSMANSHIP & SAFE EXECUTION) -->
    <section class="trust-badges" style="background: var(--bg-surface); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding: 5rem 0;">
      <div class="container">
        <div class="grid-2 trust-grid" style="display: grid; grid-template-columns: 1fr 1.3fr; align-items: center; gap: 3.5rem;">
          <div class="trust-image-block" style="border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-md); border: 1px solid var(--border-color);">
            <img src="/public/images/hero-plumbing-team.webp" alt="Plumbing specialists serving ${cityName} ${stateCode}" style="width: 100%; height: auto; display: block;">
          </div>
          <div>
            <div class="section-title left-aligned" style="text-align: left; margin-bottom: 2rem;">
              <h2 style="font-size: 2.1rem; color: #fff; margin-bottom: 0.75rem;">Quality Craftsmanship &amp; Safe Execution</h2>
              <p style="font-size: 1.05rem; color: var(--text-muted); margin: 0;">We focus on delivering safe, code-compliant plumbing solutions for local households in ${cityName} (${zip}).</p>
            </div>
            <div class="grid-2" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
              <div class="badge-card" style="background: var(--bg-card); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
                <div style="font-size: 1.5rem; color: var(--accent); margin-bottom: 0.5rem;"><i class="fas fa-certificate"></i></div>
                <h3 style="color: var(--text-white); margin-bottom: 0.5rem; font-size: 1.15rem;">Licensed Plumbers</h3>
                <p style="font-size: 0.88rem; margin-bottom: 0; color: var(--text-muted); line-height: 1.6;">Our crew includes certified, professional plumbers, each bringing deep knowledge and experience to every task across ${cityName}'s diverse neighborhoods.</p>
              </div>
              <div class="badge-card" style="background: var(--bg-card); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
                <div style="font-size: 1.5rem; color: var(--accent); margin-bottom: 0.5rem;"><i class="fas fa-clock"></i></div>
                <h3 style="color: var(--text-white); margin-bottom: 0.5rem; font-size: 1.15rem;">24/7 Fast Dispatch</h3>
                <p style="font-size: 0.88rem; margin-bottom: 0; color: var(--text-muted); line-height: 1.6;">We offer rapid 24/7 emergency dispatches, getting to homes in ${cityName} and surrounding communities quickly. For any urgent leak, count on us to be there fast.</p>
              </div>
              <div class="badge-card" style="background: var(--bg-card); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
                <div style="font-size: 1.5rem; color: var(--accent); margin-bottom: 0.5rem;"><i class="fas fa-shield-check"></i></div>
                <h3 style="color: var(--text-white); margin-bottom: 0.5rem; font-size: 1.15rem;">Safety Compliant</h3>
                <p style="font-size: 0.88rem; margin-bottom: 0; color: var(--text-muted); line-height: 1.6;">All our work follows strict OSHA standards and local ${stateName} building &amp; plumbing codes, protecting both our team and your property during every service call.</p>
              </div>
              <div class="badge-card" style="background: var(--bg-card); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
                <div style="font-size: 1.5rem; color: var(--accent); margin-bottom: 0.5rem;"><i class="fas fa-file-invoice-dollar"></i></div>
                <h3 style="color: var(--text-white); margin-bottom: 0.5rem; font-size: 1.15rem;">Flat-Rate Quotes</h3>
                <p style="font-size: 0.88rem; margin-bottom: 0; color: var(--text-muted); line-height: 1.6;">You receive honest, transparent, flat-rate quotes before any work begins, meaning no unexpected costs or hidden fees ever surprise you.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. ABOUT SECTION (LOCAL AUTHORITY) -->
    <section class="about-section" style="padding: 5rem 0; background: var(--bg-dark);">
      <div class="container">
        <div style="max-width: 860px; margin: 0 auto; text-align: center;">
          <div class="section-title" style="margin-bottom: 2rem;">
            <div class="section-label" style="display: inline-block; padding: 4px 14px; background: rgba(37,99,235,0.15); color: var(--primary-light); border-radius: 20px; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 10px;">Local Expertise</div>
            <h2 style="font-size: 2.2rem; color: #fff;">Professional Pipe Repair &amp; Drain Cleaning in ${cityName}, ${stateCode}</h2>
          </div>
          <p style="font-size: 1.05rem; color: var(--text-light); line-height: 1.8; margin-bottom: 1.5rem;">
            Home Plumbing USA is built on a network of vetted local professionals, deeply familiar with ${cityName}'s unique plumbing challenges. From managing coastal groundwater pressure and seasonal downpours to dealing with hard water mineral build-up, our dedication to honest, effective work keeps homes across our community running smoothly in ${cityName} (${zip}) and surrounding areas.
          </p>
          <p style="font-size: 1.05rem; color: var(--text-muted); line-height: 1.8; margin-bottom: 2rem;">
            Our licensed experts perform every task adhering strictly to ${stateName}'s building codes and plumbing safety regulations. We use high-grade copper, CPVC, and PEX piping, chosen for its durability and corrosion resistance in our regional climate, ensuring lasting repairs. Each work zone is kept tidy, laying down floor protection to minimize disruption and leaving your property spotless.
          </p>
          <div>
            <a href="/about" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 8px; background: var(--primary); color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">More About Our Standards <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. SERVICE WORKFLOW (PROCESS TIMELINE) -->
    <section class="process-section" style="padding: 5rem 0; background: var(--bg-surface);">
      <div class="container">
        <div class="section-title text-center" style="text-align: center; max-width: 700px; margin: 0 auto 3.5rem;">
          <div class="section-label" style="display: inline-block; padding: 4px 14px; background: rgba(37,99,235,0.15); color: var(--primary-light); border-radius: 20px; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 10px;">How It Works</div>
          <h2 style="font-size: 2.2rem; color: #fff;">Our Streamlined Service Workflow</h2>
          <p style="color: var(--text-muted); font-size: 1.05rem;">We combine rapid response times with structured testing to deliver reliable plumbing repairs in ${cityName}.</p>
        </div>
        <div class="process-timeline" style="position: relative; max-width: 800px; margin: 0 auto;">
          <div class="process-step" style="position: relative; margin-bottom: 2.5rem; padding-left: 70px;">
            <div class="process-dot" style="position: absolute; left: 0; top: 0; width: 44px; height: 44px; border-radius: 50%; background: var(--gradient-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; box-shadow: var(--shadow-glow);">1</div>
            <div class="process-content" style="background: var(--bg-card); padding: 20px 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <h3 style="color: var(--text-white); font-size: 1.2rem; margin-bottom: 6px;">Immediate Dispatch</h3>
              <p style="color: var(--text-muted); font-size: 0.95rem; margin: 0; line-height: 1.6;">Call us anytime for immediate service; we match and dispatch a licensed plumber to your ${cityName} location 24/7, day or night.</p>
            </div>
          </div>
          <div class="process-step" style="position: relative; margin-bottom: 2.5rem; padding-left: 70px;">
            <div class="process-dot" style="position: absolute; left: 0; top: 0; width: 44px; height: 44px; border-radius: 50%; background: var(--gradient-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; box-shadow: var(--shadow-glow);">2</div>
            <div class="process-content" style="background: var(--bg-card); padding: 20px 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <h3 style="color: var(--text-white); font-size: 1.2rem; margin-bottom: 6px;">Rigorous Inspection</h3>
              <p style="color: var(--text-muted); font-size: 0.95rem; margin: 0; line-height: 1.6;">We use camera inspections and acoustic tests to precisely locate pipeline issues, even hidden underground ones, minimizing guesswork and damage.</p>
            </div>
          </div>
          <div class="process-step" style="position: relative; margin-bottom: 2.5rem; padding-left: 70px;">
            <div class="process-dot" style="position: absolute; left: 0; top: 0; width: 44px; height: 44px; border-radius: 50%; background: var(--gradient-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; box-shadow: var(--shadow-glow);">3</div>
            <div class="process-content" style="background: var(--bg-card); padding: 20px 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <h3 style="color: var(--text-white); font-size: 1.2rem; margin-bottom: 6px;">Flat-Rate Estimate</h3>
              <p style="color: var(--text-muted); font-size: 0.95rem; margin: 0; line-height: 1.6;">After diagnosing the issue on-site, we provide an itemized, upfront, flat-rate written quote detailing all necessary work and parts.</p>
            </div>
          </div>
          <div class="process-step" style="position: relative; margin-bottom: 2.5rem; padding-left: 70px;">
            <div class="process-dot" style="position: absolute; left: 0; top: 0; width: 44px; height: 44px; border-radius: 50%; background: var(--gradient-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; box-shadow: var(--shadow-glow);">4</div>
            <div class="process-content" style="background: var(--bg-card); padding: 20px 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <h3 style="color: var(--text-white); font-size: 1.2rem; margin-bottom: 6px;">Code-Compliant Repair</h3>
              <p style="color: var(--text-muted); font-size: 0.95rem; margin: 0; line-height: 1.6;">Our team performs code-compliant repair work using premium, durable materials, ensuring a lasting fix that meets all ${stateName} plumbing standards.</p>
            </div>
          </div>
          <div class="process-step" style="position: relative; padding-left: 70px;">
            <div class="process-dot" style="position: absolute; left: 0; top: 0; width: 44px; height: 44px; border-radius: 50%; background: var(--gradient-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; box-shadow: var(--shadow-glow);">5</div>
            <div class="process-content" style="background: var(--bg-card); padding: 20px 24px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <h3 style="color: var(--text-white); font-size: 1.2rem; margin-bottom: 6px;">Hydrostatic Verification</h3>
              <p style="color: var(--text-muted); font-size: 0.95rem; margin: 0; line-height: 1.6;">We conduct hydrostatic pressure audits and flow checks post-repair, confirming your plumbing system operates flawlessly without leaks.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. WHY CHOOSE US -->
    <section class="why-us-section" style="padding: 5rem 0; background: var(--bg-dark);">
      <div class="container">
        <div class="section-title text-center" style="text-align: center; max-width: 700px; margin: 0 auto 3.5rem;">
          <div class="section-label" style="display: inline-block; padding: 4px 14px; background: rgba(37,99,235,0.15); color: var(--primary-light); border-radius: 20px; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 10px;">Why Choose Us</div>
          <h2 style="font-size: 2.2rem; color: #fff;">Why Call Us in ${cityName}?</h2>
          <p style="color: var(--text-muted); font-size: 1.05rem;">We deliver high-quality plumbing services backed by code compliance, certified pros, and upfront pricing.</p>
        </div>
        <div class="why-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
          <div class="why-card" style="background: var(--bg-card); padding: 28px; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
            <div style="font-size: 1.6rem; color: var(--primary-light); margin-bottom: 12px;"><i class="fas fa-award"></i></div>
            <h3 style="color: var(--text-white); margin-bottom: 8px; font-size: 1.2rem;">1. Plumbing Experience</h3>
            <p style="font-size: 0.92rem; margin: 0; color: var(--text-muted); line-height: 1.6;">Our network technicians bring years of diagnostic troubleshooting experience covering everything from complex slab leaks to entire pipe system overhauls across ${cityName}.</p>
          </div>
          <div class="why-card" style="background: var(--bg-card); padding: 28px; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
            <div style="font-size: 1.6rem; color: var(--primary-light); margin-bottom: 12px;"><i class="fas fa-user-check"></i></div>
            <h3 style="color: var(--text-white); margin-bottom: 8px; font-size: 1.2rem;">2. Professional Crew</h3>
            <p style="font-size: 0.92rem; margin: 0; color: var(--text-muted); line-height: 1.6;">Every plumber in our matching network is fully verified, licensed, insured, and adheres to strict residential safety regulations in your home.</p>
          </div>
          <div class="why-card" style="background: var(--bg-card); padding: 28px; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
            <div style="font-size: 1.6rem; color: var(--primary-light); margin-bottom: 12px;"><i class="fas fa-toolbox"></i></div>
            <h3 style="color: var(--text-white); margin-bottom: 8px; font-size: 1.2rem;">3. Premium Materials</h3>
            <p style="font-size: 0.92rem; margin: 0; color: var(--text-muted); line-height: 1.6;">We use only premium copper, CPVC, and PEX-A materials, and pressure-test all connection seals for maximum integrity and leak prevention.</p>
          </div>
          <div class="why-card" style="background: var(--bg-card); padding: 28px; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
            <div style="font-size: 1.6rem; color: var(--primary-light); margin-bottom: 12px;"><i class="fas fa-stopwatch"></i></div>
            <h3 style="color: var(--text-white); margin-bottom: 8px; font-size: 1.2rem;">4. Under 45-Min Response</h3>
            <p style="font-size: 0.92rem; margin: 0; color: var(--text-muted); line-height: 1.6;">Expect fast dispatches, often under 45 minutes, getting our mobile team to your location along ${cityName}'s corridors quickly for urgent needs.</p>
          </div>
          <div class="why-card" style="background: var(--bg-card); padding: 28px; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
            <div style="font-size: 1.6rem; color: var(--primary-light); margin-bottom: 12px;"><i class="fas fa-hand-holding-dollar"></i></div>
            <h3 style="color: var(--text-white); margin-bottom: 8px; font-size: 1.2rem;">5. Clear Flat Rates</h3>
            <p style="font-size: 0.92rem; margin: 0; color: var(--text-muted); line-height: 1.6;">Our pricing is clear and upfront, with a written flat rate provided on-site for every service, so you know the full cost before work starts.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. COMPLETED PROJECTS (CASE STUDIES) -->
    <section class="projects-section" style="padding: 5rem 0; background: var(--bg-surface);">
      <div class="container">
        <div class="section-title text-center" style="text-align: center; max-width: 700px; margin: 0 auto 3.5rem;">
          <div class="section-label" style="display: inline-block; padding: 4px 14px; background: rgba(37,99,235,0.15); color: var(--primary-light); border-radius: 20px; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 10px;">Recent Work</div>
          <h2 style="font-size: 2.2rem; color: #fff;">Completed Plumbing Case Studies</h2>
          <p style="color: var(--text-muted); font-size: 1.05rem;">Explore recent water line installations and emergency repairs in ${cityName} and surrounding areas.</p>
        </div>
        <div class="projects-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 28px;">
          <!-- Case Study 1 -->
          <div class="project-card" style="background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-color); overflow: hidden; box-shadow: var(--shadow-sm); display: flex; flex-direction: column;">
            <div class="project-image-wrapper" style="height: 220px; overflow: hidden; position: relative;">
              <img src="/public/images/project1-after.webp" alt="Water heater replacement in ${cityName}" style="width: 100%; height: 100%; object-fit: cover;">
              <span style="position: absolute; top: 12px; left: 12px; background: rgba(10,22,40,0.85); color: var(--accent); padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">Completed</span>
            </div>
            <div class="project-content-block" style="padding: 24px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <h3 style="color: var(--text-white); font-size: 1.25rem; margin-bottom: 8px;">Water Heater Replacement</h3>
                <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 16px; line-height: 1.6;">Dismantled an aging, corroded water tank in ${cityName} and installed a high-efficiency tankless system, configuring expansion tanks and vent lines to code.</p>
              </div>
              <div style="border-top: 1px solid var(--border-color); padding-top: 12px;">
                <p style="font-size: 0.88rem; font-weight: 600; color: #4ade80; margin: 0;"><i class="fas fa-check-circle" style="margin-right: 6px;"></i> Outcome: Restored continuous hot water and reduced energy draw.</p>
              </div>
            </div>
          </div>

          <!-- Case Study 2 -->
          <div class="project-card" style="background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-color); overflow: hidden; box-shadow: var(--shadow-sm); display: flex; flex-direction: column;">
            <div class="project-image-wrapper" style="height: 220px; overflow: hidden; position: relative;">
              <img src="/public/images/project2-after.webp" alt="Slab leak detection in ${cityName}" style="width: 100%; height: 100%; object-fit: cover;">
              <span style="position: absolute; top: 12px; left: 12px; background: rgba(10,22,40,0.85); color: var(--accent); padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">Completed</span>
            </div>
            <div class="project-content-block" style="padding: 24px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <h3 style="color: var(--text-white); font-size: 1.25rem; margin-bottom: 8px;">Under-Slab Leak Repiping</h3>
                <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 16px; line-height: 1.6;">Used non-invasive acoustic sensors to pinpoint an underground leak beneath a concrete foundation in ${cityName}, performing a surgical PEX bypass without floor destruction.</p>
              </div>
              <div style="border-top: 1px solid var(--border-color); padding-top: 12px;">
                <p style="font-size: 0.88rem; font-weight: 600; color: #4ade80; margin: 0;"><i class="fas fa-check-circle" style="margin-right: 6px;"></i> Outcome: Repaired leak to operating pressure with zero structural moisture risk.</p>
              </div>
            </div>
          </div>

          <!-- Case Study 3 -->
          <div class="project-card" style="background: var(--bg-card); border-radius: var(--radius-md); border: 1px solid var(--border-color); overflow: hidden; box-shadow: var(--shadow-sm); display: flex; flex-direction: column;">
            <div class="project-image-wrapper" style="height: 220px; overflow: hidden; position: relative;">
              <img src="/public/images/project3-after.webp" alt="Drainage refit in ${cityName}" style="width: 100%; height: 100%; object-fit: cover;">
              <span style="position: absolute; top: 12px; left: 12px; background: rgba(10,22,40,0.85); color: var(--accent); padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">Completed</span>
            </div>
            <div class="project-content-block" style="padding: 24px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <h3 style="color: var(--text-white); font-size: 1.25rem; margin-bottom: 8px;">Main Sewer Line Refit</h3>
                <p style="font-size: 0.92rem; color: var(--text-muted); margin-bottom: 16px; line-height: 1.6;">Removed failing root-damaged sewer pipes in ${cityName}, cleared obstructions via high-pressure hydro-jetting, and installed heavy-duty PVC cleanouts.</p>
              </div>
              <div style="border-top: 1px solid var(--border-color); padding-top: 12px;">
                <p style="font-size: 0.88rem; font-weight: 600; color: #4ade80; margin: 0;"><i class="fas fa-check-circle" style="margin-right: 6px;"></i> Outcome: Restored 100% free flow drainage and passed municipal code inspection.</p>
              </div>
            </div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 3rem;">
          <a href="/projects" class="btn btn-secondary" style="background: var(--primary); color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 8px;">View More Case Studies <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    </section>

    <!-- 7. SERVICES GRID -->
    <section class="section" id="services" style="padding: 5rem 0; background: var(--bg-dark);">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 40px;">
          <div class="section-label" style="display: inline-block; padding: 4px 14px; background: rgba(37,99,235,0.15); color: var(--primary-light); border-radius: 20px; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 10px;">Capabilities</div>
          <h2 style="font-size: 2.2rem; font-weight: 800; color: #fff;">Our Plumbing Services in ${cityName} (${zip})</h2>
          <p style="color: var(--text-muted); font-size: 1.05rem; max-width: 700px; margin: 10px auto 0;">Our licensed team delivers comprehensive plumbing solutions for homes and businesses throughout ${cityName} (${zip}). Select your required service below for diagnostic protocols, upfront pricing, and fast dispatch.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
          ${servicesGridHtml}
        </div>
      </div>
    </section>

    <!-- 8. COVERAGE AREAS -->
    <section class="section" id="areas" style="padding: 5rem 0; background: var(--bg-surface);">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 40px;">
          <div class="section-label" style="display: inline-block; padding: 4px 14px; background: rgba(37,99,235,0.15); color: var(--primary-light); border-radius: 20px; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 10px;">Coverage Network</div>
          <h2 style="font-size: 2.2rem; font-weight: 800; color: #fff;">Plumbing Service Coverage Areas</h2>
          <p style="color: var(--text-muted); font-size: 1.05rem; max-width: 700px; margin: 10px auto 0;">Our technicians provide emergency repairs and scheduled plumbing services across ${stateName} and neighboring communities.</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px;">
          ${nearbyHtml}
        </div>
      </div>
    </section>

    <!-- 9. REVIEWS / TESTIMONIALS -->
    <section class="reviews-section" style="padding: 5rem 0; background: var(--bg-dark);">
      <div class="container">
        <div class="section-title text-center" style="text-align: center; max-width: 700px; margin: 0 auto 3.5rem;">
          <div class="section-label" style="display: inline-block; padding: 4px 14px; background: rgba(37,99,235,0.15); color: var(--primary-light); border-radius: 20px; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 10px;">Testimonials</div>
          <h2 style="font-size: 2.2rem; color: #fff;">Reviews From Local Property Owners</h2>
          <p style="color: var(--text-muted); font-size: 1.05rem;">See what clients in ${cityName} say about our professional plumbing diagnostics and upfront quotes.</p>
        </div>
        <div class="grid-3" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
          <div class="testimonial-card" style="background: var(--bg-card); padding: 28px; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="stars" style="color: var(--accent); margin-bottom: 1rem; font-size: 1.15rem;">★★★★★</div>
              <p style="font-size: 0.95rem; color: var(--text-light); font-style: italic; margin-bottom: 1.5rem; line-height: 1.65;">
                "A sudden burst pipe caused water to pool across our floor in ${cityName}. Home Plumbing USA arrived in under 40 minutes, shut off the main line, and replaced the split section without any mess. Truly exceptional service!"
              </p>
            </div>
            <div class="testimonial-author" style="display: flex; flex-direction: column; border-top: 1px solid var(--border-color); padding-top: 12px;">
              <h4 style="font-size: 1rem; color: var(--text-white); margin-bottom: 2px;">Robert H.</h4>
              <span style="font-size: 0.82rem; color: var(--primary-light); font-weight: 600;">Burst Pipe Repair | ${cityName}, ${stateCode}</span>
            </div>
          </div>
          
          <div class="testimonial-card" style="background: var(--bg-card); padding: 28px; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="stars" style="color: var(--accent); margin-bottom: 1rem; font-size: 1.15rem;">★★★★★</div>
              <p style="font-size: 0.95rem; color: var(--text-light); font-style: italic; margin-bottom: 1.5rem; line-height: 1.65;">
                "Upgrading to a tankless water heater in ${cityName} was seamless. The plumber walked us through our options, gave us an exact upfront price, and completed the installation cleanly. Our hot water is endless now!"
              </p>
            </div>
            <div class="testimonial-author" style="display: flex; flex-direction: column; border-top: 1px solid var(--border-color); padding-top: 12px;">
              <h4 style="font-size: 1rem; color: var(--text-white); margin-bottom: 2px;">Sarah M.</h4>
              <span style="font-size: 0.82rem; color: var(--primary-light); font-weight: 600;">Tankless Heater Upgrade | ${cityName}, ${stateCode}</span>
            </div>
          </div>

          <div class="testimonial-card" style="background: var(--bg-card); padding: 28px; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div class="stars" style="color: var(--accent); margin-bottom: 1rem; font-size: 1.15rem;">★★★★★</div>
              <p style="font-size: 0.95rem; color: var(--text-light); font-style: italic; margin-bottom: 1.5rem; line-height: 1.65;">
                "Our main sewer drain was backing up into the shower. The technician arrived with a camera inspection unit, showed us the root clog, and used high-pressure hydro-jetting to clear it completely. Outstanding!"
              </p>
            </div>
            <div class="testimonial-author" style="display: flex; flex-direction: column; border-top: 1px solid var(--border-color); padding-top: 12px;">
              <h4 style="font-size: 1rem; color: var(--text-white); margin-bottom: 2px;">David L.</h4>
              <span style="font-size: 0.82rem; color: var(--primary-light); font-weight: 600;">Sewer Line Hydro-Jetting | ${cityName}, ${stateCode}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 10. FAQS (ACCORDION) -->
    <section class="faq-section" style="padding: 5rem 0; background: var(--bg-surface);">
      <div class="container">
        <div class="section-title text-center" style="text-align: center; max-width: 700px; margin: 0 auto 3.5rem;">
          <div class="section-label" style="display: inline-block; padding: 4px 14px; background: rgba(37,99,235,0.15); color: var(--primary-light); border-radius: 20px; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 10px;">Got Questions?</div>
          <h2 style="font-size: 2.2rem; color: #fff;">Frequently Asked Questions</h2>
          <p style="color: var(--text-muted); font-size: 1.05rem;">Get answers to the most common questions about our plumbing services, safety codes, and dispatch times in ${cityName}.</p>
        </div>
        <div class="faq-container" style="max-width: 820px; margin: 0 auto; display: flex; flex-direction: column; gap: 14px;">
          ${faqsHtml}
        </div>
      </div>
    </section>

    <!-- 11. SERVICE AREA MAP -->
    <section class="map-section" style="padding: 5rem 0; background: var(--bg-dark);">
      <div class="container">
        <div class="section-title text-center" style="text-align: center; max-width: 700px; margin: 0 auto 2.5rem;">
          <div class="section-label" style="display: inline-block; padding: 4px 14px; background: rgba(37,99,235,0.15); color: var(--primary-light); border-radius: 20px; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 10px;">Local Coverage</div>
          <h2 style="font-size: 2.2rem; color: #fff;">Service Area Network</h2>
          <p style="color: var(--text-muted); font-size: 1.05rem;">We provide 24/7 emergency dispatch services across ${cityName} (${zip}) and surrounding areas.</p>
        </div>
        <div class="map-container" style="width: 100%; height: 420px; border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-md); border: 1px solid var(--border-color);">
          <iframe src="https://maps.google.com/maps?q=${encodeURIComponent(cityName + ', ' + stateCode + ' ' + zip)}&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </section>

    <!-- 12. FINAL CTA BANNER -->
    <section class="cta-section" style="padding: 5rem 0; background: var(--gradient-cta); color: #fff; text-align: center;">
      <div class="container" style="max-width: 760px; margin: 0 auto;">
        <h2 style="font-size: 2.4rem; color: #fff; margin-bottom: 1rem; font-weight: 800;">Request a No-Obligation Quote in ${cityName}</h2>
        <p style="font-size: 1.15rem; color: rgba(255,255,255,0.9); margin-bottom: 2rem; line-height: 1.6;">Contact our dispatch center now to receive an upfront, transparent flat-rate estimate. Experienced licensed technicians stationed across ${cityName} (${zip}) are ready for fast 24/7 dispatch.</p>
        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          <a href="tel:877-516-8705" class="btn btn-accent" style="background: var(--accent); color: #fff; font-size: 1.15rem; font-weight: 800; padding: 16px 36px; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
            <i class="fas fa-phone-alt"></i> Call Now: (877) 516-8705
          </a>
        </div>
      </div>
    </section>
  </main>

  <!-- FOOTER -->
  <footer class="footer" style="background: var(--bg-darker); border-top: 1px solid var(--border-color); padding: 70px 0 30px;">
    <div class="container">
      <div class="footer-grid" style="display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 50px;">
        <div class="footer-about">
          <a href="/" class="logo footer-logo" style="display: inline-block; margin-bottom: 18px;">
            <img src="/public/images/logo.svg" alt="Home Plumbing USA Logo" class="logo-img" width="247" height="52">
          </a>
          <h3 class="footer-title" style="font-size: 1.2rem; color: #fff; margin-bottom: 10px;">24/7 Plumbers in ${cityName}, ${stateCode}</h3>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 16px;">Connecting property owners across ${cityName} (${zip}) with vetted, licensed local plumbing contractors for 24/7 emergency repair and installations.</p>
          <div style="display: flex; align-items: center; gap: 10px; color: var(--accent); font-weight: 700;">
            <i class="fas fa-phone-alt"></i> (877) 516-8705
          </div>
        </div>
        <div class="footer-col">
          <div class="footer-title" style="font-size: 1.1rem; color: #fff; font-weight: 700; margin-bottom: 16px;">Quick Links</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <a href="/" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Home</a>
            <a href="${stateUrl}" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">${stateName} Plumbers</a>
            <a href="/about" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">About Us</a>
            <a href="/projects" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Projects</a>
            <a href="/contact" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Contact</a>
          </div>
        </div>
        <div class="footer-col">
          <div class="footer-title" style="font-size: 1.1rem; color: #fff; font-weight: 700; margin-bottom: 16px;">Emergency Services</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <a href="/${stateSlug}/${cityZipSlug}/emergency-plumbing/" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Emergency Plumbing</a>
            <a href="/${stateSlug}/${cityZipSlug}/burst-pipe-repair/" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Burst Pipe Repair</a>
            <a href="/${stateSlug}/${cityZipSlug}/water-heater-repair/" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Water Heater Repair</a>
            <a href="/${stateSlug}/${cityZipSlug}/drain-cleaning/" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Drain Cleaning</a>
            <a href="/${stateSlug}/${cityZipSlug}/leak-detection/" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Leak Detection</a>
          </div>
        </div>
        <div class="footer-col">
          <div class="footer-title" style="font-size: 1.1rem; color: #fff; font-weight: 700; margin-bottom: 16px;">24/7 Active Dispatch</div>
          <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.5; margin-bottom: 12px;"><strong>Emergency Dispatch:</strong> 24 Hours / 7 Days</p>
          <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.5; margin-bottom: 16px;"><strong>Office Hours:</strong> Mon - Sat: 8:00 AM - 6:00 PM</p>
          <a href="tel:877-516-8705" class="footer-call-btn" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px; background: var(--accent); color: #fff; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 0.95rem;">
            <i class="fas fa-phone-alt"></i> (877) 516-8705
          </a>
        </div>
      </div>
      <div class="footer-bottom" style="border-top: 1px solid var(--border-color); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; font-size: 0.85rem; color: var(--text-muted);">
        <p style="margin: 0;">&copy; 2026 Home Plumbing USA. All rights reserved. Nationwide Plumbing Referral Network.</p>
        <div class="footer-links" style="display: flex; gap: 16px;">
          <a href="/privacy-policy" style="color: var(--text-muted); text-decoration: none;">Privacy Policy</a>
          <a href="/terms-and-conditions" style="color: var(--text-muted); text-decoration: none;">Terms &amp; Conditions</a>
          <a href="/disclaimer" style="color: var(--text-muted); text-decoration: none;">Disclaimer</a>
        </div>
      </div>
    </div>
  </footer>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // FAQ Accordion Interactivity
      document.querySelectorAll('.faq-trigger').forEach(trigger => {
        trigger.addEventListener('click', function() {
          const item = this.closest('.faq-item');
          const isOpen = item.classList.contains('active');
          document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('active');
            const btn = i.querySelector('.faq-trigger');
            if (btn) btn.setAttribute('aria-expanded', 'false');
            const icon = i.querySelector('.faq-icon');
            if (icon) icon.textContent = '+';
          });
          if (!isOpen) {
            item.classList.add('active');
            this.setAttribute('aria-expanded', 'true');
            const icon = item.querySelector('.faq-icon');
            if (icon) icon.textContent = '−';
          }
        });
      });

      // Mobile Navigation Toggle
      const toggle = document.getElementById('mobileToggle');
      const nav = document.getElementById('mainNav');
      if (toggle && nav) {
        toggle.addEventListener('click', function() {
          const expanded = this.getAttribute('aria-expanded') === 'true';
          this.setAttribute('aria-expanded', !expanded);
          nav.classList.toggle('active');
        });
      }
    });
  </script>
</body>
</html>`;
}

function main() {
  console.log('=== Starting City/Zip Hub Rebuilding Pipeline ===');

  if (!fs.existsSync(seoPagesPath)) {
    console.error('database/seo-pages.json not found!');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const targetStateArg = args[0] ? args[0].toUpperCase() : 'FL';

  console.log(`Target State Filter: ${targetStateArg}`);
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
      ...loc,
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

    if (targetStateArg !== 'ALL' && stCode !== targetStateArg && stateCfg.slug.toUpperCase() !== targetStateArg) {
      continue;
    }

    console.log(`\nRebuilding ${stateCfg.name} (${stCode}): ${locList.length} city/zip hub pages...`);

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

      // Rebuilt Hub page with 16 sections
      const hubHtml = buildCityZipHub(stateCfg, loc, nearbyForLoc);
      fs.writeFileSync(path.join(cityZipDir, 'index.html'), hubHtml, 'utf8');
      statePagesCount++;

      if ((index + 1) % 150 === 0 || index + 1 === locList.length) {
        console.log(`  [${stateCfg.name}] Rebuilt ${index + 1}/${locList.length} hubs (${statePagesCount} pages)...`);
      }
    });

    console.log(`Finished ${stateCfg.name}: Total ${statePagesCount} static city/zip hubs rebuilt.`);
    grandTotal += statePagesCount;
  }

  console.log(`\n======================================================`);
  console.log(`Hub regeneration complete! Total static hubs rebuilt: ${grandTotal}`);
  console.log(`======================================================`);
}

if (require.main === module) {
  main();
}

module.exports = { buildCityZipHub };
