const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://homeplumbingusa.com';
const blogsPath = path.join(__dirname, '..', 'database', 'blogs.json');

if (!fs.existsSync(blogsPath)) {
  console.error('database/blogs.json not found!');
  process.exit(1);
}

const blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));

// Ensure blog output root directory exists
const blogRootDir = path.join(__dirname, '..', 'blog');
if (!fs.existsSync(blogRootDir)) {
  fs.mkdirSync(blogRootDir, { recursive: true });
}

function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', options);
}

const CATEGORIES = [
  { slug: 'all', name: 'All Daily Guides', icon: 'fa-th-large' },
  { slug: 'emergency-fixes', name: 'Emergency Fixes', icon: 'fa-bolt' },
  { slug: 'toilet-fixes', name: 'Toilet Facts & Fixes', icon: 'fa-toilet' },
  { slug: 'leak-detection-damage', name: 'Leak Detection & Water Damage', icon: 'fa-magnifying-glass' },
  { slug: 'remodel-renovation', name: 'Remodel & Renovation Plumbing Ideas', icon: 'fa-hammer' },
  { slug: 'faucet-fixture-tips', name: 'Faucet & Fixture Tips', icon: 'fa-faucet' },
  { slug: 'sump-pump-basement', name: 'Sump Pump & Basement Protection', icon: 'fa-shield-halved' },
  { slug: 'money-saving-tips', name: 'Money-Saving Plumbing Tips', icon: 'fa-piggy-bank' },
  { slug: 'water-quality-hard-water', name: 'Water Quality & Hard Water', icon: 'fa-filter' },
  { slug: 'water-heaters', name: 'Water Heaters', icon: 'fa-temperature-high' },
  { slug: 'drains-sewer', name: 'Drains & Sewer', icon: 'fa-broom' },
  { slug: 'diy-vs-pro', name: 'DIY vs. Pro', icon: 'fa-tools' },
  { slug: 'seasonal-maintenance', name: 'Seasonal Maintenance', icon: 'fa-snowflake' }
];

