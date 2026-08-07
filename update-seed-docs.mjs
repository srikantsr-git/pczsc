import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/data/allSportsCalendarDocuments.ts';
let content = readFileSync(filePath, 'utf-8');

const sampleUrl = 'https://rtmjgqjakopoy7lq.public.blob.vercel-storage.com/documents/pczsc-official-document-sample.pdf';

const updated = content.replaceAll(
  /https:\/\/pczsc\.in\/pczsc-data_files\/[^\s"]+/g,
  sampleUrl
);

writeFileSync(filePath, updated, 'utf-8');
console.log('✅ Updated allSportsCalendarDocuments.ts with active Vercel Blob CDN PDF URL!');
