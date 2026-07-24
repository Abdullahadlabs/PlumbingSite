const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'database', 'seo-pages.json');
const serviceAreasOutputDir = path.join(__dirname, 'service-areas');

// Helper to capitalize words (e.g., "fort-lauderdale" -> "Fort Lauderdale")
function capitalize(str) {
  if (!str) return '';
  return str
    .split(/[- ]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

// Simple slugify for fallback links
function slugify(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-_]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function compilePage(loc) {
  const city = loc.city || 'Local Area';
  const stateCode = (loc.state || 'FL').toUpperCase();
  const zip = loc.zip || '';
  
  // Resolve State Name
  const stateMap = {
    'AK': 'Alaska',
    'TX': 'Texas',
    'FL': 'Florida'
  };
  const stateName = stateMap[stateCode] || stateCode;

  // 1. Title Tag & Meta Description Fallbacks
  const title = loc.title_tag || `Emergency Plumbers in ${city}, ${stateCode} ${zip} | Home Plumbing USA`;
  const metaDesc = loc.meta_description || `Need professional plumbing services in ${city}, ${stateCode}? Certified, insured, and available 24/7. Call us today at 877-516-8705 for a free quote!`;
  
  const rawH1 = loc.h1 || `Plumbing Services in ${city}, ${stateCode} (${zip})`;
  const h1Formatted = rawH1.replace(/(in\s+)(.+)/i, '$1<span class="highlight">$2</span>');
  const intro = `Connecting home and business owners in ${city}, ${stateCode} (${zip}) with vetted, independent local plumbing experts in real-time. Fast, reliable service matches 24/7.`;

  // 2. Service Spotlight & Grid Section (Conditional / Fallback)
  let serviceSpotlightHtml = '';
  if (loc.service_grid && Array.isArray(loc.service_grid) && loc.service_grid.length > 0) {
    const serviceIcons = {
      'emergency-plumbing': 'fa-bolt',
      'water-heater-repair': 'fa-temperature-high',
      'gas-line-repair': 'fa-fire',
      'sewer-line-repair': 'fa-screwdriver-wrench',
      'drain-cleaning': 'fa-broom',
      'leak-detection': 'fa-magnifying-glass',
      'burst-pipe-repair': 'fa-water',
      'water-line-repair': 'fa-faucet'
    };

    const gridCards = loc.service_grid.map(s => {
      const icon = serviceIcons[s.service_slug] || 'fa-wrench';
      const detailUrl = `/service-areas/${loc.folder_name}/${s.service_slug}/`;
      return `
        <div class="service-card animate-on-scroll">
          <div class="service-icon"><i class="fas ${icon}"></i></div>
          <p class="service-title">${s.service_name}</p>
          <p>${s.description}</p>
          <a href="${detailUrl}" class="service-card-link" style="color: var(--primary); font-size: 0.9rem; font-weight: 600; text-decoration: none; margin-top: 10px; display: inline-flex; align-items: center; gap: 4px;">Learn More <i class="fas fa-chevron-right" style="font-size: 0.75rem;"></i></a>
        </div>
      `;
    }).join('\n');

    serviceSpotlightHtml = `
      <div class="section-header animate-on-scroll">
        <div class="section-label">Expertise</div>
        <h2 class="section-title">Our Local Plumbing Capabilities</h2>
        <p class="section-desc">We match you with qualified, licensed technicians in ${city} for the following primary plumbing services:</p>
      </div>
      <div class="services-grid" style="margin-top: 30px;">
        ${gridCards}
      </div>
    `;
  } else if (loc.service_spotlight && loc.service_spotlight.trim() !== '') {
    serviceSpotlightHtml = `
      <div class="service-spotlight-box animate-on-scroll" style="background: var(--bg-card); border: 2px solid var(--primary); border-radius: var(--radius-md); padding: 32px; margin-bottom: 40px; position: relative; overflow: hidden;">
        <div style="position: absolute; top: 0; left: 0; background: var(--primary); color: #fff; padding: 4px 16px; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; border-bottom-right-radius: var(--radius-sm);">Local Spotlight</div>
        <h3 style="font-size: 1.5rem; font-weight: 800; color: var(--text-white); margin-top: 10px; margin-bottom: 12px;">Service Area Spotlight</h3>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin: 0;">${loc.service_spotlight}</p>
      </div>
    `;
  } else {
    // Fallback: Default High-Converting Spotlight Cards
    serviceSpotlightHtml = `
      <div class="section-header animate-on-scroll">
        <div class="section-label">Expertise</div>
        <h2 class="section-title">Our Local Plumbing Capabilities</h2>
        <p class="section-desc">We match you with qualified, licensed technicians in ${city} for the following primary plumbing services:</p>
      </div>
      <div class="services-grid" style="margin-top: 30px;">
        <div class="service-card animate-on-scroll">
          <div class="service-icon"><i class="fas fa-bolt"></i></div>
          <p class="service-title">24/7 Emergency Plumbing</p>
          <p>Get immediate local dispatch for burst pipes, active flooding, main water shut-off issues, or severe backups at any hour of the day or night.</p>
        </div>
        <div class="service-card animate-on-scroll">
          <div class="service-icon"><i class="fas fa-broom"></i></div>
          <p class="service-title">Drain Cleaning &amp; Hydro-Jetting</p>
          <p>Clear stubborn clogs, grease buildup, and root intrusion in your sewer lines using professional snake equipment and high-pressure jetting.</p>
        </div>
        <div class="service-card animate-on-scroll">
          <div class="service-icon"><i class="fas fa-temperature-high"></i></div>
          <p class="service-title">Water Heater Repair &amp; Install</p>
          <p>Professional diagnostic repairs and replacements for traditional gas/electric tank heaters and modern energy-efficient tankless systems.</p>
        </div>
        <div class="service-card animate-on-scroll">
          <div class="service-icon"><i class="fas fa-magnifying-glass"></i></div>
          <p class="service-title">Electronic Leak Detection</p>
          <p>Locate hidden pipe leaks, slab leaks, and gas line breaches using state-of-the-art acoustic and thermal imaging equipment without tearing up floors.</p>
        </div>
      </div>
    `;
  }


  // 3. FAQs Section (Crucial Fallback Logic)
  let faqsHtml = '';
  let faqsList = [];
  
  if (loc.faqs && Array.isArray(loc.faqs) && loc.faqs.length > 0) {
    faqsList = loc.faqs;
  } else {
    // Fallback: 4 dynamic FAQs
    faqsList = [
      {
        question: `Do you offer 24/7 emergency plumbing in ${city}, ${stateName}?`,
        answer: `Yes. We provide direct access to emergency dispatch coordinators 24 hours a day, 7 days a week, including weekends and holidays. Whether you have a burst pipe in the middle of the night or a clogged sewer line on Thanksgiving, a local plumber in ${city} is available to help.`
      },
      {
        question: `How quickly can a plumber arrive at my home in ${zip || city}?`,
        answer: `On average, a mobile plumber can reach your property in ${zip || city} within 45 minutes or less, depending on weather, local traffic conditions, and current call volumes. We always dispatch the closest available technician to ensure the fastest response.`
      },
      {
        question: `Are your plumbers licensed and insured in ${stateName}?`,
        answer: `Absolutely. Every plumbing provider in our network is carefully vetted to verify they hold active state-level licensing, liability insurance, and worker's compensation coverage to guarantee safety and compliance.`
      },
      {
        question: `How much does plumbing repair cost in ${city}?`,
        answer: `We charge a standard local trip fee to cover dispatch and on-site diagnosis. Once the plumber inspects the problem in person, they will present a clear, flat-rate written estimate. We do not do blind over-the-phone estimates to avoid unexpected price changes.`
      }
    ];
  }

  faqsHtml = faqsList.map((faq) => `
    <div class="faq-item animate-on-scroll">
      <div class="faq-question">
        <h3 class="faq-title">${faq.question}</h3>
        <i class="fas fa-chevron-down"></i>
      </div>
      <div class="faq-answer">
        <div class="faq-answer-inner">${faq.answer}</div>
      </div>
    </div>
  `).join('\n');

  // 4. Nearby Areas / Internal Linking (Conditional / Fallback)
  let nearbyAreasHtml = '';
  if (loc.nearby_areas && Array.isArray(loc.nearby_areas) && loc.nearby_areas.length > 0) {
    // Loop through nearby areas and format as action banners
    let gridCards = loc.nearby_areas.map(area => {
      const areaCity = area.city || capitalize(area.slug.split('-').slice(1, -1).join('-'));
      const areaZip = area.zip || area.slug.split('-').pop();
      const areaState = (area.state || stateCode).toUpperCase();
      
      // Determine dynamic service badge context
      const badges = [
        '24/7 Fast Dispatch',
        'Emergency Service Ready',
        'Local Plumber Stationed',
        'Safety Compliant Crew',
        'Diagnostics Active'
      ];
      // Deterministic index based on ZIP code
      const zipVal = parseInt(areaZip, 10);
      const badgeText = !isNaN(zipVal) ? badges[zipVal % badges.length] : 'Local Dispatch Ready';

      return `
        <div class="area-banner animate-on-scroll" style="display: flex; flex-direction: column; justify-content: space-between; padding: 20px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); transition: var(--transition); position: relative; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          <div style="font-size: 0.95rem; color: var(--text-white); font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
            <span style="color: var(--primary); font-size: 1.1rem;">&bull;</span>
            <span>${areaCity}, ${areaState}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
            ZIP Code <span style="color: var(--text-white); font-weight: 600; font-family: var(--font-outfit);">${areaZip}</span>
          </div>
          <div style="align-self: flex-start; background: rgba(37, 99, 235, 0.1); color: var(--primary); border: 1px solid rgba(37, 99, 235, 0.2); padding: 4px 10px; border-radius: 12px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">
            ${badgeText}
          </div>
          <a href="/service-areas/${area.slug}/" style="margin-top: auto; display: inline-flex; align-items: center; gap: 6px; color: var(--accent); font-size: 0.88rem; font-weight: 700; text-decoration: none; transition: var(--transition);">
            Schedule Service <i class="fas fa-arrow-right-long" style="font-size: 0.8rem;"></i>
          </a>
        </div>
      `;
    }).join('\n');

    nearbyAreasHtml = `
      <section class="service-area-section section" id="areas" style="background: var(--bg-surface);">
        <div class="container">
          <div class="section-header animate-on-scroll">
            <div class="section-label">Coverage</div>
            <h2 class="section-title">Serving ${city} &amp; Surrounding Areas</h2>
            <p class="section-desc">Our plumbing dispatch trucks cover the entire local neighborhood including the following nearby zip code areas:</p>
          </div>
          <div class="areas-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; margin-top: 30px;">
            ${gridCards}
          </div>
        </div>
      </section>
    `;
  } else {
    // Fallback: Localized Call-Out Banner
    nearbyAreasHtml = `
      <section class="service-area-section section" id="areas" style="background: var(--bg-surface); padding: 60px 0;">
        <div class="container" style="text-align: center;">
          <div class="animate-on-scroll" style="max-width: 700px; margin: 0 auto; padding: 30px; border-radius: var(--radius-md); background: var(--bg-card); border: 1px solid var(--border-color);">
            <i class="fas fa-truck-fast" style="font-size: 2.5rem; color: var(--primary); margin-bottom: 16px;"></i>
            <h3 style="font-size: 1.6rem; color: var(--text-white); margin-bottom: 8px;">Proudly Serving ${city} &amp; Surrounding Areas</h3>
            <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin: 0;">We provide 24/7 residential and commercial plumbing dispatch throughout ${city} and all nearby neighborhoods in ${stateName}. Our local mobile technicians are fully equipped to reach you fast.</p>
          </div>
        </div>
      </section>
    `;
  }

  // Canonical path (sanitize double slashes)
  const canonicalUrl = `https://homeplumbingusa.com/service-areas/${loc.folder_name}/`;

  const queryStr = `?city=${encodeURIComponent(city)}&state=${encodeURIComponent(stateCode)}&zip=${encodeURIComponent(zip)}`;

  // Full HTML Template
  return `<!DOCTYPE html>
<html lang="en">

<head>
  <script>
    (function() {
      // Canonicals are pre-rendered, but we keep GTM and base redirection logic
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', "${canonicalUrl}");
    })();
  </script>
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-NHGT9PF7');</script>
  <!-- End Google Tag Manager -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index, follow">
  <meta name="author" content="Home Plumbing USA">
  <meta name="publisher" content="Home Plumbing USA">
  <title>${title}</title>
  <meta name="description" content="${metaDesc}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" media="print" onload="this.media='all'">
  <noscript>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  </noscript>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="../../css/style.css">
  <style>
    .hero-section {
      position: relative;
      min-height: 60vh;
      display: flex;
      align-items: center;
      padding: 140px 0 80px;
      background: var(--gradient-hero);
      overflow: hidden;
    }
    .hero-title, .hero-content h1, .hero-section h1 {
      font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      font-size: 3.25rem !important;
      font-weight: 900 !important;
      line-height: 1.18 !important;
      color: #ffffff !important;
      margin-top: 12px !important;
      margin-bottom: 24px !important;
      letter-spacing: -0.025em !important;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }
    .hero-title span.highlight, .hero-content h1 span.highlight, .hero-section h1 span.highlight {
      background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #f59e0b 100%) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      background-clip: text !important;
      display: inline-block;
    }
    @media (max-width: 992px) {
      .hero-title, .hero-content h1, .hero-section h1 { font-size: 2.5rem !important; }
    }
    @media (max-width: 576px) {
      .hero-title, .hero-content h1, .hero-section h1 { font-size: 2rem !important; line-height: 1.25 !important; }
    }
    .hero-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background:
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        radial-gradient(ellipse at 20% 80%, rgba(37, 99, 235, 0.15) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 20%, rgba(245, 158, 11, 0.08) 0%, transparent 60%);
      background-size: 40px 40px, 40px 40px, auto, auto;
      pointer-events: none;
    }
    .hero-section .hero-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 48px;
      align-items: center;
      position: relative;
      z-index: 2;
    }
    @media (max-width: 992px) {
      .hero-section .hero-grid {
        grid-template-columns: 1fr;
      }
    }
    .trust-grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
    @media (max-width: 992px) {
      .trust-grid-4 {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 576px) {
      .trust-grid-4 {
        grid-template-columns: 1fr;
      }
    }
    .trust-card {
      transition: var(--transition);
    }
    .trust-card:hover {
      transform: translateY(-5px);
      border-color: rgba(37, 99, 235, 0.3) !important;
      background: rgba(30, 41, 59, 0.6) !important;
    }
    .case-card {
      transition: var(--transition);
    }
    .case-card:hover {
      transform: translateY(-5px);
      border-color: rgba(245, 158, 11, 0.3) !important;
      box-shadow: 0 10px 30px rgba(0,0,0,0.25) !important;
    }
    .area-banner {
      transition: var(--transition);
    }
    .area-banner:hover {
      transform: translateY(-3px);
      border-color: rgba(37, 99, 235, 0.3) !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25) !important;
    }
    .workflow-steps-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }
    @media (max-width: 992px) {
      .workflow-steps-4 {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 576px) {
      .workflow-steps-4 {
        grid-template-columns: 1fr;
      }
    }
    .final-cta-section {
      background: var(--gradient-primary);
      text-align: center;
      padding: 80px 0;
      position: relative;
      z-index: 2;
    }
    .final-cta-section h2 {
      font-size: 2.5rem;
      font-weight: 800;
      color: #fff;
      margin-bottom: 16px;
    }
    .final-cta-section p {
      color: rgba(255, 255, 255, 0.9);
      max-width: 600px;
      margin: 0 auto 32px;
    }
    .final-cta-section .cta-buttons {
      display: flex;
      justify-content: center;
      gap: 16px;
    }
    @media (max-width: 576px) {
      .final-cta-section .cta-buttons {
        flex-direction: column;
        align-items: center;
      }
      .final-cta-section .cta-buttons a {
        width: 100%;
        max-width: 300px;
      }
    }
    .btn-quote, .btn-call {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 14px 28px;
      border-radius: var(--radius-sm);
      font-weight: 600;
      font-size: 1rem;
      transition: var(--transition);
      text-decoration: none;
    }
    .btn-quote {
      background: #fff;
      color: var(--primary);
    }
    .btn-quote:hover {
      background: rgba(255, 255, 255, 0.9);
      transform: translateY(-2px);
    }
    .btn-call {
      background: var(--accent);
      color: var(--text-white);
    }
    .btn-call:hover {
      background: var(--accent-hover);
      transform: translateY(-2px);
    }
    .mobile-sticky-bar {
      display: none !important;
    }
    @media screen and (max-width: 1024px) {
      .mobile-sticky-bar {
        display: flex !important;
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 60px !important;
        z-index: 999999 !important;
      }
    }
  </style>
  <link rel="icon" type="image/png" href="/images/favicon.png">
</head>

<body data-prefix="/" data-depth="0">
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NHGT9PF7"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->

  <!-- Header -->
  <header class="header site-header" id="header">
    <div class="top-bar">
      <div class="top-bar-content">
        <span class="pulse-dot"></span>
        <span>24/7 Emergency Plumbers Nationwide - Same Price, Holidays Included!</span>
      </div>
    </div>
    <div class="header-inner">
      <a href="/" class="logo">
        <img src="/images/logo.svg" alt="Home Plumbing USA Logo" class="logo-img" width="247" height="52">
      </a>
      <nav class="nav" id="mainNav">
        <a href="/" class="nav-link" id="homeMenuLink">Home</a>
        <div class="nav-item">
          <a href="javascript:void(0)" class="nav-link dropdown-toggle">Services <i class="fas fa-chevron-down"></i></a>
          <div class="mega-dropdown">
            <div class="dropdown-category">
              <div class="dropdown-category-title">Emergency &amp; Repair</div>
              <a href="/services/24-hour-emergency-plumbing${queryStr}" class="dropdown-link"><i class="fas fa-bolt"></i> 24 Hour Emergency Plumbing</a>
              <a href="/services/same-day-plumbing-repair${queryStr}" class="dropdown-link"><i class="fas fa-clock"></i> Same Day Plumbing Repair</a>
              <a href="/services/burst-pipe-repair${queryStr}" class="dropdown-link"><i class="fas fa-pipe-section"></i> Burst Pipe Repair</a>
              <a href="/services/whole-house-repiping${queryStr}" class="dropdown-link"><i class="fas fa-house-chimney"></i> Whole House Repiping</a>
              <a href="/services/plumbing-maintenance${queryStr}" class="dropdown-link"><i class="fas fa-clipboard-check"></i> Plumbing Maintenance</a>
              <a href="/services/commercial-plumbing${queryStr}" class="dropdown-link"><i class="fas fa-building"></i> Commercial Plumbing</a>
            </div>
            <div class="dropdown-category">
              <div class="dropdown-category-title">Water Heater &amp; Drains</div>
              <a href="/services/water-heater-repair${queryStr}" class="dropdown-link"><i class="fas fa-temperature-high"></i> Water Heater Repair</a>
              <a href="/services/water-heater-installation${queryStr}" class="dropdown-link"><i class="fas fa-fire"></i> Water Heater Installation</a>
              <a href="/services/tankless-water-heater-installation${queryStr}" class="dropdown-link"><i class="fas fa-fire-flame-simple"></i> Tankless Water Heater</a>
              <a href="/services/drain-cleaning${queryStr}" class="dropdown-link"><i class="fas fa-broom"></i> Drain Cleaning</a>
              <a href="/services/clogged-drain-repair${queryStr}" class="dropdown-link"><i class="fas fa-plug-circle-xmark"></i> Clogged Drain Repair</a>
              <a href="/services/hydro-jetting${queryStr}" class="dropdown-link"><i class="fas fa-water"></i> Hydro Jetting</a>
              <a href="/services/sewer-line-repair${queryStr}" class="dropdown-link"><i class="fas fa-screwdriver-wrench"></i> Sewer Line Repair</a>
              <a href="/services/sewer-line-replacement${queryStr}" class="dropdown-link"><i class="fas fa-arrows-rotate"></i> Sewer Line Replacement</a>
            </div>
            <div class="dropdown-category">
              <div class="dropdown-category-title">Leak &amp; Pipe Services</div>
              <a href="/services/leak-detection${queryStr}" class="dropdown-link"><i class="fas fa-magnifying-glass"></i> Leak Detection</a>
              <a href="/services/slab-leak-repair${queryStr}" class="dropdown-link"><i class="fas fa-layer-group"></i> Slab Leak Repair</a>
              <a href="/services/pipe-leak-repair${queryStr}" class="dropdown-link"><i class="fas fa-droplet"></i> Pipe Leak Repair</a>
              <a href="/services/gas-line-installation${queryStr}" class="dropdown-link"><i class="fas fa-fire-burner"></i> Gas Line Installation</a>
              <a href="/services/gas-leak-detection${queryStr}" class="dropdown-link"><i class="fas fa-triangle-exclamation"></i> Gas Leak Detection</a>
              <a href="/services/gas-line-repair${queryStr}" class="dropdown-link"><i class="fas fa-wrench"></i> Gas Line Repair</a>
              <a href="/services/water-line-repair${queryStr}" class="dropdown-link"><i class="fas fa-faucet-drip"></i> Water Line Repair</a>
              <a href="/services/water-line-installation${queryStr}" class="dropdown-link"><i class="fas fa-faucet"></i> Water Line Installation</a>
            </div>
            <div class="dropdown-category">
              <div class="dropdown-category-title">Fixtures &amp; Specialty</div>
              <a href="/services/toilet-repair&amp; Installation${queryStr}" class="dropdown-link"><i class="fas fa-toilet"></i> Toilet Repair &amp; Installation</a>
              <a href="/services/faucet&amp; Sink Repair${queryStr}" class="dropdown-link"><i class="fas fa-sink"></i> Faucet &amp; Sink Repair</a>
              <a href="/services/garbage-disposal-repair${queryStr}" class="dropdown-link"><i class="fas fa-recycle"></i> Garbage Disposal Repair</a>
              <a href="/services/kitchen-plumbing${queryStr}" class="dropdown-link"><i class="fas fa-kitchen-set"></i> Kitchen Plumbing</a>
              <a href="/services/bathroom-plumbing${queryStr}" class="dropdown-link"><i class="fas fa-bath"></i> Bathroom Plumbing</a>
              <a href="/services/backflow-testing${queryStr}" class="dropdown-link"><i class="fas fa-arrows-left-right"></i> Backflow Testing</a>
              <a href="/services/sump-pump-install&amp; Repair${queryStr}" class="dropdown-link"><i class="fas fa-pump-soap"></i> Sump Pump Install &amp; Repair</a>
              <a href="/services/water-pressure-repair${queryStr}" class="dropdown-link"><i class="fas fa-gauge-high"></i> Water Pressure Repair</a>
            </div>
          </div>
        </div>
        <a href="#areas" class="nav-link">Coverage</a>
        <a href="/contact" class="nav-link">Contact</a>
      </nav>

      <div class="header-cta">
        <a href="tel:877-516-8705" class="header-phone"><i class="fas fa-phone"></i> 877-516-8705</a>
        <a href="/contact" class="btn btn-primary btn-sm">Get a Quote</a>
      </div>

      <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <main>
    <!-- Hero Section -->
    <section class="hero-section" id="hero">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-content">
            <div class="hero-badge"><i class="fas fa-star"></i> Serving Local Neighborhoods</div>
            <h1 class="hero-title">${h1Formatted}</h1>
            <p class="hero-text">${intro}</p>
            <div class="hero-buttons" style="margin-top: 30px; display: flex; gap: 16px;">
              <a href="tel:877-516-8705" class="btn btn-accent btn-lg" style="text-decoration: none;"><i class="fas fa-phone"></i> Call Now (24/7 Emergency)</a>
              <a href="/contact" class="btn btn-outline btn-lg" style="text-decoration: none; color: #fff; border-color: rgba(255,255,255,0.4);"><i class="fas fa-paper-plane"></i> Request Online Quote</a>
            </div>
          </div>
          <div class="hero-image-wrapper" style="position: relative;">
            <div class="hero-image-container" style="position: relative; border-radius: var(--radius-md); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
              <img src="/images/hero-plumbing.webp" srcset="/images/hero-plumbing-mobile.webp 480w, /images/hero-plumbing.webp 1200w" sizes="(max-width: 600px) 480px, 1200px" alt="Local Plumbing Services in ${city}" class="hero-image" width="600" height="750" fetchpriority="high" style="width: 100%; height: auto; display: block; filter: brightness(0.95);">
              <div class="hero-overlay-badge" style="position: absolute; bottom: 20px; left: 20px; right: 20px; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-sm); padding: 16px; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
                <div style="background: var(--primary); color: #fff; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;"><i class="fas fa-user-check"></i></div>
                <div>
                  <div style="color: #fff; font-weight: 700; font-size: 0.95rem;">Licensed Mechanic On-Duty</div>
                  <div style="color: var(--text-muted); font-size: 0.78rem; font-weight: 500;">Direct Radio Dispatch Active</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Section -->
    <section class="trust-section" id="trust" style="position: relative; z-index: 10;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Card 1: Certified Plumbers -->
          <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-xl hover:border-blue-500/50 transition-all duration-300">
            <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 text-xl">
              <i class="fas fa-user-shield"></i>
            </div>
            <div>
              <h3 class="text-white font-semibold text-base leading-snug">Certified Plumbers</h3>
              <p class="text-slate-400 text-sm mt-1 leading-relaxed">Vetted technicians who know ${stateName} building codes.</p>
            </div>
          </div>

          <!-- Card 2: 24/7 Rapid Response -->
          <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-xl hover:border-blue-500/50 transition-all duration-300">
            <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 text-xl">
              <i class="fas fa-truck-fast"></i>
            </div>
            <div>
              <h3 class="text-white font-semibold text-base leading-snug">24/7 Rapid Response</h3>
              <p class="text-slate-400 text-sm mt-1 leading-relaxed">Average arrival under 45 minutes for urgent repairs.</p>
            </div>
          </div>

          <!-- Card 3: Upfront Estimates -->
          <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-xl hover:border-blue-500/50 transition-all duration-300">
            <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 text-xl">
              <i class="fas fa-file-invoice-dollar"></i>
            </div>
            <div>
              <h3 class="text-white font-semibold text-base leading-snug">Upfront Estimates</h3>
              <p class="text-slate-400 text-sm mt-1 leading-relaxed">Flat-rate quotes presented on-site, no surprises.</p>
            </div>
          </div>

          <!-- Card 4: Guaranteed Craftsmanship -->
          <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-xl hover:border-blue-500/50 transition-all duration-300">
            <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 text-xl">
              <i class="fas fa-award"></i>
            </div>
            <div>
              <h3 class="text-white font-semibold text-base leading-snug">Guaranteed Craftsmanship</h3>
              <p class="text-slate-400 text-sm mt-1 leading-relaxed">Every repair backed by parts and labor warranties.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Service Spotlight Section -->
    <section class="service-overview section" id="overview">
      <div class="container">
        ${serviceSpotlightHtml}
      </div>
    </section>

    <!-- Completed Plumbing Projects / Case Studies Section -->
    <section class="case-studies-section section" id="case-studies" style="background: var(--bg-card); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding: 80px 0;">
      <div class="container">
        <div class="section-header animate-on-scroll" style="text-align: center; margin-bottom: 50px;">
          <div class="section-label" style="color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Proven Track Record</div>
          <h2 class="section-title" style="font-size: 2.2rem; font-weight: 800; color: var(--text-white);">Completed Plumbing Case Studies in ${city}, ${stateCode}</h2>
          <p class="section-desc" style="color: var(--text-muted); max-width: 600px; margin: 10px auto 0;">Real resolutions completed by our expert mechanics in the local area.</p>
        </div>
        <div class="case-studies-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
          <!-- Card 1 -->
          <div class="case-card animate-on-scroll" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 30px; transition: var(--transition); display: flex; flex-direction: column; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
            <div style="background: rgba(37, 99, 235, 0.1); color: var(--primary); border: 1px solid rgba(37, 99, 235, 0.2); padding: 4px 12px; border-radius: 12px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; align-self: flex-start; margin-bottom: 16px;">PHCC Standards Compliance</div>
            <h3 style="color: var(--text-white); font-size: 1.25rem; font-weight: 800; margin-bottom: 12px;">Water Heater Replacement</h3>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 20px; flex-grow: 1;">Completed a full installation of an energy-efficient hot water system. The installation was certified under PHCC standard metrics for safety and performance, resulting in a 98% efficiency index.</p>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: auto;">
              <span style="font-size: 0.82rem; color: var(--text-muted);"><i class="fas fa-calendar-alt"></i> Completed Recently</span>
              <span style="font-size: 0.82rem; font-weight: 700; color: var(--accent); text-transform: uppercase;">Verified Resolution</span>
            </div>
          </div>
          <!-- Card 2 -->
          <div class="case-card animate-on-scroll" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 30px; transition: var(--transition); display: flex; flex-direction: column; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
            <div style="background: rgba(245, 158, 11, 0.1); color: var(--accent); border: 1px solid rgba(245, 158, 11, 0.2); padding: 4px 12px; border-radius: 12px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; align-self: flex-start; margin-bottom: 16px;">Acoustic Leak Detection</div>
            <h3 style="color: var(--text-white); font-size: 1.25rem; font-weight: 800; margin-bottom: 12px;">Under-Slab Leak Repiping</h3>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 20px; flex-grow: 1;">Located a high-pressure pipe breach underneath the concrete foundation using acoustic sensor localization. Replaced the damaged section with zero structural damage to floors.</p>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: auto;">
              <span style="font-size: 0.82rem; color: var(--text-muted);"><i class="fas fa-calendar-alt"></i> Completed Recently</span>
              <span style="font-size: 0.82rem; font-weight: 700; color: var(--accent); text-transform: uppercase;">Verified Resolution</span>
            </div>
          </div>
          <!-- Card 3 -->
          <div class="case-card animate-on-scroll" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 30px; transition: var(--transition); display: flex; flex-direction: column; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
            <div style="background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); padding: 4px 12px; border-radius: 12px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; align-self: flex-start; margin-bottom: 16px;">Uniform Plumbing Code (UPC)</div>
            <h3 style="color: var(--text-white); font-size: 1.25rem; font-weight: 800; margin-bottom: 12px;">Restroom Drainage Refit</h3>
            <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 20px; flex-grow: 1;">Reconstructed drainage pipe routing for local commercial restrooms. Verified slope, venting, and trap seals to guarantee compliance with Uniform Plumbing Code (UPC) regulations.</p>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: auto;">
              <span style="font-size: 0.82rem; color: var(--text-muted);"><i class="fas fa-calendar-alt"></i> Completed Recently</span>
              <span style="font-size: 0.82rem; font-weight: 700; color: var(--accent); text-transform: uppercase;">Verified Resolution</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Workflow Section -->
    <section class="workflow-section section" id="workflow" style="background: var(--bg-surface);">
      <div class="container">
        <div class="section-header animate-on-scroll">
          <div class="section-label">How We Work</div>
          <h2 class="section-title">Our Service <span>Workflow</span></h2>
          <p class="section-desc">We dispatch technicians directly to your address in ${city}. Here is our direct local workflow.</p>
        </div>
        <div class="workflow-steps-4">
          <div class="process-card animate-on-scroll">
            <div class="process-number">01</div>
            <p class="process-title">Call Dispatch</p>
            <p>Call us at 877-516-8705. Speak with a coordinator to describe your plumbing problem.</p>
          </div>
          <div class="process-card animate-on-scroll">
            <div class="process-number">02</div>
            <p class="process-title">Technician Dispatched</p>
            <p>We locate the nearest certified mobile plumber in ${city} and assign them to your call.</p>
          </div>
          <div class="process-card animate-on-scroll">
            <div class="process-number">03</div>
            <p class="process-title">On-Site Estimate</p>
            <p>The plumber arrives at your property, inspects the issue, and presents an upfront written estimate.</p>
          </div>
          <div class="process-card animate-on-scroll">
            <div class="process-number">04</div>
            <p class="process-title">Job Completed</p>
            <p>With your approval, the technician performs the repairs immediately using parts from their stocked truck.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="why-us-section section" id="why-us">
      <div class="container">
        <div class="section-header animate-on-scroll">
          <div class="section-label">Why Choose Us</div>
          <h2 class="section-title">Why Call Us in ${city}?</h2>
          <p class="section-desc">We provide direct access to verified plumbers with transparent pricing and fast turnaround times.</p>
        </div>
        <div class="why-grid">
          <div class="why-card animate-on-scroll">
            <div class="why-icon"><i class="fas fa-clock"></i></div>
            <div>
              <p class="why-title">Fast Local Dispatch</p>
              <p>Because our dispatch network is active throughout ${city}, we match you with a nearby tech who can arrive in 45 minutes on average.</p>
            </div>
          </div>
          <div class="why-card animate-on-scroll">
            <div class="why-icon"><i class="fas fa-hand-holding-dollar"></i></div>
            <div>
              <p class="why-title">Upfront Diagnostic Pricing</p>
              <p>No estimates over the phone that change on arrival. The plumber inspects the work on-site and provides a clear, binding diagnostic quote before starting.</p>
            </div>
          </div>
          <div class="why-card animate-on-scroll">
            <div class="why-icon"><i class="fas fa-user-check"></i></div>
            <div>
              <p class="why-title">Vetted Technicians</p>
              <p>All plumbing companies in our matching service are checked for active state licensing, general liability insurance, and background verification.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Nearby Areas Section -->
    ${nearbyAreasHtml}

    <!-- FAQ Section -->
    <section class="faq-section section" id="faq">
      <div class="container">
        <div class="section-header animate-on-scroll">
          <div class="section-label">FAQ</div>
          <h2 class="section-title">Frequently Asked Questions</h2>
          <p class="section-desc">Answers to common plumbing questions from local homeowners in ${city}.</p>
        </div>
        <div class="faq-container" style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px;">
          ${faqsHtml}
        </div>
      </div>
    </section>

    <!-- Final CTA Banner -->
    <section class="final-cta-section">
      <div class="container">
        <h2>Need Professional Plumbing Services?</h2>
        <p>Get connected with vetted, licensed local plumbers in ${city} immediately. Safe repairs, flat upfront estimates, 24/7 emergency dispatch.</p>
        <div class="cta-buttons">
          <a href="/contact" class="btn-quote">Request a Quote</a>
          <a href="tel:877-516-8705" class="btn-call">Call Now: 877-516-8705</a>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="footer site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-about">
          <a href="/" class="logo footer-logo">
            <img src="/images/logo.svg" alt="Home Plumbing USA Logo" class="logo-img" width="247" height="52" loading="lazy">
          </a>
          <p>Disclaimer: Home Plumbing USA is a referral service that connects homeowners with independent local plumbing contractors. All contractors are independent, licensed, and insured local businesses. Home Plumbing USA does not directly perform plumbing services, and it is the responsibility of the homeowner to verify licensing and insurance for any contractor hired.</p>
        </div>
        <div class="footer-col">
          <div class="footer-title">Quick Links</div>
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="#overview">Capabilities</a>
          <a href="#why-us">Why Choose Us</a>
        </div>
        <div class="footer-col">
          <div class="footer-title">Local Info</div>
          <a href="#"><i class="fas fa-map-marker-alt"></i> ${city}, ${stateCode} ${zip}</a>
          <a href="tel:877-516-8705"><i class="fas fa-phone"></i> 877-516-8705</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Home Plumbing USA. All rights reserved. Licensed &amp; Insured | Nationwide USA</p>
        <!-- Footer Links -->
        <div class="footer-links flex justify-center space-x-4 mt-2 text-xs">
          <a href="/privacy-policy" class="hover:text-white transition-colors" style="color: rgba(255,255,255,0.6); text-decoration: none;">Privacy Policy</a>
          <span style="color: rgba(255,255,255,0.2);">&middot;</span>
          <a href="/terms-and-conditions" class="hover:text-white transition-colors" style="color: rgba(255,255,255,0.6); text-decoration: none;">Terms &amp; Conditions</a>
          <span style="color: rgba(255,255,255,0.2);">&middot;</span>
          <a href="/disclaimer" class="hover:text-white transition-colors" style="color: rgba(255,255,255,0.6); text-decoration: none;">Disclaimer</a>
        </div>
        <!-- Visible One-Liner Disclaimer Text -->
        <p style="color: #9ca3af; font-size: 12px; margin-top: 8px; text-align: center;">
          <strong>Disclaimer:</strong> Home Plumbing USA is a free referral service matching homeowners with independent local contractors. We do not directly provide plumbing services. <a href="/disclaimer" style="color: #3b82f6;">Read Full Disclaimer</a>
        </p>
      </div>
    </div>
  </footer>

  <script src="../../js/main.js" defer></script>
  <div class="mobile-sticky-bar">
    <a href="tel:877-516-8705" class="sticky-btn call-btn">
      <i class="fas fa-phone-alt"></i> Call Now
    </a>
    <a href="/contact" class="sticky-btn quote-btn">
      <i class="fas fa-paper-plane"></i> Get a Quote
    </a>
  </div>
</body>

</html>`;
}

function compileServicePage(sub) {
  const city = sub.city || 'Local Area';
  const stateCode = (sub.state || 'FL').toUpperCase();
  const zip = sub.zip || '';
  
  const stateMap = {
    'AK': 'Alaska',
    'TX': 'Texas',
    'FL': 'Florida'
  };
  const stateName = stateMap[stateCode] || stateCode;

  const title = sub.title_tag || `${sub.service_name} in ${city}, ${stateCode} ${zip} | Home Plumbing USA`;
  const metaDesc = sub.meta_description || `Home Plumbing USA provides ${sub.service_name.toLowerCase()} in ${city}, ${stateCode} ${zip}. Licensed, insured, and available for same-day service. Call 877-516-8705.`;
  
  const rawH1 = sub.h1 || `${sub.service_name} in ${city}, ${stateCode} (${zip})`;
  const h1Formatted = rawH1.replace(/(in\s+)(.+)/i, '$1<span class="highlight">$2</span>');
  
  // Format workflow steps
  let workflowHtml = '';
  if (sub.workflow_steps && Array.isArray(sub.workflow_steps)) {
    workflowHtml = sub.workflow_steps.map((step, index) => `
      <div class="process-card animate-on-scroll">
        <div class="process-number">0${index + 1}</div>
        <h3 class="process-title">${step.title}</h3>
        <p>${step.description}</p>
      </div>
    `).join('\n');
  }

  // Format FAQs
  let faqsHtml = '';
  faqsHtml = sub.faqs.map(faq => `
      <div class="faq-item animate-on-scroll">
        <div class="faq-question">
          <h3 class="faq-title">${faq.question}</h3>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="faq-answer">
          <div class="faq-answer-inner">${faq.answer}</div>
        </div>
      </div>
    `).join('\n');

  // Format other services
  let otherServicesHtml = '';
  if (sub.other_services && Array.isArray(sub.other_services)) {
    otherServicesHtml = sub.other_services.map(s => `
      <a href="${s.url}" class="list-link">${s.service_name} <i class="fas fa-chevron-right"></i></a>
    `).join('\n');
  }

  // Format nearby areas as visual action banners
  let nearbyAreasHtml = '';
  if (sub.nearby_areas && Array.isArray(sub.nearby_areas)) {
    nearbyAreasHtml = sub.nearby_areas.map(n => {
      const cleanCity = n.city || capitalize(n.slug.split('-').slice(1, -1).join('-'));
      const nState = (n.state || stateCode).toUpperCase();
      return `
        <a href="${n.url}" class="list-link" style="display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-card); margin-bottom: 10px; text-decoration: none; transition: var(--transition);">
          <div style="display: flex; width: 100%; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; color: var(--text-white); font-size: 0.9rem;">&bull; ${cleanCity}, ${nState}</span>
            <i class="fas fa-chevron-right" style="font-size: 0.75rem; color: var(--accent);"></i>
          </div>
          <div style="display: flex; width: 100%; justify-content: space-between; align-items: center; margin-top: 4px; width: 100%;">
            <span style="font-size: 0.78rem; color: var(--text-muted);">ZIP Code ${n.zip}</span>
            <span style="font-size: 0.72rem; font-weight: 700; color: var(--primary); text-transform: uppercase;">Schedule Service &rarr;</span>
          </div>
        </a>
      `;
    }).join('\n');
  }

  const parentUrl = `/service-areas/${sub.zip_folder_name}/`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${metaDesc}">
  <link rel="canonical" href="https://homeplumbingusa.com/service-areas/${sub.folder_name}/">
  <link rel="stylesheet" href="../../../css/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .detail-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 50px; margin-top: 40px; }
    .detail-main { background: var(--gradient-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 40px; }
    .detail-main h2 { font-size: 1.5rem; color: var(--text-white); margin-top: 28px; margin-bottom: 14px; }
    .detail-main h2:first-of-type { margin-top: 0; }
    .detail-main p { font-size: 1rem; color: var(--text-muted); line-height: 1.8; }
    .workflow-list { display: flex; flex-direction: column; gap: 18px; margin-top: 10px; }
    .workflow-step { display: flex; gap: 16px; align-items: flex-start; }
    .workflow-step .step-num { flex-shrink: 0; width: 32px; height: 32px; border-radius: 50%; background: var(--gradient-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; }
    .workflow-step h4 { color: var(--text-white); font-size: 1rem; margin-bottom: 4px; }
    .workflow-step p { font-size: 0.92rem; margin: 0; }
    .detail-sidebar { display: flex; flex-direction: column; gap: 24px; }
    .sidebar-widget { background: var(--gradient-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 26px; }
    .sidebar-widget h3 { font-size: 1.1rem; color: var(--text-white); margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; }
    .sidebar-widget a.list-link { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-bottom: 8px; font-size: 0.88rem; color: var(--text-muted); transition: var(--transition); text-decoration: none; }
    .sidebar-widget a.list-link:hover { background: var(--primary); color: #fff; border-color: var(--primary); }
    .cta-widget { background: var(--gradient-primary); border: none; text-align: center; }
    .cta-widget h3 { border: none; color: #fff; }
    .cta-widget p { font-size: 0.9rem; color: rgba(255,255,255,0.85); margin-bottom: 20px; }
    
    /* Overhaul Styles */
    .hero-sub {
      position: relative;
      background: var(--gradient-hero);
      padding: 140px 0 80px;
      overflow: hidden;
    }
    .hero-title, .hero-content h1, .hero-sub h1 {
      font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      font-size: 3.25rem !important;
      font-weight: 900 !important;
      line-height: 1.18 !important;
      color: #ffffff !important;
      margin-top: 12px !important;
      margin-bottom: 24px !important;
      letter-spacing: -0.025em !important;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }
    .hero-title span.highlight, .hero-content h1 span.highlight, .hero-sub h1 span.highlight {
      background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #f59e0b 100%) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      background-clip: text !important;
      display: inline-block;
    }
    @media (max-width: 992px) {
      .hero-title, .hero-content h1, .hero-sub h1 { font-size: 2.5rem !important; }
    }
    @media (max-width: 576px) {
      .hero-title, .hero-content h1, .hero-sub h1 { font-size: 2rem !important; line-height: 1.25 !important; }
    }
    .hero-sub::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background:
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        radial-gradient(ellipse at 20% 80%, rgba(37, 99, 235, 0.15) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 20%, rgba(245, 158, 11, 0.08) 0%, transparent 60%);
      background-size: 40px 40px, 40px 40px, auto, auto;
      pointer-events: none;
    }
    .hero-sub .hero-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 48px;
      align-items: center;
      position: relative;
      z-index: 2;
    }
    @media (max-width: 992px) {
      .hero-sub .hero-grid {
        grid-template-columns: 1fr;
      }
    }
    .trust-grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
    @media (max-width: 992px) {
      .trust-grid-4 {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 576px) {
      .trust-grid-4 {
        grid-template-columns: 1fr;
      }
    }
    .trust-card {
      transition: var(--transition);
    }
    .trust-card:hover {
      transform: translateY(-5px);
      border-color: rgba(37, 99, 235, 0.3) !important;
      background: rgba(30, 41, 59, 0.6) !important;
    }
    .case-card {
      transition: var(--transition);
    }
    .case-card:hover {
      transform: translateY(-5px);
      border-color: rgba(245, 158, 11, 0.3) !important;
      box-shadow: 0 10px 30px rgba(0,0,0,0.25) !important;
    }
    .area-banner {
      transition: var(--transition);
    }
    .area-banner:hover {
      transform: translateY(-3px);
      border-color: rgba(37, 99, 235, 0.3) !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25) !important;
    }
  </style>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "${sub.service_name}",
    "provider": {"@type": "Plumber", "name": "Home Plumbing USA", "telephone": "+1-877-516-8705"},
    "areaServed": {"@type": "PostalAddress", "postalCode": "${zip}", "addressLocality": "${city}", "addressRegion": "${stateCode}", "addressCountry": "US"}
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://homeplumbingusa.com/"},
      {"@type": "ListItem", "position": 2, "name": "Service Areas", "item": "https://homeplumbingusa.com/areas.html"},
      {"@type": "ListItem", "position": 3, "name": "${city}, ${stateCode} ${zip}", "item": "https://homeplumbingusa.com/service-areas/${sub.zip_folder_name}/"},
      {"@type": "ListItem", "position": 4, "name": "${sub.service_name}", "item": "https://homeplumbingusa.com/service-areas/${sub.folder_name}/"}
    ]
  }
  </script>

  <script type="application/ld+json">
  { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
    ${(sub.faqs || []).map(f => `{"@type": "Question", "name": "${f.question.replace(/"/g, '\\"')}", "acceptedAnswer": {"@type": "Answer", "text": "${f.answer.replace(/"/g, '\\"')}"}}`).join(',\n    ')}
  ]}
  </script>

  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-NHGT9PF7');</script>
  <!-- End Google Tag Manager -->
  <link rel="icon" type="image/png" href="/images/favicon.png">
</head>
<body>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NHGT9PF7"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->

  <header class="header" id="header">
    <div class="header-inner">
      <a href="../../../index.html" class="logo">
        <img src="/images/logo.svg" alt="Home Plumbing USA Logo" class="logo-img" width="247" height="52">
      </a>
      <nav class="nav" id="mainNav">
        <a href="../../../index.html" class="nav-link">Home</a>
        <a href="../../../about.html" class="nav-link">About</a>
        <a href="../../../services.html" class="nav-link">Services</a>
        <a href="../../../areas.html" class="nav-link active">Areas We Serve</a>
        <a href="../../../projects.html" class="nav-link">Projects</a>
        <a href="../../../contact.html" class="nav-link">Contact</a>
      </nav>
      <div class="header-cta">
        <a href="tel:877-516-8705" class="header-phone"><i class="fas fa-phone"></i> 877-516-8705</a>
        <a href="../../../contact.html" class="btn btn-primary btn-sm">Get a Quote</a>
      </div>
      <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle navigation"><span></span><span></span><span></span></button>
    </div>
  </header>

  <section class="hero hero-sub">
    <div class="container">
      <div class="hero-grid">
        <div class="hero-content">
          <div class="breadcrumbs" style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 15px;">
            <a href="../../../index.html" style="color: var(--text-muted); text-decoration: none;">Home</a><span> / </span>
            <a href="../../../areas.html" style="color: var(--text-muted); text-decoration: none;">Service Areas</a><span> / </span>
            <a href="${parentUrl}" style="color: var(--text-muted); text-decoration: none;">${city}, ${stateCode} ${zip}</a><span> / </span>
            <span class="current" style="color: var(--text-white);">${sub.service_name}</span>
          </div>
          <h1 class="hero-title">${h1Formatted}</h1>
          <p class="hero-text" style="color: var(--text-muted); font-size: 1.15rem; line-height: 1.6; margin-top: 10px;">Connecting home and business owners in ${city}, ${stateCode} (${zip}) with vetted, independent local plumbing experts in real-time. Fast, reliable service matches 24/7.</p>
          <div class="hero-buttons" style="margin-top: 20px;">
            <a href="tel:877-516-8705" class="btn btn-accent btn-lg" style="text-decoration: none;"><i class="fas fa-phone"></i> Call 877-516-8705</a>
          </div>
        </div>
        <div class="hero-image-wrapper" style="position: relative;">
          <div class="hero-image-container" style="position: relative; border-radius: var(--radius-md); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
            <img src="/images/hero-plumbing.webp" alt="Local ${sub.service_name} in ${city}" class="hero-image" width="600" height="750" style="width: 100%; height: auto; display: block; filter: brightness(0.95);">
            <div class="hero-overlay-badge" style="position: absolute; bottom: 20px; left: 20px; right: 20px; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-sm); padding: 16px; display: flex; align-items: center; gap: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
              <div style="background: var(--primary); color: #fff; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;"><i class="fas fa-screwdriver-wrench"></i></div>
              <div>
                <div style="color: #fff; font-weight: 700; font-size: 0.95rem;">Active Local Dispatch</div>
                <div style="color: var(--text-muted); font-size: 0.78rem; font-weight: 500;">Safety Certified &amp; Ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Trust Section -->
  <section class="trust-section" id="trust" style="position: relative; z-index: 10;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Card 1: Certified Plumbers -->
        <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-xl hover:border-blue-500/50 transition-all duration-300">
          <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 text-xl">
            <i class="fas fa-user-shield"></i>
          </div>
          <div>
            <h3 class="text-white font-semibold text-base leading-snug">Certified Plumbers</h3>
            <p class="text-slate-400 text-sm mt-1 leading-relaxed">Vetted technicians who know ${stateName} building codes.</p>
          </div>
        </div>

        <!-- Card 2: 24/7 Rapid Response -->
        <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-xl hover:border-blue-500/50 transition-all duration-300">
          <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 text-xl">
            <i class="fas fa-truck-fast"></i>
          </div>
          <div>
            <h3 class="text-white font-semibold text-base leading-snug">24/7 Rapid Response</h3>
            <p class="text-slate-400 text-sm mt-1 leading-relaxed">Average arrival under 45 minutes for urgent repairs.</p>
          </div>
        </div>

        <!-- Card 3: Upfront Estimates -->
        <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-xl hover:border-blue-500/50 transition-all duration-300">
          <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 text-xl">
            <i class="fas fa-file-invoice-dollar"></i>
          </div>
          <div>
            <h3 class="text-white font-semibold text-base leading-snug">Upfront Estimates</h3>
            <p class="text-slate-400 text-sm mt-1 leading-relaxed">Flat-rate quotes presented on-site, no surprises.</p>
          </div>
        </div>

        <!-- Card 4: Guaranteed Craftsmanship -->
        <div class="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-5 flex items-center gap-4 shadow-xl hover:border-blue-500/50 transition-all duration-300">
          <div class="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 text-xl">
            <i class="fas fa-award"></i>
          </div>
          <div>
            <h3 class="text-white font-semibold text-base leading-snug">Guaranteed Craftsmanship</h3>
            <p class="text-slate-400 text-sm mt-1 leading-relaxed">Every repair backed by parts and labor warranties.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="detail-layout">
        <div class="detail-main animate-on-scroll">
          <h2>Why ${city} Residents Call Us for ${sub.service_name}</h2>
          <p>${sub.problem_paragraph}</p>

          <h2>How We Handle It</h2>
          <p>${sub.technique_paragraph}</p>

          <h2>Our Process</h2>
          <div class="workflow-list">
            ${workflowHtml}
          </div>
        </div>

        <div class="detail-sidebar">
          <div class="sidebar-widget">
            <h3>Other Services in ${city}</h3>
            ${otherServicesHtml}
          </div>

          <div class="sidebar-widget">
            <h3>Nearby Areas</h3>
            ${nearbyAreasHtml}
          </div>

          <div class="sidebar-widget cta-widget">
            <h3>Need ${sub.service_name} in ${city}?</h3>
            <p>Call now for same-day service in ${zip} and the surrounding area.</p>
            <a href="tel:877-516-8705" class="btn btn-lg" style="background:#fff; color: var(--primary); width: 100%; justify-content: center; text-decoration: none; font-weight: 600;"><i class="fas fa-phone"></i> Call 877-516-8705</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Completed Plumbing Projects / Case Studies Section -->
  <section class="case-studies-section section" id="case-studies" style="background: var(--bg-card); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding: 80px 0;">
    <div class="container">
      <div class="section-header animate-on-scroll" style="text-align: center; margin-bottom: 50px;">
        <div class="section-label" style="color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Proven Track Record</div>
        <h2 class="section-title" style="font-size: 2.2rem; font-weight: 800; color: var(--text-white);">Completed Plumbing Case Studies in ${city}, ${stateCode}</h2>
        <p class="section-desc" style="color: var(--text-muted); max-width: 600px; margin: 10px auto 0;">Real resolutions completed by our expert mechanics in the local area.</p>
      </div>
      <div class="case-studies-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
        <!-- Card 1 -->
        <div class="case-card animate-on-scroll" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 30px; transition: var(--transition); display: flex; flex-direction: column; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
          <div style="background: rgba(37, 99, 235, 0.1); color: var(--primary); border: 1px solid rgba(37, 99, 235, 0.2); padding: 4px 12px; border-radius: 12px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; align-self: flex-start; margin-bottom: 16px;">PHCC Standards Compliance</div>
          <h3 style="color: var(--text-white); font-size: 1.25rem; font-weight: 800; margin-bottom: 12px;">Water Heater Replacement</h3>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 20px; flex-grow: 1;">Completed a full installation of an energy-efficient hot water system. The installation was certified under PHCC standard metrics for safety and performance, resulting in a 98% efficiency index.</p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: auto;">
            <span style="font-size: 0.82rem; color: var(--text-muted);"><i class="fas fa-calendar-alt"></i> Completed Recently</span>
            <span style="font-size: 0.82rem; font-weight: 700; color: var(--accent); text-transform: uppercase;">Verified Resolution</span>
          </div>
        </div>
        <!-- Card 2 -->
        <div class="case-card animate-on-scroll" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 30px; transition: var(--transition); display: flex; flex-direction: column; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
          <div style="background: rgba(245, 158, 11, 0.1); color: var(--accent); border: 1px solid rgba(245, 158, 11, 0.2); padding: 4px 12px; border-radius: 12px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; align-self: flex-start; margin-bottom: 16px;">Acoustic Leak Detection</div>
          <h3 style="color: var(--text-white); font-size: 1.25rem; font-weight: 800; margin-bottom: 12px;">Under-Slab Leak Repiping</h3>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 20px; flex-grow: 1;">Located a high-pressure pipe breach underneath the concrete foundation using acoustic sensor localization. Replaced the damaged section with zero structural damage to floors.</p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: auto;">
            <span style="font-size: 0.82rem; color: var(--text-muted);"><i class="fas fa-calendar-alt"></i> Completed Recently</span>
            <span style="font-size: 0.82rem; font-weight: 700; color: var(--accent); text-transform: uppercase;">Verified Resolution</span>
          </div>
        </div>
        <!-- Card 3 -->
        <div class="case-card animate-on-scroll" style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 30px; transition: var(--transition); display: flex; flex-direction: column; box-shadow: 0 4px 20px rgba(0,0,0,0.15);">
          <div style="background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); padding: 4px 12px; border-radius: 12px; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; align-self: flex-start; margin-bottom: 16px;">Uniform Plumbing Code (UPC)</div>
          <h3 style="color: var(--text-white); font-size: 1.25rem; font-weight: 800; margin-bottom: 12px;">Restroom Drainage Refit</h3>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 20px; flex-grow: 1;">Reconstructed drainage pipe routing for local commercial restrooms. Verified slope, venting, and trap seals to guarantee compliance with Uniform Plumbing Code (UPC) regulations.</p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 16px; margin-top: auto;">
            <span style="font-size: 0.82rem; color: var(--text-muted);"><i class="fas fa-calendar-alt"></i> Completed Recently</span>
            <span style="font-size: 0.82rem; font-weight: 700; color: var(--accent); text-transform: uppercase;">Verified Resolution</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" style="background: var(--bg-surface);">
    <div class="container">
      <div class="section-header animate-on-scroll" style="text-align: center; margin-bottom: 40px;">
        <div class="section-label" style="color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">FAQ</div>
        <h2 class="section-title">${sub.service_name} Questions &mdash; ${city}, ${zip}</h2>
      </div>
      <div class="faq-container" style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px;">
        ${faqsHtml}
      </div>
    </div>
  </section>

  <section class="cta-section section" style="background: var(--gradient-primary); text-align: center; padding: 60px 0; color: #fff;">
    <div class="container">
      <div class="cta-content">
        <h2>Get ${sub.service_name} in ${city}, ${stateCode} ${zip}</h2>
        <div class="cta-phone" style="font-size: 2.2rem; font-weight: 800; margin: 15px 0;"><i class="fas fa-phone"></i> <a href="tel:877-516-8705" style="color: #fff; text-decoration: none;">877-516-8705</a></div>
        <div class="cta-buttons" style="display: flex; justify-content: center; gap: 16px; margin-top: 20px;">
          <a href="tel:877-516-8705" class="btn btn-accent btn-lg" style="text-decoration: none;"><i class="fas fa-phone"></i> Call Now</a>
          <a href="${parentUrl}" class="btn btn-outline btn-lg" style="border-color: rgba(255,255,255,0.3); color: #fff; text-decoration: none;"><i class="fas fa-map-location-dot"></i> View All ${city} Services</a>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer" style="background: var(--bg-footer); padding: 40px 0; color: var(--text-muted);">
    <div class="container">
      <div class="footer-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px;">
        <div class="footer-about">
          <h3 style="color: #fff;"><i class="fas fa-house-chimney" style="color: var(--primary-light);"></i> Home Plumbing USA</h3>
          <p>Disclaimer: Home Plumbing USA is a referral service that connects homeowners with independent local plumbing contractors. All contractors are independent, licensed, and insured local businesses. Home Plumbing USA does not directly perform plumbing services, and it is the responsibility of the homeowner to verify licensing and insurance for any contractor hired.</p>
        </div>
        <div class="footer-col">
          <h3 style="color: #fff; font-size: 1.1rem; margin-bottom: 15px;">Quick Links</h3>
          <a href="../../../index.html" style="color: var(--text-muted); text-decoration: none; display: block; margin-bottom: 8px;">Home</a>
          <a href="../../../about.html" style="color: var(--text-muted); text-decoration: none; display: block; margin-bottom: 8px;">About Us</a>
          <a href="../../../services.html" style="color: var(--text-muted); text-decoration: none; display: block; margin-bottom: 8px;">Services</a>
          <a href="../../../areas.html" style="color: var(--text-muted); text-decoration: none; display: block; margin-bottom: 8px;">Areas We Serve</a>
          <a href="../../../contact.html" style="color: var(--text-muted); text-decoration: none; display: block; margin-bottom: 8px;">Contact</a>
        </div>
        <div class="footer-col">
          <h3 style="color: #fff; font-size: 1.1rem; margin-bottom: 15px;">This ZIP</h3>
          <a href="${parentUrl}" style="color: var(--text-muted); text-decoration: none; display: block; margin-bottom: 8px;">${city}, ${stateCode} ${zip} Overview</a>
        </div>
        <div class="footer-col">
          <h3 style="color: #fff; font-size: 1.1rem; margin-bottom: 15px;">Contact Info</h3>
          <a href="tel:877-516-8705" style="color: var(--text-muted); text-decoration: none; display: block; margin-bottom: 8px;"><i class="fas fa-phone"></i> 877-516-8705</a>
          <span style="display: block; margin-bottom: 8px;"><i class="fas fa-map-marker-alt"></i> Serving ${city}, ${stateCode} ${zip}</span>
          <span style="display: block; margin-bottom: 8px;"><i class="fas fa-clock"></i> 24/7 Emergency Service</span>
        </div>
      </div>
      <div class="footer-bottom" style="text-align: center; border-top: 1px solid var(--border-color); margin-top: 30px; padding-top: 20px;">
        <p>&copy; 2026 Home Plumbing USA. All rights reserved. Licensed &amp; Insured | Serving ${stateName} Statewide</p>
        <!-- Footer Links -->
        <div class="footer-links flex justify-center space-x-4 mt-2 text-xs">
          <a href="/privacy-policy" class="hover:text-white transition-colors" style="color: rgba(255,255,255,0.6); text-decoration: none;">Privacy Policy</a>
          <span style="color: rgba(255,255,255,0.2);">&middot;</span>
          <a href="/terms-and-conditions" class="hover:text-white transition-colors" style="color: rgba(255,255,255,0.6); text-decoration: none;">Terms &amp; Conditions</a>
          <span style="color: rgba(255,255,255,0.2);">&middot;</span>
          <a href="/disclaimer" class="hover:text-white transition-colors" style="color: rgba(255,255,255,0.6); text-decoration: none;">Disclaimer</a>
        </div>
        <!-- Visible One-Liner Disclaimer Text -->
        <p style="color: #9ca3af; font-size: 12px; margin-top: 8px; text-align: center;">
          <strong>Disclaimer:</strong> Home Plumbing USA is a free referral service matching homeowners with independent local contractors. We do not directly provide plumbing services. <a href="/disclaimer" style="color: #3b82f6;">Read Full Disclaimer</a>
        </p>
      </div>
    </div>
  </footer>

  <script src="../../../js/main.js" defer></script>
</body>
</html>`;
}

function main() {
  console.log('Loading ZIP hub pages from seo-pages.json...');
  if (!fs.existsSync(dataFilePath)) {
    console.error('Data file not found!');
    process.exit(1);
  }

  const seoPages = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  console.log(`Loaded ${seoPages.length} ZIP hub records.`);

  if (!fs.existsSync(serviceAreasOutputDir)) {
    console.log(`Creating directory: ${serviceAreasOutputDir}`);
    fs.mkdirSync(serviceAreasOutputDir, { recursive: true });
  }

  let count = 0;
  seoPages.forEach(loc => {
    if (!loc.folder_name) {
      console.warn(`Skipping row without folder_name: ${JSON.stringify(loc)}`);
      return;
    }
    
    const pageDir = path.join(serviceAreasOutputDir, loc.folder_name);
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir, { recursive: true });
    }
    
    const pageHtml = compilePage(loc);
    fs.writeFileSync(path.join(pageDir, 'index.html'), pageHtml, 'utf8');
    
    count++;
    if (count % 500 === 0) {
      console.log(`Generated ${count} / ${seoPages.length} ZIP hub pages...`);
    }
  });
  console.log(`Successfully generated ${count} ZIP hub pages.`);

  const servicePagesPath = path.join(__dirname, 'database', 'service-area-pages.json');
  if (fs.existsSync(servicePagesPath)) {
    console.log('Loading service subpages from service-area-pages.json...');
    const servicePages = JSON.parse(fs.readFileSync(servicePagesPath, 'utf8'));
    console.log(`Loaded ${servicePages.length} service subpage records.`);
    
    let subCount = 0;
    servicePages.forEach(sub => {
      if (!sub.folder_name || !sub.zip_folder_name) {
        console.warn(`Skipping service row without folder details: ${JSON.stringify(sub)}`);
        return;
      }
      
      const subPageDir = path.join(serviceAreasOutputDir, sub.zip_folder_name, sub.service_slug);
      if (!fs.existsSync(subPageDir)) {
        fs.mkdirSync(subPageDir, { recursive: true });
      }
      
      const subPageHtml = compileServicePage(sub);
      fs.writeFileSync(path.join(subPageDir, 'index.html'), subPageHtml, 'utf8');
      
      subCount++;
      if (subCount % 1000 === 0) {
        console.log(`Generated ${subCount} / ${servicePages.length} service subpages...`);
      }
    });
    console.log(`Successfully generated ${subCount} service subpages.`);
  } else {
    console.log('No service-area-pages.json found. Skipping service subpages compilation.');
  }
  console.log('Static site generation complete.');
}

main();

