import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const profile = JSON.parse(fs.readFileSync(path.join(root, 'content/profile.json'), 'utf8'));
const projects = JSON.parse(fs.readFileSync(path.join(root, 'content/projects.json'), 'utf8'));
const isRelease = process.argv.includes('--release');
const errors = [];
const fail = (message) => errors.push(message);
const validStatus = new Set(['concept','prototype','in_development','pilot','released','maintained','retired']);
const validPublication = new Set(['draft','in_review','published','archived']);
const seen = new Set();
if (!profile.displayName || !profile.professionalTitle || !profile.shortBio) fail('profile identity and biography are required');
if (!profile.profileUrlApproved || !/^https:\/\/github\.com\/[a-zA-Z0-9-]+\/?$/.test(profile.profileUrl || '')) fail('approved GitHub profile URL must be valid');
if (profile.publicEmail && !profile.publicEmailApproved) fail('unapproved contact email must not be in public profile data');
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
const orders = featured.map(p => p.featuredOrder);
if (new Set(orders).size !== orders.length) fail('featuredOrder values must be unique');
if (isRelease) {
  if (!profile.ownerBioApproved) fail('public biography needs owner sign-off');
  if (!profile.publicEmail || !profile.publicEmailApproved) fail('owner-approved reachable contact required before launch (DEC-01)');
  fail('P01 preview cannot be indexed or publicly launched until P02–P05 release gates pass');
}
if (errors.length) {
  console.error(`Content validation failed (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Content validation passed: ${projects.length} records, ${featured.length} published featured, no duplicate slugs.`);
