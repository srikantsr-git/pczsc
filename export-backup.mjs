import { neon } from '@neondatabase/serverless';
import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

// Read .env file manually if needed
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      let val = parts.slice(1).join('=').trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const DATABASE_URL = process.env.VITE_DATABASE_URL;
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || process.env.VITE_BLOB_READ_WRITE_TOKEN;

if (!DATABASE_URL) {
  console.error('Error: VITE_DATABASE_URL is not set.');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

function escapeSqlValue(val) {
  if (val === null || val === undefined) {
    return 'NULL';
  }
  if (typeof val === 'boolean') {
    return val ? 'TRUE' : 'FALSE';
  }
  if (typeof val === 'number') {
    return val.toString();
  }
  if (typeof val === 'object') {
    // For JSON / JSONB or objects
    const jsonStr = JSON.stringify(val);
    return `'${jsonStr.replace(/'/g, "''")}'::jsonb`;
  }
  if (val instanceof Date) {
    return `'${val.toISOString()}'`;
  }
  // String
  return `'${String(val).replace(/'/g, "''")}'`;
}

async function runBackup() {
  console.log('--- Starting Database Backup ---');
  console.log('Connecting to PostgreSQL database...');

  // 1. Fetch all user tables in public schema
  const tablesResult = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `;

  const tableNames = tablesResult.map(t => t.table_name);
  console.log(`Found ${tableNames.length} tables:`, tableNames.join(', '));

  const fullBackupData = {
    metadata: {
      exportedAt: new Date().toISOString(),
      databaseUrlHost: new URL(DATABASE_URL).hostname,
      tableCount: tableNames.length,
      tables: {}
    },
    tables: {}
  };

  let sqlStatements = [];
  sqlStatements.push(`-- ========================================================`);
  sqlStatements.push(`-- Database Backup Created at ${new Date().toISOString()}`);
  sqlStatements.push(`-- Database Host: ${new URL(DATABASE_URL).hostname}`);
  sqlStatements.push(`-- ========================================================\n`);
  sqlStatements.push(`SET statement_timeout = 0;`);
  sqlStatements.push(`SET lock_timeout = 0;`);
  sqlStatements.push(`SET client_encoding = 'UTF8';\n`);

  const summary = [];

  for (const tableName of tableNames) {
    // Get column definitions
    const columnsResult = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = ${tableName}
      ORDER BY ordinal_position;
    `;

    // Fetch all rows using query or template tag safely
    let rows = [];
    if (tableName === 'documents') {
      rows = await sql`SELECT * FROM documents`;
    } else if (tableName === 'gallery') {
      rows = await sql`SELECT * FROM gallery`;
    } else if (tableName === 'hero_slides') {
      rows = await sql`SELECT * FROM hero_slides`;
    } else if (tableName === 'media_uploads') {
      rows = await sql`SELECT * FROM media_uploads`;
    } else if (tableName === 'physical_education_directors') {
      rows = await sql`SELECT * FROM physical_education_directors`;
    } else if (tableName === 'site_settings') {
      rows = await sql`SELECT * FROM site_settings`;
    } else {
      // Fallback if there are dynamic tables
      const queryStr = `SELECT * FROM "${tableName}"`;
      if (typeof sql.query === 'function') {
        rows = await sql.query(queryStr);
      } else {
        rows = await sql([queryStr]);
      }
    }

    console.log(`Table [${tableName}]: ${rows.length} records exported.`);

    summary.push({ tableName, rowsCount: rows.length, columnsCount: columnsResult.length });

    fullBackupData.tables[tableName] = {
      columns: columnsResult,
      rowsCount: rows.length,
      rows: rows
    };
    fullBackupData.metadata.tables[tableName] = rows.length;

    // Generate SQL for table
    sqlStatements.push(`-- --------------------------------------------------------`);
    sqlStatements.push(`-- Table structure for ${tableName}`);
    sqlStatements.push(`-- --------------------------------------------------------`);
    sqlStatements.push(`DROP TABLE IF EXISTS "${tableName}" CASCADE;`);

    const colDefs = columnsResult.map(col => {
      let def = `"${col.column_name}" ${col.data_type.toUpperCase()}`;
      if (col.is_nullable === 'NO') def += ' NOT NULL';
      if (col.column_default) def += ` DEFAULT ${col.column_default}`;
      return def;
    });

    sqlStatements.push(`CREATE TABLE "${tableName}" (\n  ${colDefs.join(',\n  ')}\n);`);

    if (rows.length > 0) {
      sqlStatements.push(`\n-- Dumping data for table ${tableName}`);
      const colNames = columnsResult.map(c => `"${c.column_name}"`).join(', ');

      for (const row of rows) {
        const values = columnsResult.map(c => escapeSqlValue(row[c.column_name])).join(', ');
        sqlStatements.push(`INSERT INTO "${tableName}" (${colNames}) VALUES (${values});`);
      }
    }
    sqlStatements.push('\n');
  }

  const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.resolve('./backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const sqlFilename = `pczsc-db-backup-${dateStr}.sql`;
  const jsonFilename = `pczsc-db-backup-${dateStr}.json`;
  const sqlPath = path.join(backupDir, sqlFilename);
  const jsonPath = path.join(backupDir, jsonFilename);

  const sqlContent = sqlStatements.join('\n');
  const jsonContent = JSON.stringify(fullBackupData, null, 2);

  fs.writeFileSync(sqlPath, sqlContent, 'utf-8');
  fs.writeFileSync(jsonPath, jsonContent, 'utf-8');

  // Also write standard static files to root / public for direct local serving if needed
  fs.writeFileSync(path.join(backupDir, 'pczsc-database-latest.sql'), sqlContent, 'utf-8');
  fs.writeFileSync(path.join(backupDir, 'pczsc-database-latest.json'), jsonContent, 'utf-8');

  console.log(`\nLocal Backup Files Saved:`);
  console.log(`- SQL:  ${sqlPath} (${(sqlContent.length / 1024).toFixed(2)} KB)`);
  console.log(`- JSON: ${jsonPath} (${(jsonContent.length / 1024).toFixed(2)} KB)`);

  // 4. Upload to Vercel Blob
  let sqlBlobUrl = null;
  let jsonBlobUrl = null;

  if (BLOB_TOKEN) {
    console.log('\nUploading backup files to Vercel Blob storage for direct public download URLs...');
    try {
      const sqlBlob = await put(`backups/${sqlFilename}`, sqlContent, {
        access: 'public',
        contentType: 'text/plain',
        token: BLOB_TOKEN
      });
      sqlBlobUrl = sqlBlob.url;
      console.log(`Uploaded SQL Backup URL: ${sqlBlobUrl}`);

      const jsonBlob = await put(`backups/${jsonFilename}`, jsonContent, {
        access: 'public',
        contentType: 'application/json',
        token: BLOB_TOKEN
      });
      jsonBlobUrl = jsonBlob.url;
      console.log(`Uploaded JSON Backup URL: ${jsonBlobUrl}`);
    } catch (err) {
      console.error('Failed to upload to Vercel Blob:', err.message);
    }
  }

  console.log('\n=== BACKUP SUMMARY ===');
  console.table(summary);
  
  const resultObj = {
    timestamp: new Date().toISOString(),
    localFiles: {
      sql: sqlPath,
      json: jsonPath
    },
    downloadUrls: {
      sql: sqlBlobUrl,
      json: jsonBlobUrl
    },
    summary
  };

  fs.writeFileSync(path.join(backupDir, 'latest-backup-info.json'), JSON.stringify(resultObj, null, 2));
  console.log('\nDone!');
}

runBackup().catch(err => {
  console.error('Backup failed:', err);
  process.exit(1);
});
