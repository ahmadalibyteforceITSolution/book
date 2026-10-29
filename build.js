const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- Starting Unified Build ---');
console.log('Current working directory:', process.cwd());

const possibleClientDirs = [
  path.resolve(__dirname, 'client'),
  path.resolve(__dirname, '../client'),
  path.resolve(process.cwd(), 'client'),
  path.resolve(process.cwd(), '../client')
];

const clientDir = possibleClientDirs.find(d => fs.existsSync(path.join(d, 'package.json')));

if (!clientDir) {
  console.error('ERROR: Could not locate client directory in:', possibleClientDirs);
  process.exit(1);
}

console.log('Found client directory at:', clientDir);

// 1. Install client dependencies
console.log('Installing client dependencies...');
execSync(`npm --prefix "${clientDir}" install`, { stdio: 'inherit' });

// 2. Build client
console.log('Building client with Vite...');
execSync(`npm --prefix "${clientDir}" run build`, { stdio: 'inherit' });

// 3. Ensure dist exists and copy to all possible output directories
const clientDist = path.join(clientDir, 'dist');
if (fs.existsSync(clientDist)) {
  const targetDirs = [
    path.resolve(__dirname, 'dist'),
    path.resolve(__dirname, 'client', 'dist'),
    path.resolve(__dirname, 'server', 'dist'),
    path.resolve(process.cwd(), 'dist')
  ];

  const entryCode = `const express = require('express');
const path = require('path');

let app;
const possibleServerPaths = [
  path.resolve(__dirname, '../server.js'),
  path.resolve(__dirname, '../../server/server.js'),
  path.resolve(__dirname, '../server/server.js')
];
for (const p of possibleServerPaths) {
  try {
    const candidate = require(p);
    if (candidate && (typeof candidate === 'function' || candidate.use)) {
      app = candidate;
      break;
    }
  } catch (e) {}
}

if (!app) {
  app = express();
  app.use(express.static(__dirname));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
}

module.exports = app;
`;

  targetDirs.forEach(target => {
    try {
      fs.mkdirSync(target, { recursive: true });
      if (target !== clientDist) {
        fs.cpSync(clientDist, target, { recursive: true });
      }
      // Create index.js, server.js, app.js that explicitly import express
      fs.writeFileSync(path.join(target, 'index.js'), entryCode);
      fs.writeFileSync(path.join(target, 'server.js'), entryCode);
      fs.writeFileSync(path.join(target, 'app.js'), entryCode);
      console.log('Synced dist and generated express entrypoints in:', target);
    } catch (err) {
      console.error('Copy/entrypoint note:', err.message);
    }
  });
}

console.log('--- Unified Build Completed Successfully! ---');
