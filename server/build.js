const fs = require('fs');
const path = require('path');

// If root build.js exists, invoke it
const rootBuild = path.resolve(__dirname, '../build.js');
if (fs.existsSync(rootBuild)) {
  require(rootBuild);
} else {
  const { execSync } = require('child_process');
  const clientDir = path.resolve(__dirname, '../client');
  execSync(`npm --prefix "${clientDir}" install && npm --prefix "${clientDir}" run build`, { stdio: 'inherit' });
  const src = path.resolve(clientDir, 'dist');
  const dst = path.resolve(__dirname, 'dist');
  fs.cpSync(src, dst, { recursive: true });
}
