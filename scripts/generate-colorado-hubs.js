const fs = require('fs');
const path = require('path');
const { LAKEWOOD_ZIPS, SERVICES, DOMAIN, COLORADO_DIR } = require('./colorado-data');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function slugify(text) {
  if (!text) return '';
  return text.toLowerCase().replace(/[^a-z0-9\s-_]/g, '').trim().replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

// ======================================================================
// 1. GENERATE COLORADO STATE HUB (/colorado/index.html)
// ======================================================================
function generateStateHub() {
  const pageUrl = `${DOMAIN}/colorado/`;
  const title = `Plumbing Services in Colorado | 24/7 Licensed Pro Network`;
  const metaDesc = `Connect with vetted, licensed plumbing contractors across Colorado. 24/7 emergency dispatch, upfront flat-rate pricing, and cold-climate expertise. Call 877-516-8705!`;

  const schemaObj = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "PlumbingService",
        "@id": `${pageUrl}#plumbingservice`,
        "name": "Home Plumbing USA - Colorado Contractor Network",
        "description": metaDesc,
        "url": pageUrl,
        "telephone": "877-516-8705",
        "priceRange": "$$",
        "image": `${DOMAIN}/public/images/hero-plumbing.webp`,
        "address": {
          "@type": "PostalAddress",
          "addressRegion": "CO",
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
            "item": pageUrl
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does Home Plumbing USA operate in Colorado?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Home Plumbing USA operates as a vetted referral and emergency dispatch network connecting homeowners and commercial facility managers with licensed, insured independent plumbing contractors across Colorado."
            }
          },
          {
            "@type": "Question",
            "name": "How does Colorado's high altitude affect residential plumbing?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Colorado's high elevation lowers the atmospheric pressure and boiling point of water (approx. 202°F along the Front Range), which alters water heater thermostat calibration, accelerates mineral scaling on heating elements, and necessitates expansion tanks and calibrated pressure reducing valves (PRVs)."
            }
          },
          {
            "@type": "Question",
            "name": "What causes severe freeze-thaw pipe bursts in Colorado homes?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Rapid Front Range temperature drops, sub-zero Arctic cold fronts, and uninsulated crawlspaces or exterior hose bibs freeze static water in supply lines. As ice expands, hydraulic pressure builds up behind the blockage, rupturing copper or PEX tubing."
            }
          },
          {
            "@type": "Question",
            "name": "How does expansive bentonite clay soil damage sewer lines in Colorado?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Denver Basin and Jefferson County soils contain expansive bentonite clay and Pierre shale that heave significantly when wet and contract during dry periods. This cyclical soil movement creates ground shear stress that buckles, offsets, and bellies underground sewer laterals."
            }
          }
        ]
      }
    ]
  };

  const lakewoodLinksHtml = LAKEWOOD_ZIPS.map(z => `
    <a href="/colorado/lakewood-${z.zip}/" class="area-card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 18px 20px; display: flex; flex-direction: column; justify-content: space-between; text-decoration: none; transition: var(--transition);">
      <div>
        <h3 style="font-size: 1.1rem; color: #fff; font-weight: 700; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
          <i class="fas fa-map-pin" style="color: var(--primary); font-size: 0.95rem;"></i> Lakewood (${z.zip})
        </h3>
        <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 10px; line-height: 1.5;">${z.neighborhood} &bull; Elev: ${z.elevation}</p>
        <span style="font-size: 0.8rem; color: #38bdf8; display: inline-block; background: rgba(56,189,248,0.1); padding: 2px 8px; border-radius: 4px;">Pop: ${z.population.toLocaleString()}</span>
      </div>
      <span style="color: var(--accent); font-size: 0.9rem; font-weight: 700; margin-top: 14px; display: inline-flex; align-items: center; gap: 6px;">
        View Lakewood (${z.zip}) Hub <i class="fas fa-arrow-right" style="font-size: 0.75rem;"></i>
      </span>
    </a>
  `).join('\n');

  const servicesGridHtml = SERVICES.map(s => `
    <div class="service-card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 28px; transition: var(--transition); display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div class="service-icon" style="width: 52px; height: 52px; border-radius: 12px; background: var(--gradient-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; margin-bottom: 20px;">
          <i class="fas ${s.icon}"></i>
        </div>
        <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--text-white); margin-bottom: 12px;">${s.name}</h3>
        <p style="color: var(--text-muted); font-size: 0.94rem; line-height: 1.65; margin-bottom: 20px;">Colorado-compliant ${s.name.toLowerCase()} specialized for Front Range climate conditions, mineral scaling, and freeze resistance.</p>
      </div>
      <div>
        <span style="color: var(--primary-light); font-weight: 700; display: inline-flex; align-items: center; gap: 8px; font-size: 0.95rem;">
          Available Across Colorado <i class="fas fa-check-circle" style="color: #34d399; font-size: 0.85rem;"></i>
        </span>
      </div>
    </div>
  `).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${metaDesc}">
  <meta name="keywords" content="Colorado plumbers, plumbing network Colorado, emergency plumber Denver metro, Lakewood plumbers, burst pipe repair Colorado">
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

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="icon" type="image/png" href="/public/images/favicon.png">

  <style>
    .co-painpoint-card {
      background: rgba(15, 30, 58, 0.7);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 12px;
      padding: 24px;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .co-painpoint-card:hover {
      transform: translateY(-2px);
      border-color: var(--primary);
    }
  </style>
</head>
<body data-prefix="/" data-depth="0">

  <!-- Header -->
  <header class="header" id="header" style="min-height: 120px;">
    <div class="top-bar" style="min-height: 40px; height: 40px; display: flex; align-items: center; justify-content: center; text-align: center; white-space: nowrap;">
      <div class="top-bar-content">
        <span class="pulse-dot"></span>
        <span>24/7 Colorado Plumbing Dispatch Network &bull; Vetted Independent Contractors &bull; <a href="tel:877-516-8705" style="color: inherit; text-decoration: none; font-weight: 700;">877-516-8705</a></span>
      </div>
    </div>
    <div class="header-inner container" style="min-height: 80px; height: 80px; display: flex; align-items: center; justify-content: space-between;">
      <a href="/" class="logo" style="width: 247px; max-width: 100%; display: flex; align-items: center;">
        <img src="/public/images/logo.svg" alt="Home Plumbing USA Logo" class="logo-img" width="247" height="52">
      </a>
      <nav class="nav" id="mainNav">
        <a href="/" class="nav-link">Home</a>
        <a href="/colorado/" class="nav-link active" style="color: var(--primary-light); font-weight: 700;">Colorado</a>
        <a href="#coverage" class="nav-link">Coverage Areas</a>
        <a href="#services" class="nav-link">Services</a>
        <a href="/contact" class="nav-link">Contact</a>
      </nav>
      <div class="header-cta" style="display: flex; align-items: center; gap: 16px;">
        <a href="tel:877-516-8705" class="header-phone" style="display: inline-flex; align-items: center; gap: 8px; font-weight: 700; color: #fff; text-decoration: none;"><i class="fas fa-phone" style="color: var(--accent);"></i> 877-516-8705</a>
        <a href="tel:877-516-8705" class="btn btn-primary btn-sm">Call 24/7</a>
      </div>
    </div>
  </header>

  <main>
    <!-- HERO SECTION -->
    <section class="hero" style="padding: 65px 0 55px; background: linear-gradient(135deg, rgba(10, 22, 40, 0.96), rgba(15, 30, 60, 0.88)); color: var(--text-white); position: relative;">
      <div class="container">
        <div class="breadcrumbs" style="display: flex; gap: 8px; align-items: center; font-size: 0.9rem; margin-bottom: 24px; color: var(--text-muted); flex-wrap: wrap;">
          <a href="/" style="color: var(--primary-light); text-decoration: none;">Home</a>
          <i class="fas fa-chevron-right" style="font-size: 0.75rem;"></i>
          <span style="color: #fff;">Colorado</span>
        </div>

        <div class="grid-2 hero-grid" style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 3rem; align-items: center;">
          <div class="hero-content">
            <div class="hero-badge" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(37,99,235,0.15); border: 1px solid rgba(37,99,235,0.3); color: var(--primary-light); padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; margin-bottom: 16px;">
              <i class="fas fa-shield-alt" style="color: var(--accent);"></i> Vetted Colorado Independent Pro Network
            </div>
            <h1 style="font-size: 2.85rem; line-height: 1.15; color: #fff; margin-bottom: 1.25rem; font-weight: 900;">
              Licensed Plumbing Solutions Across <span style="color: var(--accent);">Colorado</span>
            </h1>
            <p style="font-size: 1.12rem; color: var(--text-light); margin-bottom: 2rem; line-height: 1.7;">
              Home Plumbing USA operates as an emergency dispatch and referral network connecting property owners across Colorado with independent, licensed, and background-checked plumbing contractors. From high-altitude water heater adjustments and frozen pipe mitigation to bentonite clay sewer repairs, we coordinate fast on-call dispatch with upfront flat-rate pricing.
            </p>
            <div class="hero-ctas" style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <a href="tel:877-516-8705" class="btn btn-accent" style="background: var(--gradient-accent); color: #fff; font-weight: 700; font-size: 1.05rem; padding: 14px 28px; border-radius: 8px; text-decoration: none; box-shadow: var(--shadow-accent-glow); display: inline-flex; align-items: center; gap: 8px;">
                <i class="fas fa-phone-alt"></i> Call (877) 516-8705
              </a>
              <a href="#coverage" class="btn btn-outline" style="border: 2px solid rgba(255,255,255,0.3); color: #fff; font-weight: 600; font-size: 1.05rem; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                <i class="fas fa-location-dot"></i> View Coverage Areas
              </a>
            </div>
          </div>
          <div class="hero-image-container" style="border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-lg); border: 1px solid var(--border-color); background: #0f1e3a;">
            <img src="/public/images/hero-plumbing.webp" alt="Colorado Licensed Plumbing Contractors" style="width: 100%; height: auto; display: block; aspect-ratio: 4 / 5; object-fit: cover;">
          </div>
        </div>
      </div>
    </section>

    <!-- COLORADO PLUMBING CHALLENGES -->
    <section class="section" style="background: var(--bg-surface); padding: 5rem 0; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 48px;">
          <div class="section-label" style="display: inline-block; padding: 4px 14px; background: rgba(37,99,235,0.15); color: var(--primary); border-radius: 20px; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 10px;">Regional Expertise</div>
          <h2 style="font-size: 2.3rem; font-weight: 800; color: #fff;">Colorado's 5 Core Plumbing Challenges</h2>
          <p style="color: var(--text-muted); font-size: 1.05rem; max-width: 750px; margin: 10px auto 0;">Rocky Mountain geography and Front Range weather require specialized diagnostics and materials.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
          <div class="co-painpoint-card">
            <div style="font-size: 1.8rem; color: #38bdf8; margin-bottom: 14px;"><i class="fas fa-mountain"></i></div>
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 10px;">High-Altitude Pressure Variation</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.65; margin: 0;">Colorado elevations (5,000' to 7,500'+) drop atmospheric pressure and water's boiling point to ~202°F. This creates thermal cycling stress in water heaters, requiring calibrated thermal expansion tanks and pressure reducing valves (PRVs) to prevent premature pressure relief discharges.</p>
          </div>

          <div class="co-painpoint-card">
            <div style="font-size: 1.8rem; color: #fbbf24; margin-bottom: 14px;"><i class="fas fa-faucet-drip"></i></div>
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 10px;">Hard Water & Calcium Buildup</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.65; margin: 0;">Mountain runoff filtering through limestone deposits saturates Front Range water supplies with calcium and magnesium. Without whole-house conditioning or periodic flushing, mineral crusts insulate electric water heater elements and clog tankless heat exchangers.</p>
          </div>

          <div class="co-painpoint-card">
            <div style="font-size: 1.8rem; color: #60a5fa; margin-bottom: 14px;"><i class="fas fa-snowflake"></i></div>
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 10px;">Sub-Zero Freeze-Thaw Pipe Bursts</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.65; margin: 0;">Dramatic Rocky Mountain temperature shifts (Chinook swings dropping 40°F in hours) freeze uninsulated pipes in exterior walls, crawlspaces, and unheated basements. Rapid line isolation and freeze-tolerant PEX expansion piping are critical winter safeguards.</p>
          </div>

          <div class="co-painpoint-card">
            <div style="font-size: 1.8rem; color: #f87171; margin-bottom: 14px;"><i class="fas fa-layer-group"></i></div>
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 10px;">Expansive Bentonite Clay Soils</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.65; margin: 0;">The Denver Basin's infamous Pierre Shale and bentonite clay swell violently when saturated and shrink during drought. This cyclical ground movement shifts foundations, bellies sewer laterals, fractures clay lines, and requires trenchless pipe relining.</p>
          </div>

          <div class="co-painpoint-card">
            <div style="font-size: 1.8rem; color: #34d399; margin-bottom: 14px;"><i class="fas fa-water"></i></div>
            <h3 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 10px;">Spring Snowmelt Backflow & Runoff</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.65; margin: 0;">Heavy spring snowmelt saturates sub-grade water tables, placing immense hydrostatic pressure on perimeter foundation drains. Properly tested dual sump pump systems and backwater check valves prevent municipal storm surge backups into basements.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- COVERAGE HUBS (LAKEWOOD FIRST) -->
    <section class="section" id="coverage" style="padding: 5rem 0;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 40px;">
          <div class="section-label" style="display: inline-block; padding: 4px 14px; background: rgba(37,99,235,0.15); color: var(--primary); border-radius: 20px; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 10px;">Active Metro Coverage</div>
          <h2 style="font-size: 2.3rem; font-weight: 800; color: #fff;">Lakewood, CO City &amp; ZIP Code Hubs</h2>
          <p style="color: var(--text-muted); font-size: 1.05rem; max-width: 750px; margin: 10px auto 0;">Explore local plumbing dispatch hubs across Lakewood and surrounding Jefferson County communities.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
          ${lakewoodLinksHtml}
        </div>
      </div>
    </section>

    <!-- SERVICES OFFERED -->
    <section class="section" id="services" style="background: var(--bg-surface); padding: 5rem 0; border-top: 1px solid var(--border-color);">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 40px;">
          <h2 style="font-size: 2.3rem; font-weight: 800; color: #fff;">Core Plumbing Capabilities Across Colorado</h2>
          <p style="color: var(--text-muted); font-size: 1.05rem; max-width: 700px; margin: 10px auto 0;">Standardized diagnostic protocols and licensed execution across all 8 essential categories.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
          ${servicesGridHtml}
        </div>
      </div>
    </section>

    <!-- CALL TO ACTION -->
    <section class="cta-section" style="padding: 5rem 0; background: linear-gradient(135deg, #1e3a8a 0%, #0f1e3a 100%); border-top: 2px solid var(--primary); text-align: center;">
      <div class="container">
        <h2 style="font-size: 2.4rem; font-weight: 900; color: #fff; margin-bottom: 14px;">Need Emergency Plumbing Dispatch in Colorado?</h2>
        <p style="color: var(--text-light); font-size: 1.15rem; max-width: 680px; margin: 0 auto 28px; line-height: 1.6;">Our live operators connect you with vetted, licensed independent plumbing contractors 24 hours a day, 7 days a week.</p>
        <a href="tel:877-516-8705" class="btn btn-accent" style="padding: 16px 36px; font-size: 1.15rem; font-weight: 800; text-decoration: none; border-radius: 8px; display: inline-flex; align-items: center; gap: 10px; background: var(--gradient-accent); color: #fff; box-shadow: var(--shadow-accent-glow);">
          <i class="fas fa-phone-alt"></i> Call (877) 516-8705 Now
        </a>
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
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.65; margin-bottom: 16px;">Home Plumbing USA is a nationwide referral and dispatch network connecting property owners with independent, licensed, and insured plumbing professionals. We do not provide direct contracting services.</p>
          <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5;">Dispatch Center: <a href="tel:877-516-8705" style="color: var(--accent); text-decoration: none; font-weight: 700;">877-516-8705</a></p>
        </div>

        <div>
          <h4 style="color: #fff; font-size: 1.1rem; font-weight: 700; margin-bottom: 16px;">Colorado Hubs</h4>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.92rem;">
            <a href="/colorado/lakewood-80226/" style="color: var(--text-muted); text-decoration: none;">Lakewood (80226)</a>
            <a href="/colorado/lakewood-80214/" style="color: var(--text-muted); text-decoration: none;">Lakewood (80214)</a>
            <a href="/colorado/lakewood-80215/" style="color: var(--text-muted); text-decoration: none;">Lakewood (80215)</a>
            <a href="/colorado/lakewood-80228/" style="color: var(--text-muted); text-decoration: none;">Lakewood (80228)</a>
            <a href="/colorado/lakewood-80227/" style="color: var(--text-muted); text-decoration: none;">Lakewood (80227)</a>
          </div>
        </div>

        <div>
          <h4 style="color: #fff; font-size: 1.1rem; font-weight: 700; margin-bottom: 16px;">Services</h4>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.92rem;">
            <a href="/colorado/lakewood-80226/drain-cleaning/" style="color: var(--text-muted); text-decoration: none;">Drain Cleaning</a>
            <a href="/colorado/lakewood-80226/burst-pipe-repair/" style="color: var(--text-muted); text-decoration: none;">Burst Pipe Repair</a>
            <a href="/colorado/lakewood-80226/water-heater-repair/" style="color: var(--text-muted); text-decoration: none;">Water Heater Repair</a>
            <a href="/colorado/lakewood-80226/sewer-line-repair/" style="color: var(--text-muted); text-decoration: none;">Sewer Line Repair</a>
            <a href="/colorado/lakewood-80226/emergency-plumbing/" style="color: var(--text-muted); text-decoration: none;">Emergency Plumbing</a>
          </div>
        </div>

        <div>
          <h4 style="color: #fff; font-size: 1.1rem; font-weight: 700; margin-bottom: 16px;">Network Standards</h4>
          <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.6; margin-bottom: 12px;">All matched providers are verified for active Colorado state plumbing licensure, commercial general liability insurance, and upfront flat-rate pricing compliance.</p>
          <a href="tel:877-516-8705" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; background: rgba(37,99,235,0.2); color: #38bdf8; border: 1px solid rgba(56,189,248,0.3); border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 0.95rem;">
            <i class="fas fa-phone"></i> 877-516-8705
          </a>
        </div>
      </div>

      <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; font-size: 0.85rem; color: var(--text-muted);">
        <p style="margin: 0;">&copy; 2026 Home Plumbing USA. All rights reserved. Independent Plumbing Contractor Referral Network.</p>
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

  fs.writeFileSync(path.join(COLORADO_DIR, 'index.html'), html, 'utf8');
  console.log('Created State Hub: /colorado/index.html');
}

