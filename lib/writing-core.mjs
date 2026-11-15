/** Pure publication and Markdown rules shared by Next.js and Node release checks. */
const safeSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO = /^\d{4}-\d{2}-\d{2}$/;
const VALID_CATEGORY = /^[\p{L}\p{N} &'/-]{2,48}$/u;
const SUPPORTED_CODE = new Set(['ts', 'tsx', 'js', 'jsx', 'json', 'bash', 'sh', 'sql', 'text']);

export function isRealDate(value) {
  if (typeof value !== 'string' || !ISO.test(value)) return false;
  const t = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(t.valueOf()) && t.toISOString().slice(0, 10) === value;
}
export function isPublishable(article, today = new Date().toISOString().slice(0, 10)) {
  return article?.publicationStatus === 'published' && article.ownerApproval === 'owner_approved'
    && isRealDate(article.publishedAt) && article.publishedAt <= today
    && (!article.updatedAt || (isRealDate(article.updatedAt) && article.updatedAt >= article.publishedAt && article.updatedAt <= today));
}
export function getApprovedArticles(records, today) {
  if (!Array.isArray(records)) return [];
  return records.filter(record => isPublishable(record, today))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title));
}
export function isWritingEnabled(records, today) {
  return getApprovedArticles(records, today).length >= 2;
}
/** Reject invalid metadata early, including drafts containing dates disguised as publication. */
export function validateWritingManifest(records, projectSlugs = []) {
  const errors = [];
  if (!Array.isArray(records)) return ['Writing manifest must be an array.'];
  const slugs = new Set();
  for (const [index, a] of records.entries()) {
    const name = `article[${index}]`;
    if (!a || typeof a !== 'object') { errors.push(`${name}: invalid record`); continue; }
    if (typeof a.slug !== 'string' || !safeSlug.test(a.slug) || slugs.has(a.slug)) errors.push(`${name}: unique safe slug required`);
    slugs.add(a.slug);
    if (typeof a.title !== 'string' || a.title.trim().length < 16 || a.title.length > 110) errors.push(`${name}: descriptive title required`);
    if (typeof a.excerpt !== 'string' || a.excerpt.trim().length < 50 || a.excerpt.length > 240) errors.push(`${name}: excerpt must be 50–240 characters`);
    if (typeof a.category !== 'string' || !VALID_CATEGORY.test(a.category)) errors.push(`${name}: invalid category`);
    if (!Array.isArray(a.tags) || !a.tags.length || a.tags.some(x => typeof x !== 'string' || x.length > 30)) errors.push(`${name}: tags required`);
    if (!Array.isArray(a.relatedProjects) || a.relatedProjects.some(p => !projectSlugs.includes(p))) errors.push(`${name}: relatedProjects must be existing published project slugs`);
    if (!['draft', 'published', 'archived'].includes(a.publicationStatus)) errors.push(`${name}: invalid publication status`);
    if (!['owner_pending', 'owner_approved'].includes(a.ownerApproval)) errors.push(`${name}: invalid owner approval`);
    if (a.publicationStatus === 'published' && !isPublishable(a)) errors.push(`${name}: publishing requires owner approval and real current dates`);
    if (a.publicationStatus !== 'published' && (a.publishedAt !== null || a.updatedAt !== null)) errors.push(`${name}: drafts/archived records must have null publication dates`);
    if (a.publicationStatus !== 'published' && a.ownerApproval === 'owner_approved') errors.push(`${name}: owner-approved drafts must explicitly transition to published before use`);
  }
  return errors;
}
export function estimateReadingMinutes(body) {
  const prose = String(body).replace(/```[\s\S]*?```/g, ' ').trim();
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 210));
}
export function safeArticleHref(value) {
  if (typeof value !== 'string') return null;
  if (/^https:\/\/[a-z0-9.-]+(?::443)?(?:[/?#][^\s]*)?$/i.test(value)) return value;
  if (/^\/(?!\/)(?:projects\/[a-z0-9-]+|writing\/[a-z0-9-]+|about|contact|projects)(?:#[a-z0-9-]+)?$/i.test(value)) return value;
  return null;
}
function headingId(input, seen) {
  const base = input.toLocaleLowerCase('en').replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-') || 'section';
  const index = (seen.get(base) || 0) + 1;
  seen.set(base, index);
  return index > 1 ? `${base}-${index}` : base;
}
/** Restrained safe Markdown subset. Never interprets raw HTML as HTML. */
export function parseArticle(body) {
  const source = String(body).replace(/\r\n?/g, '\n');
  const lines = source.split('\n');
  const blocks = [];
  const headings = [];
  const seen = new Map();
  let index = 0;
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { index++; continue; }
    const fence = line.match(/^```([a-z0-9_-]*)\s*$/i);
    if (fence) {
      const language = fence[1].toLowerCase() || 'text';
      if (!SUPPORTED_CODE.has(language)) throw new Error(`Unsupported code language: ${language}`);
      index++; const content = [];
      while (index < lines.length && !/^```\s*$/.test(lines[index])) content.push(lines[index++]);
      if (index === lines.length) throw new Error('Unclosed code fence');
      index++;
      blocks.push({ type: 'code', language, text: content.join('\n') });
      continue;
    }
    const heading = line.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2].replace(/\*\*|\*|`/g, '');
      const id = headingId(text, seen);
      headings.push({ level, id, text });
      blocks.push({ type: 'heading', level, id, text: heading[2] });
      index++; continue;
    }
    const quote = line.match(/^>\s?(.+)$/);
    if (quote) { const parts = []; while(index < lines.length && /^>\s?/.test(lines[index])) parts.push(lines[index++].replace(/^>\s?/, '')); blocks.push({ type: 'quote', text: parts.join(' ') }); continue; }
    const bullet = /^[-*]\s+/.test(line);
    const numbered = /^\d+\.\s+/.test(line);
    if (bullet || numbered) {
      const items = []; const regex = bullet ? /^[-*]\s+/ : /^\d+\.\s+/;
      while(index < lines.length && regex.test(lines[index])) items.push(lines[index++].replace(regex, '').trim());
      blocks.push({ type: numbered ? 'ordered' : 'list', items }); continue;
    }
    const paragraph = [];
    while(index < lines.length && lines[index].trim() && !/^(?:#{2,3}\s|```|>\s?|[-*]\s+|\d+\.\s+)/.test(lines[index])) paragraph.push(lines[index++]);
    if (paragraph.length) { blocks.push({ type: 'paragraph', text: paragraph.join(' ').trim() }); continue; }
    throw new Error(`Unsupported Markdown syntax at line ${index + 1}`);
  }
  return { blocks, headings };
}
