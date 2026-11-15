export type WritingArticle = {
  slug: string; title: string; excerpt: string; category: string; tags: string[]; relatedProjects: string[];
  publicationStatus: 'draft' | 'published' | 'archived'; ownerApproval: 'owner_pending' | 'owner_approved';
  publishedAt: string | null; updatedAt: string | null;
};
export type ArticleBlock =
  | { type: 'heading'; level: number; id: string; text: string }
  | { type: 'code'; language: string; text: string }
  | { type: 'quote' | 'paragraph'; text: string }
  | { type: 'list' | 'ordered'; items: string[] };
export function isRealDate(value: unknown): boolean;
export function isPublishable(article: WritingArticle, today?: string): boolean;
export function getApprovedArticles(records: WritingArticle[], today?: string): WritingArticle[];
export function isWritingEnabled(records: WritingArticle[], today?: string): boolean;
export function validateWritingManifest(records: WritingArticle[], projectSlugs?: string[]): string[];
export function estimateReadingMinutes(body: string): number;
export function safeArticleHref(value: string): string | null;
export function parseArticle(body: string): { blocks: ArticleBlock[]; headings: { level: number; id: string; text: string }[] };
