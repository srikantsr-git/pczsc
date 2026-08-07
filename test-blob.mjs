import { put } from '@vercel/blob';
import { readFileSync } from 'fs';

const envLines = readFileSync('.env', 'utf-8').split('\n');
const env = {};
for (const line of envLines) {
  const m = line.match(/^([A-Z_]+)="?([^"\n]+)"?/);
  if (m) env[m[1]] = m[2].trim();
}

async function testUpload() {
  const token = env['BLOB_READ_WRITE_TOKEN'];
  console.log('Testing put with token:', token?.substring(0, 25));
  const res = await put('test/test-doc.pdf', Buffer.from('%PDF-1.4 Mock PDF Content'), {
    access: 'public',
    token: token,
    contentType: 'application/pdf'
  });
  console.log('Uploaded successfully:', res.url);
}
testUpload().catch(console.error);
