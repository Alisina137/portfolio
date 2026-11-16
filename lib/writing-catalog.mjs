/** Phase 18: shareable, accessible writing directory query rules; no drafts enter these functions. */
const fold = value => String(value || "").normalize("NFKC").toLocaleLowerCase("en").replace(/\s+/gu," ").trim();
const str = value => typeof value === "string" ? value : "";
const MAX_QUERY = 100;
export const WRITING_PAGE_SIZE = 6;
export function writingCatalogOptions(articles){
  return {
    categories:[...new Set(articles.map(article=>article.category))].sort((a,b)=>a.localeCompare(b)),
    tags:[...new Set(articles.flatMap(article=>article.tags))].sort((a,b)=>a.localeCompare(b))
  };
}
export function normalizeWritingQuery(raw={},articles=[]){
  const options = writingCatalogOptions(articles);
  const q = str(raw.q).normalize("NFKC").replace(/\s+/gu," ").trim().slice(0,MAX_QUERY);
  const category = options.categories.find(value=>fold(value)===fold(raw.category)) || "";
  const tag = options.tags.find(value=>fold(value)===fold(raw.tag)) || "";
  const sort = ["newest","oldest","title"].includes(raw.sort) ? raw.sort : "newest";
  const p = str(raw.page);
  const page = /^\d{1,3}$/.test(p) && Number(p)>0 ? Number(p) : 1;
  return {q,category,tag,sort,page};
}
export function writingCatalogHref(partial={}){
  const params=new URLSearchParams();
  if(partial.q)params.set("q",str(partial.q).slice(0,MAX_QUERY));
  if(partial.category)params.set("category",str(partial.category));
  if(partial.tag)params.set("tag",str(partial.tag));
  if(partial.sort && partial.sort!=="newest")params.set("sort",str(partial.sort));
  if(partial.page && partial.page>1)params.set("page",String(Math.max(1,Math.min(999,Math.trunc(partial.page)))));
  return "/writing"+(params.toString()?"?"+params.toString():"");
}
/** Caller must supply approved public records, not the raw writing manifest. */
export function listWritingCatalog(articles,raw={}){
  const query=normalizeWritingQuery(raw,articles),options=writingCatalogOptions(articles);
  const needle=fold(query.q);
  const matches=articles.filter(article=>
    (!query.category || query.category===article.category) &&
    (!query.tag || article.tags.includes(query.tag)) &&
    (!needle || fold([article.title,article.excerpt,article.category,...article.tags].join(" ")).includes(needle))
  ).slice().sort((a,b)=>{
    if(query.sort==="title")return a.title.localeCompare(b.title);
    const date=a.publishedAt.localeCompare(b.publishedAt);
    return (query.sort==="oldest"?date:-date) || a.title.localeCompare(b.title);
  });
  const totalPages=Math.max(1,Math.ceil(matches.length/WRITING_PAGE_SIZE));
  const page=Math.min(query.page,totalPages);
  return {query:{...query,page},options,visible:matches.slice((page-1)*WRITING_PAGE_SIZE,page*WRITING_PAGE_SIZE),
    total:matches.length,totalPages,page,hasNext:page<totalPages,hasPrevious:page>1};
}
