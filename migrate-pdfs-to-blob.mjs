/**
 * Migrate all PDF/document URLs in Neon DB `documents` table to Vercel Blob CDN.
 * run: node migrate-pdfs-to-blob.mjs
 */
import { neon } from '@neondatabase/serverless';
import { put } from '@vercel/blob';
import { readFileSync } from 'fs';

// Load .env
const envLines = readFileSync('.env', 'utf-8').split('\n');
const env = {};
for (const line of envLines) {
  const m = line.match(/^([A-Z_]+)="?([^"\n]+)"?/);
  if (m) env[m[1]] = m[2].trim();
}

const DATABASE_URL = env['VITE_DATABASE_URL'];
const BLOB_TOKEN = env['BLOB_READ_WRITE_TOKEN'];

if (!DATABASE_URL || !BLOB_TOKEN) {
  console.error('❌ Missing VITE_DATABASE_URL or BLOB_READ_WRITE_TOKEN in .env');
  process.exit(1);
}

console.log('✅ Env loaded. Starting PDF migration...\n');
const sql = neon(DATABASE_URL);

// ── Step 1: Inspect all document URLs ────────────────────────────────────────
const docs = await sql`SELECT id, title, view_url, download_url FROM documents ORDER BY created_at DESC`;

console.log(`📋 Found ${docs.length} documents in DB.\n`);

let needsMigration = 0;
let alreadyBlob = 0;
let externalUrl = 0;

for (const doc of docs) {
  const viewType = doc.view_url?.startsWith('data:') ? 'base64'
    : doc.view_url?.startsWith('/api/media') ? 'api/media'
    : doc.view_url?.includes('blob.vercel-storage.com') ? 'blob-cdn'
    : doc.view_url?.startsWith('http') ? 'external'
    : 'other';

  if (viewType === 'blob-cdn') alreadyBlob++;
  else if (viewType === 'external') externalUrl++;
  else if (viewType === 'base64' || viewType === 'api/media') needsMigration++;

  const preview = (doc.view_url || '').substring(0, 60);
  console.log(`  [${viewType.padEnd(10)}] ${doc.title?.substring(0,40)} — ${preview}...`);
}

console.log(`\n📊 Summary:`);
console.log(`   Already on Blob CDN : ${alreadyBlob}`);
console.log(`   External URL (skip) : ${externalUrl}`);
console.log(`   Needs migration     : ${needsMigration}`);

if (needsMigration === 0) {
  console.log('\n✅ No PDFs need migration! All documents are already on CDN or external URLs.');
  process.exit(0);
}

// ── Step 2: Migrate base64 and /api/media PDF URLs ───────────────────────────
console.log('\n⬆️  Starting migration of PDFs to Vercel Blob CDN...\n');

async function uploadDataUrl(dataUrl, filename, mimeType) {
  let base64 = dataUrl;
  if (base64.includes(',')) base64 = base64.split(',')[1];
  const binary = Buffer.from(base64, 'base64');
  const blob = await put(filename, binary, {
    access: 'public',
    token: BLOB_TOKEN,
    contentType: mimeType || 'application/pdf'
  });
  return blob.url;
}

async function resolveApiMediaUrl(mediaId) {
  try {
    const rows = await sql`SELECT data, mime_type FROM media_uploads WHERE id = ${mediaId}`;
    if (!rows?.length) return null;
    return { data: rows[0].data, mimeType: rows[0].mime_type };
  } catch { return null; }
}

let migrated = 0;
let failed = 0;
let skipped = 0;

for (const doc of docs) {
  for (const field of ['view_url', 'download_url']) {
    const url = doc[field];
    if (!url) continue;

    if (url.includes('blob.vercel-storage.com') || url.startsWith('http')) {
      // already CDN or external — skip
      continue;
    }

    let newUrl = null;
    const safeName = (doc.title || doc.id).replace(/[^a-zA-Z0-9]/g, '_').substring(0, 40);
    const filename = `documents/${doc.id}-${safeName}-${field}.pdf`;

    try {
      if (url.startsWith('data:')) {
        const mimeMatch = url.match(/^data:([^;]+);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
        console.log(`  ⬆️  ${doc.title} [${field}] base64 (${Math.round(url.length * 0.75 / 1024)}KB)...`);
        newUrl = await uploadDataUrl(url, filename, mime);

      } else if (url.startsWith('/api/media')) {
        const idMatch = url.match(/id=([a-zA-Z0-9_]+)/);
        if (idMatch) {
          const mediaId = idMatch[1];
          const mediaData = await resolveApiMediaUrl(mediaId);
          if (mediaData) {
            console.log(`  ⬆️  ${doc.title} [${field}] api/media (${mediaId})...`);
            newUrl = await uploadDataUrl(mediaData.data, filename, mediaData.mimeType);
          } else {
            console.log(`  ⚠️  ${doc.title} [${field}] api/media NOT FOUND in DB — skipping`);
            skipped++;
            continue;
          }
        }
      }

      if (newUrl) {
        // Update the DB column
        if (field === 'view_url') {
          await sql`UPDATE documents SET view_url = ${newUrl} WHERE id = ${doc.id}`;
        } else {
          await sql`UPDATE documents SET download_url = ${newUrl} WHERE id = ${doc.id}`;
        }
        console.log(`  ✅ Migrated → ${newUrl}\n`);
        migrated++;
      }

    } catch (err) {
      console.error(`  ❌ ${doc.title} [${field}]: ${err.message}`);
      failed++;
    }
  }
}

console.log('\n🎉 PDF Migration Complete!');
console.log(`   Migrated : ${migrated}`);
console.log(`   Skipped  : ${skipped}`);
console.log(`   Failed   : ${failed}`);
console.log('\nAll new document uploads will also go directly to Vercel Blob CDN going forward.');
