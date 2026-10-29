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

  const serverDir = fs.existsSync(path.resolve(__dirname, 'server')) 
    ? path.resolve(__dirname, 'server') 
    : (fs.existsSync(path.resolve(__dirname, '../server')) ? path.resolve(__dirname, '../server') : __dirname);

  const serverJsSrc = path.join(serverDir, 'server.js');
  const modelsSrc = path.join(serverDir, 'models');
  const dataSrc = path.join(serverDir, 'data');

  const entryCode = `const express = require('express');
const app = require('./server.js');
module.exports = app;
`;

  targetDirs.forEach(target => {
    try {
      fs.mkdirSync(target, { recursive: true });
      if (target !== clientDist) {
        fs.cpSync(clientDist, target, { recursive: true });
      }

      // Copy server.js, models, and data directly into dist so dist is 100% self-contained
      if (fs.existsSync(serverJsSrc)) {
        fs.copyFileSync(serverJsSrc, path.join(target, 'server.js'));
      }
      if (fs.existsSync(modelsSrc)) {
        fs.cpSync(modelsSrc, path.join(target, 'models'), { recursive: true });
      }
      if (fs.existsSync(dataSrc)) {
        fs.cpSync(dataSrc, path.join(target, 'data'), { recursive: true });
      }

      // Create index.js, app.js that require ./server.js
      fs.writeFileSync(path.join(target, 'index.js'), entryCode);
      fs.writeFileSync(path.join(target, 'app.js'), entryCode);

      console.log('Synced dist, bundled backend and express entrypoints in:', target);
    } catch (err) {
      console.error('Copy/entrypoint note:', err.message);
    }
  });
}

console.log('--- Unified Build Completed Successfully! ---');
