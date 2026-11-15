/** Production server smoke tests; run only after next build, with launch indexing disabled. */
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { isWritingEnabled } from '../lib/writing-core.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next');
if (!fs.existsSync(nextBin)) throw new Error('Run npm install and npm run build first; Next.js is not installed.');
const port = await new Promise((resolve, reject) => {
  const s = createServer();
  s.once('error', reject);
  s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => resolve(p)); });
});
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, [nextBin, 'start', '--hostname', '127.0.0.1', '-p', String(port)], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, PORTFOLIO_LAUNCH_APPROVED: 'false', NEXT_PUBLIC_SITE_URL: '' },
});
let logs = '';
server.stdout.on('data', chunk => { logs += chunk.toString(); });
server.stderr.on('data', chunk => { logs += chunk.toString(); });
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const checks = [];
const check = (name, ok) => { assert.ok(ok, name); checks.push(name); };
try {
  let ready = false;
  for (let i = 0; i < 80; i++) {
    if (server.exitCode !== null) throw new Error(`Next server stopped: ${logs.slice(-2000)}`);
    try { const response = await fetch(origin, { signal: AbortSignal.timeout(1200) }); if (response.status === 200) { ready = true; break; } } catch { /* Server not ready yet. */ }
    await pause(200);
  }
  if (!ready) throw new Error(`Next failed to start: ${logs.slice(-2000)}`);
  for (const pathname of ['/', '/projects', '/about', '/contact', '/projects/maktablink']) {
    const response = await fetch(`${origin}${pathname}`);
    const html = await response.text();
    check(`${pathname} HTTP 200`, response.status === 200);
    check(`${pathname} HTML and noindex`, html.includes('<main') && /name="robots"[^>]*noindex/i.test(html));
    check(`${pathname} security response headers`, response.headers.get('x-content-type-options') === 'nosniff' && response.headers.get('x-frame-options') === 'DENY');
  }
  const writingRecords = JSON.parse(fs.readFileSync(path.join(root, 'content', 'writing', 'articles.json'), 'utf8'));
  const writingLive = isWritingEnabled(writingRecords);
  for (const pathname of ['/projects/not-an-existing-project', '/unknown-path', '/writing/never-published-article']) {
    const response = await fetch(`${origin}${pathname}`);
    check(`${pathname} real 404`, response.status === 404);
  }
  const homeHtml = await (await fetch(origin)).text();
  check('Writing nav respects owner approval', /href="\/writing"/.test(homeHtml) === writingLive);
  for (const pathname of ['/writing', ...writingRecords.map(a => `/writing/${a.slug}`)]) {
    const response = await fetch(`${origin}${pathname}`);
    const isPublishedSlug = pathname === '/writing' || writingRecords.some(a => a.slug === pathname.slice('/writing/'.length) && a.publicationStatus === 'published' && a.ownerApproval === 'owner_approved');
    check(`${pathname} route matches approval state`, response.status === (writingLive && isPublishedSlug ? 200 : 404));
  }
  const robotsResponse = await fetch(`${origin}/robots.txt`);
  const robots = await robotsResponse.text();
  check('Preview robots disallow indexing', robotsResponse.status === 200 && robots.includes('Disallow: /'));
  const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
  const sitemap = await sitemapResponse.text();
  check('Preview sitemap has no public URLs', sitemapResponse.status === 200 && !sitemap.includes('<loc>'));
  for (const pathname of ['/opengraph-image', '/about/opengraph-image', '/projects/maktablink/opengraph-image']) {
    const response = await fetch(`${origin}${pathname}`);
    check(`${pathname} PNG image`, response.status === 200 && response.headers.get('content-type')?.includes('image/png'));
  }
  console.log(`Production HTTP smoke tests passed: ${checks.length} assertions across home/catalog/cases/about/contact, 404, SEO and security.`);
} catch (error) {
  console.error('HTTP smoke failed:', error);
  console.error('Next server log excerpt:', logs.slice(-3000));
  process.exitCode = 1;
} finally {
  server.kill('SIGTERM');
}
