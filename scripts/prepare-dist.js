const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const clientDist = path.join(rootDir, 'client', 'dist');
const adminDist = path.join(rootDir, 'admin', 'dist');
const rootDist = path.join(rootDir, 'dist');
const rootAdminDist = path.join(rootDist, 'admin');

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function prepareDist() {
  console.log('📦 [Prepare Dist]: Consolidating client and admin builds for Vercel/Production deployment...');

  if (!fs.existsSync(clientDist)) {
    console.warn('⚠️ [Prepare Dist]: client/dist does not exist. Skipping storefront copy.');
  } else {
    copyDirSync(clientDist, rootDist);
    console.log('✓ Storefront copied to dist/');
  }

  if (!fs.existsSync(adminDist)) {
    console.warn('⚠️ [Prepare Dist]: admin/dist does not exist. Skipping admin copy.');
  } else {
    copyDirSync(adminDist, rootAdminDist);
    if (fs.existsSync(path.join(adminDist, 'assets'))) {
      copyDirSync(path.join(adminDist, 'assets'), path.join(rootDist, 'assets'));
    }
    console.log('✓ Admin dashboard copied to dist/admin/ and assets merged to dist/assets/');
  }

  console.log('✅ [Prepare Dist]: Consolidated production assets ready in dist/');
}

prepareDist();
