/** Check local launch readiness without mutating production state or secrets. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assessLaunch } from '../lib/release-audit.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const strict = process.argv.includes('--strict');
const json = process.argv.includes('--json');
const report = assessLaunch({
  profile: read('content/profile.json'),
  projects: read('content/projects.json'),
  cases: read('content/case-studies.json'),
  approval: read('content/launch-approval.json'),
});
if (json) {
  console.log(JSON.stringify({ ...report, checkedAt: new Date().toISOString() }, null, 2));
} else {
  console.log(`Portfolio Phase 5 release review: ${report.ready ? 'READY TO VERIFY LIVE' : 'NOT READY'} (${report.blockers.length} blockers).`);
  console.log(`Public records: ${report.summary.totalPublished} projects, ${report.summary.caseStudies} cases, ${report.summary.featured} featured.`);
  for (const blocker of report.blockers) console.log(`- [${blocker.id}] ${blocker.message}`);
  if (!report.ready) console.log('The preview is intentionally noindex. Owner approvals and live QA are still required.');
}
if (strict && !report.ready) process.exitCode = 1;
