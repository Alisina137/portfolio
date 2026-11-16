import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleContent, getPublicWriting, getRelatedWriting } from "@/lib/writing";
import { getPublicProject } from "@/lib/content";
import { WritingBody } from "@/components/writing-body";
import { WritingReaderTools, WritingShare } from "@/components/writing-reader-tools";
import { writingCatalogHref } from "@/lib/writing-catalog.mjs";
import { createPageMetadata, canIndexPortfolio } from "@/lib/seo";
import { getPageUrl } from "@/lib/site-url.mjs";
import { ArrowRightIcon } from "@/components/icons";

type Props={params:Promise<{slug:string}>};
export const dynamicParams=false;
export function generateStaticParams(){return getPublicWriting().map(post=>({slug:post.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params,post=getPublicWriting().find(item=>item.slug===slug);
  if(!post)return {title:"Page not found | Alisina Sarwari",robots:{index:false,follow:false}};
  return createPageMetadata({title:`${post.title} | Alisina Sarwari`,description:post.excerpt,pathname:`/writing/${post.slug}`});
}
export default async function WritingArticlePage({params}:Props){
  const {slug}=await params,content=getArticleContent(slug);
  if(!content)notFound();
  const {article,headings,blocks,readingMinutes}=content;
  const related=getRelatedWriting(article);
  const projects=article.relatedProjects.map(getPublicProject).filter(p=>p!==undefined);
  const pageUrl=getPageUrl(`/writing/${article.slug}`);
  const structuredData=canIndexPortfolio()&&pageUrl?{
    "@context":"https://schema.org","@type":"BlogPosting",
    headline:article.title,description:article.excerpt,datePublished:article.publishedAt,
    ...(article.updatedAt?{dateModified:article.updatedAt}:{}),
    author:{"@type":"Person",name:"Alisina Sarwari"},mainEntityOfPage:pageUrl,
  }:null;
  return <main id="main" tabIndex={-1}>
    {structuredData&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,"\\u003c")}}/>}
    <article className="writing-story section-pad">
      <WritingReaderTools headings={headings.filter(h=>h.level===2)} />
      <div className="container">
        <nav className="case-breadcrumb" aria-label="Breadcrumb"><Link href="/writing">Writing</Link>
          <span aria-hidden="true">/</span><span aria-current="page">{article.title}</span></nav>
        <header className="writing-story-head"><div className="page-eyebrow"><span>ENGINEERING NOTE /</span> {article.category}</div>
          <h1>{article.title}<span>.</span></h1><p className="writing-story-deck">{article.excerpt}</p>
          <div className="writing-byline"><span>Alisina Sarwari</span><span aria-hidden="true">·</span>
            <time dateTime={article.publishedAt!}>{new Date(`${article.publishedAt}T12:00:00Z`).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric",timeZone:"UTC"})}</time>
            <span aria-hidden="true">·</span><span>~{readingMinutes} min read</span>
            {article.updatedAt&&<span>· Updated <time dateTime={article.updatedAt}>{article.updatedAt}</time></span>}
          </div>
          <div className="writing-tags">{article.tags.map(tag=><Link key={tag} href={writingCatalogHref({tag})}>{tag} ↗</Link>)}</div>
        </header>
        <div className="writing-story-grid">
          <aside className="writing-toc" aria-label="On this page"><div>IN THIS ARTICLE</div>
            <WritingReaderTools headings={headings.filter(h=>h.level===2)} />
            <Link href="/writing">← All writing</Link>
          </aside>
          <div id="writing-reading-content"><WritingBody blocks={blocks}/></div>
        </div>
        <section className="writing-end" aria-label="More to explore"><p>These engineering notes describe approaches and experiments, not verified production outcomes.</p>
          {projects.length>0&&<div className="writing-end-projects"><h2>Related projects</h2><div>{projects.map(p=><Link key={p.slug} href={`/projects/${p.slug}`}>{p.title}<span aria-hidden="true">↗</span></Link>)}</div></div>}
          {related.length>0&&<div className="writing-end-related"><h2>Keep reading</h2>{related.map(post=><Link key={post.slug} href={`/writing/${post.slug}`}><span>{post.category}</span><strong>{post.title} ↗</strong></Link>)}</div>}
          <div className="writing-end-actions"><Link className="button button-outline" href="/writing">All articles <ArrowRightIcon width="17" height="17"/></Link>
            <Link className="button button-primary" href="/contact">Get in touch <ArrowRightIcon width="17" height="17"/></Link></div>
          <WritingShare title={article.title}/>
        </section>
      </div>
    </article>
  </main>;
}
