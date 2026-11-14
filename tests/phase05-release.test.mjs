import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { assessLaunch, hasLaunchApproval, LAUNCH_CHECKS } from '../lib/release-audit.mjs';

const read = (file) => JSON.parse(fs.readFileSync(new URL(`../content/${file}`, import.meta.url), 'utf8'));
const profile = read('profile.json');
const projects = read('projects.json');
const cases = read('case-studies.json');
const signoff = read('launch-approval.json');
const env = { NEXT_PUBLIC_SITE_URL: 'https://approved.example', PORTFOLIO_LAUNCH_APPROVED: 'true' };
const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
const nextWeek = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);
const copy = value => JSON.parse(JSON.stringify(value));
function approved() {
  const p = { ...copy(profile), ownerBioApproved: true, publicEmailApproved: true, publicEmail: 'public@example.org' };
  const list = copy(projects).map(item => ({ ...item, contentApproval: 'owner_approved' }));
  const a = {
    ...copy(signoff), approvedForPublicLaunch: true, approvedOrigin: env.NEXT_PUBLIC_SITE_URL,
    ownerApprovedAt: yesterday, reviewedCommit: 'b'.repeat(40),
    checks: Object.fromEntries(LAUNCH_CHECKS.map(key => [key, true])),
  };
  return { profile: p, projects: list, cases, approval: a, env };
}
test('P05 default public launch is blocked and not accidentally indexable', () => {
  const input = { profile, projects, cases, approval: signoff, env: { PORTFOLIO_LAUNCH_APPROVED: 'false' } };
  const result = assessLaunch(input);
  assert.equal(result.ready, false);
  assert.equal(hasLaunchApproval(signoff, env), false);
  assert.ok(result.blockers.some(item => item.id === 'DEC-01'));
  assert.ok(result.blockers.some(item => item.id === 'DEC-02'));
  assert.ok(result.blockers.some(item => item.id === 'OWNER-SIGNOFF'));
});
test('P05 a fully approved content and review fixture passes the source-level gate', () => {
  const input = approved();
  assert.equal(assessLaunch(input).ready, true);
  assert.equal(hasLaunchApproval(input.approval, input.env), true);
});
test('P05 missing contact, claim review or gallery/privacy approval blocks release', () => {
  const input = approved();
  input.profile.publicEmailApproved = false;
  assert.equal(assessLaunch(input).ready, false);
  input.profile.publicEmailApproved = true;
  input.projects[0].contentApproval = 'owner_pending';
  assert.ok(assessLaunch(input).blockers.some(item => item.id === 'DEC-02'));
  input.projects[0].contentApproval = 'owner_approved';
  input.approval.checks.screenshotsRightsAndPrivacy = false;
  assert.equal(hasLaunchApproval(input.approval, input.env), false);
});
test('P05 wrong domain, invalid revision, future date and env toggles fail closed', () => {
  const input = approved();
  input.approval.approvedOrigin = 'https://other.example';
  assert.equal(hasLaunchApproval(input.approval, env), false);
  input.approval.approvedOrigin = env.NEXT_PUBLIC_SITE_URL;
  input.approval.reviewedCommit = 'placeholder';
  assert.equal(hasLaunchApproval(input.approval, env), false);
  input.approval.reviewedCommit = 'b'.repeat(40);
  input.approval.ownerApprovedAt = nextWeek;
  assert.equal(hasLaunchApproval(input.approval, env), false);
  input.approval.ownerApprovedAt = yesterday;
  assert.equal(hasLaunchApproval(input.approval, { ...env, PORTFOLIO_LAUNCH_APPROVED: 'false' }), false);
  assert.equal(hasLaunchApproval(input.approval, { ...env, NEXT_PUBLIC_SITE_URL: 'http://insecure.example' }), false);
});
test('P05 review checklist is explicit and includes live-device acceptance', () => {
  assert.deepEqual(Object.keys(signoff.checks), [...LAUNCH_CHECKS]);
  assert.ok(LAUNCH_CHECKS.includes('deployedHttpsJourney'));
  assert.equal(signoff.approvedForPublicLaunch, false);
  assert.equal(signoff.approvedOrigin, null);
  assert.equal(signoff.reviewedCommit, null);
});
test('P05 read-only production smoke and external link tools exist', () => {
  const smoke = fs.readFileSync(new URL('../scripts/smoke-deployed.mjs', import.meta.url), 'utf8');
  const link = fs.readFileSync(new URL('../scripts/verify-public-links.mjs', import.meta.url), 'utf8');
  assert.match(smoke, /status === 404/);
  assert.match(smoke, /robots\.txt/);
  assert.match(smoke, /sitemap\.xml/);
  assert.match(smoke, /opengraph-image/);
  assert.match(link, /INCONCLUSIVE/);
  assert.match(link, /PORTFOLIO/gi);
});
