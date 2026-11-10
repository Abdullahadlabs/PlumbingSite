const fs = require('fs');
const path = require('path');

const alaskaDir = path.join(__dirname, '..', 'alaska');
const dirs = fs.readdirSync(alaskaDir).filter(d => fs.statSync(path.join(alaskaDir, d)).isDirectory());

// Build a set of valid zip directory slugs for filtering
const validSlugs = new Set(dirs);

const data = {};

dirs.forEach(dir => {
  const htmlPath = path.join(alaskaDir, dir, 'index.html');
  if (!fs.existsSync(htmlPath)) return;
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Extract only the "Other Alaska Communities" section links
  const nearbySection = html.split('Other Alaska Communities')[1] || '';
  const nearby = [];
  const regex = /href="\/alaska\/([^"\/]+)\/"[^>]*>[\s\S]*?<\/i>\s*([^<]+)/g;
  let match;
  while ((match = regex.exec(nearbySection)) !== null) {
    const slug = match[1].trim();
    const label = match[2].trim();
    if (slug !== dir && validSlugs.has(slug)) {
      nearby.push({ slug, label });
    }
  }
  data[dir] = nearby.slice(0, 20);
});

const outputPath = path.join(__dirname, 'alaska-nearby-data.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log(`Extracted nearby data for ${Object.keys(data).length} directories`);

// Show some samples
['anchorage-99501', 'fairbanks-99701', 'juneau-99801', 'adak-99546'].forEach(key => {
  if (data[key]) {
    console.log(`${key}: ${data[key].length} nearby cities -> ${data[key].slice(0, 3).map(n => n.label).join(', ')}...`);
  }
});
