import type { WritingArticle } from "./writing-core.mjs";
export type WritingQuery = { q:string;category:string;tag:string;sort:"newest"|"oldest"|"title";page:number };
export declare const WRITING_PAGE_SIZE: number;
export declare function writingCatalogOptions(articles:WritingArticle[]):{categories:string[];tags:string[]};
export declare function normalizeWritingQuery(raw:Record<string,unknown>,articles:WritingArticle[]):WritingQuery;
export declare function writingCatalogHref(partial?:Partial<WritingQuery>):string;
export declare function listWritingCatalog(articles:WritingArticle[],raw?:Record<string,unknown>):{
  query:WritingQuery;options:{categories:string[];tags:string[]};visible:WritingArticle[];
  total:number;totalPages:number;page:number;hasNext:boolean;hasPrevious:boolean;
};
