import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSiteUrl, isPublicIndexingEnabled } from '../lib/site-url.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const projects = JSON.parse(read('content/projects.json'));
const cases = JSON.parse(read('content/case-studies.json'));
const profile = JSON.parse(read('content/profile.json'));
const errors = [];
const required = ['app/robots.ts', 'app/sitemap.ts', 'app/not-found.tsx', 'app/error.tsx', 'app/opengraph-image.tsx', 'app/about/opengraph-image.tsx', 'app/contact/opengraph-image.tsx', 'app/projects/opengraph-image.tsx', 'app/services/opengraph-image.tsx', 'app/repositories/opengraph-image.tsx', 'app/impact/opengraph-image.tsx', 'app/now/opengraph-image.tsx', 'app/availability/opengraph-image.tsx', 'app/projects/[slug]/opengraph-image.tsx'];
for (const file of required) if (!fs.existsSync(path.join(root, file))) errors.push(`Missing ${file}`);
for (const file of ['app/layout.tsx', 'app/about/page.tsx', 'app/contact/page.tsx', 'app/projects/page.tsx', 'app/services/page.tsx', 'app/repositories/page.tsx', 'app/impact/page.tsx', 'app/now/page.tsx', 'app/availability/page.tsx', 'app/projects/[slug]/page.tsx']) {
  if (!read(file).includes('createPageMetadata(')) errors.push(`Page metadata missing: ${file}`);
}
if (!read('app/sitemap.ts').includes('writingIsLive()') || !read('app/layout.tsx').includes('writingIsLive()')) errors.push('Writing routes and navigation must share the owner approval guard.');
if (!read('app/sitemap.ts').includes('getPublishedProjects()') || !read('app/sitemap.ts').includes('getCaseStudy(p.slug)')) errors.push('Sitemap must derive routes only from published cases.');
if (!read('app/robots.ts').includes('canIndexPortfolio()')) errors.push('Robots must fail closed before approval.');
if (!read('app/projects/[slug]/page.tsx').includes('notFound()')) errors.push('Unknown or unpublished projects need a true 404.');
if (!read('styles/globals.css').includes('prefers-reduced-motion:reduce')) errors.push('Reduced motion treatment missing.');
if (!read('app/layout.tsx').includes('skip-link')) errors.push('Keyboard skip link missing.');
if (getSiteUrl() === null && isPublicIndexingEnabled()) errors.push('Indexing cannot be enabled without a site URL.');
if (projects.some(p => p.publicationStatus !== 'published' && cases.some(c => c.slug === p.slug))) errors.push('A case study for an unpublished project is exposed.');
if (!profile.ownerBioApproved && isPublicIndexingEnabled() && read('lib/seo.ts').includes('return true')) errors.push('Unsafe publication override.');
if (errors.length) { console.error(`SEO contract failed:\n- ${errors.join('\n- ')}`); process.exit(1); }
console.log(`SEO and recovery source contracts passed: ${cases.length} public case studies; ${required.length} routes/media resources; default launch policy guarded.`);
