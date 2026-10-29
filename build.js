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

  targetDirs.forEach(target => {
    if (target !== clientDist) {
      try {
        fs.mkdirSync(target, { recursive: true });
        fs.cpSync(clientDist, target, { recursive: true });
        console.log('Synced dist to:', target);
      } catch (err) {
        // Ignore copy errors
      }
    }
  });
}

console.log('--- Unified Build Completed Successfully! ---');
