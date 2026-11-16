import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { getApprovedArticles, isWritingEnabled, parseArticle, estimateReadingMinutes, validateWritingManifest } from "../lib/writing-core.mjs";
import { listWritingCatalog, normalizeWritingQuery, writingCatalogHref, WRITING_PAGE_SIZE } from "../lib/writing-catalog.mjs";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const manifest=JSON.parse(read("content/writing/articles.json"));
const demo=Array.from({length:15},(_,i)=>({
 slug:"article-"+i,title:"Synthetic test article "+i,category:i%2?"Product engineering":"Web architecture",
 excerpt:"This is a synthetic unit test only and contains no public-facing invented portfolio claims.",
 tags:i%3?["Next.js","Systems"]:["PostgreSQL","Systems"],
 relatedProjects:[],publishedAt:`2026-11-${String(i+1).padStart(2,"0")}`,updatedAt:null,
 ownerApproval:"owner_approved",publicationStatus:"published"
}));
test("Phase 18 keeps both originals unapproved, unpublished and absent from public index",()=>{
 assert.equal(manifest.length,2);
 assert.deepEqual(getApprovedArticles(manifest),[]);
 assert.equal(isWritingEnabled(manifest),false);
 for(const article of manifest){
  assert.equal(article.publicationStatus,"draft");
  assert.equal(article.ownerApproval,"owner_pending");
  assert.equal(article.publishedAt,null);
  assert.equal(article.updatedAt,null);
 }
 assert.ok(read("app/writing/page.tsx").includes("if(!writingIsLive())notFound()"));
 assert.ok(read("components/writing-preview.tsx").includes("if(articles.length<2)return null"));
});
test("Writing directory search examines titles, excerpt, category and tags; case- and whitespace-folded",()=>{
 const result=listWritingCatalog(demo,{q:"   NeXt.Js  ",category:"Web architecture"});
 assert.equal(result.query.q,"NeXt.Js");
 assert.equal(result.query.category,"Web architecture");
 assert.ok(result.visible.length>0);
 assert.ok(result.visible.every(article=>article.category==="Web architecture"&&article.tags.includes("Next.js")));
 assert.equal(listWritingCatalog(demo,{q:"absolutely-no-matching-article"}).total,0);
 assert.equal(listWritingCatalog(demo,{q:"postgresql"}).total,5);
});
test("Article catalog tag, sort and pagination preserve shareable query state",()=>{
 const result=listWritingCatalog(demo,{tag:"Systems",sort:"oldest",page:"2"});
 assert.equal(result.page,2);
 assert.equal(result.totalPages,Math.ceil(15/WRITING_PAGE_SIZE));
 assert.equal(result.visible[0].slug,"article-6");
 assert.ok(result.hasNext);
 assert.ok(result.hasPrevious);
 const title=listWritingCatalog(demo,{sort:"title"});
 assert.equal(title.visible[0].slug,"article-0");
 assert.equal(listWritingCatalog(demo,{page:"999"}).page,3);
 const href=writingCatalogHref({q:"React & UI",tag:"Systems",sort:"title",page:3});
 assert.ok(href.startsWith("/writing?"));
 assert.equal(new URL("https://example.com"+href).searchParams.get("q"),"React & UI");
 assert.equal(new URL("https://example.com"+href).searchParams.get("page"),"3");
 assert.equal(writingCatalogHref({}),"/writing");
});
test("Unknown filters, attack-shaped input and invalid page values fail to valid defaults",()=>{
 const huge="X".repeat(600);
 const q=normalizeWritingQuery({q:huge,category:"not real",tag:"<script>",sort:"random",page:"-1"},demo);
 assert.equal(q.q.length,100);
 assert.equal(q.category,"");
 assert.equal(q.tag,"");
 assert.equal(q.sort,"newest");
 assert.equal(q.page,1);
 assert.equal(listWritingCatalog(demo,{page:"1000"}).page,1);
});
test("Existing Markdown safety and code examples remain functional in review previews",()=>{
 for(const entry of manifest){
  const markdown=read(`content/writing/${entry.slug}.md`);
  assert.ok(estimateReadingMinutes(markdown)>=3);
  const {blocks,headings}=parseArticle(markdown);
  assert.ok(headings.length>=3);
  assert.ok(blocks.some(block=>block.type==="code"));
 }
 const client=read("components/studio-writing-preview.tsx");
 assert.ok(client.includes("parseArticle(body)"));
 assert.ok(client.includes("<WritingBody"));
 assert.ok(client.includes("not published"));
 assert.doesNotMatch(client,/dangerouslySetInnerHTML/);
});
test("Full article reads include reading progress, active section navigation and sharing fallbacks",()=>{
 const detail=read("app/writing/[slug]/page.tsx");
 const tools=read("components/writing-reader-tools.tsx");
 for(const token of ["WritingReaderTools","WritingShare","getArticleContent(slug)","getRelatedWriting(article)","getPublicProject","generateStaticParams","canIndexPortfolio()"])assert.ok(detail.includes(token),token);
 for(const token of ["role=\"progressbar\"","aria-valuenow={percent}","requestAnimationFrame","aria-current={active===heading.id?","navigator.share","navigator.clipboard","aria-live=\"polite\""])assert.ok(tools.includes(token),token);
 assert.ok(detail.includes("if(!content)notFound()"));
 assert.ok(read("app/writing/[slug]/opengraph-image.tsx").includes("getPublicWriting()"));
});
test("Home, About, Studio, responsive CSS and publication gate are consistent",()=>{
 const home=read("app/page.tsx"),about=read("app/about/page.tsx"),editor=read("components/studio-editor.tsx");
 assert.ok(home.includes("<WritingPreview />"));
 assert.ok(about.includes("writingIsLive() &&"));
 assert.ok(editor.includes("<StudioWritingPreview"));
 assert.ok(read("app/layout.tsx").includes("styles/phase18.css"));
 const css=read("styles/phase18.css");
 for(const token of ["--type-page","--type-body","--type-section","--type-card","--focus","--border","@media(max-width:1100px)","@media(max-width:767px)","@media(max-width:540px)","@media(prefers-reduced-motion:reduce)",'html[dir="rtl"]',":focus-visible"])assert.ok(css.includes(token),token);
 assert.ok(read("app/sitemap.ts").includes("writingIsLive()"));
 assert.ok(read("components/site-header.tsx").includes("showWriting"));
 assert.ok(read("components/site-footer.tsx").includes("showWriting"));
 assert.deepEqual(JSON.parse(read("content/locales/approval.json")).fa.ownerApproved,false);
 assert.deepEqual(JSON.parse(read("content/locales/approval.json")).ps.ownerApproved,false);
 assert.equal(JSON.parse(read("content/launch-approval.json")).approvedForPublicLaunch,false);
});
test("Existing writing publication and completeness validator still passes",()=>{
 assert.match(execFileSync(process.execPath,["scripts/check-writing.mjs"],{encoding:"utf8"}),/publication HIDDEN/);
 const projects=JSON.parse(read("content/projects.json")).filter(x=>x.publicationStatus==="published").map(x=>x.slug);
 assert.deepEqual(validateWritingManifest(manifest,projects),[]);
});
