<?php
/**
 * Server-Side Dynamic State Page Template
 * Eliminates duplicate title tags by rendering unique, state-specific metadata on the server.
 */

$raw_state = isset($_GET['state']) ? $_GET['state'] : '';
if (empty($raw_state)) {
    $uri_parts = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
    $state_idx = array_search('state', $uri_parts);
    if ($state_idx !== false && isset($uri_parts[$state_idx + 1])) {
        $raw_state = $uri_parts[$state_idx + 1];
    }
}

$state_slug = strtolower(preg_replace('/[^a-zA-Z0-9_-]/', '', trim($raw_state)));
$state_slug = str_replace('_', '-', $state_slug);

$state_map = [
    'alabama' => 'AL', 'alaska' => 'AK', 'arizona' => 'AZ', 'arkansas' => 'AR', 'california' => 'CA',
    'colorado' => 'CO', 'connecticut' => 'CT', 'delaware' => 'DE', 'district-of-columbia' => 'DC',
    'florida' => 'FL', 'georgia' => 'GA', 'hawaii' => 'HI', 'idaho' => 'ID', 'illinois' => 'IL',
    'indiana' => 'IN', 'iowa' => 'IA', 'kansas' => 'KS', 'kentucky' => 'KY', 'louisiana' => 'LA',
    'maine' => 'ME', 'maryland' => 'MD', 'massachusetts' => 'MA', 'michigan' => 'MI', 'minnesota' => 'MN',
    'mississippi' => 'MS', 'missouri' => 'MO', 'montana' => 'MT', 'nebraska' => 'NE', 'nevada' => 'NV',
    'new-hampshire' => 'NH', 'new-jersey' => 'NJ', 'new-mexico' => 'NM', 'new-york' => 'NY',
    'north-carolina' => 'NC', 'north-dakota' => 'ND', 'ohio' => 'OH', 'oklahoma' => 'OK',
    'oregon' => 'OR', 'pennsylvania' => 'PA', 'rhode-island' => 'RI', 'south-carolina' => 'SC',
    'south-dakota' => 'SD', 'tennessee' => 'TN', 'texas' => 'TX', 'utah' => 'UT', 'vermont' => 'VT',
    'virginia' => 'VA', 'washington' => 'WA', 'west-virginia' => 'WV', 'wisconsin' => 'WI', 'wyoming' => 'WY'
];

$state_name = ucwords(str_replace('-', ' ', $state_slug));
if (empty($state_name)) {
    $state_name = 'USA';
}

$state_code = isset($state_map[$state_slug]) ? $state_map[$state_slug] : strtoupper(substr($state_slug, 0, 2));

// Dynamic Unique Title (Strictly <= 60 characters)
$page_title = "24/7 Plumbers in {$state_name} | Emergency Plumbing Services";
if (mb_strlen($page_title) > 60) {
    $page_title = "24/7 Plumbers in {$state_name} | Emergency Plumbing";
}
if (mb_strlen($page_title) > 60) {
    $page_title = "Plumbers in {$state_name} | Home Plumbing USA";
}

// Dynamic Unique Meta Description (Strictly 150-160 characters)
$s_clean = ($state_name === 'District of Columbia') ? 'Washington DC' : $state_name;

$templates = [
    // Base 152-155 (For short states 4-8 chars)
    "Need trusted plumbers in {$s_clean}? Home Plumbing USA connects you with licensed local technicians for 24/7 emergency repairs & drain cleaning. Call 877-516-8705!",
    "Looking for emergency plumbers in {$s_clean}? Home Plumbing USA matches you with vetted local specialists for 24/7 fast pipe & leak repairs. Call 877-516-8705!",
    "Need 24/7 emergency plumbers in {$s_clean}? Home Plumbing USA connects you with licensed local experts for fast repairs, drains & leak service. Call 877-516-8705!",
    "Need emergency plumbing in {$s_clean}? Home Plumbing USA connects you with licensed local contractors for 24/7 pipe repairs & drain cleaning. Call 877-516-8705!",
    // Base 145-150 (For medium states 7-11 chars)
    "Need reliable plumbers in {$s_clean}? Home Plumbing USA connects you with licensed local technicians for 24/7 emergency repairs & drain service. Call 877-516-8705!",
    "Need fast emergency plumbers in {$s_clean}? Home Plumbing USA connects you with licensed local technicians for 24/7 repairs & leak detection. Call 877-516-8705!",
    "Find trusted local plumbers in {$s_clean}. Home Plumbing USA connects you with licensed, vetted technicians for 24/7 emergency plumbing repairs. Call 877-516-8705!",
    "Looking for trusted plumbers in {$s_clean}? Home Plumbing USA connects you with licensed local technicians for 24/7 emergency repairs. Call 877-516-8705 today!",
    // Base 138-145 (For long states 11-15 chars)
    "Fast, reliable plumbing in {$s_clean}. Home Plumbing USA connects you with licensed, local plumbers 24/7 for emergency repairs & drains. Call 877-516-8705!",
    "Looking for reliable plumbers in {$s_clean}? Home Plumbing USA connects you with licensed local experts for 24/7 emergency repairs. Call 877-516-8705!",
    "Get 24/7 plumbing services in {$s_clean}. Home Plumbing USA matches you with vetted, licensed local plumbers for fast emergency repairs. Call 877-516-8705!",
    "Need trusted plumbers in {$s_clean}? Home Plumbing USA connects you with licensed local experts for 24/7 emergency repairs & service. Call 877-516-8705!",
    "Find licensed plumbers in {$s_clean}. Home Plumbing USA connects you with vetted, local contractors for 24/7 emergency plumbing repairs. Call 877-516-8705!"
];

