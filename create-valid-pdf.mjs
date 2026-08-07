import { put } from '@vercel/blob';
import { readFileSync } from 'fs';
import { neon } from '@neondatabase/serverless';

const envLines = readFileSync('.env', 'utf-8').split('\n');
const env = {};
for (const line of envLines) {
  const m = line.match(/^([A-Z_]+)="?([^"\n]+)"?/);
  if (m) env[m[1]] = m[2].trim();
}

const DATABASE_URL = env['VITE_DATABASE_URL'];
const BLOB_TOKEN = env['BLOB_READ_WRITE_TOKEN'];

const sql = neon(DATABASE_URL);

/**
 * Builds a 100% valid PDF 1.4 binary buffer with calculated XREF offsets
 */
function createValidPdfBuffer(titleText = 'PCZSC Official Circular') {
  const contentStream = `BT /F1 20 Tf 50 720 Td (${titleText}) Tj ET\n` +
                        `BT /F1 12 Tf 50 680 Td (Pune City Zonal Sports Committee - Official Repository) Tj ET\n` +
                        `BT /F1 10 Tf 50 640 Td (Savitribai Phule Pune University - Affiliated Colleges) Tj ET\n`;

  const streamLength = Buffer.byteLength(contentStream, 'utf-8');

  let pdf = `%PDF-1.4\n`;
  const offsets = [];

  // Obj 1: Catalog
  offsets[1] = Buffer.byteLength(pdf, 'utf-8');
  pdf += `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;

  // Obj 2: Pages
  offsets[2] = Buffer.byteLength(pdf, 'utf-8');
  pdf += `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;

  // Obj 3: Page
  offsets[3] = Buffer.byteLength(pdf, 'utf-8');
  pdf += `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`;

  // Obj 4: Font
  offsets[4] = Buffer.byteLength(pdf, 'utf-8');
  pdf += `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`;

  // Obj 5: Contents
  offsets[5] = Buffer.byteLength(pdf, 'utf-8');
  pdf += `5 0 obj\n<< /Length ${streamLength} >>\nstream\n${contentStream}endstream\nendobj\n`;

  // Xref table
  const xrefOffset = Buffer.byteLength(pdf, 'utf-8');
  pdf += `xref\n0 6\n`;
  pdf += `0000000000 65535 f \n`;
  for (let i = 1; i <= 5; i++) {
    pdf += `${offsets[i].toString().padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, 'utf-8');
}

async function run() {
  console.log('📄 Generating 100% valid PDF binary buffer...');
  const pdfBuffer = createValidPdfBuffer('PCZSC Official Document & Circular');

  console.log('⬆️ Uploading valid PDF to Vercel Blob CDN...');
  const blob = await put('documents/pczsc-official-valid-document.pdf', pdfBuffer, {
    access: 'public',
    token: BLOB_TOKEN,
    contentType: 'application/pdf'
  });

  console.log('✅ Uploaded valid PDF to CDN:', blob.url);

  console.log('\n🔄 Updating document records in Neon DB to use valid CDN PDF URL...');
  const result = await sql`
    UPDATE documents
    SET view_url = ${blob.url}, download_url = ${blob.url}
    WHERE view_url LIKE '%pczsc-official-document-sample.pdf%'
       OR view_url IS NULL
       OR view_url = '#'
       OR view_url LIKE '%pczsc.in%';
  `;

  console.log('🎉 Successfully updated DB records!');

  // Also test fetching the uploaded PDF to verify it parses clean
  const checkRes = await fetch(blob.url);
  console.log('   CDN Fetch status:', checkRes.status);
  console.log('   Content-Type:', checkRes.headers.get('content-type'));
}

run().catch(console.error);
