import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";
import { getArticleReadingMinutes, getPublicWriting, writingIsLive } from "@/lib/writing";
import { listWritingCatalog, writingCatalogHref, type WritingQuery } from "@/lib/writing-catalog.mjs";
import { ArrowRightIcon } from "@/components/icons";

type Search = Record<"q" | "category" | "tag" | "sort" | "page", string | string[] | undefined>;
type Props = { searchParams: Promise<Search> };
const first=(value: string | string[] | undefined)=>typeof value==="string"?value:"";

export function generateMetadata(): Metadata {
  if(!writingIsLive())return {title:"Page not found | Alisina Sarwari",robots:{index:false,follow:false}};
  return createPageMetadata({
    title:"Writing — Engineering Notes | Alisina Sarwari",
    description:"Explore source-reviewed software engineering articles, technical examples and practical product design lessons.",
    pathname:"/writing",
  });
}
export default async function WritingPage({searchParams}:Props){
  if(!writingIsLive())notFound();
  const articles=getPublicWriting();
  const search=await searchParams;
  const listing=listWritingCatalog(articles,Object.fromEntries(Object.entries(search).map(([key,value])=>[key,first(value)])));
  const {query,options,visible,total,page,totalPages}=listing;
  const selectedFilters=Boolean(query.q||query.category||query.tag||query.sort!=="newest");
  const filterHref=(category:string)=>writingCatalogHref({...query,category,page:1});
  return <main id="main" tabIndex={-1}>
    <section className="writing-landing section-pad" aria-labelledby="writing-title"><div className="container">
      <div className="page-eyebrow"><span>04 /</span> ENGINEERING NOTES</div>
      <div className="writing-intro">
        <div><h1 id="writing-title">Ideas worth<br/><em>writing down.</em></h1>
          <p>Technical notes on building thoughtful interfaces, designing dependable systems and making practical engineering trade-offs.</p></div>
        <span className="writing-intro-badge">{articles.length} published {articles.length===1?"article":"articles"}</span>
      </div>
      <form action="/writing" method="GET" role="search" className="writing-catalog-toolbar" aria-label="Search and filter published articles">
        <label className="writing-control"><span>Search articles</span><input name="q" type="search" maxLength={100} defaultValue={query.q} placeholder="Search titles, technologies or topics" autoComplete="off"/></label>
        <label className="writing-control"><span>Category</span><select name="category" defaultValue={query.category}><option value="">All categories</option>
          {options.categories.map(category=><option key={category} value={category}>{category}</option>)}</select></label>
        <label className="writing-control"><span>Topic tag</span><select name="tag" defaultValue={query.tag}><option value="">All tags</option>
          {options.tags.map(tag=><option key={tag} value={tag}>{tag}</option>)}</select></label>
        <label className="writing-control"><span>Sort by</span><select name="sort" defaultValue={query.sort}>
          <option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="title">Title A–Z</option>
        </select></label>
        <button type="submit" className="button button-primary">Apply filters ↗</button>
      </form>
      <nav className="writing-filter" aria-label="Quick article categories">
        <Link href={filterHref("")} className={!query.category?"writing-filter--active":""} aria-current={!query.category?"page":undefined}>All topics</Link>
        {options.categories.map(category=><Link key={category} href={filterHref(category)} className={query.category===category?"writing-filter--active":""} aria-current={query.category===category?"page":undefined}>{category}</Link>)}
      </nav>
      <div className="writing-filter-count"><p className="writing-count" role="status">
        {total ? `Showing ${(page-1)*6+1}–${(page-1)*6+visible.length} of ${total} matching articles` : "No matching articles"}
      </p>{selectedFilters && <Link className="writing-reset" href="/writing">Clear all filters ↗</Link>}</div>
      {visible.length ? <div className="writing-list">{visible.map((post,index)=>{
        const number=(page-1)*6+index+1;
        return <article className={index===0&&page===1&&!selectedFilters?"writing-list-item writing-list-item--featured":"writing-list-item"} key={post.slug}>
          <span className="writing-list-index">{String(number).padStart(2,"0")}</span>
          <div><div className="writing-article-meta"><span>{post.category}</span><span aria-hidden="true">/</span>
            <time dateTime={post.publishedAt!}>{new Date(`${post.publishedAt}T12:00:00Z`).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric",timeZone:"UTC"})}</time>
            <span aria-hidden="true">/</span><span>~{getArticleReadingMinutes(post)} min read</span></div>
            <h2><Link href={`/writing/${post.slug}`}>{post.title}<span aria-hidden="true">↗</span></Link></h2>
            <p>{post.excerpt}</p><div className="writing-tags">{post.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
            <div className="writing-card-bottom"><span className="sr-only">Published article</span>
              <Link href={`/writing/${post.slug}`}>Read article <ArrowRightIcon width="17" height="17"/></Link></div>
          </div>
        </article>;
      })}</div>:
      <div className="writing-empty"><h2>No articles match these filters.</h2><p>Try a different search or reset your selections to browse every approved post.</p>
        <Link href="/writing">See all articles <ArrowRightIcon width="17" height="17"/></Link></div>}
      {totalPages>1&&<nav className="writing-pages" aria-label="Article pages">
        {page>1&&<Link href={writingCatalogHref({...query,page:page-1})}>← Previous</Link>}
        {Array.from({length:totalPages},(_,i)=>i+1).map(p=>p===page?
          <span key={p} aria-current="page" aria-label={`Page ${p}, current`}>{p}</span>:
          <Link key={p} href={writingCatalogHref({...query,page:p})} aria-label={`Page ${p}`}>{p}</Link>)}
        {page<totalPages&&<Link href={writingCatalogHref({...query,page:page+1})}>Next →</Link>}
      </nav>}
      <div className="writing-bottom-cta"><p>Prefer looking at the work behind the notes?</p>
        <Link className="button button-outline" href="/projects">Explore documented projects <ArrowRightIcon width="17" height="17"/></Link></div>
    </div></section>
  </main>;
}
