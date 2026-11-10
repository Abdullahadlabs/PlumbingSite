const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { buildSitemaps, inventory } = require('../generate-sitemaps');
const hubs = ['state/alaska/index.html', 'state/texas/index.html', 'state/florida/index.html', 'colorado/index.html'];
const fixture = new Set([...hubs, 'index.html', 'blog/index.html', 'privacy-policy.html',
  'texas/austin-78735/index.html', 'texas/austin-78735/drain-cleaning/index.html',
  'texas/empty-directory/readme.txt', 'blog/example/index.html']);
const maps = buildSitemaps(fixture);
assert.deepEqual(maps['sitemap-tx.xml'], [
  'https://homeplumbingusa.com/state/texas/',
  'https://homeplumbingusa.com/texas/austin-78735/drain-cleaning/',
  'https://homeplumbingusa.com/texas/austin-78735/'
]);
assert(maps['sitemap-pages.xml'].includes('https://homeplumbingusa.com/blog/'));
assert(maps['sitemap-pages.xml'].includes('https://homeplumbingusa.com/privacy-policy/'));
assert(!maps['sitemap-pages.xml'].includes('https://homeplumbingusa.com/contact'));
assert.throws(() => buildSitemaps(new Set()), /Missing state hub/);
const root = path.resolve(__dirname, '..');
const files = inventory(root);
const actual = buildSitemaps(files);
let total = 0;
for (const [name, urls] of Object.entries(actual)) {
  const xml = fs.readFileSync(path.join(root, name), 'utf8');
  assert(!xml.includes('<lastmod>'), 'Do not publish invented modification dates');
  const published = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  assert.deepEqual(published, urls);
  for (const url of urls) {
    const pathname = new URL(url).pathname;
    const file = /^\/(privacy-policy|terms-and-conditions)\/$/.test(pathname)
      ? pathname.slice(1, -1) + '.html'
      : pathname.endsWith('/') ? pathname.slice(1) + 'index.html' : pathname.slice(1) + '.html';
    assert(files.has(file), `Missing HTML for ${url}`);
  }
  total += urls.length;
}
assert.equal(new Set(Object.values(actual).flat()).size, total);
console.log(`Sitemap tests passed: ${total} unique URLs, all mapped to HTML files.`);
