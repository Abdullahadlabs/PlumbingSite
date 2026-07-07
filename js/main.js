/* ================================================
   Home Plumbing USA — Client Interactive Logic
   Navigation, Map Routing, Tabs, Counters, FAQ Accordion,
   Dynamic text replacement, and History Restrictions.
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {
  const prefix = document.body.getAttribute('data-prefix') || './';
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // ==================== LOCAL HOME MENU LINK DYNAMIC UPDATE ====================
  const homeMenuEl = document.getElementById('homeMenuLink');
  if (homeMenuEl) {
    const params = new URLSearchParams(window.location.search);
    const city = params.get('city') || 'Anchorage';
    const zip = params.get('zip') || '99501';
    const state = params.get('state') || 'alaska';
    homeMenuEl.href = `city-zip.html?city=${encodeURIComponent(city)}&zip=${encodeURIComponent(zip)}&state=${encodeURIComponent(state)}`;
  }

  // ==================== HEADER SCROLL ====================
  const header = document.getElementById('header') || document.querySelector('.header');
  
  function handleScroll() {
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }
  
  window.addEventListener('scroll', handleScroll);
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

  // Close mobile menu on link click
  document.querySelectorAll('.nav .dropdown-link, .nav .nav-link').forEach(function (link) {
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
        const dropdown = this.nextElementSibling;
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

        // Route to state.html with query parameter
        window.location.href = `${prefix}state.html?state=${stateSlug}`;
      });

      path.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          path.click();
        }
      });
    });
  }

  // ==================== FAQ ACCORDION ====================
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (question && answer) {
      question.addEventListener('click', function () {
        const isActive = item.classList.contains('active');
        
        // Close all other FAQ items
        faqItems.forEach(function (otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });
        
        // Toggle current item
        item.classList.toggle('active');
        
        if (!isActive) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = null;
        }
      });
    }
  });

  // ==================== SCROLL ANIMATIONS ====================
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if (animatedElements.length > 0) {
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
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
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
  if (currentPage.includes('service-detail.html')) {
    const params = new URLSearchParams(window.location.search);
    let serviceName = params.get('service');
    
    if (!serviceName) {
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        serviceName = decodeURIComponent(hash.substring(1));
      }
    }

    if (serviceName) {
      serviceName = decodeURIComponent(serviceName);
      
      // Update Page Title
      document.title = document.title.replace(/respective/gi, serviceName);

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
            // Match casing: 'Respective' -> capitalized service name, 'respective' -> lowercase/standard service name
            if (match.charAt(0) === 'R') {
              return toText.charAt(0).toUpperCase() + toText.slice(1);
            }
            return toText.toLowerCase();
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
  // From state.html: intercept city-zip.html clicks and use location.replace()
  if (currentPage.includes('state.html')) {
    document.addEventListener('click', function (e) {
      const anchor = e.target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && (href.includes('city-zip.html') || href === 'city-zip.html')) {
          e.preventDefault();
          window.location.replace(anchor.href);
        }
      }
    });
  }

  // ==================== DYNAMIC PARAMETER PRESERVATION ====================
  // Intercept links to service-detail.html and append location query parameters if present
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a');
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href && href.includes('service-detail.html')) {
        const currentParams = new URLSearchParams(window.location.search);
        const cityVal = currentParams.get('city');
        const zipVal = currentParams.get('zip');
        const stateVal = currentParams.get('state');

        if (cityVal || zipVal || stateVal) {
          e.preventDefault();
          const targetUrl = new URL(anchor.href, window.location.origin);
          if (cityVal) targetUrl.searchParams.set('city', cityVal);
          if (zipVal) targetUrl.searchParams.set('zip', zipVal);
          if (stateVal) targetUrl.searchParams.set('state', stateVal);
          window.location.href = targetUrl.toString();
        }
      }
    }
  });
});
