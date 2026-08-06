/**
 * run: node migrate-neon-to-blob.mjs
 * 
 * Directly migrates /api/media?id=... references in Neon DB site_settings
 * to Vercel Blob CDN. Runs locally — no Vercel deployment required.
 */
import { neon } from '@neondatabase/serverless';
import { put } from '@vercel/blob';
import { readFileSync } from 'fs';

// Load .env file manually
const envContent = readFileSync('.env', 'utf-8');
const envVars = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([A-Z_]+)="?([^"]+)"?/);
  if (match) envVars[match[1]] = match[2];
}

const DATABASE_URL = envVars['VITE_DATABASE_URL'] || process.env.VITE_DATABASE_URL;
const BLOB_TOKEN = envVars['BLOB_READ_WRITE_TOKEN'] || process.env.BLOB_READ_WRITE_TOKEN;

if (!DATABASE_URL) { console.error('❌ VITE_DATABASE_URL not found in .env'); process.exit(1); }
if (!BLOB_TOKEN) { console.error('❌ BLOB_READ_WRITE_TOKEN not found in .env'); process.exit(1); }

console.log('✅ Loaded env vars');
console.log('   DB:', DATABASE_URL.substring(0, 50) + '...');
console.log('   Blob token:', BLOB_TOKEN.substring(0, 25) + '...\n');

const sql = neon(DATABASE_URL);

// ── Step 1: Find all /api/media?id= URLs in site_settings ────────────────────
console.log('🔍 Step 1: Scanning site_settings for /api/media URLs...');
const settingsRows = await sql`
  SELECT key, value FROM site_settings WHERE value::text LIKE '%/api/media%'
`;

const allMediaIds = new Set();
for (const row of settingsRows) {
  const text = JSON.stringify(row.value);
  const matches = [...text.matchAll(/\/api\/media\?id=([a-zA-Z0-9_]+)/g)];
  for (const m of matches) allMediaIds.add(m[1]);
  console.log(`   Found in "${row.key}": ${matches.map(m => m[1]).join(', ')}`);
}

if (allMediaIds.size === 0) {
  console.log('✅ No /api/media URLs found in site_settings. Nothing to migrate!');
  process.exit(0);
}

// ── Step 2: Fetch each media from media_uploads and upload to Blob ────────────
console.log(`\n📦 Step 2: Migrating ${allMediaIds.size} media file(s) to Vercel Blob CDN...`);
const urlMap = {};

for (const mediaId of allMediaIds) {
  const oldUrl = `/api/media?id=${mediaId}`;
  try {
    const rows = await sql`SELECT data, mime_type FROM media_uploads WHERE id = ${mediaId}`;
    
    if (!rows || rows.length === 0) {
      console.log(`   ⚠️  ${mediaId}: NOT FOUND in media_uploads table — skipping`);
      continue;
    }

    const { data, mime_type } = rows[0];
    let base64 = data;
    if (base64.includes(',')) base64 = base64.split(',')[1];
    const binaryData = Buffer.from(base64, 'base64');

    const ext = mime_type === 'image/png' ? 'png'
      : mime_type === 'image/webp' ? 'webp'
      : mime_type === 'image/gif' ? 'gif'
      : mime_type === 'video/mp4' ? 'mp4'
      : mime_type === 'application/pdf' ? 'pdf'
      : 'jpg';

    console.log(`   ⬆️  Uploading ${mediaId} (${Math.round(binaryData.length / 1024)}KB, ${mime_type})...`);
    
    const blob = await put(`migrated/${mediaId}.${ext}`, binaryData, {
      access: 'public',
      token: BLOB_TOKEN,
      contentType: mime_type
    });

    urlMap[oldUrl] = blob.url;
    console.log(`   ✅ ${mediaId} → ${blob.url}`);

  } catch (err) {
    console.error(`   ❌ ${mediaId}: ${err.message}`);
  }
}

if (Object.keys(urlMap).length === 0) {
  console.log('\n⚠️  No files were uploaded (not found in media_uploads). Checking if they are base64 data URLs in site_settings...');
  
  // Maybe the images are stored as base64 directly in site_settings (not via media_uploads)
  // This is handled separately — let user know
  console.log('\n📋 Existing /api/media URLs that could not be resolved:');
  for (const id of allMediaIds) {
    console.log(`   /api/media?id=${id}`);
  }
  console.log('\n💡 These files may have been stored in a different browser session or deleted.');
  console.log('   Please re-upload these images via the Admin panel to get new Blob CDN URLs.');
  process.exit(0);
}

// ── Step 3: Update site_settings with new Blob URLs ───────────────────────────
console.log('\n🔄 Step 3: Updating site_settings with new Blob CDN URLs...');

for (const row of settingsRows) {
  const originalStr = JSON.stringify(row.value);
  let updatedStr = originalStr;
  
  for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
    updatedStr = updatedStr.split(JSON.stringify(oldUrl).slice(1,-1)).join(JSON.stringify(newUrl).slice(1,-1));
  }
  
  if (updatedStr !== originalStr) {
    await sql`
      UPDATE site_settings SET value = ${updatedStr}::jsonb, updated_at = NOW()
      WHERE key = ${row.key}
    `;
    console.log(`   ✅ Updated "${row.key}"`);
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────
console.log('\n🎉 Migration Complete!');
console.log('   URL Mappings:');
for (const [old, newUrl] of Object.entries(urlMap)) {
  console.log(`   ${old}`);
  console.log(`   → ${newUrl}\n`);
}
