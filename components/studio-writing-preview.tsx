"use client";
import { useMemo } from "react";
import { parseArticle, estimateReadingMinutes } from "@/lib/writing-core.mjs";
import { WritingBody } from "@/components/writing-body";

/** Preview lives strictly in the authenticated Studio; no draft public routes. */
export function StudioWritingPreview({title,excerpt,body}:{title:string;excerpt:string;body:string}){
  const parsed=useMemo(()=>{
    if(!body.trim())return {error:"The editor is empty. Enter or load the article to preview.",blocks:[]};
    try{return {error:"",blocks:parseArticle(body).blocks};}
    catch(e){return {error:e instanceof Error?e.message:"Could not parse this Markdown.",blocks:[]};}
  },[body]);
  return <details className="studio-writing-preview">
    <summary>Preview draft privately (not published)</summary>
    <div className="studio-writing-preview-inner">
      <p className="studio-writing-preview-warning">Owner-only preview. This view does not approve, publish or share the article.</p>
      <header className="writing-story-head"><span className="page-eyebrow">EDITORIAL PREVIEW / NOT PUBLIC</span>
        <h2>{title||"Untitled article"}</h2><p className="writing-story-deck">{excerpt||"Write an excerpt to describe the article."}</p>
        <span className="writing-byline">Estimated reading time: ~{estimateReadingMinutes(body)} min</span>
      </header>
      {parsed.error?<p className="studio-alert" role="alert">{parsed.error}</p>:<WritingBody blocks={parsed.blocks}/>}
    </div>
  </details>;
}
