/**
 * Checks public, explicitly approved outgoing portfolio links.
 * Network errors and rate limits are INCONCLUSIVE, never silently reported as verified.
 * Usage: npm run check:links [-- --strict]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = name => JSON.parse(fs.readFileSync(path.join(root, 'content', name), 'utf8'));
const profile = read('profile.json');
const projects = read('projects.json');
const urls = new Set();
if (profile.profileUrlApproved && profile.profileUrl) urls.add(profile.profileUrl);
if (profile.linkedInApproved && profile.linkedInUrl) urls.add(profile.linkedInUrl);
for (const p of projects) if (p.publicationStatus === 'published' && p.repoUrlVerified) urls.add(p.repoUrl);
const strict = process.argv.includes('--strict');
const allowed = new Set(['github.com','www.linkedin.com']);
let ok = 0, broken = 0, inconclusive = 0;
const timeoutMs = 9000;

for (const raw of urls) {
  let url;
  try { url = new URL(raw); } catch { broken++; console.error(`INVALID ${raw}`); continue; }
  if (url.protocol !== 'https:' || !allowed.has(url.hostname) || url.username || url.password) {
    broken++; console.error(`NOT ALLOWED ${raw}`); continue;
  }
  let response;
  try {
    response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(timeoutMs), redirect: 'follow', headers: {'User-Agent': 'AlisinaPortfolioLinkCheck/1.0'} });
    // Some hosts do not implement HEAD consistently.
    if ([400, 405, 501].includes(response.status)) response = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(timeoutMs), redirect: 'follow', headers: {'User-Agent': 'AlisinaPortfolioLinkCheck/1.0'} });
    const finalUrl = new URL(response.url);
    if (!allowed.has(finalUrl.hostname) || finalUrl.protocol !== 'https:') {
      broken++; console.error(`UNSAFE REDIRECT ${raw} -> ${response.url}`); continue;
    }
    if (response.ok) { ok++; console.log(`OK ${raw}`); }
    else if ([401,403,408,429,500,502,503,504].includes(response.status)) {
      inconclusive++; console.warn(`INCONCLUSIVE ${response.status} ${raw}`);
    } else { broken++; console.error(`BROKEN ${response.status} ${raw}`); }
  } catch (error) {
    inconclusive++;
    console.warn(`INCONCLUSIVE ${raw} (${error?.cause?.code || error?.name || 'network failure'})`);
  }
}
console.log(`Link audit: ${ok} reachable / ${broken} broken / ${inconclusive} inconclusive (${urls.size} unique URLs).`);
if (broken || (strict && inconclusive)) process.exitCode = 1;
