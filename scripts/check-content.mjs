import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSiteUrl, isPublicIndexingEnabled } from '../lib/site-url.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const profile = JSON.parse(fs.readFileSync(path.join(root, 'content/profile.json'), 'utf8'));
const projects = JSON.parse(fs.readFileSync(path.join(root, 'content/projects.json'), 'utf8'));
const caseStudies = JSON.parse(fs.readFileSync(path.join(root, 'content/case-studies.json'), 'utf8'));
const reviewQueue = JSON.parse(fs.readFileSync(path.join(root, 'content/review-queue.json'), 'utf8'));
const isRelease = process.argv.includes('--release');
const errors = [];
const fail = (message) => errors.push(message);
const validStatus = new Set(['concept','prototype','in_development','pilot','released','maintained','retired']);
const validPublication = new Set(['draft','in_review','published','archived']);
const seen = new Set();
if (!profile.displayName || !profile.professionalTitle || !profile.shortBio) fail('profile identity and biography are required');
if (!profile.profileUrlApproved || !/^https:\/\/github\.com\/[a-zA-Z0-9-]+\/?$/.test(profile.profileUrl || '')) fail('approved GitHub profile URL must be valid');
if (profile.publicEmail && !profile.publicEmailApproved) fail('unapproved contact email must not be in public profile data');
if (profile.publicEmailApproved && (typeof profile.publicEmail !== 'string' || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(profile.publicEmail) || profile.publicEmail.length > 254)) fail('approved email must be a syntactically valid address');
if (profile.linkedInUrl && (!profile.linkedInApproved || !/^https:\/\/www\.linkedin\.com\//.test(profile.linkedInUrl))) fail('LinkedIn must be an explicitly approved HTTPS profile link');
if (profile.resumeApproved || profile.resumeUrl) {
  if (!profile.resumeApproved || profile.resumeUrl !== '/resume.pdf' || !fs.existsSync(path.join(root,'public','resume.pdf'))) fail('résumé requires owner approval, /resume.pdf path, and an actual PDF file');
  else if (fs.readFileSync(path.join(root,'public','resume.pdf')).subarray(0,5).toString() !== '%PDF-') fail('résumé must be a real PDF, not a renamed text file');
}
if (profile.education && !profile.educationApproved) fail('unapproved education text must not appear in the public repository');
if (profile.educationApproved && !(typeof profile.education === 'string' && profile.education.trim())) fail('approved education requires a human-readable verified description');

for (const p of projects) {
  const pathId = `project[${p.slug || p.id || '?'}]`;
  if (!p.slug || !/^[a-z0-9-]+$/.test(p.slug)) fail(`${pathId}: safe stable slug required`);
  if (seen.has(p.slug)) fail(`${pathId}: duplicate slug`);
  seen.add(p.slug);
  for (const field of ['title','oneLiner','category','eyebrow','ownerRole','sourceCheckedAt']) {
    if (typeof p[field] !== 'string' || !p[field].trim()) fail(`${pathId}: missing ${field}`);
  }
  if (!validStatus.has(p.developmentStatus)) fail(`${pathId}: invalid developmentStatus`);
  if (!validPublication.has(p.publicationStatus)) fail(`${pathId}: invalid publicationStatus`);
  if (!Array.isArray(p.technologies) || p.technologies.length < 2 || p.technologies.length > 4) fail(`${pathId}: expected 2–4 technology tags`);
  if (!p.repoUrl || !/^https:\/\/github\.com\/Alisina137\/[a-zA-Z0-9._-]+\/?$/.test(p.repoUrl)) fail(`${pathId}: invalid verified repository URL`);
  if (p.publicationStatus === 'published' && !p.repoUrlVerified) fail(`${pathId}: publicly linked repository is not verified`);
  if (p.featuredOrder != null && (!Number.isInteger(p.featuredOrder) || p.featuredOrder < 1)) fail(`${pathId}: featuredOrder must be positive integer`);
  if (p.publicationStatus !== 'published' && p.featuredOrder != null) fail(`${pathId}: draft/archived records must not be featured`);
  if (p.developmentStatus === 'released' && p.contentApproval !== 'owner_approved') fail(`${pathId}: release claims need owner sign-off`);
  if (isRelease && p.publicationStatus === 'published' && p.contentApproval !== 'owner_approved') fail(`${pathId}: owner must review project copy/status before public release`);
}
const featured = projects.filter(p => p.publicationStatus === 'published' && p.featuredOrder != null);
if (featured.length < 4 || featured.length > 6) fail(`4–6 published featured records required; found ${featured.length}`);
const published = projects.filter(p => p.publicationStatus === 'published');
const publishedSlugs = new Set(published.map(p => p.slug));
const caseSlugs = new Set();
for (const c of caseStudies) {
  const key = `case[${c.slug || '?'}]`;
  if (caseSlugs.has(c.slug)) fail(`${key}: duplicate case`);
  caseSlugs.add(c.slug);
  if (!publishedSlugs.has(c.slug)) fail(`${key}: cannot expose an unpublished project`);
  for (const field of ['audience','productType','currentState','sourceEvidence']) {
    if (typeof c[field] !== 'string' || c[field].trim().length < 16) fail(`${key}: missing ${field}`);
  }
  for (const field of ['platforms','problem','features','technicalNotes','tradeoffs','nextSteps','media']) {
    if (!Array.isArray(c[field])) fail(`${key}: expected ${field} array`);
  }
  if ((c.problem || []).length < 2 || (c.features || []).length < 3 || (c.technicalNotes || []).length < 1 || (c.tradeoffs || []).length < 1) fail(`${key}: incomplete engineering case`);
  for (const item of [...(c.features || []), ...(c.technicalNotes || []), ...(c.tradeoffs || [])]) {
    if (!item.title || !item.description) fail(`${key}: content block requires title and description`);
  }
  for (const [index, feature] of (c.features || []).entries()) {
    if (!feature.screenshot) continue;
    const shot = feature.screenshot;
    const prefix = `/projects/${c.slug}/`;
    if (shot.approved !== true || typeof shot.src !== 'string' ||
      !shot.src.startsWith(prefix) || !/^\/projects\/[a-z0-9-]+\/[a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|webp|avif)$/.test(shot.src)) {
      fail(`${key}: feature ${index + 1} screenshot needs approved local /projects/${c.slug}/ image`);
      continue;
    }
    if (typeof shot.alt !== 'string' || shot.alt.trim().length < 10 ||
        typeof shot.caption !== 'string' || shot.caption.trim().length < 8) {
      fail(`${key}: feature ${index + 1} screenshot requires useful alt text and an authentic caption`);
    }
    if (!fs.existsSync(path.join(root, 'public', shot.src.slice(1)))) {
      fail(`${key}: missing approved feature screenshot ${shot.src}`);
    }
  }
  for (const media of c.media || []) {
    if (media.approved !== true || !media.src?.startsWith('/media/') || !/^\/media\/[a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|webp)$/.test(media.src)) fail(`${key}: only approved local media paths are permitted`);
    if (!media.alt?.trim() || !media.caption?.trim() || !['Mobile app','Web/admin','Workflow/architecture'].includes(media.group)) fail(`${key}: media needs alt, caption and group`);
    if (!fs.existsSync(path.join(root, 'public', media.src.replace(/^\//,'')))) fail(`${key}: missing media file ${media.src}`);
  }
}
for (const p of published) if (!caseSlugs.has(p.slug)) fail(`published ${p.slug}: complete case study required by P02`);
for (const p of projects) {
  if (p.projectDate && (!/^\d{4}-\d{2}-\d{2}$/.test(p.projectDate) || p.contentApproval !== 'owner_approved')) fail(`${p.slug}: unapproved or invalid project date`);
}
for (const pending of reviewQueue) if (published.some(p => p.repoUrl === pending.repoUrl)) fail(`review queue includes an already published repo ${pending.repoUrl}`);
const orders = featured.map(p => p.featuredOrder);
if (new Set(orders).size !== orders.length) fail('featuredOrder values must be unique');
if (isRelease) {
  if (!profile.ownerBioApproved) fail('public biography needs owner sign-off');
  if (!profile.publicEmail || !profile.publicEmailApproved) fail('owner-approved reachable contact required before launch (DEC-01)');
  if (!getSiteUrl()?.startsWith('https://')) fail('release needs a real configured HTTPS NEXT_PUBLIC_SITE_URL');
  if (!isPublicIndexingEnabled()) fail('release needs PORTFOLIO_LAUNCH_APPROVED=true after owner sign-off');
}
if (errors.length) {
  console.error(`Content validation failed (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Content validation passed: ${published.length} published records, ${caseStudies.length} case studies, ${featured.length} featured, ${reviewQueue.length} pending review.`);
