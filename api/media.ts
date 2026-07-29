import { neon } from '@neondatabase/serverless';

const DATABASE_URL =
  process.env.VITE_DATABASE_URL ||
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_Ko7RbCqA5lsG@ep-winter-bar-azhp79jj.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id parameter' }), {
      status: 400,
      headers: { 'content-type': 'application/json' }
    });
  }

  try {
    const sql = neon(DATABASE_URL);

    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS media_uploads (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    const rows = await sql`SELECT data, mime_type FROM media_uploads WHERE id = ${id}`;
    if (!rows || rows.length === 0) {
      return new Response('Not found', { status: 404 });
    }

    const { data, mime_type } = rows[0];

    // Strip data URL prefix if present to get raw base64
    let base64 = data as string;
    if (base64.includes(',')) {
      base64 = base64.split(',')[1];
    }

    const binaryData = Buffer.from(base64, 'base64');

    return new Response(binaryData, {
      status: 200,
      headers: {
        'Content-Type': mime_type || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    console.error('Media fetch error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json() as { id: string; data: string; mime_type: string };
    const { id, data, mime_type } = body;

    if (!id || !data) {
      return new Response(JSON.stringify({ error: 'Missing id or data' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      });
    }

    const sql = neon(DATABASE_URL);

    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS media_uploads (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      INSERT INTO media_uploads (id, data, mime_type)
      VALUES (${id}, ${data}, ${mime_type || 'image/jpeg'})
      ON CONFLICT (id) DO UPDATE SET
        data = EXCLUDED.data,
        mime_type = EXCLUDED.mime_type
    `;

    const mediaUrl = `/api/media?id=${id}`;

    return new Response(JSON.stringify({ url: mediaUrl, id }), {
      status: 200,
      headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    console.error('Media upload error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}
