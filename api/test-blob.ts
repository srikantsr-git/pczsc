/**
 * Test endpoint: GET /api/test-blob
 * Verifies Vercel Blob storage is configured and reachable.
 * Returns JSON with status, token presence, and a test upload result.
 */
import { put, list } from '@vercel/blob';

export async function GET(request: Request): Promise<Response> {
  const token =
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.VITE_BLOB_READ_WRITE_TOKEN ||
    '';

  if (!token) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'BLOB_READ_WRITE_TOKEN is not set in environment variables.',
        hint: 'Go to Vercel Dashboard → Project → Settings → Environment Variables and add BLOB_READ_WRITE_TOKEN'
      }),
      { status: 200, headers: { 'content-type': 'application/json' } }
    );
  }

  try {
    // Test: upload a tiny text file to blob storage
    const testContent = `PCZSC Blob Test - ${new Date().toISOString()}`;
    const testBlob = await put(
      `test/pczsc-blob-test-${Date.now()}.txt`,
      testContent,
      { access: 'public', token }
    );

    // Test: list files to confirm it was stored
    const blobList = await list({ token, prefix: 'test/', limit: 5 });

    return new Response(
      JSON.stringify({
        status: 'success',
        message: '✅ Vercel Blob is working correctly!',
        testFileUrl: testBlob.url,
        tokenPresent: true,
        tokenPrefix: token.substring(0, 20) + '...',
        recentBlobFiles: blobList.blobs.map(b => ({ url: b.url, size: b.size, uploadedAt: b.uploadedAt }))
      }),
      { status: 200, headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Blob upload test failed: ' + (err?.message || String(err)),
        tokenPresent: !!token,
        tokenPrefix: token ? token.substring(0, 20) + '...' : 'not set'
      }),
      { status: 200, headers: { 'content-type': 'application/json' } }
    );
  }
}