// ======================================================================
// 2. GENERATE LAKEWOOD CITY-ZIP HUBS (/colorado/lakewood-[zip]/index.html)
// ======================================================================
function generateCityZipHub(zipObj) {
  const cityZipSlug = `lakewood-${zipObj.zip}`;
  const zipDir = path.join(COLORADO_DIR, cityZipSlug);
  ensureDir(zipDir);

  const pageUrl = `${DOMAIN}/colorado/${cityZipSlug}/`;
  const stateUrl = `${DOMAIN}/colorado/`;
  const title = `Plumbers in Lakewood, CO ${zipObj.zip} | 24/7 Emergency Plumbing`;
  const metaDesc = `Need emergency plumbing in Lakewood, CO (${zipObj.zip})? Home Plumbing USA connects you with vetted, licensed local contractors 24/7. Call 877-516-8705!`;

  const nearbyList = LAKEWOOD_ZIPS.filter(z => z.zip !== zipObj.zip);
  const nearbyHtml = nearbyList.map(nz => `
    <div class="area-card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 18px 20px; display: flex; flex-direction: column; justify-content: space-between; transition: var(--transition);">
      <div>
        <h3 style="font-size: 1.05rem; color: var(--text-white); margin-bottom: 4px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
          <i class="fas fa-map-pin" style="color: var(--primary); font-size: 0.9rem;"></i> Lakewood, CO (${nz.zip})
        </h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">${nz.neighborhood} | Elev: ${nz.elevation}</p>
      </div>
      <a href="/colorado/lakewood-${nz.zip}/" style="color: var(--accent); font-size: 0.88rem; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
        View Hub <i class="fas fa-arrow-right" style="font-size: 0.75rem;"></i>
      </a>
    </div>
  `).join('\n');

  const servicesGridHtml = SERVICES.map(s => `
    <div class="service-card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 28px; transition: var(--transition); display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div class="service-icon" style="width: 52px; height: 52px; border-radius: 12px; background: var(--gradient-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; margin-bottom: 20px;">
          <i class="fas ${s.icon}"></i>
        </div>
        <h3 style="font-size: 1.3rem; font-weight: 800; color: var(--text-white); margin-bottom: 12px;">${s.name}</h3>
        <p style="color: var(--text-muted); font-size: 0.94rem; line-height: 1.65; margin-bottom: 20px;">Prompt, licensed ${s.name.toLowerCase()} for homes and businesses in Lakewood (${zipObj.zip}). Front Range code compliant with upfront estimates.</p>
      </div>
      <div>
        <a href="/colorado/${cityZipSlug}/${s.slug}/" style="color: var(--primary-light); font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-size: 0.95rem;">
          View ${s.name} <i class="fas fa-arrow-right" style="font-size: 0.8rem;"></i>
        </a>
      </div>
    </div>
  `).join('\n');

  const faqs = [
    {
      q: `How quickly can a network technician arrive in Lakewood ${zipObj.zip}?`,
      a: `Emergency plumbing dispatches in our Lakewood (${zipObj.zip}) coverage area maintain a typical response window of 30 to 45 minutes under standard operating conditions. We dispatch the closest available independent licensed contractor.`
    },
    {
      q: `Are the plumbing contractors licensed and insured in Colorado?`,
      a: `Yes. Every plumbing professional matched through our dispatch network holds active licensure under the Colorado State Plumbing Board and maintains comprehensive commercial liability insurance.`
    },
    {
      q: `How do Lakewood's bentonite clay soils affect underground plumbing in ${zipObj.zip}?`,
      a: `In ${zipObj.neighborhood} (${zipObj.zip}), expansive ${zipObj.soilType} shifts significantly between seasonal wet and dry cycles. This movement puts lateral tension on sewer pipes, leading to low spots (bellies), separated joints, and recurring backups that require camera inspection.`
    },
    {
      q: `What altitude factors affect water heaters in Lakewood (${zipObj.elevation})?`,
      a: `At Lakewood's elevation of ${zipObj.elevation}, lower air pressure drops the boiling point of water. Water heater burners and heating elements must be calibrated correctly, and pressure relief valves and expansion tanks must be inspected to avoid premature failure.`
    },
    {
      q: `Do network technicians offer upfront flat-rate pricing in Lakewood?`,
      a: `Yes. The on-site technician inspects your plumbing issue in person, diagnoses the root cause, and provides a clear, written flat-rate estimate before any physical repair begins.`
    },
    {
      q: `What should I do if a water pipe bursts during a Lakewood winter freeze?`,
      a: `Immediately shut off your home's main water shut-off valve (typically located in the basement near the water meter or in the crawlspace) to halt active flooding, then call our 24/7 dispatch line at 877-516-8705.`
    },
    {
      q: `Does Lakewood water cause mineral scaling on faucets and fixtures?`,
      a: `Water supplied via ${zipObj.waterSource} carries moderate to hard mineral concentrations. Calcium carbonate crusts build up on fixture aerators, shower valves, and water heater elements over time, which can be mitigated with water softeners and annual flushes.`
    },
    {
      q: `What warranty coverage applies to repairs completed in Lakewood ${zipObj.zip}?`,
      a: `All service repairs are backed by a workmanship warranty from the independent contractor executing the job, alongside manufacturer guarantees on replaced components and piping.`
    }
  ];

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

  const schemaObj = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "PlumbingService",
        "@id": `${pageUrl}#plumbingservice`,
        "name": `Home Plumbing USA - Lakewood (${zipObj.zip})`,
        "description": metaDesc,
        "url": pageUrl,
        "telephone": "877-516-8705",
        "priceRange": "$$",
        "image": `${DOMAIN}/public/images/hero-plumbing.webp`,
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
  <title>${title}</title>
  <meta name="description" content="${metaDesc}">
  <meta name="keywords" content="plumbers Lakewood ${zipObj.zip}, emergency plumbing Lakewood CO, Lakewood plumber near me, drain cleaning ${zipObj.zip}, water heater repair Lakewood">
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

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="icon" type="image/png" href="/public/images/favicon.png">

  <style>
    .quick-info-bar { background: #0b1528; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 22px 0; }
    .quick-info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .quick-info-card { display: flex; align-items: center; gap: 14px; background: rgba(15, 30, 58, 0.7); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 12px; padding: 16px 18px; backdrop-filter: blur(8px); }
    .quick-info-card.highlight-card { background: rgba(220, 38, 38, 0.12); border-color: rgba(239, 68, 68, 0.35); }
    .quick-info-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
    .quick-info-label { display: block; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted, #94a3b8); font-weight: 600; margin-bottom: 2px; }
    .quick-info-value { display: block; font-size: 1.08rem; color: #fff; font-weight: 800; line-height: 1.2; }
    .quick-info-sub { display: block; font-size: 0.76rem; color: var(--accent, #38bdf8); margin-top: 2px; }
    @media (max-width: 992px) {
      .quick-info-grid { grid-template-columns: repeat(2, 1fr); }
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
        <span>24/7 Plumbers Dispatched to <strong>Lakewood, CO (${zipObj.zip})</strong> &bull; Vetted Independent Network &bull; <a href="tel:877-516-8705" style="color: inherit; text-decoration: none; font-weight: 700;">877-516-8705</a></span>
      </div>
    </div>
    <div class="header-inner container" style="min-height: 80px; height: 80px; display: flex; align-items: center; justify-content: space-between;">
      <a href="/" class="logo" style="width: 247px; max-width: 100%; display: flex; align-items: center;">
        <img src="/public/images/logo.svg" alt="Home Plumbing USA Logo" class="logo-img" width="247" height="52">
      </a>
      <nav class="nav" id="mainNav">
        <a href="/" class="nav-link">Home</a>
        <a href="/colorado/" class="nav-link">Colorado</a>
        <a href="#services" class="nav-link">Services in ${zipObj.zip}</a>
        <a href="#areas" class="nav-link">Nearby Areas</a>
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
          <span style="color: #fff;">Lakewood (${zipObj.zip})</span>
        </div>

        <div class="grid-2 hero-grid" style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 3rem; align-items: center;">
          <div class="hero-content">
            <div class="hero-badge" style="display: inline-flex; align-items: center; gap: 8px; background: rgba(37,99,235,0.15); border: 1px solid rgba(37,99,235,0.3); color: var(--primary-light); padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; margin-bottom: 16px;">
              <i class="fas fa-shield-alt" style="color: var(--accent);"></i> Vetted Local Plumbing Network &bull; ${zipObj.neighborhood}
            </div>
            <h1 style="font-size: 2.75rem; line-height: 1.2; color: #fff; margin-bottom: 1.25rem; font-weight: 800;">
              Licensed Plumbers in <span style="color: var(--accent);">Lakewood, CO (${zipObj.zip})</span>
            </h1>
            <p style="font-size: 1.1rem; color: var(--text-light); margin-bottom: 2rem; line-height: 1.7;">
              Connecting homeowners and commercial property managers in Lakewood (${zipObj.zip}) with independent, background-checked plumbing contractors. Whether you face sub-zero frozen pipe ruptures, expansive clay soil sewer backups, or high-altitude water heater malfunctions in ${zipObj.neighborhood}, our 24/7 network provides prompt, professional dispatch.
            </p>
            <div class="hero-ctas" style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <a href="tel:877-516-8705" class="btn btn-accent" style="background: var(--gradient-accent); color: #fff; font-weight: 700; font-size: 1.05rem; padding: 14px 28px; border-radius: 8px; text-decoration: none; box-shadow: var(--shadow-accent-glow); display: inline-flex; align-items: center; gap: 8px;">
                <i class="fas fa-phone-alt"></i> Call (877) 516-8705
              </a>
              <a href="#services" class="btn btn-outline" style="border: 2px solid rgba(255,255,255,0.3); color: #fff; font-weight: 600; font-size: 1.05rem; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                <i class="fas fa-wrench"></i> Services in ${zipObj.zip}
              </a>
            </div>
          </div>
          <div class="hero-image-container" style="border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-lg); border: 1px solid var(--border-color); background: #0f1e3a;">
            <img src="/public/images/hero-plumbing.webp" alt="Plumber serving Lakewood CO ${zipObj.zip}" style="width: 100%; height: auto; display: block; aspect-ratio: 4 / 5; object-fit: cover;">
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
              <span class="quick-info-label">Pricing Standard</span>
              <strong class="quick-info-value">Upfront Flat-Rate</strong>
              <span class="quick-info-sub">No Hidden Surcharges</span>
            </div>
          </div>

          <div class="quick-info-card">
            <div class="quick-info-icon" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">
              <i class="fas fa-clock"></i>
            </div>
            <div class="quick-info-text">
              <span class="quick-info-label">Dispatch Standard</span>
              <strong class="quick-info-value">30–45 Min Window</strong>
              <span class="quick-info-sub">Typical Metro Response</span>
            </div>
          </div>

          <div class="quick-info-card">
            <div class="quick-info-icon" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">
              <i class="fas fa-shield-halved"></i>
            </div>
            <div class="quick-info-text">
              <span class="quick-info-label">Workmanship Standard</span>
              <strong class="quick-info-value">100% Guaranteed</strong>
              <span class="quick-info-sub">Backed by Network Pros</span>
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

    <!-- TRUST SIGNALS -->
    <section class="trust-badges" style="background: var(--bg-surface); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding: 4.5rem 0;">
      <div class="container">
        <div style="text-align: center; max-width: 780px; margin: 0 auto 3rem;">
          <h2 style="font-size: 2.1rem; color: #fff; margin-bottom: 0.75rem;">Honest, Vetted Local Contractor Network</h2>
          <p style="font-size: 1.05rem; color: var(--text-muted); margin: 0;">We partner exclusively with certified, independent plumbing contractors across Jefferson County to ensure quality repairs under Colorado code.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem;">
          <div style="background: var(--bg-card); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 1.5rem; color: var(--accent); margin-bottom: 0.5rem;"><i class="fas fa-certificate"></i></div>
            <h3 style="color: var(--text-white); margin-bottom: 0.5rem; font-size: 1.15rem;">Colorado Licensed</h3>
            <p style="font-size: 0.88rem; margin-bottom: 0; color: var(--text-muted); line-height: 1.6;">Matched technicians hold verified Colorado State Plumbing Board licensing and comprehensive general liability insurance.</p>
          </div>

          <div style="background: var(--bg-card); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 1.5rem; color: var(--accent); margin-bottom: 0.5rem;"><i class="fas fa-stopwatch"></i></div>
            <h3 style="color: var(--text-white); margin-bottom: 0.5rem; font-size: 1.15rem;">Fast 24/7 Dispatch</h3>
            <p style="font-size: 0.88rem; margin-bottom: 0; color: var(--text-muted); line-height: 1.6;">Our automated and live dispatch desk connects your ${zipObj.zip} property with the closest on-call technician day or night.</p>
          </div>

          <div style="background: var(--bg-card); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 1.5rem; color: var(--accent); margin-bottom: 0.5rem;"><i class="fas fa-file-invoice-dollar"></i></div>
            <h3 style="color: var(--text-white); margin-bottom: 0.5rem; font-size: 1.15rem;">Upfront Written Quotes</h3>
            <p style="font-size: 0.88rem; margin-bottom: 0; color: var(--text-muted); line-height: 1.6;">No surprise billing or hidden trip fees. You receive a firm flat-rate quote on-site before any physical wrench work begins.</p>
          </div>

          <div style="background: var(--bg-card); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="font-size: 1.5rem; color: var(--accent); margin-bottom: 0.5rem;"><i class="fas fa-shield-heart"></i></div>
            <h3 style="color: var(--text-white); margin-bottom: 0.5rem; font-size: 1.15rem;">Local Soil &amp; Freeze Insight</h3>
            <p style="font-size: 0.88rem; margin-bottom: 0; color: var(--text-muted); line-height: 1.6;">Technicians understand ${zipObj.neighborhood}'s specific challenges: ${zipObj.elevation} elevation, ${zipObj.soilType}, and winter freeze cycles.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SERVICES GRID -->
    <section class="section" id="services" style="padding: 5rem 0;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 40px;">
          <h2 style="font-size: 2.2rem; font-weight: 800; color: #fff;">Plumbing Services in Lakewood (${zipObj.zip})</h2>
          <p style="color: var(--text-muted); font-size: 1.05rem; max-width: 700px; margin: 10px auto 0;">Select a specific category below for localized pricing, diagnostics, and dispatch protocols in ${zipObj.zip}.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
          ${servicesGridHtml}
        </div>
      </div>
    </section>

    <!-- NEARBY HUBS -->
    <section class="section" id="areas" style="background: var(--bg-surface); padding: 5rem 0; border-top: 1px solid var(--border-color);">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 40px;">
          <h2 style="font-size: 2rem; font-weight: 800; color: #fff;">Other Lakewood &amp; Foothills ZIP Codes We Cover</h2>
          <p style="color: var(--text-muted); font-size: 1.05rem; max-width: 700px; margin: 10px auto 0;">Fast local dispatch across the entire west Denver metro region.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px;">
          ${nearbyHtml}
        </div>
      </div>
    </section>

    <!-- FAQS -->
    <section class="section" style="padding: 5rem 0; border-top: 1px solid var(--border-color);">
      <div class="container" style="max-width: 900px;">
        <div class="section-header" style="text-align: center; margin-bottom: 40px;">
          <h2 style="font-size: 2.1rem; font-weight: 800; color: #fff;">Frequently Asked Questions in Lakewood (${zipObj.zip})</h2>
          <p style="color: var(--text-muted); font-size: 1.05rem; margin: 10px auto 0;">Honest answers regarding plumbing dispatch, local soil, freeze risks, and pricing standards.</p>
        </div>

        <div>
          ${faqsHtml}
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
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.65; margin-bottom: 16px;">Serving Lakewood, CO (${zipObj.zip}) and neighboring Jefferson County areas with vetted independent plumbing contractors 24 hours a day, 365 days a year.</p>
          <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.5;">24/7 Dispatch Desk: <a href="tel:877-516-8705" style="color: var(--accent); text-decoration: none; font-weight: 700;">877-516-8705</a></p>
        </div>

        <div>
          <h4 style="color: #fff; font-size: 1.1rem; font-weight: 700; margin-bottom: 16px;">Quick Links</h4>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.92rem;">
            <a href="/" style="color: var(--text-muted); text-decoration: none;">Home</a>
            <a href="/colorado/" style="color: var(--text-muted); text-decoration: none;">Colorado Plumbers</a>
            <a href="/colorado/${cityZipSlug}/" style="color: var(--text-muted); text-decoration: none;">Lakewood (${zipObj.zip}) Hub</a>
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
          <h4 style="color: #fff; font-size: 1.1rem; font-weight: 700; margin-bottom: 16px;">Referral Network Disclosure</h4>
          <p style="color: var(--text-muted); font-size: 0.88rem; line-height: 1.6; margin-bottom: 12px;">Home Plumbing USA connects consumers with independent local plumbing contractors. Services are performed by licensed third-party professionals.</p>
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

  fs.writeFileSync(path.join(zipDir, 'index.html'), html, 'utf8');
  console.log(`Created City Hub: /colorado/${cityZipSlug}/index.html`);
}

module.exports = {
  generateStateHub,
  generateCityZipHub
};