function buildPostHtml(post, allPosts) {
  const pageUrl = `${DOMAIN}/blog/${post.slug}/`;
  const formattedDate = formatDate(post.date);
  const relatedPosts = allPosts.filter(p => p.slug !== post.slug).slice(0, 4);

  const relatedHtml = relatedPosts.map(p => `
    <a href="/blog/${p.slug}/" class="related-post-card">
      <span class="related-category">${p.category}</span>
      <h4 class="related-title">${p.title}</h4>
      <div class="related-meta">
        <span><i class="fas fa-calendar-alt"></i> ${formatDate(p.date)}</span>
        <span><i class="fas fa-clock"></i> ${p.readTime}</span>
      </div>
    </a>
  `).join('\n');

  const tagsHtml = (post.tags || []).map(t => `<span class="post-tag">#${t}</span>`).join(' ');

  const schemaObj = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${pageUrl}#article`,
        "isPartOf": {
          "@type": "Blog",
          "@id": `${DOMAIN}/blog/#blog`,
          "name": "Home Plumbing USA Daily Guides & Advice",
          "publisher": {
            "@type": "Organization",
            "name": "Home Plumbing USA",
            "url": DOMAIN,
            "logo": `${DOMAIN}/public/images/logo.svg`
          }
        },
        "headline": post.title,
        "description": post.excerpt,
        "url": pageUrl,
        "datePublished": post.date,
        "dateModified": post.date,
        "author": {
          "@type": "Person",
          "name": post.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "Home Plumbing USA",
          "url": DOMAIN,
          "logo": `${DOMAIN}/public/images/logo.svg`
        },
        "image": `${DOMAIN}${post.image}`,
        "mainEntityOfPage": pageUrl,
        "keywords": (post.tags || []).join(', ')
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
            "name": "Blog & Guides",
            "item": `${DOMAIN}/blog`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": pageUrl
          }
        ]
      }
    ]
  };

  if (post.faqs && post.faqs.length > 0) {
    schemaObj["@graph"].push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      "mainEntity": post.faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    });
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} | Home Plumbing USA Daily Guides</title>
  <meta name="description" content="${post.excerpt}">
  <link rel="canonical" href="${pageUrl}">

  <!-- Open Graph / Social -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${post.title}">
  <meta property="og:description" content="${post.excerpt}">
  <meta property="og:image" content="${DOMAIN}${post.image}">

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
${JSON.stringify(schemaObj, null, 2)}
  </script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="icon" type="image/png" href="/public/images/favicon.png">

  <style>
    .article-layout {
      display: grid;
      grid-template-columns: 2.2fr 1fr;
      gap: 40px;
      margin-top: 36px;
    }
    .article-main {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 40px;
    }
    .article-main h2 {
      font-size: 1.85rem;
      font-weight: 800;
      color: var(--text-white);
      margin-top: 36px;
      margin-bottom: 16px;
      line-height: 1.3;
    }
    .article-main h3 {
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--accent);
      margin-top: 28px;
      margin-bottom: 12px;
    }
    .article-main p {
      font-size: 1.05rem;
      color: var(--text-light);
      line-height: 1.85;
      margin-bottom: 20px;
    }
    .article-main ul, .article-main ol {
      margin-bottom: 24px;
      padding-left: 24px;
      color: var(--text-light);
      line-height: 1.8;
      font-size: 1.02rem;
    }
    .article-main li {
      margin-bottom: 8px;
    }
    .post-takeaway-box {
      background: linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(245,158,11,0.08) 100%);
      border-left: 4px solid var(--accent);
      padding: 24px;
      border-radius: 0 var(--radius-md) var(--radius-md) 0;
      margin: 28px 0;
    }
    .post-takeaway-box h4 {
      color: var(--accent);
      font-size: 1.15rem;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .article-hero-img {
      width: 100%;
      max-height: 440px;
      object-fit: cover;
      border-radius: var(--radius-md);
      margin-bottom: 30px;
      border: 1px solid var(--border-color);
    }
    .article-content img {
      width: 100%;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
      margin: 20px 0 10px;
      display: block;
    }
    .article-content figure {
      margin: 28px 0;
    }
    .article-content figcaption {
      font-size: 0.88rem;
      color: var(--text-muted);
      text-align: center;
      margin-top: 8px;
      font-style: italic;
    }
    .article-table-wrapper {
      overflow-x: auto;
      margin: 28px 0;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
    }
    .article-content table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.95rem;
      text-align: left;
    }
    .article-content th {
      background: rgba(37, 99, 235, 0.15);
      color: var(--text-white);
      padding: 14px 16px;
      font-weight: 700;
      border-bottom: 2px solid var(--border-color);
    }
    .article-content td {
      padding: 14px 16px;
      color: var(--text-light);
      border-bottom: 1px solid var(--border-color);
    }
    .article-content tr:last-child td {
      border-bottom: none;
    }
    .article-content tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }
    .article-content .faq-container {
      max-width: 100%;
      margin: 24px 0 32px;
    }
    .post-tag {
      display: inline-block;
      padding: 4px 10px;
      background: rgba(255,255,255,0.06);
      border-radius: 12px;
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-right: 6px;
      margin-top: 6px;
    }
    .article-sidebar {
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    .sidebar-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 26px;
    }
    .sidebar-card h3 {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--text-white);
      margin-bottom: 16px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 10px;
    }
    .related-post-card {
      display: block;
      padding: 14px 0;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      text-decoration: none;
      transition: var(--transition);
    }
    .related-post-card:last-child {
      border-bottom: none;
    }
    .related-post-card:hover .related-title {
      color: var(--accent);
    }
    .related-category {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--primary-light);
      margin-bottom: 4px;
      display: block;
    }
    .related-title {
      font-size: 0.95rem;
      color: var(--text-white);
      font-weight: 600;
      line-height: 1.4;
      margin-bottom: 6px;
      transition: var(--transition);
    }
    .related-meta {
      display: flex;
      gap: 12px;
      font-size: 0.78rem;
      color: var(--text-muted);
    }
    .emergency-cta-box {
      background: linear-gradient(135deg, #1e3a8a 0%, #0f1e3a 100%);
      border: 2px solid var(--primary);
      text-align: center;
    }
    @media (max-width: 992px) {
      .article-layout {
        grid-template-columns: 1fr;
      }
      .article-main {
        padding: 24px;
      }
    }
  </style>
</head>
<body data-prefix="/" data-depth="0">

  <!-- Header -->
  <header class="header" id="header" style="min-height: 120px;">
    <div class="top-bar" style="min-height: 40px; height: 40px; display: flex; align-items: center; justify-content: center; text-align: center; white-space: nowrap;">
      <div class="top-bar-content">
        <span class="pulse-dot"></span>
        <span>Daily Plumbing Guides & Expert Advice &bull; 24/7 Nationwide Emergency Support</span>
      </div>
    </div>
    <div class="header-inner" style="min-height: 80px; height: 80px; display: flex; align-items: center; justify-content: space-between;">
      <a href="/" class="logo" style="width: 247px; max-width: 100%; display: flex; align-items: center;">
        <img src="/public/images/logo.svg" alt="Home Plumbing USA Logo" class="logo-img" width="247" height="52">
      </a>
      <nav class="nav" id="mainNav">
        <a href="/" class="nav-link">Home</a>
        <a href="/#states" class="nav-link">Areas We Serve</a>
        <a href="/services" class="nav-link">Services</a>
        <a href="/blog" class="nav-link active">Blog &amp; Guides <span class="nav-badge-pulse">Daily</span></a>
        <a href="/about" class="nav-link">About</a>
        <a href="/contact" class="nav-link">Contact</a>
      </nav>
      <div class="header-cta">
        <a href="tel:877-516-8705" class="header-phone"><i class="fas fa-phone"></i> 877-516-8705</a>
        <a href="tel:877-516-8705" class="btn btn-primary btn-sm">Call 24/7</a>
      </div>
      <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <main style="padding-top: 30px; padding-bottom: 70px;">
    <div class="container">
      <!-- Breadcrumbs -->
      <div class="breadcrumbs" style="display: flex; gap: 8px; align-items: center; font-size: 0.9rem; margin-bottom: 24px; color: var(--text-muted); flex-wrap: wrap;">
        <a href="/" style="color: var(--primary-light); text-decoration: none;">Home</a>
        <i class="fas fa-chevron-right" style="font-size: 0.75rem;"></i>
        <a href="/blog" style="color: var(--primary-light); text-decoration: none;">Blog &amp; Guides</a>
        <i class="fas fa-chevron-right" style="font-size: 0.75rem;"></i>
        <span style="color: #fff;">${post.category}</span>
      </div>

      <div class="article-layout">
        <!-- Main Article Column -->
        <article class="article-main">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px; flex-wrap: wrap;">
            <span style="padding: 4px 12px; background: rgba(37,99,235,0.2); color: var(--primary-light); border-radius: 20px; font-weight: 700; font-size: 0.8rem; text-transform: uppercase;">${post.category}</span>
            <span style="color: var(--text-muted); font-size: 0.88rem;"><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
            <span style="color: var(--text-muted); font-size: 0.88rem;"><i class="fas fa-clock"></i> ${post.readTime}</span>
          </div>

          <h1 style="font-size: 2.5rem; font-weight: 900; line-height: 1.2; color: #fff; margin-bottom: 20px;">${post.title}</h1>

          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid var(--border-color);">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.2rem;">
              <i class="fas fa-user-check"></i>
            </div>
            <div>
              <div style="color: #fff; font-weight: 700; font-size: 0.95rem;">${post.author}</div>
              <div style="color: var(--primary-light); font-size: 0.82rem;">Reviewed for Accuracy & Safety Standards</div>
            </div>
          </div>

          <img src="${post.image}" alt="${post.title}" class="article-hero-img">

          <div class="post-takeaway-box">
            <h4><i class="fas fa-bolt"></i> Key Takeaway</h4>
            <p style="margin: 0; color: #fff; font-size: 1rem; line-height: 1.6;">${post.excerpt}</p>
          </div>

          <div class="article-content">
            ${post.content}
          </div>

          <div style="margin-top: 36px; padding-top: 24px; border-top: 1px solid var(--border-color);">
            <h4 style="color: var(--text-white); margin-bottom: 10px; font-size: 0.95rem;">Article Topics:</h4>
            ${tagsHtml}
          </div>
        </article>

        <!-- Sidebar -->
        <aside class="article-sidebar">
          <div class="sidebar-card emergency-cta-box">
            <div style="font-size: 2.2rem; color: var(--accent); margin-bottom: 10px;"><i class="fas fa-phone-volume"></i></div>
            <h3 style="border: none; margin-bottom: 8px;">Facing a Plumbing Emergency?</h3>
            <p style="font-size: 0.92rem; color: rgba(255,255,255,0.85); margin-bottom: 18px; line-height: 1.6;">Don't let a minor leak become severe water damage. Licensed plumbers are standing by for under 45-minute dispatch.</p>
            <a href="tel:877-516-8705" class="btn btn-accent" style="width: 100%; padding: 14px; font-weight: 800; font-size: 1.05rem; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
              <i class="fas fa-phone-alt"></i> (877) 516-8705
            </a>
          </div>

          <div class="sidebar-card">
            <h3>Recent Daily Guides</h3>
            <div class="related-posts-list">
              ${relatedHtml}
            </div>
            <div style="margin-top: 18px; text-align: center;">
              <a href="/blog" style="color: var(--primary-light); font-weight: 700; text-decoration: none; font-size: 0.92rem; display: inline-flex; align-items: center; gap: 6px;">
                View All Guides <i class="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>

          <div class="sidebar-card">
            <h3>Browse by Category</h3>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              ${CATEGORIES.filter(c => c.slug !== 'all').map(c => `
                <a href="/blog?category=${c.slug}" style="color: var(--text-muted); text-decoration: none; font-size: 0.88rem; display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <span><i class="fas ${c.icon}" style="color: var(--accent); width: 22px;"></i> ${c.name}</span>
                  <i class="fas fa-chevron-right" style="font-size: 0.72rem;"></i>
                </a>
              `).join('\n')}
            </div>
          </div>
        </aside>
      </div>
    </div>
  </main>

  <!-- Final Call-to-Action Banner -->
  <section class="cta-section" style="padding: 4rem 0; background: var(--gradient-cta); color: #fff; text-align: center;">
    <div class="container" style="max-width: 760px; margin: 0 auto;">
      <h2 style="font-size: 2.2rem; color: #fff; margin-bottom: 1rem; font-weight: 800;">Need Immediate Hands-On Plumbing Help?</h2>
      <p style="font-size: 1.1rem; color: rgba(255,255,255,0.9); margin-bottom: 2rem; line-height: 1.6;">Our dispatch operators are online 24 hours a day, 7 days a week. Connect with a licensed local plumbing specialist in under 45 minutes.</p>
      <a href="tel:877-516-8705" class="btn btn-accent" style="background: var(--accent); color: #fff; font-size: 1.15rem; font-weight: 800; padding: 16px 36px; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
        <i class="fas fa-phone-alt"></i> Call (877) 516-8705
      </a>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer" style="background: var(--bg-darker); border-top: 1px solid var(--border-color); padding: 70px 0 30px;">
    <div class="container">
      <div class="footer-grid" style="display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 50px;">
        <div class="footer-about">
          <a href="/" class="logo footer-logo" style="display: inline-block; margin-bottom: 18px;">
            <img src="/public/images/logo.svg" alt="Home Plumbing USA Logo" class="logo-img" width="247" height="52">
          </a>
          <h3 class="footer-title" style="font-size: 1.2rem; color: #fff; margin-bottom: 10px;">Daily Homeowner Plumbing Guides</h3>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 16px;">Empowering homeowners nationwide with daily preventative advice, troubleshooting guides, and rapid 24/7 licensed plumbing dispatch.</p>
        </div>
        <div class="footer-col">
          <div class="footer-title" style="font-size: 1.1rem; color: #fff; font-weight: 700; margin-bottom: 16px;">Quick Links</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <a href="/" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Home</a>
            <a href="/blog" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Daily Guides</a>
            <a href="/services" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">All Services</a>
            <a href="/about" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">About Us</a>
            <a href="/contact" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Contact</a>
          </div>
        </div>
        <div class="footer-col">
          <div class="footer-title" style="font-size: 1.1rem; color: #fff; font-weight: 700; margin-bottom: 16px;">Top Services</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <a href="/services" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Emergency Plumbing</a>
            <a href="/services" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Burst Pipe Repair</a>
            <a href="/services" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Water Heater Repair</a>
            <a href="/services" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Drain Cleaning</a>
          </div>
        </div>
        <div class="footer-col">
          <div class="footer-title" style="font-size: 1.1rem; color: #fff; font-weight: 700; margin-bottom: 16px;">24/7 Dispatch</div>
          <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 16px;">Talk directly with a live dispatch supervisor right now:</p>
          <a href="tel:877-516-8705" class="btn btn-accent" style="padding: 12px 20px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; border-radius: 8px; font-size: 0.95rem;">
            <i class="fas fa-phone-alt"></i> (877) 516-8705
          </a>
        </div>
      </div>
      <div class="footer-bottom" style="border-top: 1px solid var(--border-color); padding-top: 24px; text-align: center; color: var(--text-muted); font-size: 0.88rem;">
        <p>&copy; 2026 Home Plumbing USA. All rights reserved. Nationwide Plumbing Referral Network.</p>
        <div style="margin-top: 8px;">
          <a href="/privacy-policy" style="color: var(--text-muted); margin: 0 8px;">Privacy Policy</a> &bull;
          <a href="/terms-and-conditions" style="color: var(--text-muted); margin: 0 8px;">Terms &amp; Conditions</a> &bull;
          <a href="/disclaimer" style="color: var(--text-muted); margin: 0 8px;">Disclaimer</a>
        </div>
      </div>
    </div>
  </footer>

  <script src="/js/main.js"></script>
</body>
</html>`;
}

function buildBlogHubHtml(allPosts) {
  const filterButtonsHtml = CATEGORIES.map(cat => `
    <button class="filter-btn ${cat.slug === 'all' ? 'active' : ''}" data-cat="${cat.slug}">
      <i class="fas ${cat.icon}"></i> ${cat.name}
    </button>
  `).join('\n');

  const cardsHtml = allPosts.map(post => `
    <article class="blog-card" data-category="${post.categorySlug}" data-keywords="${(post.tags || []).join(' ').toLowerCase()} ${post.title.toLowerCase()}">
      <div class="blog-thumb-wrapper">
        <img src="${post.image}" alt="${post.title}" class="blog-thumb" loading="lazy">
        <span class="blog-category-tag">${post.category}</span>
      </div>
      <div class="blog-card-body">
        <div>
          <div class="blog-card-meta">
            <span><i class="fas fa-calendar-alt"></i> ${formatDate(post.date)}</span>
            <span><i class="fas fa-clock"></i> ${post.readTime}</span>
          </div>
          <h2 class="blog-card-title">${post.title}</h2>
          <p class="blog-card-excerpt">${post.excerpt}</p>
        </div>
        <div class="blog-card-footer">
          <span class="blog-author-tag"><i class="fas fa-user-check" style="color: var(--primary-light);"></i> ${post.author.split(',')[0]}</span>
          <a href="/blog/${post.slug}/" class="read-more-link">Read Guide <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    </article>
  `).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plumbing Guides, Daily Insights & Emergency Tips | Home Plumbing USA</title>
  <meta name="description" content="Explore daily plumbing guides, expert maintenance tips, and emergency troubleshooting written by master plumbers. Learn how to diagnose issues, save energy, and know when to call a pro.">
  <link rel="canonical" href="https://homeplumbingusa.com/blog">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://homeplumbingusa.com/blog">
  <meta property="og:title" content="Plumbing Guides, Daily Insights & Emergency Tips | Home Plumbing USA">
  <meta property="og:description" content="Explore daily plumbing guides, expert maintenance tips, and emergency troubleshooting written by master plumbers.">
  <meta property="og:image" content="https://homeplumbingusa.com/public/images/hero-plumbing.webp">

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://homeplumbingusa.com/blog/#blog",
    "name": "Home Plumbing USA Daily Plumbing Guides",
    "description": "Daily plumbing guides, expert maintenance advice, and emergency troubleshooting tutorials for homeowners.",
    "url": "https://homeplumbingusa.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Home Plumbing USA",
      "url": "https://homeplumbingusa.com/",
      "logo": "https://homeplumbingusa.com/public/images/logo.svg"
    }
  }
  </script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="icon" type="image/png" href="/public/images/favicon.png">

  <style>
    .blog-hub-hero {
      padding: 60px 0 45px;
      background: linear-gradient(135deg, rgba(10, 22, 40, 0.98), rgba(15, 30, 60, 0.92));
      text-align: center;
      border-bottom: 1px solid var(--border-color);
    }
    .blog-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: rgba(37,99,235,0.15);
      border: 1px solid rgba(37,99,235,0.3);
      border-radius: 20px;
      color: var(--primary-light);
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .blog-search-box {
      max-width: 600px;
      margin: 28px auto 0;
      position: relative;
    }
    .blog-search-input {
      width: 100%;
      padding: 16px 20px 16px 50px;
      border-radius: 30px;
      border: 1px solid var(--border-color);
      background: var(--bg-card);
      color: #fff;
      font-size: 1rem;
      box-shadow: var(--shadow-sm);
      transition: var(--transition);
    }
    .blog-search-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37,99,235,0.25);
    }
    .blog-search-icon {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      font-size: 1.1rem;
    }
    .blog-filter-bar {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin: 32px auto 44px;
      max-width: 1200px;
    }
    .filter-btn {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      padding: 9px 18px;
      border-radius: 24px;
      font-weight: 600;
      font-size: 0.88rem;
      cursor: pointer;
      transition: var(--transition);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }
    .filter-btn:hover, .filter-btn.active {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
      box-shadow: 0 4px 14px rgba(37,99,235,0.3);
    }
    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 32px;
      margin-bottom: 60px;
    }
    .blog-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: var(--transition);
      box-shadow: var(--shadow-sm);
    }
    .blog-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
      border-color: rgba(37,99,235,0.4);
    }
    .blog-thumb-wrapper {
      position: relative;
      height: 220px;
      overflow: hidden;
    }
    .blog-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .blog-card:hover .blog-thumb {
      transform: scale(1.05);
    }
    .blog-category-tag {
      position: absolute;
      top: 14px;
      left: 14px;
      background: rgba(10,22,40,0.85);
      backdrop-filter: blur(8px);
      color: var(--accent);
      padding: 5px 12px;
      border-radius: 4px;
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .blog-card-body {
      padding: 24px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: space-between;
    }
    .blog-card-meta {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 0.82rem;
      color: var(--text-muted);
      margin-bottom: 12px;
    }
    .blog-card-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text-white);
      line-height: 1.4;
      margin-bottom: 12px;
      transition: var(--transition);
    }
    .blog-card:hover .blog-card-title {
      color: var(--primary-light);
    }
    .blog-card-excerpt {
      font-size: 0.94rem;
      color: var(--text-muted);
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .blog-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--border-color);
      padding-top: 16px;
      font-size: 0.88rem;
    }
    .blog-author-tag {
      color: var(--text-light);
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .read-more-link {
      color: var(--accent);
      font-weight: 700;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .no-results-msg {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
      color: var(--text-muted);
      display: none;
    }
  </style>
</head>
<body data-prefix="/" data-depth="0">

  <!-- Header -->
  <header class="header" id="header" style="min-height: 120px;">
    <div class="top-bar" style="min-height: 40px; height: 40px; display: flex; align-items: center; justify-content: center; text-align: center; white-space: nowrap;">
      <div class="top-bar-content">
        <span class="pulse-dot"></span>
        <span>Daily Plumbing Guides & Expert Advice &bull; Updated Daily by Master Plumbers</span>
      </div>
    </div>
    <div class="header-inner" style="min-height: 80px; height: 80px; display: flex; align-items: center; justify-content: space-between;">
      <a href="/" class="logo" style="width: 247px; max-width: 100%; display: flex; align-items: center;">
        <img src="/public/images/logo.svg" alt="Home Plumbing USA Logo" class="logo-img" width="247" height="52">
      </a>
      <nav class="nav" id="mainNav">
        <a href="/" class="nav-link">Home</a>
        <a href="/#states" class="nav-link">Areas We Serve</a>
        <a href="/services" class="nav-link">Services</a>
        <a href="/blog" class="nav-link active">Blog &amp; Guides <span class="nav-badge-pulse">Daily</span></a>
        <a href="/about" class="nav-link">About</a>
        <a href="/contact" class="nav-link">Contact</a>
      </nav>
      <div class="header-cta">
        <a href="tel:877-516-8705" class="header-phone"><i class="fas fa-phone"></i> 877-516-8705</a>
        <a href="tel:877-516-8705" class="btn btn-primary btn-sm">Call 24/7</a>
      </div>
      <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>

  <main>
    <!-- Blog Hero -->
    <section class="blog-hub-hero">
      <div class="container" style="max-width: 800px; margin: 0 auto;">
        <div class="blog-badge"><i class="fas fa-newspaper" style="color: var(--accent);"></i> Daily Plumbing Knowledge Base</div>
        <h1 style="font-size: 2.8rem; font-weight: 900; color: #fff; margin-bottom: 14px; line-height: 1.2;">
          Daily Plumbing <span style="color: var(--accent);">Guides &amp; Advice</span>
        </h1>
        <p style="font-size: 1.15rem; color: var(--text-muted); line-height: 1.7;">
          Expert answers, practical maintenance walkthroughs, and emergency procedures published daily by certified plumbers.
        </p>
        <div class="blog-search-box">
          <i class="fas fa-search blog-search-icon"></i>
          <input type="text" id="blogSearch" class="blog-search-input" placeholder="Search daily guides, clogs, water heaters, freezing pipes..." autocomplete="off">
        </div>
      </div>
    </section>

    <!-- Content & Filters -->
    <section class="section" style="padding: 40px 0 70px; background: var(--bg-dark);">
      <div class="container">
        <!-- Filter Tabs -->
        <div class="blog-filter-bar">
          ${filterButtonsHtml}
        </div>

        <!-- Blog Cards Grid -->
        <div class="blog-grid" id="blogGrid">
          ${cardsHtml}

          <div class="no-results-msg" id="noResults">
            <i class="fas fa-search" style="font-size: 2.5rem; color: var(--border-color); margin-bottom: 12px; display: block;"></i>
            <h3>No articles found matching your criteria.</h3>
            <p>Try searching for a different keyword or resetting your category filter.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Emergency Dispatch Banner -->
    <section class="cta-section" style="padding: 4rem 0; background: var(--gradient-cta); color: #fff; text-align: center;">
      <div class="container" style="max-width: 760px; margin: 0 auto;">
        <h2 style="font-size: 2.2rem; color: #fff; margin-bottom: 1rem; font-weight: 800;">Have a Plumbing Emergency That Can't Wait?</h2>
        <p style="font-size: 1.1rem; color: rgba(255,255,255,0.9); margin-bottom: 2rem; line-height: 1.6;">Don't spend hours troubleshooting when water is actively leaking. Connect with vetted, licensed local plumbers in under 45 minutes.</p>
        <a href="tel:877-516-8705" class="btn btn-accent" style="background: var(--accent); color: #fff; font-size: 1.15rem; font-weight: 800; padding: 16px 36px; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
          <i class="fas fa-phone-alt"></i> Call (877) 516-8705
        </a>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="footer" style="background: var(--bg-darker); border-top: 1px solid var(--border-color); padding: 70px 0 30px;">
    <div class="container">
      <div class="footer-grid" style="display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 50px;">
        <div class="footer-about">
          <a href="/" class="logo footer-logo" style="display: inline-block; margin-bottom: 18px;">
            <img src="/public/images/logo.svg" alt="Home Plumbing USA Logo" class="logo-img" width="247" height="52">
          </a>
          <h3 class="footer-title" style="font-size: 1.2rem; color: #fff; margin-bottom: 10px;">Daily Homeowner Plumbing Guides</h3>
          <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 16px;">Empowering homeowners nationwide with daily preventative advice, troubleshooting guides, and rapid 24/7 licensed plumbing dispatch.</p>
        </div>
        <div class="footer-col">
          <div class="footer-title" style="font-size: 1.1rem; color: #fff; font-weight: 700; margin-bottom: 16px;">Quick Links</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <a href="/" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Home</a>
            <a href="/blog" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Daily Guides</a>
            <a href="/services" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">All Services</a>
            <a href="/about" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">About Us</a>
            <a href="/contact" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Contact</a>
          </div>
        </div>
        <div class="footer-col">
          <div class="footer-title" style="font-size: 1.1rem; color: #fff; font-weight: 700; margin-bottom: 16px;">Top Services</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <a href="/services" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Emergency Plumbing</a>
            <a href="/services" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Burst Pipe Repair</a>
            <a href="/services" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Water Heater Repair</a>
            <a href="/services" style="color: var(--text-muted); text-decoration: none; font-size: 0.92rem;">Drain Cleaning</a>
          </div>
        </div>
        <div class="footer-col">
          <div class="footer-title" style="font-size: 1.1rem; color: #fff; font-weight: 700; margin-bottom: 16px;">24/7 Dispatch</div>
          <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 16px;">Talk directly with a live dispatch supervisor right now:</p>
          <a href="tel:877-516-8705" class="btn btn-accent" style="padding: 12px 20px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; border-radius: 8px; font-size: 0.95rem;">
            <i class="fas fa-phone-alt"></i> (877) 516-8705
          </a>
        </div>
      </div>
      <div class="footer-bottom" style="border-top: 1px solid var(--border-color); padding-top: 24px; text-align: center; color: var(--text-muted); font-size: 0.88rem;">
        <p>&copy; 2026 Home Plumbing USA. All rights reserved. Nationwide Plumbing Referral Network.</p>
        <div style="margin-top: 8px;">
          <a href="/privacy-policy" style="color: var(--text-muted); margin: 0 8px;">Privacy Policy</a> &bull;
          <a href="/terms-and-conditions" style="color: var(--text-muted); margin: 0 8px;">Terms &amp; Conditions</a> &bull;
          <a href="/disclaimer" style="color: var(--text-muted); margin: 0 8px;">Disclaimer</a>
        </div>
      </div>
    </div>
  </footer>

  <script src="/js/main.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const searchInput = document.getElementById('blogSearch');
      const filterBtns = document.querySelectorAll('.filter-btn');
      const cards = document.querySelectorAll('.blog-card');
      const noResults = document.getElementById('noResults');

      let currentCat = 'all';

      const urlParams = new URLSearchParams(window.location.search);
      const catParam = urlParams.get('category');
      if (catParam) {
        const targetBtn = document.querySelector('.filter-btn[data-cat="' + catParam + '"]');
        if (targetBtn) {
          filterBtns.forEach(b => b.classList.remove('active'));
          targetBtn.classList.add('active');
          currentCat = catParam;
        }
      }

      function filterArticles() {
        const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
        let visibleCount = 0;

        cards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          const cardKeywords = (card.getAttribute('data-keywords') || '').toLowerCase();
          const cardTitle = card.querySelector('.blog-card-title').textContent.toLowerCase();
          const cardExcerpt = card.querySelector('.blog-card-excerpt').textContent.toLowerCase();

          const matchesCat = (currentCat === 'all' || cardCat === currentCat);
          const matchesQuery = !query || cardTitle.includes(query) || cardExcerpt.includes(query) || cardKeywords.includes(query);

          if (matchesCat && matchesQuery) {
            card.style.display = 'flex';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        if (noResults) {
          noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
      }

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentCat = btn.getAttribute('data-cat');
          filterArticles();
        });
      });

      if (searchInput) {
        searchInput.addEventListener('input', filterArticles);
      }

      filterArticles();
    });
  </script>
</body>
</html>`;
}

console.log(`Generating ${blogs.length} daily blog static pages...`);
let generatedCount = 0;

blogs.forEach(post => {
  const postDir = path.join(blogRootDir, post.slug);
  if (!fs.existsSync(postDir)) {
    fs.mkdirSync(postDir, { recursive: true });
  }

  const postHtml = buildPostHtml(post, blogs);
  fs.writeFileSync(path.join(postDir, 'index.html'), postHtml, 'utf8');
  generatedCount++;
  console.log(`  [Blog Post] Built /blog/${post.slug}/index.html`);
});

// Update blog.html hub and blog/index.html (prevents 403 Forbidden on /blog/)
const hubPath = path.join(__dirname, '..', 'blog.html');
const hubHtml = buildBlogHubHtml(blogs);
fs.writeFileSync(hubPath, hubHtml, 'utf8');

const blogDirIndex = path.join(blogRootDir, 'index.html');
fs.writeFileSync(blogDirIndex, hubHtml, 'utf8');
console.log(`  [Blog Hub] Updated blog.html and blog/index.html successfully with ${CATEGORIES.length} categories and ${blogs.length} cards!`);

console.log(`\nBlog generation complete! Total ${generatedCount} static post pages generated + blog.html updated.`);
