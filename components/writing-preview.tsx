import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { getPublicWriting, getArticleReadingMinutes } from "@/lib/writing";

/** The homepage never shows an article until the two-approved-post publication gate opens. */
export function WritingPreview(){
  const articles=getPublicWriting();
  if(articles.length<2)return null;
  return <section className="writing-home section-pad" id="writing" aria-labelledby="writing-home-title"><div className="container">
    <div className="writing-home-heading"><span className="section-eyebrow"><span>10</span><span className="section-eyebrow-line"/> ENGINEERING NOTES</span>
      <div><h2 id="writing-home-title">Ideas tested in practice.</h2><p>Technical articles grounded in product architecture, practical constraints and lessons worth documenting.</p></div>
    </div>
    <div className="writing-home-grid">{articles.slice(0,2).map((article,index)=><article className="writing-home-card" key={article.slug}>
      <div className="writing-home-card-top"><span>0{index+1} / {article.category}</span><span>~{getArticleReadingMinutes(article)} min read</span></div>
      <h3><Link href={`/writing/${article.slug}`}>{article.title}</Link></h3><p>{article.excerpt}</p>
      <div className="writing-home-card-foot"><time dateTime={article.publishedAt!}>{article.publishedAt}</time><Link href={`/writing/${article.slug}`}>Read article <ArrowRightIcon width="17" height="17"/></Link></div>
    </article>)}</div>
    <div className="writing-home-bottom"><Link className="button button-outline" href="/writing">Explore writing <ArrowRightIcon width="17" height="17"/></Link></div>
  </div></section>;
}
