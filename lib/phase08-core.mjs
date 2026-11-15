/** Phase 08 security, validation and publication policies. Pure functions for Node + Next. */
import { createHash } from 'node:crypto';

const EMAIL = /^[^\s@<>]{1,64}@[^\s@<>]{1,190}\.[^\s@<>]{2,24}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ID = /^[1-9]\d{0,19}$/;
const SAFE_REPO = /^Alisina137\/portfolio$/;
const safeUrl = (s) => { try { const u = new URL(s); return u.protocol === 'https:' && u.pathname === '/' && !u.search && !u.hash && !u.username && !u.password; } catch { return false; } };

export function studioConfig(env = process.env) {
  const enabled = env.PORTFOLIO_STUDIO_ENABLED === 'true';
  const origin = String(env.NEXT_PUBLIC_SITE_URL || '');
  const devOrigin = env.NODE_ENV !== 'production' && /^http:\/\/(?:localhost|127\.0\.0\.1):\d+\/?$/.test(origin);
  const valid = enabled && (safeUrl(origin) || devOrigin)
    && /^.{10,}$/.test(env.PORTFOLIO_GITHUB_CLIENT_ID || '')
    && !!env.PORTFOLIO_GITHUB_CLIENT_SECRET && (env.PORTFOLIO_STUDIO_SESSION_SECRET || '').length >= 32
    && ID.test(env.PORTFOLIO_OWNER_GITHUB_ID || '')
    && !!env.PORTFOLIO_STUDIO_GITHUB_TOKEN
    && SAFE_REPO.test(env.PORTFOLIO_STUDIO_REPOSITORY || '');
  return { enabled: Boolean(valid), origin: origin.replace(/\/$/, ''), repo: env.PORTFOLIO_STUDIO_REPOSITORY, ownerId: String(env.PORTFOLIO_OWNER_GITHUB_ID || '') };
}
export function contactConfig(env = process.env) {
  const siteKey = String(env.NEXT_PUBLIC_PORTFOLIO_TURNSTILE_SITE_KEY || '');
  const recipient = String(env.PORTFOLIO_CONTACT_TO || '');
  const sender = String(env.PORTFOLIO_CONTACT_FROM || '');
  const publicOrigin = String(env.NEXT_PUBLIC_SITE_URL || '');
  const devOrigin = env.NODE_ENV !== 'production' && /^http:\/\/(?:localhost|127\.0\.0\.1):\d+\/?$/.test(publicOrigin);
  const enabled = env.PORTFOLIO_CONTACT_ENABLED === 'true' && (safeUrl(publicOrigin) || devOrigin)
    && EMAIL.test(recipient) && EMAIL.test(sender) && !!env.PORTFOLIO_RESEND_API_KEY
    && !!env.PORTFOLIO_TURNSTILE_SECRET && !!siteKey
    && /^https:\/\/[a-z0-9.-]+(?:\/[^\s]*)?$/i.test(env.PORTFOLIO_UPSTASH_REDIS_REST_URL || '')
    && !!env.PORTFOLIO_UPSTASH_REDIS_REST_TOKEN;
  return { enabled: Boolean(enabled), siteKey };
}
export function safeText(input, min, max, multiline = false) {
  if (typeof input !== 'string') return null;
  const value = input.trim();
  if (value.length < min || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value) || (!multiline && /[\r\n]/.test(value))) return null;
  return value;
}
export function validateContact(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  if (input.website) return null; // honeypot: do not process
  const name = safeText(input.name, 2, 90);
  const email = safeText(input.email, 5, 254);
  const subject = safeText(input.subject, 5, 140);
  const message = safeText(input.message, 20, 4000, true);
  const captcha = safeText(input.turnstileToken, 10, 2048);
  if (!name || !email || !EMAIL.test(email) || !subject || !message || !captcha) return null;
  return { name, email, subject, message, turnstileToken: captcha };
}
export function hashLimiterKey(ip, secret) {
  return createHash('sha256').update(String(secret) + '|' + String(ip)).digest('hex').slice(0, 32);
}
export function validSameOrigin(request, configuredOrigin) {
  const supplied = request.headers.get('origin');
  if (!supplied) return false;
  const expected = configuredOrigin?.replace(/\/$/, '');
  return Boolean(expected && supplied === expected);
}
export function validateStudioChange({ kind, slug, fields }, baseline) {
  if (!baseline || typeof baseline !== 'object' || !fields || typeof fields !== 'object' || Array.isArray(fields)) return null;
  if (!['profile', 'project', 'case', 'article'].includes(kind)) return null;
  if (kind !== 'profile' && (typeof slug !== 'string' || !SLUG.test(slug))) return null;
  if (kind === 'profile') {
    const allowed = ['professionalTitle','headline','intro','shortBio','locationText','publicEmail','ownerBioApproved','publicEmailApproved'];
    if (Object.keys(fields).some(k => !allowed.includes(k))) return null;
    const next = { ...baseline };
    for (const k of allowed) if (Object.hasOwn(fields,k)) {
      if (k === 'ownerBioApproved' || k === 'publicEmailApproved') { if (typeof fields[k] !== 'boolean') return null; next[k] = fields[k]; }
      else if (k === 'publicEmail') {
        if (fields[k] !== null && fields[k] !== '' && (!safeText(fields[k],5,254) || !EMAIL.test(fields[k]))) return null;
        next[k] = fields[k] || null;
      } else { const v = safeText(fields[k], 2, k === 'shortBio' ? 1600 : 300, k === 'shortBio' || k === 'intro'); if (!v) return null; next[k] = v; }
    }
    if (next.publicEmailApproved && !next.publicEmail) return null;
    return next;
  }
  if (kind === 'project') {
    const allowed = ['oneLiner','ownerRole','developmentStatus','contentApproval'];
    if (Object.keys(fields).some(k => !allowed.includes(k))) return null;
    const next = { ...baseline };
    if (Object.hasOwn(fields,'oneLiner')) { next.oneLiner = safeText(fields.oneLiner, 25, 240); if (!next.oneLiner) return null; }
    if (Object.hasOwn(fields,'ownerRole')) { next.ownerRole = safeText(fields.ownerRole, 5, 240); if (!next.ownerRole) return null; }
    if (Object.hasOwn(fields,'developmentStatus')) { if (!['concept','prototype','in_development','pilot','released','maintained','retired'].includes(fields.developmentStatus)) return null; next.developmentStatus=fields.developmentStatus; }
    if (Object.hasOwn(fields,'contentApproval')) { if (!['owner_pending','owner_approved'].includes(fields.contentApproval)) return null; next.contentApproval=fields.contentApproval; }
    if (next.developmentStatus === 'released' && next.contentApproval !== 'owner_approved') return null;
    return next;
  }
  if (kind === 'case') {
    const allowed = ['audience','productType','currentState','sourceEvidence','problem'];
    if (Object.keys(fields).some(k=>!allowed.includes(k))) return null;
    const next = { ...baseline };
    for (const k of allowed) if (Object.hasOwn(fields,k)) {
      if (k === 'problem') {
        if (!Array.isArray(fields.problem) || fields.problem.length < 2 || fields.problem.length > 6) return null;
        const values = fields.problem.map(v => safeText(v, 35, 1200, true)); if (values.some(v => !v)) return null;
        next.problem=values;
      } else { const v=safeText(fields[k],16,k==='currentState'?1000:300,true); if (!v) return null; next[k]=v; }
    }
    return next;
  }
  const allowed = ['title','excerpt','category','tags','relatedProjects','publicationStatus','ownerApproval','publishedAt','updatedAt','body'];
  if (Object.keys(fields).some(k=>!allowed.includes(k))) return null;
  const next={...baseline};
  for (const k of ['title','excerpt','category']) if (Object.hasOwn(fields,k)) {
    const min = k==='title'?16:k==='excerpt'?50:2;
    const max = k==='title'?110:k==='excerpt'?240:48;
    next[k]=safeText(fields[k],min,max);if(!next[k])return null;
  }
  if (Object.hasOwn(fields,'tags')) { if (!Array.isArray(fields.tags)||!fields.tags.length||fields.tags.length>8) return null; next.tags=fields.tags.map(v=>safeText(v,1,30)); if(next.tags.some(v=>!v)) return null; }
  if (Object.hasOwn(fields,'relatedProjects')) { if (!Array.isArray(fields.relatedProjects)||fields.relatedProjects.length>5||fields.relatedProjects.some(v=>typeof v!=='string'||!SLUG.test(v)))return null; next.relatedProjects=fields.relatedProjects; }
  if (Object.hasOwn(fields,'publicationStatus')) { if(!['draft','published','archived'].includes(fields.publicationStatus))return null;next.publicationStatus=fields.publicationStatus; }
  if (Object.hasOwn(fields,'ownerApproval')) { if(!['owner_pending','owner_approved'].includes(fields.ownerApproval))return null;next.ownerApproval=fields.ownerApproval; }
  for(const k of ['publishedAt','updatedAt'])if(Object.hasOwn(fields,k)) { if(fields[k]!==null && !/^\d{4}-\d{2}-\d{2}$/.test(fields[k])) return null; next[k]=fields[k]; }
  if (next.publicationStatus!=='published') { next.publishedAt=null; next.updatedAt=null;next.ownerApproval='owner_pending'; }
  const body=Object.hasOwn(fields,'body')?safeText(fields.body,250,60000,true):null;
  if (Object.hasOwn(fields,'body') && !body) return null;
  return {record:next,body};
}
export function validMediaDetails(details) {
  if (!details || !SLUG.test(details.slug || '') || !['Mobile app','Web/admin','Workflow/architecture'].includes(details.group)) return null;
  const alt=safeText(details.alt, 10, 180),caption=safeText(details.caption,10,260);
  if (!alt||!caption||details.confirmNoPrivateData !== 'true')return null;
  return { slug:details.slug, group:details.group,alt,caption };
}
