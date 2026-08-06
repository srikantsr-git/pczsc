/**
 * ONE-TIME MIGRATION: /api/migrate-media
 * 
 * Migrates all images stored as base64 in Neon DB (media_uploads table)
 * to Vercel Blob CDN, then updates all URL references across all tables.
 * 
 * GET  /api/migrate-media         → dry-run: shows what will be migrated
 * POST /api/migrate-media         → runs the actual migration
 * GET  /api/migrate-media?status  → shows migration progress
 */

import { neon } from '@neondatabase/serverless';
import { put } from '@vercel/blob';

const DATABASE_URL =
  process.env.VITE_DATABASE_URL ||
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_Ko7RbCqA5lsG@ep-winter-bar-azhp79jj.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const BLOB_TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN ||
  process.env.VITE_BLOB_READ_WRITE_TOKEN ||
  '';

function corsHeaders() {
  return { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' };
}

// ─── GET: Dry-run — show what would be migrated ───────────────────────────────
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (!BLOB_TOKEN) {
    return new Response(JSON.stringify({
      error: 'BLOB_READ_WRITE_TOKEN not set. Add it to Vercel environment variables.'
    }), { status: 500, headers: corsHeaders() });
  }

  try {
    const sql = neon(DATABASE_URL);

    // Count media_uploads
    const mediaRows = await sql`
      SELECT id, mime_type, LENGTH(data) as size_chars, created_at
      FROM media_uploads
      ORDER BY created_at DESC
    `;

    // Find all /api/media?id= references across tables
    const galleryRefs = await sql`
      SELECT COUNT(*) as count FROM gallery WHERE url LIKE '/api/media%'
    `;
    const heroRefs = await sql`
      SELECT COUNT(*) as count FROM hero_slides WHERE image_url LIKE '/api/media%'
    `;
    const peRefs = await sql`
      SELECT COUNT(*) as count FROM pe_directors WHERE photo_url LIKE '/api/media%'
    `;

    // Check site_settings for embedded /api/media URLs
    const settingsRefs = await sql`
      SELECT key FROM site_settings WHERE value::text LIKE '%/api/media%'
    `;

    return new Response(JSON.stringify({
      dryRun: true,
      status: 'ready',
      message: `Found ${mediaRows.length} files in Neon DB ready for migration to Vercel Blob CDN`,
      mediaFiles: mediaRows.map((r: any) => ({
        id: r.id,
        mimeType: r.mime_type,
        sizeKB: Math.round(r.size_chars / 1024 * 0.75), // base64 to KB estimate
        uploadedAt: r.created_at
      })),
      referencesFound: {
        galleryItems: Number(galleryRefs[0]?.count || 0),
        heroSlides: Number(heroRefs[0]?.count || 0),
        peDirectors: Number(peRefs[0]?.count || 0),
        siteSettings: settingsRefs.map((r: any) => r.key)
      },
      instructions: 'POST to /api/migrate-media to run the actual migration'
    }), { status: 200, headers: corsHeaders() });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders() });
  }
}

// ─── POST: Run the actual migration ──────────────────────────────────────────
export async function POST(request: Request): Promise<Response> {
  if (!BLOB_TOKEN) {
    return new Response(JSON.stringify({
      error: 'BLOB_READ_WRITE_TOKEN not set.'
    }), { status: 500, headers: corsHeaders() });
  }

  const sql = neon(DATABASE_URL);
  const results: any[] = [];
  const urlMap: Record<string, string> = {}; // old /api/media?id=xxx → new blob URL

  try {
    // 1. Fetch all media from Neon DB
    const mediaRows = await sql`
      SELECT id, data, mime_type FROM media_uploads ORDER BY created_at ASC
    `;

    console.log(`Starting migration of ${mediaRows.length} files...`);

    // 2. Upload each to Vercel Blob
    for (const row of mediaRows) {
      const { id, data, mime_type } = row as { id: string; data: string; mime_type: string };
      const oldUrl = `/api/media?id=${id}`;

      try {
        // Decode base64 → binary
        let base64 = data as string;
        if (base64.includes(',')) base64 = base64.split(',')[1];
        const binaryData = Buffer.from(base64, 'base64');

        // Determine file extension from mime type
        const ext = mime_type === 'image/png' ? 'png'
          : mime_type === 'image/webp' ? 'webp'
          : mime_type === 'image/gif' ? 'gif'
          : mime_type === 'video/mp4' ? 'mp4'
          : mime_type === 'video/webm' ? 'webm'
          : mime_type === 'application/pdf' ? 'pdf'
          : 'jpg';

        const filename = `migrated/${id}.${ext}`;

        // Upload to Vercel Blob
        const blob = await put(filename, binaryData, {
          access: 'public',
          token: BLOB_TOKEN,
          contentType: mime_type
        });

        urlMap[oldUrl] = blob.url;
        results.push({
          id,
          status: 'migrated',
          oldUrl,
          newUrl: blob.url,
          sizeKB: Math.round(binaryData.length / 1024)
        });

        console.log(`✅ Migrated: ${id} → ${blob.url}`);

      } catch (uploadErr: any) {
        results.push({ id, status: 'error', oldUrl, error: uploadErr.message });
        console.error(`❌ Failed: ${id}`, uploadErr.message);
      }
    }

    // 3. Update gallery table
    let galleryUpdated = 0;
    for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
      const res = await sql`
        UPDATE gallery SET url = ${newUrl} WHERE url = ${oldUrl}
      `;
      galleryUpdated += (res as any).count || 0;
    }

    // 4. Update hero_slides table
    let heroUpdated = 0;
    for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
      const res = await sql`
        UPDATE hero_slides SET image_url = ${newUrl} WHERE image_url = ${oldUrl}
      `;
      heroUpdated += (res as any).count || 0;
    }

    // 5. Update pe_directors table
    let peUpdated = 0;
    for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
      const res = await sql`
        UPDATE pe_directors SET photo_url = ${newUrl} WHERE photo_url = ${oldUrl}
      `;
      peUpdated += (res as any).count || 0;
    }

    // 6. Update site_settings: replace all occurrences in JSON values
    const settingsRows = await sql`
      SELECT key, value FROM site_settings WHERE value::text LIKE '%/api/media%'
    `;

    let settingsUpdated = 0;
    for (const row of settingsRows) {
      let valueStr = JSON.stringify(row.value);
      let changed = false;
      for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
        if (valueStr.includes(oldUrl)) {
          valueStr = valueStr.split(oldUrl).join(newUrl);
          changed = true;
        }
      }
      if (changed) {
        await sql`
          UPDATE site_settings SET value = ${valueStr}::jsonb, updated_at = NOW()
          WHERE key = ${row.key}
        `;
        settingsUpdated++;
      }
    }

    // 7. Report summary
    const migrated = results.filter(r => r.status === 'migrated').length;
    const failed = results.filter(r => r.status === 'error').length;

    return new Response(JSON.stringify({
      status: 'complete',
      summary: {
        totalFiles: mediaRows.length,
        migrated,
        failed,
        tablesUpdated: {
          gallery: galleryUpdated,
          heroSlides: heroUpdated,
          peDirectors: peUpdated,
          siteSettings: settingsUpdated
        }
      },
      urlMappings: urlMap,
      details: results
    }), { status: 200, headers: corsHeaders() });

  } catch (err: any) {
    return new Response(JSON.stringify({
      status: 'error',
      error: err.message,
      partialResults: results
    }), { status: 500, headers: corsHeaders() });
  }
}
