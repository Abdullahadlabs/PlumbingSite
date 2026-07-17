const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://rokjdhlqigfmfpbkaqlq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJva2pkaGxxaWdmbWZwYmthcWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5ODI2NzAsImV4cCI6MjA5ODU1ODY3MH0.x5n0OI8sVRafJYPlEGuysv8xGFnEOP8wRiuCevJgTzI';

async function main() {
  console.log('Fetching SEO pages from Supabase...');
  let allPages = [];
  let offset = 0;
  // Supabase REST API has a default server-side limit of 1000 rows per request.
  // We implement robust offset-based pagination to bypass this limit and retrieve all 50,000+ future records.
  const limit = 1000;
  let hasMore = true;

  while (hasMore) {
    console.log(`Fetching rows ${offset} to ${offset + limit}...`);
    const url = `${SUPABASE_URL}/rest/v1/seo_pages?select=*&limit=${limit}&offset=${offset}&order=state.asc,city.asc`;
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      console.error(`Error fetching data: ${response.statusText} (${response.status})`);
      process.exit(1);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error('Expected an array of pages from Supabase REST API.');
      process.exit(1);
    }

    allPages = allPages.concat(data);
    console.log(`Fetched ${data.length} rows. Total so far: ${allPages.length}`);

    if (data.length < limit) {
      hasMore = false;
    } else {
      offset += limit;
    }
  }

  const outputPath = path.join(__dirname, 'seo-pages.json');
  fs.writeFileSync(outputPath, JSON.stringify(allPages, null, 2), 'utf8');
  console.log(`Successfully synced ${allPages.length} rows to ${outputPath}`);
}

main().catch(err => {
  console.error('Error running sync script:', err);
  process.exit(1);
});
