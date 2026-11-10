const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const DOMAIN = 'https://homeplumbingusa.com';
const STATES = { alaska: 'ak', texas: 'tx', florida: 'fl', colorado: 'colorado' };

// Use Git's file inventory in a checkout, including newly generated files.
// This also works in a sparse checkout without silently dropping whole states.
// On a deployed copy without Git, inspect the generated files on disk.
function inventory(root) {
  if (fs.existsSync(path.join(root, '.git'))) {
    const args = { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 };
    const files = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], args).split('\0');
    const deleted = new Set(execFileSync('git', ['ls-files', '-z', '--deleted'], args).split('\0'));
    return new Set(files.filter(f => f.endsWith('.html') && !deleted.has(f)));
  }
  const files = new Set();
  function walk(relative) {
    const absolute = path.join(root, relative);
    if (!fs.existsSync(absolute)) return;
    for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
      const file = relative ? `${relative}/${entry.name}` : entry.name;
      if (entry.isFile() && entry.name.endsWith('.html')) files.add(file);
      else if (entry.isDirectory() && (relative || [...Object.keys(STATES), 'state', 'blog'].includes(entry.name))) walk(file);
    }
  }
  walk('');
  return files;
}

function xmlEscape(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function buildSitemaps(files) {
  const maps = {};
  for (const [state, suffix] of Object.entries(STATES)) {
    const urls = [];
    // Colorado has a dedicated, self-canonical state landing page.
    const hub = state === 'colorado' ? 'colorado/index.html' : `state/${state}/index.html`;
    if (!files.has(hub)) throw new Error(`Missing state hub: ${hub}`);
    urls.push(DOMAIN + '/' + hub.replace(/index\.html$/, ''));
    const pagePattern = new RegExp(`^${state}/[a-z0-9-]+-\\d{5}/(?:[a-z0-9-]+/)?index\\.html$`);
    for (const file of [...files].sort()) {
      if (pagePattern.test(file)) urls.push(DOMAIN + '/' + file.replace(/index\.html$/, ''));
    }
    maps[`sitemap-${suffix}.xml`] = urls;
  }
  const roots = {
    'index.html': '/', 'blog/index.html': '/blog/', 'about.html': '/about',
    'services.html': '/services', 'projects.html': '/projects', 'contact.html': '/contact',
    'privacy-policy.html': '/privacy-policy/', 'terms-and-conditions.html': '/terms-and-conditions/'
  };
  const pages = Object.entries(roots).filter(([file]) => files.has(file)).map(([, url]) => DOMAIN + url);
  for (const file of [...files].sort()) {
    if (/^blog\/[a-z0-9-]+\/index\.html$/.test(file)) pages.push(DOMAIN + '/' + file.replace(/index\.html$/, ''));
  }
  maps['sitemap-pages.xml'] = pages;
  const seen = new Set();
  for (const urls of Object.values(maps)) {
    if (urls.length > 50000) throw new Error('Sitemap exceeds the 50,000 URL limit; split it before publishing.');
    for (const url of urls) {
      if (seen.has(url)) throw new Error(`Duplicate sitemap URL: ${url}`);
      seen.add(url);
    }
  }
  return maps;
}

function generate(root = __dirname) {
  const maps = buildSitemaps(inventory(root));
  // Omit optional lastmod until meaningful content modification dates are
  // available. Build time and checkout timestamps are not page-update dates.
  for (const [name, urls] of Object.entries(maps)) {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${xmlEscape(url)}</loc></url>`).join('\n')}\n</urlset>\n`;
    fs.writeFileSync(path.join(root, name), xml);
    console.log(`${name}: ${urls.length} URLs`);
  }
  fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.keys(maps).map(name => `  <sitemap><loc>${DOMAIN}/${name}</loc></sitemap>`).join('\n')}\n</sitemapindex>\n`);
  return maps;
}

if (require.main === module) generate();
module.exports = { inventory, buildSitemaps, generate };
