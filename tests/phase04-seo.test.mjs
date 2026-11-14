import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getSiteUrl, isPublicIndexingEnabled, getPageUrl } from '../lib/site-url.mjs';

const repo = path.join(import.meta.dirname, '..');
const read = p => fs.readFileSync(path.join(repo, p), 'utf8');
const env = extra => ({ NEXT_PUBLIC_SITE_URL: '', PORTFOLIO_LAUNCH_APPROVED: 'false', ...extra });

test('SEO rejects absent, insecure, invalid or path-containing canonical origins', () => {
  for (const candidate of ['', 'example.com', 'http://example.com', 'https://site.example/path', 'https://user:pass@site.example/', 'javascript:alert(1)', 'https://site.example/?x=1']) {
    assert.equal(getSiteUrl(env({ NEXT_PUBLIC_SITE_URL: candidate })), null);
  }
  assert.equal(getSiteUrl(env({ NEXT_PUBLIC_SITE_URL: 'https://portfolio.example/' })), 'https://portfolio.example');
  assert.equal(getSiteUrl(env({ NEXT_PUBLIC_SITE_URL: 'http://localhost:3000' })), 'http://localhost:3000');
});

test('Indexing requires both the HTTPS site URL and explicit operator approval', () => {
  assert.equal(isPublicIndexingEnabled(env({ NEXT_PUBLIC_SITE_URL: 'https://portfolio.example' })), false);
  assert.equal(isPublicIndexingEnabled(env({ NEXT_PUBLIC_SITE_URL: 'http://localhost:3000', PORTFOLIO_LAUNCH_APPROVED: 'true' })), false);
  assert.equal(isPublicIndexingEnabled(env({ NEXT_PUBLIC_SITE_URL: 'https://portfolio.example', PORTFOLIO_LAUNCH_APPROVED: 'true' })), true);
});

test('Canonical path helper rejects misleading or dangerous paths', () => {
  assert.equal(getPageUrl('/projects/maktablink', env({ NEXT_PUBLIC_SITE_URL:'https://example.org' })), 'https://example.org/projects/maktablink');
  assert.equal(getPageUrl('/', env({ NEXT_PUBLIC_SITE_URL:'https://example.org' })), 'https://example.org');
  for (const p of ['//evil.com/', '/projects?category=all', '/projects/#top', 'https://evil.com', '/../../etc']) {
    assert.equal(getPageUrl(p, env({ NEXT_PUBLIC_SITE_URL: 'https://example.org' })), null);
  }
});

test('All launched public page families supply canonical/share metadata and dedicated OG art', () => {
  for (const file of ['app/layout.tsx','app/projects/page.tsx','app/projects/[slug]/page.tsx','app/about/page.tsx','app/contact/page.tsx']) assert.match(read(file), /createPageMetadata\(/);
  for (const file of ['app/opengraph-image.tsx','app/projects/opengraph-image.tsx','app/projects/[slug]/opengraph-image.tsx','app/about/opengraph-image.tsx','app/contact/opengraph-image.tsx']) {
    assert.match(read(file), /renderOgCard\(/);
  }
  assert.match(read('lib/seo.ts'), /googleBot/);
  assert.match(read('lib/seo.ts'), /contentApproval === "owner_approved"/);
});

test('Sitemap reads public-only records, and robots fails closed', () => {
  assert.match(read('app/sitemap.ts'), /getPublishedProjects\(\)/);
  assert.match(read('app/sitemap.ts'), /getCaseStudy\(p\.slug\)/);
  assert.match(read('app/sitemap.ts'), /canIndexPortfolio\(\)/);
  assert.match(read('app/robots.ts'), /disallow: "\/"/);
  assert.match(read('app/robots.ts'), /canIndexPortfolio\(\)/);
});

test('Recovery pages provide useful navigation and real 404 behavior', () => {
  assert.match(read('app/not-found.tsx'), /Back home/);
  assert.match(read('app/not-found.tsx'), /Browse projects/);
  assert.match(read('app/error.tsx'), /reset\(\)/);
  assert.match(read('app/projects/[slug]/page.tsx'), /notFound\(\)/);
  assert.match(read('app/projects/[slug]/page.tsx'), /dynamicParams = false/);
});

test('Security controls and reduced-motion keyboard treatment are present', () => {
  const config = read('next.config.ts');
  for (const header of ['X-Content-Type-Options','Referrer-Policy','X-Frame-Options','Content-Security-Policy','Permissions-Policy']) assert.ok(config.includes(header));
  assert.match(read('styles/globals.css'), /prefers-reduced-motion:reduce/);
  assert.match(read('app/layout.tsx'), /skip-link/);
});