$char_sum = array_sum(array_map('ord', str_split($s_clean)));
$start_idx = $char_sum % count($templates);

$page_description = $templates[0];
for ($i = 0; $i < count($templates); $i++) {
    $candidate = $templates[($start_idx + $i) % count($templates)];
    $len = mb_strlen($candidate);
    if ($len >= 150 && $len <= 160) {
        $page_description = $candidate;
        break;
    }
}

// Dynamic Keywords
$page_keywords = "plumbers in {$state_name}, emergency plumbing {$state_name}, 24/7 local plumber {$state_name}, {$state_name} plumbing experts, water heater repair {$state_name}, affordable plumber {$state_name}, licensed plumbers {$state_code}";

// Canonical URL
$canonical_url = "https://homeplumbingusa.com/state/" . htmlspecialchars($state_slug);

// Schema.org
$schema_array = [
    "@context" => "https://schema.org",
    "@type" => "PlumbingService",
    "name" => "Home Plumbing USA - {$state_name}",
    "description" => "Professional plumbing and emergency repair services across {$state_name}. Licensed, vetted plumbers available 24/7.",
    "url" => $canonical_url,
    "telephone" => "877-516-8705",
    "priceRange" => "$$",
    "areaServed" => [
        "@type" => "AdministrativeArea",
        "name" => $state_name
    ],
    "provider" => [
        "@type" => "LocalBusiness",
        "name" => "Home Plumbing USA",
        "image" => "https://homeplumbingusa.com/images/logo.png"
    ]
];
$schema_json = json_encode($schema_array, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index, follow">
  <meta name="author" content="Home Plumbing USA">
  <meta name="publisher" content="Home Plumbing USA">
  <title><?php echo htmlspecialchars($page_title); ?></title>
  <meta name="description" content="<?php echo htmlspecialchars($page_description); ?>">
  <meta name="keywords" content="<?php echo htmlspecialchars($page_keywords); ?>">
  <link rel="canonical" href="<?php echo htmlspecialchars($canonical_url); ?>">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="<?php echo htmlspecialchars($canonical_url); ?>">
  <meta property="og:title" content="<?php echo htmlspecialchars($page_title); ?>">
  <meta property="og:description" content="<?php echo htmlspecialchars($page_description); ?>">
  <meta property="og:image" content="https://homeplumbingusa.com/public/images/hero-plumbing.webp">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="<?php echo htmlspecialchars($canonical_url); ?>">
  <meta name="twitter:title" content="<?php echo htmlspecialchars($page_title); ?>">
  <meta name="twitter:description" content="<?php echo htmlspecialchars($page_description); ?>">
  <meta name="twitter:image" content="https://homeplumbingusa.com/public/images/hero-plumbing.webp">

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
<?php echo $schema_json; ?>
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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" media="print" onload="this.media='all'">
  <noscript>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  </noscript>
  <link rel="stylesheet" href="/css/style.css">
  <style>
    .footer-call-btn,
    .footer-col a.footer-call-btn,
    a.footer-call-btn {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 10px !important;
        padding: 12px 26px !important;
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
        color: #ffffff !important;
        font-weight: 700 !important;
        font-size: 1rem !important;
        border-radius: 8px !important;
        text-decoration: none !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4) !important;
        margin-top: 12px !important;
        white-space: nowrap !important;
        border: none !important;
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
  <link rel="icon" type="image/png" href="/public/images/favicon.png">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2" defer></script>
</head>
<body data-prefix="/" data-depth="0">

  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NHGT9PF7"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->

  <!-- ==================== HEADER ==================== -->
  <header class="header" id="header" style="min-height: 120px;">
    <div class="top-bar" style="min-height: 40px; height: 40px; overflow: hidden; display: flex; align-items: center; justify-content: center; text-align: center; white-space: nowrap;">
      <div class="top-bar-content">
        <span class="pulse-dot"></span>
        <span>24/7 Emergency Plumbers in <span class="state-name"><?php echo htmlspecialchars($state_name); ?></span> - Same Price, Holidays Included!</span>
      </div>
    </div>
    <div class="header-inner" style="min-height: 80px; height: 80px; display: flex; align-items: center; justify-content: space-between;">
      <a href="/" class="logo" style="min-height: 52px; width: 247px; max-width: 100%; display: flex; align-items: center;">
        <img src="/public/images/logo.svg" alt="Home Plumbing USA Logo" class="logo-img" width="247" height="52" style="width: 247px; height: 52px; aspect-ratio: 247 / 52; display: block; object-fit: contain; object-position: left center;">
      </a>

      <nav class="nav" id="mainNav">
        <div class="nav-item">
          <a href="#services" class="nav-link dropdown-toggle">Services <i class="fas fa-chevron-down"></i></a>
          <div class="mega-dropdown">
            <div class="dropdown-category">
              <div class="dropdown-category-title">Emergency & Repair</div>
              <a href="/#states" class="dropdown-link"><i class="fas fa-bolt"></i> 24 Hour Emergency Plumbing</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-clock"></i> Same Day Plumbing Repair</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-pipe-section"></i> Burst Pipe Repair</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-house-chimney"></i> Whole House Repiping</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-clipboard-check"></i> Plumbing Maintenance</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-building"></i> Commercial Plumbing</a>
            </div>
            <div class="dropdown-category">
              <div class="dropdown-category-title">Water Heater & Drains</div>
              <a href="/#states" class="dropdown-link"><i class="fas fa-temperature-high"></i> Water Heater Repair</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-fire"></i> Water Heater Installation</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-fire-flame-simple"></i> Tankless Water Heater</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-broom"></i> Drain Cleaning</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-plug-circle-xmark"></i> Clogged Drain Repair</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-water"></i> Hydro Jetting</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-screwdriver-wrench"></i> Sewer Line Repair</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-arrows-rotate"></i> Sewer Line Replacement</a>
            </div>
            <div class="dropdown-category">
              <div class="dropdown-category-title">Leak & Pipe Services</div>
              <a href="/#states" class="dropdown-link"><i class="fas fa-magnifying-glass"></i> Leak Detection</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-layer-group"></i> Slab Leak Repair</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-droplet"></i> Pipe Leak Repair</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-fire-burner"></i> Gas Line Installation</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-triangle-exclamation"></i> Gas Leak Detection</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-wrench"></i> Gas Line Repair</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-faucet-drip"></i> Water Line Repair</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-faucet"></i> Water Line Installation</a>
            </div>
            <div class="dropdown-category">
              <div class="dropdown-category-title">Fixtures & Specialty</div>
              <a href="/#states" class="dropdown-link"><i class="fas fa-toilet"></i> Toilet Repair & Installation</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-sink"></i> Faucet & Sink Repair</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-recycle"></i> Garbage Disposal Repair</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-kitchen-set"></i> Kitchen Plumbing</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-bath"></i> Bathroom Plumbing</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-arrows-left-right"></i> Backflow Testing</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-pump-soap"></i> Sump Pump Install & Repair</a>
              <a href="/#states" class="dropdown-link"><i class="fas fa-gauge-high"></i> Water Pressure Repair</a>
            </div>
          </div>
        </div>
        <a href="#cities" class="nav-link">Areas We Serve</a>
        <a href="#workflow" class="nav-link">Our Process</a>
        <a href="#why-us" class="nav-link">Why Choose Us</a>
      </nav>

      <div class="header-cta">
        <a href="tel:877-516-8705" class="header-phone"><i class="fas fa-phone"></i> Call Now</a>
        <a href="/contact" class="btn btn-primary btn-sm">Get a Quote</a>
      </div>

      <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <main>
    <!-- ==================== HERO SECTION ==================== -->
    <section class="hero">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-content">
            <div class="hero-badge"><i class="fas fa-star"></i> Trusted Plumbing Experts Statewide</div>
            <h1>Professional <span>Plumbing Services</span> in <span class="state-name"><?php echo htmlspecialchars($state_name); ?></span></h1>
            <p class="hero-text">Connecting home and business owners in <span class="state-name"><?php echo htmlspecialchars($state_name); ?></span> with vetted, independent local plumbing experts in real-time. Fast, reliable service matches 24/7.</p>
            <div class="hero-buttons">
              <a href="tel:877-516-8705" class="btn btn-accent btn-lg"><i class="fas fa-phone"></i> Speak to an Expert</a>
              <a href="#cities" class="btn btn-outline btn-lg"><i class="fas fa-map-location-dot"></i> Find Your City</a>
            </div>
            <div class="hero-stats">
              <div class="hero-stat">
                <div class="hero-stat-number">24<span>/7</span></div>
                <div class="hero-stat-label">Emergency Service</div>
              </div>
              <div class="hero-stat">
                <div class="hero-stat-number">100<span>%</span></div>
                <div class="hero-stat-label">Licensed & Insured</div>
              </div>
              <div class="hero-stat">
                <div class="hero-stat-number">Statewide</div>
                <div class="hero-stat-label">Coverage</div>
              </div>
              <div class="hero-stat">
                <div class="hero-stat-number">$0</div>
                <div class="hero-stat-label">Upfront Estimates</div>
              </div>
            </div>
          </div>
          <div class="hero-image-wrapper" style="position: relative; width: 100%; min-height: 350px; display: flex; justify-content: center;">
            <div class="hero-image-container" style="position: relative; width: 100%; max-width: 420px; aspect-ratio: 4 / 5; min-height: 350px; display: block; background: #0f1e3a; contain: layout style;">
              <img src="/public/images/hero-plumbing.webp" srcset="/public/images/hero-plumbing-mobile.webp 480w, /public/images/hero-plumbing.webp 1200w" sizes="(max-width: 600px) 480px, 1200px" alt="Professional Plumbing Services" class="hero-image" width="600" height="750" loading="eager" fetchpriority="high" style="width: 100%; height: 100%; aspect-ratio: 4 / 5; object-fit: cover; display: block;">
              <div class="hero-floating-badge badge-satisfaction">
                <i class="fas fa-shield-halved"></i>
                <div>
                  <h4>100% Satisfaction</h4>
                  <p>Guaranteed Quality</p>
                </div>
              </div>
              <div class="hero-floating-badge badge-emergency">
                <i class="fas fa-bolt"></i>
                <div>
                  <h4>24/7 Emergency</h4>
                  <p>Fast Dispatch</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== TRUST SECTION ==================== -->
    <section class="trust-section" id="why-us">
      <div class="container">
        <div class="trust-grid">
          <div class="trust-card animate-on-scroll">
            <div class="trust-icon"><i class="fas fa-award"></i></div>
            <p class="trust-title">20+ Years Experience</p>
            <p>Proven track record of excellence in plumbing</p>
          </div>
          <div class="trust-card animate-on-scroll">
            <div class="trust-icon"><i class="fas fa-id-badge"></i></div>
            <p class="trust-title">Licensed &amp; Insured</p>
            <p>Fully licensed, bonded, and insured plumbers</p>
          </div>
          <div class="trust-card animate-on-scroll">
            <div class="trust-icon"><i class="fas fa-shield-halved"></i></div>
            <p class="trust-title">Safety Standards</p>
            <p>Strict adherence to all plumbing safety codes</p>
          </div>
          <div class="trust-card animate-on-scroll">
            <div class="trust-icon"><i class="fas fa-medal"></i></div>
            <p class="trust-title">Quality Work</p>
            <p>Premium materials and expert craftsmanship</p>
          </div>
          <div class="trust-card animate-on-scroll">
            <div class="trust-icon"><i class="fas fa-thumbs-up"></i></div>
            <p class="trust-title">100% Satisfaction</p>
            <p>Your satisfaction is always guaranteed</p>
          </div>
          <div class="trust-card animate-on-scroll">
            <div class="trust-icon"><i class="fas fa-truck-fast"></i></div>
            <p class="trust-title">24/7 Emergency</p>
            <p>Round-the-clock emergency plumbing service</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== OUR PROCESS ==================== -->
    <section class="section" id="workflow">
      <div class="container">
        <div class="section-header animate-on-scroll">
          <div class="section-label">How We Work</div>
          <h2 class="section-title">Our <span>Process</span></h2>
          <p class="section-desc">We follow a streamlined, transparent process to ensure every plumbing job is completed efficiently, safely, and to the highest standards.</p>
        </div>
        <div class="process-grid">
          <div class="process-card animate-on-scroll">
            <div class="process-number">01</div>
            <p class="process-title">Initial Consultation</p>
            <p>Contact us to discuss your plumbing needs. We listen carefully to understand your issue, answer questions, and provide expert guidance on the best solution.</p>
          </div>
          <div class="process-card animate-on-scroll">
            <div class="process-number">02</div>
            <p class="process-title">On-Site Inspection</p>
            <p>Our licensed plumber arrives on time to conduct a thorough evaluation of the problem, inspecting pipes, fixtures, and systems to determine the root cause.</p>
          </div>
          <div class="process-card animate-on-scroll">
            <div class="process-number">03</div>
            <p class="process-title">Upfront Estimate</p>
            <p>Before any work begins, you receive a clear, detailed estimate with no hidden fees. We explain the scope of work, materials needed, and timeline.</p>
          </div>
          <div class="process-card animate-on-scroll">
            <div class="process-number">04</div>
            <p class="process-title">Professional Repair</p>
            <p>Our skilled plumbers execute the work with precision, using quality materials and following all building codes and safety standards for a lasting repair.</p>
          </div>
          <div class="process-card animate-on-scroll">
            <div class="process-number">05</div>
            <p class="process-title">Quality Inspection</p>
            <p>Every job undergoes a thorough quality check. We test all repairs, verify proper water flow, check for leaks, and ensure everything meets our high standards.</p>
          </div>
          <div class="process-card animate-on-scroll">
            <div class="process-number">06</div>
            <p class="process-title">Final Walkthrough</p>
            <p>We walk you through the completed work, explain what was done, provide maintenance tips, and ensure your complete satisfaction before the job is closed.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== SERVICES SECTION ==================== -->
    <section class="section" id="services" style="background: var(--bg-surface);">
      <div class="container">
        <div class="section-header animate-on-scroll">
          <div class="section-label">Capabilities</div>
          <h2 class="section-title">Our Professional <span>Plumbing Services</span></h2>
          <p class="section-desc">From routine repairs to complex installations, we provide a complete range of plumbing capabilities across <?php echo htmlspecialchars($state_name); ?>.</p>
        </div>
        <div class="services-grid">
          <div class="service-card animate-on-scroll">
            <div class="service-icon"><i class="fas fa-bolt"></i></div>
            <p class="service-title">24 Hour Emergency Plumbing</p>
            <p>Round-the-clock emergency plumbing repair for burst pipes, major leaks, sewer backups, and other urgent plumbing issues.</p>
          </div>
          <div class="service-card animate-on-scroll">
            <div class="service-icon"><i class="fas fa-clock"></i></div>
            <p class="service-title">Same Day Plumbing Repair</p>
            <p>Fast, same-day plumbing repairs for common issues like dripping faucets, running toilets, and minor leaks.</p>
          </div>
          <div class="service-card animate-on-scroll">
            <div class="service-icon"><i class="fas fa-temperature-high"></i></div>
            <p class="service-title">Water Heater Repair</p>
            <p>Expert diagnosis and repair for all types of water heaters including tank, tankless, electric, and gas models.</p>
          </div>
          <div class="service-card animate-on-scroll">
            <div class="service-icon"><i class="fas fa-fire"></i></div>
            <p class="service-title">Water Heater Installation</p>
            <p>Professional installation of new water heaters with proper sizing, code compliance, and manufacturer warranty support.</p>
          </div>
          <div class="service-card animate-on-scroll">
            <div class="service-icon"><i class="fas fa-broom"></i></div>
            <p class="service-title">Drain Cleaning Service</p>
            <p>Thorough drain cleaning to remove buildup, grease, and debris. Restoring full flow to drains throughout your home.</p>
          </div>
          <div class="service-card animate-on-scroll">
            <div class="service-icon"><i class="fas fa-screwdriver-wrench"></i></div>
            <p class="service-title">Sewer Line Repair</p>
            <p>Professional sewer line repair using traditional and trenchless methods. Fixing cracks, bellied pipes, and root intrusion.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== CITIES & ZIPS LIST ==================== -->
    <section class="section" id="cities">
      <div class="container">
        <div class="section-header animate-on-scroll">
          <div class="section-label">Service Directory</div>
          <h2 class="section-title">Select Your <span>City or Zip Code in <?php echo htmlspecialchars($state_name); ?></span></h2>
          <p class="section-desc">We dispatch plumbers to communities throughout <?php echo htmlspecialchars($state_name); ?>. Select your city below to view available service options.</p>
        </div>
        <div class="areas-grid" id="areas-grid">
          <!-- Populated dynamically via JS / Supabase -->
        </div>
      </div>
    </section>

    <!-- ==================== EMERGENCY CTA SECTION ==================== -->
    <section class="cta-section section" id="emergency">
      <div class="container">
        <div class="cta-content">
          <h2>Need Emergency Plumbing in <?php echo htmlspecialchars($state_name); ?> Fast?</h2>
          <div class="cta-phone"><i class="fas fa-phone"></i> <a href="tel:877-516-8705">877-516-8705</a></div>
          <p>We are available 24/7 for burst pipes, major leaks, clogged sewers, and no hot water calls. Average arrival time is 45 minutes.</p>
          <div class="cta-buttons">
            <a href="tel:877-516-8705" class="btn btn-accent btn-lg"><i class="fas fa-phone"></i> Call 24/7</a>
            <a href="/contact" class="btn btn-outline btn-lg" style="border-color: rgba(255,255,255,0.3);"><i class="fas fa-file-lines"></i> Get a Free Quote</a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- ==================== FOOTER ==================== -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-about">
          <a href="/" class="logo footer-logo">
            <img src="/public/images/logo.svg" alt="Home Plumbing USA Logo" class="logo-img" width="247" height="52" loading="lazy">
          </a>
          <h3 class="footer-title footer-brand-heading">Find Top-Rated Local Plumbing Experts in <span class="state-name"><?php echo htmlspecialchars($state_name); ?></span></h3>
          <p class="footer-brand-subheading">We connect homeowners in <span class="state-name"><?php echo htmlspecialchars($state_name); ?></span> with vetted, background-checked, and licensed local plumbing contractors for fast &amp; reliable service.</p>
        </div>
        <div class="footer-col">
          <div class="footer-title">Quick Links</div>
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/#states">Service Areas</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact Us</a>
        </div>
        <div class="footer-col">
          <div class="footer-title">Top Services</div>
          <a href="/#states">Emergency Plumbing</a>
          <a href="/#states">Water Heater Repair</a>
          <a href="/#states">Drain Cleaning</a>
          <a href="/#states">Leak Detection</a>
        </div>
        <div class="footer-col">
          <div class="footer-title">Need Help Now?</div>
          <p>Speak directly with an active dispatch supervisor 24/7.</p>
          <a href="tel:877-516-8705" class="footer-call-btn"><i class="fas fa-phone"></i> Call 24/7</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 Home Plumbing USA. All rights reserved. Nationwide Plumbing Referral Network</p>
        <div class="footer-links flex justify-center space-x-4 mt-2 text-xs">
          <a href="/privacy-policy" class="hover:text-white transition-colors" style="font-size: 12px;">Privacy Policy</a>
          <span class="text-white/20">&middot;</span>
          <a href="/terms-and-conditions" class="hover:text-white transition-colors" style="font-size: 12px;">Terms &amp; Conditions</a>
          <span class="text-white/20">&middot;</span>
          <a href="/disclaimer" class="hover:text-white transition-colors" style="font-size: 12px;">Disclaimer</a>
        </div>
        <p class="footer-legal-disclaimer" style="color: #6b7280; font-size: 11.5px; margin-top: 8px; text-align: center;">
          <strong>Disclaimer:</strong> Home Plumbing USA is a free referral service matching homeowners with independent local contractors. We do not directly provide plumbing services. <a href="/disclaimer" style="color: #3b82f6;">Read Full Disclaimer</a>
        </p>
      </div>
    </div>
  </footer>

  <script src="/js/zipData.js" defer></script>
  <script src="/js/main.js" defer></script>

  <!-- Mobile Sticky Action Bar -->
  <div class="mobile-sticky-bar">
    <a href="tel:877-516-8705" class="sticky-btn call-btn" data-track="phone" data-location="sticky-bar">
      <i class="fas fa-phone-alt"></i> Call Now
    </a>
    <a href="/contact" class="sticky-btn quote-btn">
      <i class="fas fa-paper-plane"></i> Get a Quote
    </a>
  </div>
</body>
</html>
