/** Read-only, actual HTTP route check. Never mutates a deployment. */
import { getSiteUrl } from '../lib/site-url.mjs';
import fs from 'node:fs';

const urlArgument = process.argv.find(arg => arg.startsWith('--url='))?.slice(6) || process.env.PORTFOLIO_DEPLOYED_URL;
const mode = process.argv.find(arg => arg.startsWith('--mode='))?.slice(7) || process.env.PORTFOLIO_SMOKE_MODE || 'preview';
if (!['preview', 'launch'].includes(mode)) { console.error('Use --mode=preview or --mode=launch'); process.exit(2); }
const origin = getSiteUrl({ NEXT_PUBLIC_SITE_URL: urlArgument || '' });
if (!origin || (mode === 'launch' && !origin.startsWith('https://'))) {
  console.error('Supply an actual origin via --url=https://your-domain.example or PORTFOLIO_DEPLOYED_URL. Launch checks require HTTPS.');
  process.exit(2);
}
const paths = ['/', '/projects', '/about', '/contact', '/projects/maktablink'];
const requirements = [];
const errors = [];
const check = (name, passed) => { requirements.push(name); if (!passed) errors.push(name); };
async function request(path) {
  return fetch(origin + path, {redirect: 'follow', signal: AbortSignal.timeout(14000), headers: { 'User-Agent': 'AlisinaPortfolioSmoke/1.0' } });
}
try {
  for (const route of paths) {
    const res = await request(route);
    const body = await res.text();
    check(`${route} 200`, res.status === 200);
    check(`${route} HTML`, body.includes('<main'));
    check(`${route} X-Content-Type-Options`, res.headers.get('x-content-type-options') === 'nosniff');
    check(`${route} ${mode === 'preview' ? 'noindex' : 'indexable'}`, mode === 'preview'
      ? /<meta[^>]+name="robots"[^>]+noindex/i.test(body)
      : !/<meta[^>]+name="robots"[^>]+noindex/i.test(body));
    if (mode === 'launch') check(`${route} canonical URL`, body.includes(`rel="canonical" href="${origin}${route === '/' ? '' : route}"`));
  }
  for (const bad of ['/does-not-exist-alisina','/projects/unknown-alisina']) {
    const res = await request(bad);
    check(`${bad} real 404`, res.status === 404);
  }
  const robots = await request('/robots.txt'); const robotsBody = await robots.text();
  check('robots HTTP 200', robots.status === 200);
  check(`robots ${mode} policy`, mode === 'preview' ? robotsBody.includes('Disallow: /') : robotsBody.includes('Allow: /'));
  const sitemap = await request('/sitemap.xml'); const sitemapBody = await sitemap.text();
  check('sitemap HTTP 200', sitemap.status === 200);
  check(`sitemap ${mode} policy`, mode === 'preview' ? !sitemapBody.includes('<loc>') : sitemapBody.includes(`<loc>${origin}/projects/maktablink</loc>`));
  for (const route of ['/opengraph-image','/projects/opengraph-image','/projects/maktablink/opengraph-image']) {
    const res = await request(route);
    check(`${route} image`, res.status === 200 && (res.headers.get('content-type') || '').includes('image/png'));
  }
  console.log(`Deployed smoke (${mode}) on ${origin}: ${requirements.length - errors.length}/${requirements.length} HTTP assertions passed.`);
} catch (err) { errors.push(`Network/environment error: ${err?.message || err}`); }
if (errors.length) { console.error('Deployed smoke failures:\n- ' + errors.join('\n- ')); process.exitCode = 1; }
