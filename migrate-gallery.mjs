/**
 * Migration script: Creates the media_uploads table in Neon DB.
 * Run this once to set up permanent image storage.
 * 
 * The gallery app now stores uploaded images in Neon DB via /api/media endpoint,
 * so photos persist across browser refreshes, PC restarts, and device changes.
 */
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';

// Load DATABASE_URL from .env
const envContent = readFileSync('.env', 'utf-8');
const match = envContent.match(/VITE_DATABASE_URL="([^"]+)"/);
const DATABASE_URL = match?.[1] || process.env.DATABASE_URL || '';

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env file');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function migrate() {
  console.log('🔧 Running PCZSC gallery migration...');
  
  try {
    // Create media_uploads table for permanent image storage
    await sql`
      CREATE TABLE IF NOT EXISTS media_uploads (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    console.log('✅ media_uploads table created (or already exists)');

    // Ensure gallery table has correct schema
    await sql`
      CREATE TABLE IF NOT EXISTS gallery (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL DEFAULT '',
        image_url TEXT NOT NULL DEFAULT '',
        description TEXT DEFAULT '',
        date TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    console.log('✅ gallery table created (or already exists)');

    // Verify tables
    const tables = await sql`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('media_uploads', 'gallery', 'site_settings')
      ORDER BY table_name
    `;
    console.log('📊 Database tables:', tables.map((t) => t.table_name).join(', '));
    
    // Show current gallery count
    const galCount = await sql`SELECT COUNT(*) as count FROM gallery`;
    console.log(`📸 Current gallery items in DB: ${galCount[0].count}`);

    console.log('\n✅ Migration complete! Gallery photos will now persist on server.');
    console.log('   Upload photos via admin panel → they will survive page refreshes & PC restarts.');
  } catch (err) {
    console.error('❌ Migration error:', err);
    process.exit(1);
  }
}

migrate();
