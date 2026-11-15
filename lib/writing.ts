import { readFileSync } from 'node:fs';
import path from 'node:path';
import manifest from '@/content/writing/articles.json';
import type { WritingArticle } from '@/lib/writing-core.mjs';
import { getApprovedArticles, isWritingEnabled, estimateReadingMinutes, parseArticle } from '@/lib/writing-core.mjs';

const records = manifest as WritingArticle[];

/** Hide ALL writing until at least two full articles have explicit owner approval. */
export function writingIsLive() { return isWritingEnabled(records); }
export function getPublicWriting(): WritingArticle[] {
  return writingIsLive() ? getApprovedArticles(records) : [];
}
export function getPublicArticle(slug: string) {
  return getPublicWriting().find(post => post.slug === slug);
}
/** Only literal metadata slugs may be read; no user-supplied path segments used in fs calls. */
function loadMarkdown(article: WritingArticle) {
  return readFileSync(path.join(process.cwd(), 'content', 'writing', `${article.slug}.md`), 'utf8');
}
export function getArticleContent(slug: string) {
  const article = getPublicArticle(slug);
  if (!article) return null;
  const body = loadMarkdown(article);
  return { article, readingMinutes: estimateReadingMinutes(body), ...parseArticle(body) };
}
export function getArticleReadingMinutes(article: WritingArticle) {
  return estimateReadingMinutes(loadMarkdown(article));
}
export function getRelatedWriting(current: WritingArticle, max = 2): WritingArticle[] {
  return getPublicWriting().filter(post => post.slug !== current.slug)
    .sort((a, b) => Number(b.category === current.category) - Number(a.category === current.category) || b.publishedAt!.localeCompare(a.publishedAt!))
    .slice(0, max);
}
