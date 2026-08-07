import { neon } from '@neondatabase/serverless';
import { put } from '@vercel/blob';

const DATABASE_URL =
  process.env.VITE_DATABASE_URL ||
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_Ko7RbCqA5lsG@ep-winter-bar-azhp79jj.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

const BLOB_TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN ||
  process.env.VITE_BLOB_READ_WRITE_TOKEN ||
  'vercel_blob_rw_RtMJgqJAkOpoy7lq_IyNXpSlYvEXsmKG0oBMtFlnGPut9eI';

function corsHeaders() {
  return {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

function escapeSqlValue(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'object') {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  }
  if (val instanceof Date) return `'${val.toISOString()}'`;
  return `'${String(val).replace(/'/g, "''")}'`;
}

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(request: Request) {
  return handleBackup(request);
}

export async function POST(request: Request) {
  return handleBackup(request);
}

async function handleBackup(request: Request) {
  try {
    const url = new URL(request.url);
    const format = url.searchParams.get('format') || 'json';

    const sql = neon(DATABASE_URL);

    // 1. Fetch user tables
    const tablesResult = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;

    const tableNames = tablesResult.map((t: any) => t.table_name);
    const fullBackupData: any = {
      metadata: {
        exportedAt: new Date().toISOString(),
        tableCount: tableNames.length,
        tables: {}
      },
      tables: {}
    };

    const sqlStatements: string[] = [
      `-- Database Backup Created at ${new Date().toISOString()}`,
      `SET statement_timeout = 0;`,
      `SET client_encoding = 'UTF8';\n`
    ];

    const summary: any[] = [];

    for (const tableName of tableNames) {
      const columnsResult = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = ${tableName}
        ORDER BY ordinal_position;
      `;

      let rows: any[] = [];
      if (tableName === 'documents') rows = await sql`SELECT * FROM documents`;
      else if (tableName === 'gallery') rows = await sql`SELECT * FROM gallery`;
      else if (tableName === 'hero_slides') rows = await sql`SELECT * FROM hero_slides`;
      else if (tableName === 'media_uploads') rows = await sql`SELECT * FROM media_uploads`;
      else if (tableName === 'physical_education_directors') rows = await sql`SELECT * FROM physical_education_directors`;
      else if (tableName === 'site_settings') rows = await sql`SELECT * FROM site_settings`;

      summary.push({ tableName, rowsCount: rows.length, columnsCount: columnsResult.length });

      fullBackupData.tables[tableName] = {
        columns: columnsResult,
        rowsCount: rows.length,
        rows: rows
      };
      fullBackupData.metadata.tables[tableName] = rows.length;

      // SQL export construction
      sqlStatements.push(`-- Table: ${tableName}`);
      sqlStatements.push(`DROP TABLE IF EXISTS "${tableName}" CASCADE;`);

      const colDefs = columnsResult.map((col: any) => {
        let def = `"${col.column_name}" ${col.data_type.toUpperCase()}`;
        if (col.is_nullable === 'NO') def += ' NOT NULL';
        if (col.column_default) def += ` DEFAULT ${col.column_default}`;
        return def;
      });

      sqlStatements.push(`CREATE TABLE "${tableName}" (\n  ${colDefs.join(',\n  ')}\n);`);

      if (rows.length > 0) {
        const colNames = columnsResult.map((c: any) => `"${c.column_name}"`).join(', ');
        for (const row of rows) {
          const values = columnsResult.map((c: any) => escapeSqlValue(row[c.column_name])).join(', ');
          sqlStatements.push(`INSERT INTO "${tableName}" (${colNames}) VALUES (${values});`);
        }
      }
      sqlStatements.push('\n');
    }

    const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
    const sqlFilename = `pczsc-db-backup-${dateStr}.sql`;
    const jsonFilename = `pczsc-db-backup-${dateStr}.json`;

    const sqlContent = sqlStatements.join('\n');
    const jsonContent = JSON.stringify(fullBackupData, null, 2);

    // Upload to Blob for download link
    let sqlBlobUrl = '';
    let jsonBlobUrl = '';
    if (BLOB_TOKEN) {
      const sqlBlob = await put(`backups/${sqlFilename}`, sqlContent, {
        access: 'public',
        contentType: 'text/plain',
        token: BLOB_TOKEN
      });
      sqlBlobUrl = sqlBlob.url;

      const jsonBlob = await put(`backups/${jsonFilename}`, jsonContent, {
        access: 'public',
        contentType: 'application/json',
        token: BLOB_TOKEN
      });
      jsonBlobUrl = jsonBlob.url;
    }

    if (format === 'raw_sql') {
      return new Response(sqlContent, {
        status: 200,
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          'content-disposition': `attachment; filename="${sqlFilename}"`,
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (format === 'raw_json') {
      return new Response(jsonContent, {
        status: 200,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'content-disposition': `attachment; filename="${jsonFilename}"`,
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response(
      JSON.stringify(
        {
          success: true,
          message: 'Database backup created successfully',
          timestamp: new Date().toISOString(),
          downloadUrls: {
            sql: sqlBlobUrl,
            json: jsonBlobUrl
          },
          summary
        },
        null,
        2
      ),
      { status: 200, headers: corsHeaders() }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: corsHeaders() }
    );
  }
}
