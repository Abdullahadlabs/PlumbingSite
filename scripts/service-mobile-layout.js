'use strict';
// Build-time markup shared by existing static pages and future service builds.
const STYLE = `<style id="service-mobile-layout">
.service-page-wrapper .header { padding-left:0; padding-right:0; }
.service-page-wrapper .header .top-bar { box-sizing:border-box; height:40px; min-height:40px; max-height:none; padding:6px 16px; text-align:center; }
.service-page-wrapper .service-top-message { display:flex; justify-content:center; align-items:center; width:100%; margin:0; font-size:13px; line-height:1.45; font-weight:600; }
.service-page-wrapper .header .nav-container { box-sizing:border-box; min-height:80px; padding:12px 20px; gap:16px; }
.service-page-wrapper .header .logo { flex:0 1 220px; width:220px; min-width:0; }
.service-page-wrapper .header .logo img { display:block; width:100%; max-width:220px; height:46px; object-fit:contain; object-position:left center; }
.service-page-wrapper .header .menu-toggle { flex:0 0 44px; min-height:44px; margin-left:auto; }
.service-page-wrapper > main { padding-top:120px !important; }
.service-mobile-actions { display:none; }
@media(max-width:1024px) {
 body.service-page-wrapper { padding-bottom:calc(60px + env(safe-area-inset-bottom, 0px)) !important; }
 .service-mobile-actions { display:flex; position:fixed; left:0; right:0; bottom:0; width:100%; height:calc(60px + env(safe-area-inset-bottom, 0px)); padding-bottom:env(safe-area-inset-bottom, 0px); box-sizing:border-box; background:#003366; z-index:10000; box-shadow:0 -2px 10px rgba(0,0,0,.2); }
 .service-mobile-actions a { flex:1 1 50%; min-width:0; display:flex; align-items:center; justify-content:center; gap:8px; min-height:60px; color:#fff; font-size:16px; font-weight:700; text-decoration:none; }
 .service-mobile-actions a:first-child { background:#d97706; }
 .service-mobile-actions a:last-child { background:#003366; }
 .service-mobile-actions a:focus-visible { outline:3px solid #fff; outline-offset:-5px; }
 .service-mobile-actions svg { width:18px; height:18px; flex:none; }
}
@media(max-width:992px) {
 .service-page-wrapper .header .top-bar { height:48px; min-height:48px; overflow:visible; }
 .service-page-wrapper .header .nav-container { height:80px; }
 .service-page-wrapper .header .nav-ctas { display:none; }
 .service-page-wrapper > main { padding-top:128px !important; }
 .service-page-wrapper .hero { padding-top:2rem !important; }
 .service-page-wrapper #mainNav { padding-bottom:calc(80px + env(safe-area-inset-bottom, 0px)) !important; }
}
</style>`;
const BAR = `<nav class="service-mobile-actions" aria-label="Contact options">
 <a href="tel:877-516-8705" data-service-sticky-call aria-label="Call 877-516-8705 for a plumbing referral"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>Call Now</a>
 <a href="/contact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="m22 2-11 11"/></svg>Get a Quote</a>
</nav>
<script>
document.querySelector('[data-service-sticky-call]').addEventListener('click', function () {
 window.dataLayer = window.dataLayer || [];
 window.dataLayer.push({event:'phone_click',click_location:'service-sticky-bar',phone_number:'877-516-8705'});
});
</script>`;
function apply(html) {
 if(!html.includes('<body class="service-page-wrapper">') || html.includes('id="service-mobile-layout"'))return html;
 const pattern=/<div class="top-bar">[\s\S]*?(?=\s*<!-- Navigation Container -->)/;
 if(!pattern.test(html))throw Error('Service header marker missing');
 let out=html.replace(pattern,'<div class="top-bar"><p class="service-top-message">Plumbing referrals — confirm availability and pricing</p></div>\n');
 out=out.replace('</head>',STYLE+'\n</head>').replace('</body>',BAR+'\n</body>');
 out=out.replace("mainNav.style.top = '70px';", "const headerBottom = Math.max(0, document.getElementById('header').getBoundingClientRect().bottom);\n            mainNav.style.top = headerBottom + 'px';")
 .replace("mainNav.style.height = 'calc(100vh - 70px)';", "mainNav.style.height = 'calc(100dvh - ' + headerBottom + 'px)';");
 return out;
}
module.exports={apply};
