import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { getApprovedArticles, isWritingEnabled, isPublishable, validateWritingManifest, estimateReadingMinutes, parseArticle, safeArticleHref } from '../lib/writing-core.mjs';
const read = rel => fs.readFileSync(new URL(`../${rel}`, import.meta.url), 'utf8');
const manifest = JSON.parse(read('content/writing/articles.json'));
const projectSlugs = JSON.parse(read('content/projects.json')).filter(p=>p.publicationStatus==='published').map(p=>p.slug);
const approved = (p, date='2026-11-14') => ({...p, ownerApproval:'owner_approved', publicationStatus:'published', publishedAt:date, updatedAt:null });
const copies = () => manifest.map(p=>({...p}));

test('P06-A01: two complete articles exist as owner-pending drafts without fake publication dates', () => {
  assert.equal(manifest.length,2);
  assert.deepEqual(validateWritingManifest(manifest, projectSlugs),[]);
  for(const post of manifest) {
    assert.equal(post.ownerApproval,'owner_pending'); assert.equal(post.publicationStatus,'draft');
    assert.equal(post.publishedAt,null);
    const body=read(`content/writing/${post.slug}.md`);
    const parsed=parseArticle(body);
    assert.ok(body.split(/\s+/).length>=350);
    assert.ok(parsed.blocks.some(b=>b.type==='code'));
    assert.ok(parsed.headings.length>=3);
    assert.ok(estimateReadingMinutes(body)>=3);
  }
});
test('P06-A03: navigation, cards, SEO and routes stay gated until TWO owner-approved articles', () => {
  assert.equal(isWritingEnabled(manifest),false);
  assert.deepEqual(getApprovedArticles(manifest),[]);
  const one=copies();one[0]=approved(one[0]);
  assert.equal(isWritingEnabled(one,'2026-11-15'),false);
  const two=copies().map(p=>approved(p));
  assert.equal(isWritingEnabled(two,'2026-11-15'),true);
  assert.equal(getApprovedArticles(two,'2026-11-15').length,2);
  two[0].ownerApproval='owner_pending';
  assert.equal(isWritingEnabled(two,'2026-11-15'),false);
});
test('P06: future or malformed dates and incomplete publication combinations fail closed', () => {
  const a=approved(manifest[0], '2099-03-03');
  assert.equal(isPublishable(a,'2026-11-15'),false);
  assert.ok(validateWritingManifest([a],projectSlugs).length);
  for(const date of ['2026-02-30','2026-13-01','not-a-date']) assert.equal(isPublishable({...a,publishedAt:date},'2026-11-15'),false);
  const b=approved(manifest[0]);b.updatedAt='2026-11-01';
  assert.equal(isPublishable(b,'2026-11-15'),false);
});
test('P06: publishing rules reject duplicate slugs and unknown case links', () => {
  const list=copies();list[1].slug=list[0].slug;
  assert.ok(validateWritingManifest(list,projectSlugs).some(x=>x.includes('unique safe slug')));
  list[1].slug='other-unique-slug';list[1].relatedProjects=['never-public'];
  assert.ok(validateWritingManifest(list,projectSlugs).some(x=>x.includes('relatedProjects')));
});
test('P06: Markdown parsing supports headings, code, lists, quotes and repeatable anchors', () => {
  const {blocks,headings}=parseArticle('## Hello!\n\nWorld.\n\n## Hello!\n\n- one\n- two\n\n> Meaning\n\n```ts\nconst a = 1;\n```');
  assert.deepEqual(headings.map(h=>h.id),['hello','hello-2']);
  assert.ok(blocks.some(x=>x.type==='code' && x.text==='const a = 1;'));
  assert.ok(blocks.some(x=>x.type==='list' && x.items.length===2));
  assert.ok(blocks.some(x=>x.type==='quote'));
  assert.throws(()=>parseArticle('```not-real\ncode\n```'),/Unsupported code language/);
  assert.throws(()=>parseArticle('```ts\ncode'),/Unclosed code fence/);
});
test('P06: only safe HTTPS or site links, never executable or protocol-relative links', () => {
  for(const url of ['javascript:alert(1)','data:text/html,a','//malicious.example','http://example.com','/admin','https://user:pass@example.com']) assert.equal(safeArticleHref(url),null,url);
  for(const url of ['https://github.com/Alisina137/portfolio','/projects/maktablink','/contact','/writing/safe-article#section']) assert.equal(safeArticleHref(url),url);
});
test('P06: header/footer, sitemap, metadata and 404 use the same publication guard', () => {
  const layout=read('app/layout.tsx');const head=read('components/site-header.tsx');const foot=read('components/site-footer.tsx');
  const sitemap=read('app/sitemap.ts');const index=read('app/writing/page.tsx');const detail=read('app/writing/[slug]/page.tsx');
  assert.match(layout,/writingIsLive\(\)/);
  assert.match(head,/showWriting/);assert.match(foot,/showWriting/);
  assert.match(sitemap,/writingIsLive\(\)/);
  assert.match(index,/if \(!writingIsLive\(\)\) notFound\(\)/);
  assert.match(detail,/getPublicWriting\(\)/);assert.match(detail,/if \(!content\) notFound\(\)/);
  assert.match(detail,/generateStaticParams\(\)/);
  assert.match(index,/createPageMetadata/);assert.match(detail,/createPageMetadata/);
});
test('P06: syntax highlighting, code copy, and mobile/keyboard readers are implemented', () => {
  const body=read('components/writing-body.tsx');const copy=read('components/writing-code.tsx');const css=read('styles/globals.css');
  assert.match(body,/safeArticleHref/);assert.doesNotMatch(body,/dangerouslySetInnerHTML/);
  assert.match(copy,/aria-live="polite"/);assert.match(copy,/navigator\.clipboard/);
  assert.match(copy,/tabIndex=\{0\}/);assert.match(css,/\.writing-story-grid/);
  assert.match(css,/@media\(max-width:767px\)/);
});
