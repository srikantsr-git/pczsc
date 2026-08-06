/**
 * /api/migrate-api-media
 * Migrates /api/media?id=... URLs found in site_settings to Vercel Blob CDN.
 * These are URLs where the actual binary was stored in media_uploads table.
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

function replaceStrings(obj: any, replacer: (s: string) => string): any {
  if (typeof obj === 'string') return replacer(obj);
  if (Array.isArray(obj)) return obj.map(item => replaceStrings(item, replacer));
  if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const [k, v] of Object.entries(obj)) result[k] = replaceStrings(v, replacer);
    return result;
  }
  return obj;
}

export async function POST(request: Request): Promise<Response> {
  if (!BLOB_TOKEN) {
    return new Response(JSON.stringify({ error: 'BLOB_READ_WRITE_TOKEN not set' }), { status: 500, headers: corsHeaders() });
  }

  const sql = neon(DATABASE_URL);
  const log: any[] = [];
  const urlMap: Record<string, string> = {};

  // Get all site_settings with /api/media URLs
  const settingsRows = await sql`
    SELECT key, value FROM site_settings WHERE value::text LIKE '%/api/media%'
  `;

  // Collect all unique /api/media?id= IDs
  const mediaIds = new Set<string>();
  for (const row of settingsRows) {
    const text = JSON.stringify(row.value);
    const matches = text.matchAll(/\/api\/media\?id=([a-zA-Z0-9_]+)/g);
    for (const match of matches) {
      mediaIds.add(match[1]);
    }
  }

  log.push({ step: 'found_ids', ids: Array.from(mediaIds) });

  // For each media ID, fetch binary from media_uploads table and upload to Blob
  for (const mediaId of mediaIds) {
    const oldUrl = `/api/media?id=${mediaId}`;
    try {
      const rows = await sql`SELECT data, mime_type FROM media_uploads WHERE id = ${mediaId}`;
      if (!rows || rows.length === 0) {
        log.push({ id: mediaId, status: 'not_found_in_db', note: 'Record may have been deleted' });
        continue;
      }

      const { data, mime_type } = rows[0] as { data: string; mime_type: string };
      let base64 = data as string;
      if (base64.includes(',')) base64 = base64.split(',')[1];
      const binaryData = Buffer.from(base64, 'base64');

      const ext = mime_type === 'image/png' ? 'png'
        : mime_type === 'image/webp' ? 'webp'
        : mime_type === 'image/gif' ? 'gif'
        : mime_type === 'video/mp4' ? 'mp4'
        : mime_type === 'application/pdf' ? 'pdf'
        : 'jpg';

      const filename = `migrated/${mediaId}.${ext}`;
      const blob = await put(filename, binaryData, {
        access: 'public',
        token: BLOB_TOKEN,
        contentType: mime_type
      });

      urlMap[oldUrl] = blob.url;
      log.push({ id: mediaId, status: 'uploaded', oldUrl, newUrl: blob.url, sizeKB: Math.round(binaryData.length / 1024) });

    } catch (err: any) {
      log.push({ id: mediaId, status: 'error', error: err.message });
    }
  }

  // Update all site_settings with the new Blob URLs
  let settingsUpdated = 0;
  if (Object.keys(urlMap).length > 0) {
    for (const row of settingsRows) {
      const updated = replaceStrings(row.value, s => {
        for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
          if (s === oldUrl) return newUrl;
        }
        return s;
      });
      const updatedStr = JSON.stringify(updated);
      const originalStr = JSON.stringify(row.value);
      if (updatedStr !== originalStr) {
        await sql`
          UPDATE site_settings SET value = ${updatedStr}::jsonb, updated_at = NOW()
          WHERE key = ${row.key}
        `;
        settingsUpdated++;
        log.push({ step: 'settings_updated', key: row.key });
      }
    }
  }

  return new Response(JSON.stringify({
    status: 'complete',
    urlsMigrated: Object.keys(urlMap).length,
    settingsUpdated,
    urlMappings: urlMap,
    log
  }, null, 2), { status: 200, headers: corsHeaders() });
}

export async function GET(_request: Request): Promise<Response> {
  const sql = neon(DATABASE_URL);
  const settingsRows = await sql`
    SELECT key, value::text FROM site_settings WHERE value::text LIKE '%/api/media%'
  `;
  const result = settingsRows.map((r: any) => {
    const matches = [...(r.value as string).matchAll(/\/api\/media\?id=([a-zA-Z0-9_]+)/g)];
    return { key: r.key, apiMediaIds: matches.map(m => m[1]) };
  });
  return new Response(JSON.stringify(result, null, 2), { status: 200, headers: corsHeaders() });
}
