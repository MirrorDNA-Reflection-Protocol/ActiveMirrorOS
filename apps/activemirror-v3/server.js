const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8087;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  // CORS headers for local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // Serve the friendly version by default
  let filePath;
  if (req.url === '/' || req.url === '/index.html') {
    filePath = '/index-friendly.html';
  } else if (req.url === '/?v=dark' || req.url === '/index.html?v=dark') {
    filePath = '/index-2030.html';
  } else if (req.url === '/?v=legacy' || req.url === '/index.html?v=legacy') {
    filePath = '/index.html';
  } else {
    filePath = req.url;
  }
  filePath = path.join(ROOT, filePath.split('?')[0]);
  
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('Not Found');
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
      return;
    }
    
    // Cache control for dev
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠ Port ${PORT} already in use. Kill existing process first.`);
    process.exit(1);
  }
  console.error('Server error:', err);
});

server.listen(PORT, () => {
  console.log(`\n◈ ActiveMirror 2030 Dev Server`);
  console.log(`  ──────────────────────────────────`);
  console.log(`  🚀 2030 Experience: http://localhost:${PORT}/`);
  console.log(`  📦 Legacy Version:  http://localhost:${PORT}/?v=legacy`);
  console.log(`  ──────────────────────────────────`);
  console.log(`  Press Ctrl+C to stop\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  server.close(() => process.exit(0));
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
