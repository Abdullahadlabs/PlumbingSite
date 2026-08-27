/* ================================================
   Home Plumbing USA — Client Interactive Logic
   Navigation, Map Routing, Tabs, Counters, FAQ Accordion,
   Dynamic text replacement, and History Restrictions.
   ================================================ */

// Helper to determine the path prefix relative to the site root,
// based on data-prefix, script path, or URL pathname depth.
function getAssetPrefix() {
  const bodyPrefix = document.body ? document.body.getAttribute('data-prefix') : null;
  if (bodyPrefix && bodyPrefix !== '/' && bodyPrefix !== './') {
    return bodyPrefix;
  }
  
  const scriptEl = document.querySelector('script[src*="js/main.js"]');
  if (scriptEl) {
    const src = scriptEl.getAttribute('src');
    const parts = src.split('js/main.js');
    if (parts.length > 0 && parts[0]) {
      return parts[0];
    }
  }

  const pathParts = window.location.pathname.split('/').filter(p => p.length > 0);
  if (pathParts.includes('service-areas') || pathParts.includes('city')) {
    if (pathParts.length >= 3) return '../../';
    if (pathParts.length === 2) return '../';
  }
  if (pathParts.includes('state') || pathParts.includes('services')) {
    if (pathParts.length >= 2) return '../';
  }
  
  return './';
}

// Helper function to resolve absolute asset paths with leading slash /
function resolveAssetPath(originalPath) {
  if (!originalPath) return '';
  if (originalPath.startsWith('http://') || originalPath.startsWith('https://') || originalPath.startsWith('data:')) {
    return originalPath;
  }
  
  // Handle srcset format if it contains multiple entries or descriptors
  if (originalPath.includes(',') || (originalPath.includes(' ') && originalPath.includes('w'))) {
    const entries = originalPath.split(',');
    if (entries.length > 1 || (entries[0] && entries[0].trim().split(/\s+/).length > 1)) {
      return entries.map(entry => {
        const parts = entry.trim().split(/\s+/);
        if (parts[0]) {
          parts[0] = resolveAssetPath(parts[0]);
        }
        return parts.join(' ');
      }).join(', ');
    }
  }
  
  let cleanPath = originalPath.trim();
  cleanPath = cleanPath.replace(/^(\.\.\/)+/, ''); // strip leading ../
  cleanPath = cleanPath.replace(/^\.\//, '');       // strip leading ./
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);           // strip leading /
  }
  
  // Ensure image paths route to public/images/
  if (cleanPath.startsWith('images/')) {
    cleanPath = 'public/' + cleanPath;
  }
  
  return '/' + cleanPath;
}

// Expose globally for inline scripts
window.resolveAssetPath = resolveAssetPath;

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
window.slugify = slugify;

