/**
 * /api/inspect-settings
 * Reads actual values of pczsc_header_cfg and pczsc_subpages_hero from Neon DB
 * to inspect what /api/media URLs are embedded in them.
 * Also migrates any embedded base64 data: URLs to Vercel Blob CDN.
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

// Recursively find all string values in a JSON object that match a predicate
function findStrings(obj: any, predicate: (s: string) => boolean, results: string[] = []): string[] {
  if (typeof obj === 'string') {
    if (predicate(obj)) results.push(obj);
  } else if (Array.isArray(obj)) {
    obj.forEach(item => findStrings(item, predicate, results));
  } else if (obj && typeof obj === 'object') {
    Object.values(obj).forEach(val => findStrings(val, predicate, results));
  }
  return results;
}

// Recursively replace all matching strings in JSON object
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

export async function GET(request: Request): Promise<Response> {
  const sql = neon(DATABASE_URL);
  
  const rows = await sql`
    SELECT key, value FROM site_settings 
    WHERE key IN ('pczsc_header_cfg', 'pczsc_subpages_hero')
  `;

  const report: any = {};
  for (const row of rows) {
    const apiMediaUrls = findStrings(row.value, s => s.includes('/api/media'));
    const base64Urls = findStrings(row.value, s => s.startsWith('data:image') || s.startsWith('data:video'));
    report[row.key] = {
      apiMediaUrlsFound: apiMediaUrls,
      base64UrlsFound: base64Urls.map(u => u.substring(0, 80) + '...'),
      base64Count: base64Urls.length
    };
  }

  return new Response(JSON.stringify(report, null, 2), { status: 200, headers: corsHeaders() });
}

export async function POST(request: Request): Promise<Response> {
  if (!BLOB_TOKEN) {
    return new Response(JSON.stringify({ error: 'BLOB_READ_WRITE_TOKEN not set' }), { status: 500, headers: corsHeaders() });
  }

  const sql = neon(DATABASE_URL);
  const migrationLog: any[] = [];

  const rows = await sql`
    SELECT key, value FROM site_settings 
    WHERE key IN ('pczsc_header_cfg', 'pczsc_subpages_hero')
  `;

  for (const row of rows) {
    // Find all base64 data URLs embedded in the JSON
    const base64Urls = findStrings(row.value, s => 
      (s.startsWith('data:image') || s.startsWith('data:video') || s.startsWith('data:application/pdf')) && s.length > 200
    );

    if (base64Urls.length === 0) {
      migrationLog.push({ key: row.key, status: 'skipped', reason: 'no base64 URLs found' });
      continue;
    }

    const urlMap: Record<string, string> = {};

    for (const dataUrl of base64Urls) {
      try {
        const mimeMatch = dataUrl.match(/^data:([^;]+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const base64Data = dataUrl.split(',')[1];
        const binaryData = Buffer.from(base64Data, 'base64');
        
        const ext = mimeType === 'image/png' ? 'png'
          : mimeType === 'image/webp' ? 'webp'
          : mimeType === 'image/gif' ? 'gif'
          : mimeType === 'video/mp4' ? 'mp4'
          : mimeType === 'application/pdf' ? 'pdf'
          : 'jpg';

        const filename = `settings/${row.key}-${Date.now()}-${Math.random().toString(36).substr(2,5)}.${ext}`;
        const blob = await put(filename, binaryData, { access: 'public', token: BLOB_TOKEN, contentType: mimeType });
        
        urlMap[dataUrl] = blob.url;
        migrationLog.push({ key: row.key, status: 'uploaded', blobUrl: blob.url, sizeKB: Math.round(binaryData.length / 1024) });
      } catch (err: any) {
        migrationLog.push({ key: row.key, status: 'error', error: err.message });
      }
    }

    // Replace all base64 URLs with blob URLs in the JSON value
    if (Object.keys(urlMap).length > 0) {
      const updated = replaceStrings(row.value, s => urlMap[s] || s);
      await sql`
        UPDATE site_settings SET value = ${JSON.stringify(updated)}::jsonb, updated_at = NOW()
        WHERE key = ${row.key}
      `;
    }
  }

  return new Response(JSON.stringify({ status: 'complete', migrationLog }, null, 2), { status: 200, headers: corsHeaders() });
}
