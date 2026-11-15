import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo';
import { getArticleReadingMinutes, getPublicWriting, writingIsLive } from '@/lib/writing';
import { ArrowRightIcon } from '@/components/icons';

type Props = { searchParams: Promise<{ category?: string | string[] }> };
export function generateMetadata(): Metadata {
  if (!writingIsLive()) return { title: 'Page not found | Alisina Sarwari', robots: { index: false, follow: false } };
  return createPageMetadata({ title: 'Writing — Engineering notes | Alisina Sarwari', description: 'Technical articles on building software products, careful architecture, and practical engineering trade-offs.', pathname: '/writing' });
}
export default async function WritingPage({ searchParams }: Props) {
  if (!writingIsLive()) notFound();
  const articles = getPublicWriting();
  const query = await searchParams;
  const request = typeof query.category === 'string' ? query.category : '';
  const categories = Array.from(new Set(articles.map(a => a.category))).sort();
  const selected = categories.find(c => c.toLocaleLowerCase('en') === request.toLocaleLowerCase('en')) ?? '';
  const visible = selected ? articles.filter(a => a.category === selected) : articles;
  return <main id="main" tabIndex={-1}>
    <section className="writing-landing section-pad" aria-labelledby="writing-title"><div className="container">
      <div className="page-eyebrow"><span>04 /</span> ENGINEERING NOTES</div>
      <div className="writing-intro"><div><h1 id="writing-title">Ideas worth<br/><em>writing down.</em></h1><p>Notes on building useful web and mobile software: product boundaries, implementation choices and the lessons behind them.</p></div><span className="writing-intro-badge">{articles.length} published {articles.length === 1 ? 'article' : 'articles'}</span></div>
      <nav className="writing-filter" aria-label="Writing categories"><Link className={!selected ? 'writing-filter--active' : ''} href="/writing" aria-current={!selected ? 'page' : undefined}>All topics</Link>{categories.map(c => <Link href={`/writing?category=${encodeURIComponent(c)}`} key={c} className={selected === c ? 'writing-filter--active' : ''} aria-current={selected === c ? 'page' : undefined}>{c}</Link>)}</nav>
      <p className="writing-count" role="status">Showing {visible.length} of {articles.length} articles{selected && ` in ${selected}`}</p>
      <div className="writing-list">{visible.map((post, index) => <article className="writing-list-item" key={post.slug}>
        <div className="writing-list-index">{String(index + 1).padStart(2, '0')}</div>
        <div><div className="writing-article-meta"><span>{post.category}</span><span aria-hidden="true">/</span><time dateTime={post.publishedAt!}>{new Date(`${post.publishedAt}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}</time><span aria-hidden="true">/</span><span>~{getArticleReadingMinutes(post)} min read</span></div>
        <h2><Link href={`/writing/${post.slug}`}>{post.title}<span aria-hidden="true">↗</span></Link></h2><p>{post.excerpt}</p><div className="writing-tags">{post.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
      </article>)}</div>
      {visible.length === 0 && <div className="writing-empty"><h2>No posts in this category</h2><p>Try another topic or return to all writing.</p><Link href="/writing">All articles <ArrowRightIcon /></Link></div>}
      <div className="writing-bottom-cta"><p>Prefer looking at the work itself?</p><Link href="/projects" className="button button-outline">Explore projects <ArrowRightIcon /></Link></div>
    </div></section>
  </main>;
}
