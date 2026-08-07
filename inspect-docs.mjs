import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

const envLines = readFileSync('.env', 'utf-8').split('\n');
const env = {};
for (const line of envLines) {
  const m = line.match(/^([A-Z_]+)="?([^"\n]+)"?/);
  if (m) env[m[1]] = m[2].trim();
}

const sql = neon(env.VITE_DATABASE_URL);

async function inspect() {
  const docs = await sql`SELECT id, title, category, view_url, download_url FROM documents ORDER BY created_at DESC LIMIT 50`;
  console.log(`Found ${docs.length} documents in DB:`);
  for (const d of docs) {
    console.log(`- ID: ${d.id}`);
    console.log(`  Title: ${d.title}`);
    console.log(`  Category: ${d.category}`);
    console.log(`  View URL: ${d.view_url?.substring(0, 80)}`);
    console.log(`  Download URL: ${d.download_url?.substring(0, 80)}`);
    console.log('---');
  }
}

inspect().catch(console.error);
