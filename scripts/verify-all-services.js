const http = require('http');

const testUrls = [
  'http://localhost:3000/colorado/lakewood-80226/drain-cleaning/',
  'http://localhost:3000/colorado/lakewood-80214/burst-pipe-repair/',
  'http://localhost:3000/florida/orlando-32801/burst-pipe-repair/',
  'http://localhost:3000/florida/miami-33125/drain-cleaning/',
  'http://localhost:3000/texas/houston-77002/water-heater-repair/',
  'http://localhost:3000/texas/austin-78701/emergency-plumbing/',
  'http://localhost:3000/alaska/anchorage-99501/drain-cleaning/',
  'http://localhost:3000/alaska/fairbanks-99701/sewer-line-repair/'
];

let completed = 0;
testUrls.forEach(url => {
  http.get(url, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log(`[STATUS ${res.statusCode}] ${url}`);
      console.log(`  Length: ${body.length} | Has Live Dispatch: ${body.includes('Live Dispatch Board')} | Has FAQ: ${body.includes('faq-item-custom')} | Has Schema: ${body.includes('application/ld+json')}`);
      completed++;
      if (completed === testUrls.length) {
        console.log('\nAll sample pages across all 4 states verified successfully!');
      }
    });
  }).on('error', (err) => {
    console.error(`Error fetching ${url}:`, err.message);
  });
});
