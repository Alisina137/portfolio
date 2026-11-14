/**
 * Deterministic, network-free launch checklist; independent of Next.js.
 * False means NOT APPROVED, not a failing development build.
 * Only the portfolio owner can provide the human attestations.
 */
import { getSiteUrl } from './site-url.mjs';

export const LAUNCH_CHECKS = Object.freeze([
  'identityAndBio',
  'publicContact',
  'projectClaimsAndStatus',
  'repositoryAndExternalLinks',
  'screenshotsRightsAndPrivacy',
  'mobileAndAccessibility',
  'deployedHttpsJourney',
]);

const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const githubPattern = /^https:\/\/github\.com\/Alisina137\/[\w.-]+\/?$/i;
const safeCommit = /^[a-f0-9]{40}$/i;

export function assessLaunch({ profile, projects, cases, approval, env = process.env }) {
  const blockers = [];
  const add = (id, message) => blockers.push({ id, message });
  const origin = getSiteUrl(env);
  const featured = projects.filter(project => project.publicationStatus === 'published' && project.featuredOrder != null);
  const publicProjects = projects.filter(project => project.publicationStatus === 'published');
  const caseSlugs = new Set(cases.map(study => study.slug));

  if (!profile?.ownerBioApproved) add('DEC-03', 'Professional identity and biography have not been approved by the owner.');
  if (!profile?.publicEmailApproved || !profile?.publicEmail || !emailPattern.test(profile.publicEmail)) {
    add('DEC-01', 'Provide and explicitly approve a reachable public email address.');
  }
  if (!profile?.profileUrlApproved || profile?.profileUrl !== 'https://github.com/Alisina137') {
    add('LINK-01', 'Approve the real public GitHub profile URL.');
  }
  if (featured.length < 4 || featured.length > 6) add('CONTENT-01', 'Feature four to six reviewed projects.');
  for (const project of publicProjects) {
    if (project.contentApproval !== 'owner_approved') add('DEC-02', `Owner review needed for project: ${project.title}.`);
    if (!project.repoUrlVerified || !githubPattern.test(project.repoUrl || '')) add('LINK-02', `Verified public repository missing: ${project.title}.`);
    if (!caseSlugs.has(project.slug)) add('CASE-01', `Published project has no case study: ${project.title}.`);
  }
  if (!origin?.startsWith('https://')) add('DEC-06', 'Set NEXT_PUBLIC_SITE_URL to the actual approved HTTPS origin.');
  if (env.PORTFOLIO_LAUNCH_APPROVED !== 'true') add('LAUNCH-ENV', 'Keep PORTFOLIO_LAUNCH_APPROVED=false until the final owner-approved release.');
  if (approval?.schemaVersion !== 1 || approval.approvedForPublicLaunch !== true) {
    add('OWNER-SIGNOFF', 'Explicit public launch approval is not recorded in content/launch-approval.json.');
  }
  if (typeof approval?.ownerApprovedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(approval.ownerApprovedAt) ||
    !Number.isFinite(Date.parse(`${approval.ownerApprovedAt}T00:00:00Z`)) ||
    Date.parse(`${approval.ownerApprovedAt}T00:00:00Z`) > Date.now()) {
    add('SIGNOFF-DATE', 'Record an actual non-future owner approval date (YYYY-MM-DD).');
  }
  if (!approval?.approvedOrigin || approval.approvedOrigin !== origin || !origin?.startsWith('https://')) {
    add('ORIGIN-MATCH', 'Approved HTTPS domain must exactly match NEXT_PUBLIC_SITE_URL.');
  }
  if (!safeCommit.test(approval?.reviewedCommit || '')) {
    add('REVIEW-REVISION', 'Record the exact audited 40-character Git commit SHA.');
  }
  for (const key of LAUNCH_CHECKS) {
    if (approval?.checks?.[key] !== true) add(`CHECK-${key}`, `Owner has not confirmed: ${key}.`);
  }
  return {
    ready: blockers.length === 0,
    blockers,
    summary: { origin, totalPublished: publicProjects.length, featured: featured.length, caseStudies: cases.length,
      checkedChecks: LAUNCH_CHECKS.filter(key => approval?.checks?.[key] === true).length, totalChecks: LAUNCH_CHECKS.length },
  };
}

/** Safe for server-side gating; never infer approval from a single environment flag. */
export function hasLaunchApproval(approval, env = process.env) {
  const origin = getSiteUrl(env);
  return approval?.schemaVersion === 1 && env.PORTFOLIO_LAUNCH_APPROVED === 'true' &&
    Boolean(origin?.startsWith('https://')) &&
    approval?.approvedForPublicLaunch === true &&
    typeof approval?.ownerApprovedAt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(approval.ownerApprovedAt) &&
    Number.isFinite(Date.parse(`${approval.ownerApprovedAt}T00:00:00Z`)) &&
    Date.parse(`${approval.ownerApprovedAt}T00:00:00Z`) <= Date.now() &&
    approval.approvedOrigin === origin && safeCommit.test(approval.reviewedCommit || '') &&
    LAUNCH_CHECKS.every(key => approval?.checks?.[key] === true);
}