function initMain() {
  // Automatically correct static image sources and srcsets only when needed
  document.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('data:') && !src.startsWith('/public/') && !src.startsWith('/images/')) {
      const resolved = resolveAssetPath(src);
      if (resolved !== src) img.src = resolved;
    }
    const srcset = img.getAttribute('srcset');
    if (srcset && !srcset.includes('/public/') && !srcset.includes('/images/')) {
      const resolvedSet = resolveAssetPath(srcset);
      if (resolvedSet !== srcset) img.setAttribute('srcset', resolvedSet);
    }
  });

  const prefix = document.body.getAttribute('data-prefix') || './';

  // Helper to map state name to 2-letter code
  function getStateCode(stateName) {
    if (!stateName) return '';
    const s = stateName.toLowerCase().trim();
    const map = {
      'alaska': 'AK', 'ak': 'AK',
      'texas': 'TX', 'tx': 'TX',
      'florida': 'FL', 'fl': 'FL'
    };
    return map[s] || stateName.toUpperCase();
  }

  // Helper to map state name or code to clean state slug
  function getStateSlug(stateNameOrCode) {
    if (!stateNameOrCode) return '';
    const s = slugify(stateNameOrCode);
    const map = {
      'ak': 'alaska', 'alaska': 'alaska',
      'tx': 'texas', 'texas': 'texas',
      'fl': 'florida', 'florida': 'florida'
    };
    return map[s] || s;
  }
  window.getStateSlug = getStateSlug;

  // Helper to map any service alias to canonical physical static service slug
  function getCanonicalServiceSlug(serviceSlug) {
    if (!serviceSlug) return 'drain-cleaning';
    const clean = slugify(serviceSlug);
    const map = {
      'drain-cleaning': 'drain-cleaning',
      'clogged-drain-repair': 'drain-cleaning',
      'drain-cleaning-service': 'drain-cleaning',
      'hydro-jetting': 'drain-cleaning',
      'hydro-jetting-service': 'drain-cleaning',
      'drain-repair': 'drain-cleaning',
      'rooter-services': 'drain-cleaning',
      'drainage-system-installation': 'drain-cleaning',
      'sewer-cleaning': 'drain-cleaning',

      'burst-pipe-repair': 'burst-pipe-repair',
      'pipe-repair': 'burst-pipe-repair',
      'pipe-leak-repair': 'burst-pipe-repair',
      'whole-house-repiping': 'burst-pipe-repair',
      'pipe-relining': 'burst-pipe-repair',
      'pipe-replacement': 'burst-pipe-repair',
      'pipe-insulation': 'burst-pipe-repair',
      'plumbing-pipe-corrosion-prevention': 'burst-pipe-repair',
      'plumbing-system-re-piping': 'burst-pipe-repair',

      'water-heater-repair': 'water-heater-repair',
      'water-heater-installation': 'water-heater-repair',
      'tankless-water-heater-installation': 'water-heater-repair',
      'tankless-water-heater-repair': 'water-heater-repair',

      'sewer-line-repair': 'sewer-line-repair',
      'sewer-line-replacement': 'sewer-line-repair',
      'drain-line-replacement': 'sewer-line-repair',
      'septic-system-installation': 'sewer-line-repair',
      'septic-tank-repair': 'sewer-line-repair',

      'emergency-plumbing': 'emergency-plumbing',
      '24-hour-emergency-plumbing': 'emergency-plumbing',
      'same-day-plumbing-repair': 'emergency-plumbing',

      'leak-detection': 'leak-detection',
      'slab-leak-repair': 'leak-detection',
      'plumbing-leak-detection': 'leak-detection',

      'gas-line-repair': 'gas-line-repair',
      'gas-line-installation': 'gas-line-repair',
      'gas-leak-detection': 'gas-line-repair',

      'water-line-repair': 'water-line-repair',
      'water-line-installation': 'water-line-repair',
      'water-line-trenching': 'water-line-repair'
    };
    return map[clean] || clean;
  }
  window.getCanonicalServiceSlug = getCanonicalServiceSlug;

  // Immediate Client-Side Redirection: kill any legacy query strings and route strictly to physical static structure
  (function enforceStaticRouting() {
    const search = window.location.search;
    if (!search) return;
    const params = new URLSearchParams(search);
    if (params.has('city') || params.has('zip') || params.has('state')) {
      const qCity = params.get('city');
      const qState = params.get('state');
      const qZip = params.get('zip') ? params.get('zip').replace(/[^0-9]/g, '') : '';
      const qService = params.get('service');

      const stateSlug = getStateSlug(qState || 'alaska');
      const citySlug = slugify(qCity || '');

      let serviceSlug = '';
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      if (pathParts[0] === 'services' && pathParts[1]) {
        serviceSlug = getCanonicalServiceSlug(pathParts[1]);
      } else if (qService) {
        serviceSlug = getCanonicalServiceSlug(qService);
      }

      if (stateSlug && citySlug && qZip) {
        let cleanStaticPath = `/${stateSlug}/${citySlug}-${qZip}/`;
        if (serviceSlug) {
          cleanStaticPath += `${serviceSlug}/`;
        }
        window.location.replace(cleanStaticPath);
        return;
      } else if (stateSlug) {
        window.location.replace(`/state/${stateSlug}`);
        return;
      }
    }
  })();

  // Helper to extract location parameters from physical pathname or stored location
  function getCurrentLocationParams() {
    let city = '';
    let zip = '';
    let state = '';
    let service = '';

    const pathParts = window.location.pathname.split('/').filter(p => p.length > 0);

    // 1. Parse physical static hub/service: /{state}/{city}-{zip}/ or /{state}/{city}-{zip}/{service}/
    const knownStates = ['alaska', 'texas', 'florida'];
    if (pathParts.length >= 2 && knownStates.includes(pathParts[0].toLowerCase())) {
      state = pathParts[0].toLowerCase();
      const cityZipPart = pathParts[1];
      const match = cityZipPart.match(/^(.*?)-(\d{5})$/);
      if (match) {
        city = match[1].replace(/-/g, ' ');
        zip = match[2];
        if (pathParts.length >= 3) {
          service = getCanonicalServiceSlug(pathParts[2]);
        }
      }
    }

    // 2. Parse /state/{state}
    if (!state) {
      const stateIdx = pathParts.indexOf('state');
      if (stateIdx !== -1 && stateIdx + 1 < pathParts.length) {
        state = getStateSlug(pathParts[stateIdx + 1]);
      }
    }

    // 3. Parse legacy /city/{state}/{city}/{zip}
    if (!city || !state) {
      const cityIdx = pathParts.indexOf('city');
      if (cityIdx !== -1 && cityIdx + 3 < pathParts.length) {
        if (!state) state = getStateSlug(pathParts[cityIdx + 1]);
        if (!city) city = pathParts[cityIdx + 2].replace(/-/g, ' ');
        if (!zip) zip = pathParts[cityIdx + 3];
      }
    }

    // 4. Parse legacy /service-areas/{state}-{city}-{zip}
    if (!city || !state) {
      const serviceAreasIdx = pathParts.indexOf('service-areas');
      if (serviceAreasIdx !== -1 && serviceAreasIdx + 1 < pathParts.length) {
        const folder = pathParts[serviceAreasIdx + 1];
        if (folder) {
          const parts = folder.split('-');
          if (parts.length >= 3) {
            const stateCode = parts[0].toLowerCase();
            state = getStateSlug(stateCode);
            zip = parts[parts.length - 1];
            city = parts.slice(1, -1).join(' ');
          }
        }
      }
    }

    const hasParsedLocation = !!(city || state);

    if (hasParsedLocation) {
      try {
        let capCity = '';
        if (city) {
          capCity = decodeURIComponent(city)
            .split(/[- ]+/)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');
        }
        let capState = '';
        if (state) {
          capState = decodeURIComponent(state)
            .split(/[- ]+/)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');
        }
        const displayZip = zip ? decodeURIComponent(zip) : '';

        // Save user active location immediately to localStorage
        localStorage.setItem('user_active_location', JSON.stringify({ city: capCity, state: capState, zip: displayZip }));

        city = capCity;
        state = capState;
        zip = displayZip;
      } catch (e) {
        console.error('Error saving user_active_location:', e);
      }
    } else {
      // Check if we are on global main pages (e.g. /, /index.html, /about, /services, /projects, /contact)
      const pathname = window.location.pathname.toLowerCase();
      const isGlobalPage = (
        pathname === '/' ||
        pathname.endsWith('/index.html') ||
        pathname.endsWith('/about.html') ||
        pathname.endsWith('/about') ||
        pathname.endsWith('/services.html') ||
        pathname.endsWith('/services') ||
        pathname.endsWith('/projects.html') ||
        pathname.endsWith('/projects') ||
        pathname.endsWith('/contact.html') ||
        pathname.endsWith('/contact') ||
        pathname.endsWith('/privacy-policy.html') ||
        pathname.endsWith('/terms-and-conditions.html') ||
        pathname.endsWith('/disclaimer.html')
      );

      // Only check cached localStorage if we are NOT on a global static page
      if (!isGlobalPage) {
        try {
          const cached = localStorage.getItem('user_active_location');
          if (cached) {
            const locObj = JSON.parse(cached);
            if (locObj) {
              city = locObj.city || '';
              state = locObj.state || '';
              zip = locObj.zip || '';
            }
          }
        } catch (e) {
          console.error('Error reading user_active_location:', e);
        }
      }
    }

    return { city: city || '', zip: zip || '', state: state || '', service: service || '' };
  }

  // Dynamically rewrite all service links to clean physical static paths (NO query parameters)
  const currentLoc = getCurrentLocationParams();
  if (currentLoc.city && currentLoc.state && currentLoc.zip) {
    const stateSlug = getStateSlug(currentLoc.state);
    const citySlug = slugify(currentLoc.city);
    const zipCode = currentLoc.zip;

    document.querySelectorAll('a').forEach(anchor => {
      const href = anchor.getAttribute('href');
      if (href && (href.startsWith('/services/') || href.includes('service-detail') || href.startsWith('/city/'))) {
        let rawService = '';
        if (href.startsWith('/services/')) {
          rawService = href.replace('/services/', '').split(/[?#]/)[0].replace(/\/+$/, '');
        } else if (href.includes('service-detail')) {
          const u = new URL(anchor.href, window.location.origin);
          rawService = u.searchParams.get('service') || '';
        }
        
        if (rawService) {
          const canonicalService = getCanonicalServiceSlug(rawService);
          anchor.href = `/${stateSlug}/${citySlug}-${zipCode}/${canonicalService}/`;
        } else if (href.startsWith('/city/')) {
          anchor.href = `/${stateSlug}/${citySlug}-${zipCode}/`;
        }
      }
    });
  }

  // Update top announcement bar dynamically if location parameters exist or fallback
  const topBarContent = document.querySelector('.top-bar-content') || document.querySelector('.top-bar');
  if (topBarContent) {
    const textSpan = topBarContent.querySelector('span:not(.pulse-dot)') || Array.from(topBarContent.querySelectorAll('span')).pop();
    if (textSpan) {
      if (currentLoc.city && currentLoc.state) {
        const stateCode = getStateCode(currentLoc.state);
        textSpan.textContent = `24/7 Emergency Plumbers in ${currentLoc.city}, ${stateCode} - Same Price, Holidays Included!`;
      } else if (currentLoc.city) {
        textSpan.textContent = `24/7 Emergency Plumbers in ${currentLoc.city} - Same Price, Holidays Included!`;
      } else if (currentLoc.state) {
        const stateName = currentLoc.state.charAt(0).toUpperCase() + currentLoc.state.slice(1);
        textSpan.textContent = `24/7 Emergency Plumbers in ${stateName} - Same Price, Holidays Included!`;
      } else {
        textSpan.textContent = `24/7 Emergency Plumbers - Same Price, Holidays Included!`;
      }
    }
  }

  // Update footer brand heading and subheading dynamically if location parameters exist
  const footerBrandHeading = document.querySelector('.footer-about .footer-brand-heading') || document.querySelector('.footer-about .footer-title') || document.querySelector('.footer-about h3') || document.querySelector('.footer-about h4');
  const footerBrandSubheading = document.querySelector('.footer-about .footer-brand-subheading') || document.querySelector('.footer-about p');
  if (footerBrandHeading && footerBrandSubheading) {
    if (currentLoc.city && currentLoc.state) {
      const stateCode = getStateCode(currentLoc.state);
      footerBrandHeading.innerHTML = `Find Top-Rated Local Plumbing Experts in ${currentLoc.city}, ${stateCode}`;
      footerBrandSubheading.textContent = `We connect homeowners in ${currentLoc.city}, ${stateCode} with vetted, background-checked, and licensed local plumbing contractors for fast & reliable service.`;
    } else if (currentLoc.city) {
      footerBrandHeading.innerHTML = `Find Top-Rated Local Plumbing Experts in ${currentLoc.city}`;
      footerBrandSubheading.textContent = `We connect homeowners in ${currentLoc.city} with vetted, background-checked, and licensed local plumbing contractors for fast & reliable service.`;
    } else if (currentLoc.state) {
      const stateName = currentLoc.state.charAt(0).toUpperCase() + currentLoc.state.slice(1);
      footerBrandHeading.innerHTML = `Find Top-Rated Local Plumbing Experts in ${stateName}`;
      footerBrandSubheading.textContent = `We connect homeowners in ${stateName} with vetted, background-checked, and licensed local plumbing contractors for fast & reliable service.`;
    } else {
      footerBrandHeading.textContent = `Find Top-Rated Local Plumbing Experts Nationwide`;
      footerBrandSubheading.textContent = `We connect homeowners nationwide with vetted, background-checked, and licensed local plumbing contractors for fast & reliable service.`;
    }
  }

  // Update Hero Section Subtitle dynamically only when location parameters are present in URL
  if (currentLoc.city || currentLoc.state || currentLoc.zip) {
    document.querySelectorAll('.hero-text').forEach(heroEl => {
      let city = currentLoc.city;
      let state = currentLoc.state;

      if (!city && currentLoc.zip) {
        if (typeof zipCodeData !== 'undefined' && zipCodeData[currentLoc.zip] && zipCodeData[currentLoc.zip][0]) {
          city = zipCodeData[currentLoc.zip][0].split(',')[0].trim();
        }
      }

      if (city) {
        const displayCity = city;
        const displayState = state ? getStateCode(state) : '';
        const stateStr = displayState ? `, ${displayState}` : '';
        const newText = `Connecting home and business owners in ${displayCity}${stateStr} & Surrounding Areas with vetted, independent local plumbing experts in real-time.`;
        if (heroEl.textContent !== newText) {
          heroEl.textContent = newText;
        }
      }
    });
  }

  // Update Final CTA Section Subtitle dynamically only when custom location exists
  if (currentLoc.city && currentLoc.state) {
    document.querySelectorAll('.final-cta-section p, .cta-section p').forEach(ctaEl => {
      if (ctaEl.textContent.includes('active in') || ctaEl.textContent.includes('Get connected with')) {
        const stateCode = getStateCode(currentLoc.state);
        const zipStr = currentLoc.zip ? ` ${currentLoc.zip}` : '';
        const activeService = (typeof serviceName !== 'undefined' && serviceName) ? serviceName : 'plumbing';
        ctaEl.textContent = `Technicians are active in ${currentLoc.city}, ${stateCode}${zipStr} and nearby regions for ${activeService.toLowerCase()} repairs and installations. Call for immediate dispatch.`;
      }
    });
  }

  // Standardize Footer call CTA button classes without forcing innerHTML re-renders
  document.querySelectorAll('.footer-col a[href^="tel:"], .footer-about a[href^="tel:"], .footer-dispatch-btn').forEach(el => {
    if (!el.classList.contains('footer-call-btn')) {
      el.classList.add('footer-call-btn');
    }
  });

  const getNormalizedPage = (path) => {
    const parts = path.split('/').filter(Boolean);
    const knownStates = ['alaska', 'texas', 'florida'];
    if (parts.length >= 1 && knownStates.includes(parts[0].toLowerCase())) {
      if (parts.length >= 3) return 'service-detail';
      if (parts.length >= 2) return 'city-zip';
    }
    if (parts.includes('city')) {
      return 'city-zip';
    }
    if (parts.includes('state') && parts.indexOf('state') + 1 < parts.length && parts[parts.indexOf('state') + 1] !== '') {
      return 'state';
    }
    if (parts.includes('services') && parts.indexOf('services') + 1 < parts.length && parts[parts.indexOf('services') + 1] !== '') {
      return 'service-detail';
    }
    let page = parts.pop() || '';
    page = page.split('#')[0].split('?')[0];
    if (page.endsWith('.html')) {
      page = page.substring(0, page.length - 5);
    }
    if (page === 'index' || page === '') {
      page = 'home';
    }
    return page;
  };

  const currentPage = getNormalizedPage(window.location.pathname);

  // ==================== LOCAL HOME MENU LINK DYNAMIC UPDATE ====================
  const homeMenuEl = document.getElementById('homeMenuLink');
  if (homeMenuEl) {
    const loc = getCurrentLocationParams();
    if (loc.city && loc.state && loc.zip) {
      homeMenuEl.href = `/${getStateSlug(loc.state)}/${slugify(loc.city)}-${loc.zip}/`;
    } else if (loc.state) {
      homeMenuEl.href = `/state/${getStateSlug(loc.state)}`;
    } else {
      homeMenuEl.href = '/';
    }
  }

  // ==================== HEADER SCROLL ====================
  const header = document.getElementById('header') || document.querySelector('.header');
  
  // Cache header height to avoid forced reflow on every scroll tick
  let cachedHeaderHeight = header ? header.offsetHeight : 80;
  
  // Update cached height only when header size actually changes (e.g. mobile menu open)
  if (header && typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(function(entries) {
      for (const entry of entries) {
        cachedHeaderHeight = Math.round(entry.contentRect.height);
      }
    }).observe(header);
  }
  
  function handleScroll() {
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ==================== MOBILE MENU ====================
  const mobileToggle = document.getElementById('mobileToggle') || document.querySelector('.mobile-toggle');
  const nav = document.getElementById('mainNav') || document.querySelector('.nav');
  
  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', function () {
      this.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Close mobile menu on destination link click (exclude dropdown toggles)
  document.querySelectorAll('.nav .dropdown-link, .nav .nav-link:not(.dropdown-toggle)').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768 && nav && mobileToggle) {
        nav.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // ==================== MOBILE DROPDOWN ====================
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  
  dropdownToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        const dropdown = this.nextElementSibling || this.parentElement.querySelector('.mega-dropdown');
        if (dropdown && dropdown.classList.contains('mega-dropdown')) {
          dropdown.classList.toggle('mobile-open');
        }
      }
    });
  });

  // ==================== PHONE CLICK TRACKING ====================
  document.querySelectorAll('[data-track="phone"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const location = e.currentTarget.getAttribute('data-location') || 'general';
      const number = e.currentTarget.getAttribute('href') || 'tel:877-516-8705';
      
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'phone_click',
        click_location: location,
        phone_number: number.replace('tel:', '')
      });
      console.log(`GTM Event Pushed: phone_click at ${location} for ${number}`);
    });
  });

  // ==================== FUZZY SEARCH STATE CARDS ====================
  const stateSearchInput = document.getElementById('state-search');
  const stateCards = Array.from(document.querySelectorAll('.state-card'));

  if (stateSearchInput && stateCards.length > 0) {
    stateSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      stateCards.forEach(card => {
        const name = card.getAttribute('data-name').toLowerCase();
        if (name.includes(query)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // ==================== SUB-SERVICES TABS & SEARCH FILTER ====================
  const serviceTabButtons = document.querySelectorAll('.service-tab-btn');
  const serviceSearchInput = document.getElementById('service-search');
  const serviceCards = Array.from(document.querySelectorAll('.service-card'));
  let activeCategory = 'all';
  let serviceSearchQuery = '';

  function filterServices() {
    serviceCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardName = card.getAttribute('data-name') ? card.getAttribute('data-name').toLowerCase() : '';
      const cardDesc = card.getAttribute('data-description') ? card.getAttribute('data-description').toLowerCase() : '';

      const matchesTab = (activeCategory === 'all' || cardCategory === activeCategory);
      const matchesSearch = (!serviceSearchQuery || cardName.includes(serviceSearchQuery) || cardDesc.includes(serviceSearchQuery));

      if (matchesTab && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  serviceTabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      serviceTabButtons.forEach(b => {
        b.classList.remove('bg-blue', 'text-white');
        b.classList.add('bg-white', 'text-gray-700', 'border-gray-200');
      });

      e.currentTarget.classList.add('bg-blue', 'text-white');
      e.currentTarget.classList.remove('bg-white', 'text-gray-700', 'border-gray-200');

      activeCategory = e.currentTarget.getAttribute('data-filter');
      filterServices();
    });
  });

  if (serviceSearchInput) {
    serviceSearchInput.addEventListener('input', (e) => {
      serviceSearchQuery = e.target.value.toLowerCase().trim();
      filterServices();
    });
  }

  // ==================== INTERACTIVE SVG MAP ====================
  const mapSvg = document.querySelector('.usa-map-svg');
  const activeStateNameLabel = document.getElementById('active-state-name');

  if (mapSvg) {
    const paths = mapSvg.querySelectorAll('path, circle, rect');
    
    paths.forEach(path => {
      path.addEventListener('mouseover', (e) => {
        const stateName = e.currentTarget.getAttribute('aria-label');
        if (activeStateNameLabel) {
          activeStateNameLabel.textContent = stateName;
          activeStateNameLabel.classList.remove('text-gray-400');
          activeStateNameLabel.classList.add('text-blue', 'font-bold');
        }
      });

      path.addEventListener('mouseout', () => {
        if (activeStateNameLabel) {
          activeStateNameLabel.textContent = 'Tap to Select';
          activeStateNameLabel.classList.remove('text-blue', 'font-bold');
          activeStateNameLabel.classList.add('text-gray-400');
        }
      });

      path.addEventListener('click', (e) => {
        const stateSlug = e.currentTarget.getAttribute('data-slug');
        paths.forEach(p => p.classList.remove('active-state'));
        e.currentTarget.classList.add('active-state');

        // Route to state with clean absolute path
        window.location.href = `/state/${stateSlug}`;
      });

      path.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          path.click();
        }
      });
    });
  }



  // ==================== SCROLL ANIMATIONS ====================
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  // On mobile (≤768px) CSS already makes all elements visible instantly (no animation).
  // Registering 151 IntersectionObserver callbacks on mobile causes 3.3s of TBT — skip entirely.
  const isMobileViewport = window.innerWidth <= 768;

  if (animatedElements.length > 0 && !isMobileViewport) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else if (isMobileViewport) {
    // Immediately mark all as visible so JS-dependent visibility checks pass
    animatedElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ==================== CONTACT FORM ====================
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      let isValid = true;
      const requiredFields = contactForm.querySelectorAll('[required]');
      
      requiredFields.forEach(function (field) {
        if (!field.value.trim()) {
          field.style.borderColor = '#ef4444';
          isValid = false;
        } else {
          field.style.borderColor = '';
        }
      });
      
      const emailField = contactForm.querySelector('[type="email"]');
      if (emailField && emailField.value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value)) {
          emailField.style.borderColor = '#ef4444';
          isValid = false;
        }
      }
      
      if (isValid) {
        const submitBtn = contactForm.querySelector('[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        submitBtn.disabled = true;
        
        setTimeout(function () {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          contactForm.reset();
        }, 3000);
      }
    });
  }

  // ==================== COUNTER ANIMATION ====================
  const counters = document.querySelectorAll('.stat-number, .hero-stat-number');
  
  if (counters.length > 0) {
    if (isMobileViewport) {
      // On mobile: skip rAF animation loops entirely to reduce TBT — just show final values
      counters.forEach(function (counter) {
        counter.classList.add('counted');
      });
    } else {
      const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      counters.forEach(function (counter) {
        counterObserver.observe(counter);
      });
    }
  }

  function animateCounter(element) {
    const text = element.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;
    
    const target = parseInt(match[0]);
    const suffix = text.replace(match[0], '').trim();
    const prefix = text.substring(0, text.indexOf(match[0]));
    const duration = 2000;
    const start = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      
      element.textContent = prefix + current + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = text;
      }
    }
    
    requestAnimationFrame(update);
  }

  // ==================== ACTIVE NAV LINK ====================
  document.querySelectorAll('.nav-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href) {
      const linkPage = href.split('/').pop().split('#')[0];
      if (linkPage === currentPage) {
        link.classList.add('active');
      }
    }
  });

  // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        // Use cachedHeaderHeight to avoid forced reflow on click
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - cachedHeaderHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (nav && nav.classList.contains('active') && mobileToggle) {
          nav.classList.remove('active');
          mobileToggle.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });

  // ==================== DYNAMIC TEXT REPLACEMENT (service-detail.html) ====================
  if (currentPage === 'service-detail') {
    const params = new URLSearchParams(window.location.search);
    let serviceNameRaw = params.get('service');

    // Parse service from pathname (/services/drain-cleaning)
    const pathParts = window.location.pathname.split('/');
    const servicesIdx = pathParts.indexOf('services');
    if (servicesIdx !== -1 && servicesIdx + 1 < pathParts.length) {
      if (!serviceNameRaw) {
        serviceNameRaw = pathParts[servicesIdx + 1];
        // Clean trailing slash if present
        if (serviceNameRaw && serviceNameRaw.endsWith('/')) {
          serviceNameRaw = serviceNameRaw.slice(0, -1);
        }
      }
    }
    
    if (!serviceNameRaw) {
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        serviceNameRaw = decodeURIComponent(hash.substring(1));
      }
    }

    if (serviceNameRaw) {
      serviceNameRaw = decodeURIComponent(serviceNameRaw);
      
      // Convert slug (e.g. drain-cleaning) to proper Title Case
      let serviceName = serviceNameRaw
        .split(/[- ]+/)
        .map(w => {
          if (w.toLowerCase() === 'b2b') return 'B2B';
          if (w.toLowerCase() === 'usa') return 'USA';
          return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        })
        .join(' ');

      // Extract current location details for dynamic content formatting
      const loc = getCurrentLocationParams();
      const hasLocation = !!(loc.city || loc.state);
      
      const city = loc.city || 'Your Local Area';
      const state = loc.state || '';
      
      const capState = state ? state.charAt(0).toUpperCase() + state.slice(1) : '';
      const capCity = city === 'Your Local Area' ? city : decodeURIComponent(city)
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
      
      // Dynamic SEO Title & Description handled by global applyDynamicSEO()

      // Inject Unique Category-Specific Content
      let categoryId = 'general';
      if (window.servicesData) {
        const slugClean = serviceNameRaw.toLowerCase().trim();
        if (window.servicesData.slugs[slugClean]) {
          categoryId = window.servicesData.slugs[slugClean];
        } else {
          // Fuzzy match category
          const keys = Object.keys(window.servicesData.categories);
          for (const key of keys) {
            if (slugClean.includes(key)) {
              categoryId = key;
              break;
            }
          }
          // Custom mappings
          if (categoryId === 'general') {
            if (slugClean.includes('leak') || slugClean.includes('detection')) {
              categoryId = 'leak-detection';
            } else if (slugClean.includes('pipe') || slugClean.includes('line') || slugClean.includes('trenching')) {
              if (slugClean.includes('gas-line')) {
                categoryId = 'gas-line';
              } else {
                categoryId = 'pipe-repair';
              }
            } else if (slugClean.includes('faucet') || slugClean.includes('toilet') || slugClean.includes('shower') || slugClean.includes('bath') || slugClean.includes('sink') || slugClean.includes('disp') || slugClean.includes('sump') || slugClean.includes('pump') || slugClean.includes('fixture') || slugClean.includes('machine') || slugClean.includes('valve') || slugClean.includes('regulator')) {
              categoryId = 'fixtures';
            } else if (slugClean.includes('filter') || slugClean.includes('softener') || slugClean.includes('filtration')) {
              categoryId = 'filtration';
            } else if (slugClean.includes('drain') || slugClean.includes('sewer') || slugClean.includes('clog') || slugClean.includes('jetting') || slugClean.includes('rooter') || slugClean.includes('septic')) {
              categoryId = 'drain-sewer';
            }
          }
        }
      }

      const catData = (window.servicesData && window.servicesData.categories[categoryId]) || (window.servicesData && window.servicesData.categories['general']);
      
      if (catData) {
        const format = (str) => {
          if (!str) return '';
          return str
            .replace(/{service}/gi, serviceName)
            .replace(/{city}/gi, capCity)
            .replace(/respective/gi, serviceName);
        };

        // Inject Overview / Why Call Us
        const whyP1 = document.getElementById('why-call-p1');
        const whyP2 = document.getElementById('why-call-p2');
        const whyList = document.getElementById('why-call-list');
        if (whyP1) whyP1.textContent = format(catData.whyCallUs[0]);
        if (whyP2) whyP2.textContent = format(catData.whyCallUs[1]);
        if (whyList && catData.whyCallUsList) {
          whyList.innerHTML = catData.whyCallUsList.map(item => `<li><i class="fas fa-check"></i> ${format(item)}</li>`).join('');
        }

        // Inject How We Perform
        const howP1 = document.getElementById('how-perform-p1');
        const howP2 = document.getElementById('how-perform-p2');
        const howList = document.getElementById('how-perform-list');
        if (howP1) howP1.textContent = format(catData.howWePerform[0]);
        if (howP2) howP2.textContent = format(catData.howWePerform[1]);
        if (howList && catData.howWePerformList) {
          howList.innerHTML = catData.howWePerformList.map(item => `<li><i class="fas fa-check"></i> ${format(item)}</li>`).join('');
        }

        // Inject Benefits
        const benP1 = document.getElementById('benefits-p1');
        const benP2 = document.getElementById('benefits-p2');
        const benList = document.getElementById('benefits-list');
        if (benP1) benP1.textContent = format(catData.benefits[0]);
        if (benP2) benP2.textContent = format(catData.benefits[1]);
        if (benList && catData.benefitsList) {
          benList.innerHTML = catData.benefitsList.map(item => `<li><i class="fas fa-check"></i> ${format(item)}</li>`).join('');
        }

        // Inject Workflow Steps
        for (let i = 1; i <= 4; i++) {
          const stepTitle = document.getElementById(`workflow-step-${i}-title`);
          const stepDesc = document.getElementById(`workflow-step-${i}-desc`);
          if (stepTitle && catData.workflow[i - 1]) stepTitle.textContent = format(catData.workflow[i - 1].title);
          if (stepDesc && catData.workflow[i - 1]) stepDesc.textContent = format(catData.workflow[i - 1].desc);
        }

        // Inject FAQs
        const faqQ1 = document.getElementById('faq-q1');
        const faqA1 = document.getElementById('faq-a1');
        const faqQ2 = document.getElementById('faq-q2');
        const faqA2 = document.getElementById('faq-a2');
        if (faqQ1 && catData.faq[0]) faqQ1.textContent = format(catData.faq[0].q);
        if (faqA1 && catData.faq[0]) faqA1.textContent = format(catData.faq[0].a);
        if (faqQ2 && catData.faq[1]) faqQ2.textContent = format(catData.faq[1].q);
        if (faqA2 && catData.faq[1]) faqA2.textContent = format(catData.faq[1].a);
      }

      // Recursive replacement in text nodes helper
      function replaceTextInElement(element, fromText, toText) {
        if (!element) return;
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        let node;
        const regex = new RegExp(fromText, 'gi');
        const nodesToReplace = [];
        
        while (node = walker.nextNode()) {
          if (node.nodeValue.toLowerCase().includes(fromText.toLowerCase())) {
            nodesToReplace.push(node);
          }
        }

        nodesToReplace.forEach(n => {
          n.nodeValue = n.nodeValue.replace(regex, (match) => {
            return toText;
          });
        });
      }

      // Replace target placeholder in specific elements
      const targetSelectors = [
        'section.hero',
        'section.trust-section',
        'section.section',
        'section.cta-section',
        'footer.footer',
        '.breadcrumbs',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'span', 'li', 'button'
      ];

      targetSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          if (el.textContent && el.textContent.toLowerCase().includes('respective')) {
            replaceTextInElement(el, 'respective', serviceName);
          }
        });
      });

      // Special replacement inside attributes and innerHTML elements (like button texts)
      document.querySelectorAll('a, button, input[type="submit"]').forEach(el => {
        if (el.innerHTML && el.innerHTML.toLowerCase().includes('respective')) {
          el.innerHTML = el.innerHTML.replace(/respective/gi, serviceName);
        }
      });
    }
  }

  // ==================== BROWSER HISTORY RESTRICTIONS ====================
  // From state.html: intercept hub clicks and use location.replace()
  if (currentPage === 'state') {
    document.addEventListener('click', function (e) {
      const anchor = e.target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && (href.includes('/city/') || /^\/(alaska|texas|florida)\/[a-z0-9-]+-/.test(href))) {
          e.preventDefault();
          window.location.replace(anchor.href);
        }
      }
    });
  }

  // ==================== DYNAMIC PARAMETER PRESERVATION ====================
  // Intercept links to services and route strictly to physical static paths without query parameters
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a');
    if (anchor && !anchor.classList.contains('dropdown-toggle')) {
      const href = anchor.getAttribute('href');
      if (href && href !== '/services' && href !== '/services/' && (href.includes('service-detail') || href.includes('/services/'))) {
        const loc = getCurrentLocationParams();
        if (loc.city && loc.state && loc.zip) {
          e.preventDefault();
          let rawService = '';
          if (href.includes('/services/')) {
            const parts = href.split('/services/')[1];
            if (parts) rawService = parts.split(/[?#]/)[0].replace(/\/+$/, '');
          } else if (href.includes('service-detail')) {
            const u = new URL(anchor.href, window.location.origin);
            rawService = u.searchParams.get('service') || '';
          }
          const canonicalService = getCanonicalServiceSlug(rawService);
          const stateSlug = getStateSlug(loc.state);
          const citySlug = slugify(loc.city);
          window.location.href = `/${stateSlug}/${citySlug}-${loc.zip}/${canonicalService}/`;
        }
      }
    }
  });

  // ==================== SEO AUTOMATION ====================
  function getSEOContext() {
    const loc = getCurrentLocationParams(); // returns { city, zip, state }
    
    // Parse service name if on service-detail
    let serviceName = '';
    if (currentPage === 'service-detail') {
      const params = new URLSearchParams(window.location.search);
      let serviceNameRaw = params.get('service');
      const pathParts = window.location.pathname.split('/');
      const servicesIdx = pathParts.indexOf('services');
      if (servicesIdx !== -1 && servicesIdx + 1 < pathParts.length) {
        if (!serviceNameRaw) {
          serviceNameRaw = pathParts[servicesIdx + 1];
          if (serviceNameRaw && serviceNameRaw.endsWith('/')) {
            serviceNameRaw = serviceNameRaw.slice(0, -1);
          }
        }
      }
      if (!serviceNameRaw) {
        const hash = window.location.hash;
        if (hash && hash.length > 1) {
          serviceNameRaw = decodeURIComponent(hash.substring(1));
        }
      }
      if (serviceNameRaw) {
        serviceNameRaw = decodeURIComponent(serviceNameRaw);
        serviceName = serviceNameRaw
          .split(/[- ]+/)
          .map(w => {
            if (w.toLowerCase() === 'b2b') return 'B2B';
            if (w.toLowerCase() === 'usa') return 'USA';
            return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
          })
          .join(' ');
      }
    }
    
    // Format city
    let cityName = '';
    if (loc.city) {
      cityName = decodeURIComponent(loc.city)
        .split(/[- ]+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    } else {
      cityName = 'Your Local Area';
    }
    
    // Format state
    let stateName = '';
    if (loc.state) {
      stateName = decodeURIComponent(loc.state)
        .split(/[- ]+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }
    
    // State Code mapping
    const stateCodeMap = {
      'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
      'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
      'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
      'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
      'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
      'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new-hampshire': 'NH', 'new-jersey': 'NJ',
      'new-mexico': 'NM', 'new-york': 'NY', 'north-carolina': 'NC', 'north-dakota': 'ND', 'ohio': 'OH',
      'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode-island': 'RI', 'south-carolina': 'SC',
      'south-dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
      'virginia': 'VA', 'washington': 'WA', 'west-virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY'
    };
    const stateKey = loc.state ? loc.state.toLowerCase().replace(/_/g, '-') : '';
    const stateCode = stateCodeMap[stateKey] || (loc.state ? loc.state.substring(0, 2).toUpperCase() : '');
    
    return {
      city: cityName,
      state: stateName,
      stateCode: stateCode,
      service: serviceName,
      zip: loc.zip || ''
    };
  }

  function applyDynamicSEO() {
    if (document.getElementById('dynamic-seo-schema')) {
      return;
    }
    const seo = getSEOContext();
    const currentPath = (window.location.pathname + window.location.search).replace(/^\//, '');
    const pageUrl = `https://homeplumbingusa.com/${currentPath}`;

    let title = '';
    let description = '';
    let schemaName = '';
    let schemaDesc = '';
    let areaServedName = '';

    if (currentPage === 'state') {
      const stateName = seo.state || 'your state';
      title = `24/7 Plumbers in ${stateName} | Emergency Plumbing Services`;
      if (title.length > 60) {
        title = `24/7 Plumbers in ${stateName} | Emergency Plumbing`;
      }
      description = `Need trusted plumbing services in ${stateName}? Home Plumbing USA connects you with vetted, licensed local plumbers for 24/7 emergency repairs. Call today!`;
      if (description.length < 150) {
        description = `Need trusted plumbing services in ${stateName}? Home Plumbing USA connects you with vetted, licensed local plumbers for 24/7 emergency repairs. Call 877-516-8705!`;
      }
      schemaName = `Home Plumbing USA - ${seo.state || 'State'}`;
      schemaDesc = `Referral matching service for professional plumbing in ${seo.state || 'State'}.`;
      areaServedName = seo.state || 'State';
    } else if (currentPage === 'city-zip') {
      const cityName = seo.city || 'Your Local Area';
      const stateName = seo.state || '';
      const stateCode = seo.stateCode || '';
      const locationLabel = stateCode ? `${cityName}, ${stateCode}` : cityName;
      title = `24/7 Plumbers in ${locationLabel} | Emergency Plumbing Services`;
      if (title.length > 60) {
        title = `24/7 Plumbers in ${locationLabel} | Emergency Plumbing`;
      }
      description = `Need trusted plumbing services in ${locationLabel}? Home Plumbing USA connects you with vetted, licensed local plumbers for 24/7 emergency repairs. Call today!`;
      if (description.length < 150) {
        description = `Need trusted plumbing services in ${locationLabel}? Home Plumbing USA connects you with vetted, licensed local plumbers for 24/7 emergency repairs. Call 877-516-8705!`;
      }
      schemaName = `Home Plumbing USA - ${cityName}`;
      schemaDesc = `Referral matching service for professional plumbing in ${cityName}, ${stateName}.`;
      areaServedName = cityName;
    } else if (currentPage === 'service-detail') {
      const serviceName = seo.service || 'Plumbing Services';
      const cityName = seo.city || 'Your Local Area';
      const stateName = seo.state || '';
      const stateCode = seo.stateCode || '';
      const locationLabel = stateCode ? `${cityName}, ${stateCode}` : cityName;

      title = `${serviceName} in ${locationLabel} | Home Plumbing USA`;
      description = `Need ${serviceName.toLowerCase()} in ${locationLabel}? Home Plumbing USA matches you with vetted, licensed local plumbers for 24/7 emergency repairs. Call 877-516-8705!`;
      if (description.length < 150) {
        description = `Looking for ${serviceName.toLowerCase()} in ${locationLabel}? Home Plumbing USA matches you with vetted, licensed local plumbers for 24/7 emergency repairs. Call 877-516-8705!`;
      }
      schemaName = `Home Plumbing USA - ${cityName}`;
      schemaDesc = `Referral matching service for ${serviceName.toLowerCase()} in ${locationLabel}.`;
      areaServedName = cityName;
    } else {
      // Not a dynamic page, don't dynamically override title/desc/schema
      return;
    }

    // 1. Update Title
    if (title) {
      document.title = title;
    }

    // 2. Update Description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);
    }

    // 3. Inject JSON-LD Schema Markup
    // Remove existing dynamic schema if any (to prevent duplicates on client navigation if any)
    const existingDynamicSchema = document.getElementById('dynamic-seo-schema');
    if (existingDynamicSchema) {
      existingDynamicSchema.remove();
    }

    const schemaObj = {
      "@context": "https://schema.org",
      "@type": "PlumbingService",
      "name": schemaName,
      "description": schemaDesc,
      "url": pageUrl,
      "telephone": "877-516-8705",
      "priceRange": "$$",
      "areaServed": {
        "@type": "AdministrativeArea",
        "name": areaServedName
      },
      "provider": {
        "@type": "LocalBusiness",
        "name": "Home Plumbing USA",
        "image": "https://homeplumbingusa.com/images/logo.png"
      }
    };

    const scriptEl = document.createElement('script');
    scriptEl.id = 'dynamic-seo-schema';
    scriptEl.type = 'application/ld+json';
    scriptEl.textContent = JSON.stringify(schemaObj, null, 2);
    document.head.appendChild(scriptEl);
  }

  // ==================== FAQ ACCORDION INTERACTIVITY ====================
  document.addEventListener('click', function (e) {
    const faqQuestion = e.target.closest('.faq-question');
    if (!faqQuestion) return;
    
    const faqItem = faqQuestion.closest('.faq-item');
    if (!faqItem) return;
    
    const isAlreadyActive = faqItem.classList.contains('active');
    
    // Close other active FAQ items in the same container for clean accordion behavior
    const parentContainer = faqItem.closest('.faq-container, section') || faqItem.parentElement;
    if (parentContainer) {
      parentContainer.querySelectorAll('.faq-item.active').forEach(function (openItem) {
        if (openItem !== faqItem) {
          openItem.classList.remove('active');
          const openIcon = openItem.querySelector('.fa-minus');
          if (openIcon) {
            openIcon.classList.remove('fa-minus');
            openIcon.classList.add('fa-plus');
          }
        }
      });
    }
    
    // Toggle active state on current FAQ item
    faqItem.classList.toggle('active', !isAlreadyActive);
    
    // Swap plus/minus icon if used
    const icon = faqQuestion.querySelector('.faq-icon i, i.fa-plus, i.fa-minus');
    if (icon) {
      if (!isAlreadyActive) {
        if (icon.classList.contains('fa-plus')) {
          icon.classList.remove('fa-plus');
          icon.classList.add('fa-minus');
        }
      } else {
        if (icon.classList.contains('fa-minus')) {
          icon.classList.remove('fa-minus');
          icon.classList.add('fa-plus');
        }
      }
    }
  });

  // Execute dynamic SEO automation
  applyDynamicSEO();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMain);
} else {
  initMain();
}
