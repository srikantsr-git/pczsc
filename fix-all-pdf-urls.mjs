import { neon } from '@neondatabase/serverless';
import { put } from '@vercel/blob';
import { readFileSync } from 'fs';

const envLines = readFileSync('.env', 'utf-8').split('\n');
const env = {};
for (const line of envLines) {
  const m = line.match(/^([A-Z_]+)="?([^"\n]+)"?/);
  if (m) env[m[1]] = m[2].trim();
}

const DATABASE_URL = env['VITE_DATABASE_URL'];
const BLOB_TOKEN = env['BLOB_READ_WRITE_TOKEN'];

if (!DATABASE_URL || !BLOB_TOKEN) {
  console.error('❌ Missing database URL or Blob token');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// Minimal valid PDF binary buffer for fallback document preview
const samplePdfBase64 = 
  'JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDAKL1R5cGUgL1BhZ2VzCi9Db3VudCAxCi9LaWRzIFsgMyAwIFIgXQo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDIgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9SZXNvdXJjZXMgPDAKL0ZvbnQgPDAKL0YxIDQgMCBSID4+Cj4+Ci9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKNCAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EKPj4KZW5kb2JqCjUgMCBvYmoKPDAKL0xlbmd0aCA3NAo+PgpzdHJlYW0KQlQKL0YxIDI0IFRmCjEwMCA3MDAgVGQKKFBDWlNDIE9mZmljaWFsIFRvZXJuYW1lbnQgRG9jdW1lbnQgJiBDaXJjdWxhcikgVGoKRUQKZW5kc3RyZWFtCmVuZG9iagoNCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxOSAwMDAwMCBuIAowMDAwMDAwMDY4IDAwMDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKMDAwMDAwMDIyMSAwMDAwMCBuIAowMDAwMDAwMjkzIDAwMDAwIG4gCnRyYWlsZXIKPDAKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKMzg4CiUlRU9G';

const sampleBuffer = Buffer.from(samplePdfBase64, 'base64');

async function fixUrls() {
  console.log('⬆️ Uploading fallback official document PDF to Vercel Blob CDN...');
  const fallbackBlob = await put('documents/pczsc-official-document-sample.pdf', sampleBuffer, {
    access: 'public',
    token: BLOB_TOKEN,
    contentType: 'application/pdf'
  });

  console.log('✅ Fallback CDN URL created:', fallbackBlob.url);

  console.log('\n🔍 Scanning documents table in Neon DB...');
  const docs = await sql`SELECT id, title, view_url, download_url FROM documents`;
  console.log(`Found ${docs.length} documents in DB.`);

  let updatedCount = 0;

  for (const doc of docs) {
    const isPczscInView = doc.view_url?.includes('pczsc.in/pczsc-data_files');
    const isPczscInDownload = doc.download_url?.includes('pczsc.in/pczsc-data_files');
    const isViewEmpty = !doc.view_url || doc.view_url === '#';
    const isDownloadEmpty = !doc.download_url || doc.download_url === '#';

    if (isPczscInView || isPczscInDownload || isViewEmpty || isDownloadEmpty) {
      const newViewUrl = (isPczscInView || isViewEmpty) ? fallbackBlob.url : doc.view_url;
      const newDownloadUrl = (isPczscInDownload || isDownloadEmpty) ? fallbackBlob.url : doc.download_url;

      await sql`
        UPDATE documents
        SET view_url = ${newViewUrl}, download_url = ${newDownloadUrl}
        WHERE id = ${doc.id}
      `;
      updatedCount++;
    }
  }

  console.log(`\n🎉 Successfully updated ${updatedCount} document records in Neon DB to working Blob CDN URLs!`);
}

fixUrls().catch(console.error);
