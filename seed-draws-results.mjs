import { neon } from '@neondatabase/serverless';
import fs from 'fs';

// Read DATABASE_URL from .env
const envContent = fs.readFileSync('.env', 'utf-8');
const match = envContent.match(/VITE_DATABASE_URL="([^"]+)"/);
const DATABASE_URL = match?.[1] || process.env.DATABASE_URL || '';

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env file');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// Read scraped dataset
const dataPath = 'C:\\Users\\Dell\\.gemini\\antigravity-ide\\brain\\99e96a2c-703a-4ac3-988b-aaef3ca11e99\\scratch\\all-scraped-draws-and-results.json';
const scrapedDocs = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

async function seedDrawsAndResults() {
  console.log(`🚀 Seeding ${scrapedDocs.length} Draws & Results documents into Neon DB...`);

  try {
    // Ensure documents table exists
    await sql`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        sr_no INT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        view_url TEXT NOT NULL,
        download_url TEXT NOT NULL,
        show_on_news_marquee BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Fetch existing doc IDs to avoid duplicates
    const existing = await sql`SELECT id FROM documents`;
    const existingIds = new Set(existing.map((r) => r.id));

    let inserted = 0;
    let skipped = 0;

    // Batch insert in chunks of 50
    const chunkSize = 50;
    for (let i = 0; i < scrapedDocs.length; i += chunkSize) {
      const chunk = scrapedDocs.slice(i, i + chunkSize);
      
      for (const doc of chunk) {
        if (existingIds.has(doc.id)) {
          skipped++;
          continue;
        }

        await sql`
          INSERT INTO documents (id, sr_no, title, category, date, view_url, download_url, show_on_news_marquee)
          VALUES (${doc.id}, ${doc.srNo}, ${doc.title}, ${doc.category}, ${doc.date}, ${doc.viewUrl}, ${doc.downloadUrl}, ${Boolean(doc.showOnNewsMarquee)})
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            category = EXCLUDED.category,
            date = EXCLUDED.date,
            view_url = EXCLUDED.view_url,
            download_url = EXCLUDED.download_url;
        `;
        inserted++;
      }
      console.log(`  Processed ${Math.min(i + chunkSize, scrapedDocs.length)} / ${scrapedDocs.length} items...`);
    }

    const totalInDb = await sql`SELECT COUNT(*) as count FROM documents`;
    console.log(`\n✅ Seeding complete! Total documents in Neon DB: ${totalInDb[0].count}`);
    console.log(`   New Inserted: ${inserted}, Existing Skipped: ${skipped}`);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seedDrawsAndResults();
