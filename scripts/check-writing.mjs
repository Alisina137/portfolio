import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getApprovedArticles, isWritingEnabled, parseArticle, safeArticleHref, validateWritingManifest } from '../lib/writing-core.mjs';
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const articles = JSON.parse(read('content/writing/articles.json'));
const publishedProjects = JSON.parse(read('content/projects.json')).filter(p => p.publicationStatus === 'published');
const errors = validateWritingManifest(articles, publishedProjects.map(p => p.slug));
const headingsBySlug = new Map();
for (const item of articles) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug ?? '')) continue;
  const file = `content/writing/${item.slug}.md`;
  if (!fs.existsSync(path.join(root,file))) { errors.push(`${file}: source file missing`); continue; }
  const source = read(file);
  if (/!\[[^\]]*\]\([^)]*\)/.test(source)) errors.push(`${file}: unreviewed inline images are not permitted`);
  if (/<\s*\/?\s*(?:script|iframe|img|object|embed|style|video|audio|form)\b/i.test(source)) errors.push(`${file}: embedded HTML/media is not supported`);
  const wordCount = source.replace(/```[\s\S]*?```/g, ' ').trim().split(/\s+/).length;
  if (wordCount < 350) errors.push(`${file}: article incomplete (${wordCount} words; minimum 350)`);
  try {
    const {blocks,headings} = parseArticle(source);
    headingsBySlug.set(item.slug,headings);
    if (headings.filter(h => h.level === 2).length < 3) errors.push(`${file}: meaningful section headings required`);
    if (!blocks.some(b => b.type === 'code')) errors.push(`${file}: include at least one clearly labeled code example`);
    for (const href of source.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) if (!safeArticleHref(href[1])) errors.push(`${file}: unsafe or unsupported link ${href[1]}`);
  } catch (error) { errors.push(`${file}: ${error.message}`); }
}
const approved = getApprovedArticles(articles);
const live = isWritingEnabled(articles);
if (live && approved.length < 2) errors.push('Writing cannot be public with fewer than two complete, approved articles');
for (const file of ['app/writing/page.tsx','app/writing/[slug]/page.tsx','app/writing/opengraph-image.tsx','app/writing/[slug]/opengraph-image.tsx','components/writing-body.tsx','components/writing-code.tsx']) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`Missing required route/component: ${file}`);
}
if (errors.length) { console.error(`Writing validation failed (${errors.length}):\n- ${errors.join('\n- ')}`); process.exit(1); }
console.log(`Writing checks passed: ${articles.length} substantial source articles, ${approved.length} approved; publication ${live ? 'ENABLED' : 'HIDDEN (owner approval required)'}; ${headingsBySlug.size} parsed.`);
