import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleContent, getPublicWriting, getRelatedWriting } from '@/lib/writing';
import { getPublicProject } from '@/lib/content';
import { WritingBody } from '@/components/writing-body';
import { createPageMetadata } from '@/lib/seo';
import { ArrowRightIcon } from '@/components/icons';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return getPublicWriting().map(post => ({ slug: post.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPublicWriting().find(item => item.slug === slug);
  if (!post) return { title: 'Page not found | Alisina Sarwari', robots: { index: false, follow: false } };
  return createPageMetadata({ title: `${post.title} | Alisina Sarwari`, description: post.excerpt, pathname: `/writing/${post.slug}` });
}
export default async function WritingArticlePage({ params }: Props) {
  const { slug } = await params;
  const content = getArticleContent(slug);
  if (!content) notFound();
  const { article, headings, blocks, readingMinutes } = content;
  const related = getRelatedWriting(article);
  const projects = article.relatedProjects.map(getPublicProject).filter(p => p !== undefined);
  return <main id="main" tabIndex={-1}>
    <article className="writing-story section-pad"><div className="container">
      <nav className="case-breadcrumb" aria-label="Breadcrumb"><Link href="/writing">Writing</Link><span aria-hidden="true">/</span><span aria-current="page">{article.title}</span></nav>
      <header className="writing-story-head"><div className="page-eyebrow"><span>TECHNICAL NOTE /</span> {article.category}</div><h1>{article.title}<span>.</span></h1><p className="writing-story-deck">{article.excerpt}</p><div className="writing-byline"><span>Alisina Sarwari</span><span aria-hidden="true">·</span><time dateTime={article.publishedAt!}>{new Date(`${article.publishedAt}T12:00:00Z`).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric', timeZone:'UTC' })}</time><span aria-hidden="true">·</span><span>~{readingMinutes} min read</span>{article.updatedAt && <span>· Updated <time dateTime={article.updatedAt}>{article.updatedAt}</time></span>}</div></header>
      <div className="writing-story-grid"><aside className="writing-toc" aria-label="On this page"><div>IN THIS ARTICLE</div><nav aria-label="Article sections">{headings.filter(h => h.level === 2).map(h => <a href={`#${h.id}`} key={h.id}>{h.text}</a>)}</nav><Link href="/writing">← All writing</Link></aside>
      <WritingBody blocks={blocks}/></div>
      <section className="writing-end" aria-label="More to explore"><p>Thanks for reading. These notes explore design approaches, not production-readiness claims about any particular project.</p>
        {projects.length > 0 && <div className="writing-end-projects"><h2>Related project work</h2><div>{projects.map(p => <Link href={`/projects/${p.slug}`} key={p.slug}>{p.title}<span aria-hidden="true">↗</span></Link>)}</div></div>}
        {related.length > 0 && <div className="writing-end-related"><h2>Keep reading</h2>{related.map(post => <Link key={post.slug} href={`/writing/${post.slug}`}><span>{post.category}</span><strong>{post.title} ↗</strong></Link>)}</div>}
        <div className="writing-end-actions"><Link className="button button-outline" href="/writing">All articles <ArrowRightIcon /></Link><Link className="button button-primary" href="/contact">Get in touch <ArrowRightIcon /></Link></div>
      </section>
    </div></article>
  </main>;
}
