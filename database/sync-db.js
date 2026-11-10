const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://rokjdhlqigfmfpbkaqlq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJva2pkaGxxaWdmbWZwYmthcWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5ODI2NzAsImV4cCI6MjA5ODU1ODY3MH0.x5n0OI8sVRafJYPlEGuysv8xGFnEOP8wRiuCevJgTzI';

async function fetchTable(tableName, orderBy) {
  console.log(`Fetching ${tableName} from Supabase...`);
  let allRows = [];
  let offset = 0;
  const limit = 1000;
  let hasMore = true;

  while (hasMore) {
    console.log(`Fetching ${tableName} rows ${offset} to ${offset + limit}...`);
    const url = `${SUPABASE_URL}/rest/v1/${tableName}?select=*&limit=${limit}&offset=${offset}&order=${orderBy}`;
    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      console.error(`Error fetching ${tableName}: ${response.statusText} (${response.status})`);
      process.exit(1);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error(`Expected an array from ${tableName} fetch.`);
      process.exit(1);
    }

    allRows = allRows.concat(data);
    console.log(`Fetched ${data.length} rows. Total so far: ${allRows.length}`);

    if (data.length < limit) {
      hasMore = false;
    } else {
      offset += limit;
    }
  }

  return allRows;
}

async function main() {
  const seoPages = await fetchTable('seo_pages', 'zip.asc');
  const seoPath = path.join(__dirname, 'seo-pages.json');
  fs.writeFileSync(seoPath, JSON.stringify(seoPages, null, 2), 'utf8');
  console.log(`Successfully synced ${seoPages.length} rows to ${seoPath}`);

  const serviceAreaPages = await fetchTable('service_area_pages', 'zip.asc,service_slug.asc');
  const serviceAreaPath = path.join(__dirname, 'service-area-pages.json');
  fs.writeFileSync(serviceAreaPath, JSON.stringify(serviceAreaPages, null, 2), 'utf8');
  console.log(`Successfully synced ${serviceAreaPages.length} rows to ${serviceAreaPath}`);
}

main().catch(err => {
  console.error('Error running sync script:', err);
  process.exit(1);
});
