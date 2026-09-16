const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=UTF-8'
};

const server = http.createServer((req, res) => {
  let rawUrl = req.url.split('?')[0];
  let query = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';

  // 1. Normalize duplicate slashes (e.g. //alaska/... -> /alaska/...)
  if (rawUrl.match(/\/{2,}/)) {
    const cleanUrl = rawUrl.replace(/\/+/g, '/') + query;
    res.writeHead(301, { 'Location': cleanUrl });
    res.end();
    return;
  }

  let reqUrl = decodeURI(rawUrl);
  if (reqUrl.startsWith('/images/')) {
    reqUrl = reqUrl.replace('/images/', '/public/images/');
  }
  let filePath = path.join(ROOT, reqUrl);

  // Security check: ensure within ROOT
  if (!filePath.startsWith(ROOT)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }

  // 2. Enforce trailing slash on directories
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    if (!reqUrl.endsWith('/')) {
      res.writeHead(301, { 'Location': reqUrl + '/' + query });
      res.end();
      return;
    }
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.statusCode = 404;
    res.end(`File not found: ${reqUrl}`);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Local preview server is active at http://localhost:${PORT}/`);
  console.log(`Direct pilot URL: http://localhost:${PORT}/alaska/anchorage-99507/drain-cleaning/`);
});
