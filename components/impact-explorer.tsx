"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons";
import { localizePath } from "@/lib/i18n-core.mjs";
import type { ImpactCategory, ImpactHighlight, ImpactLocale } from "@/lib/impact";

export type ImpactWords={
 impactEvidence:string;impactSource:string;impactCase:string;impactExplore:string;
 impactAll:string;impactEngineering:string;impactProducts:string;impactFilter:string;
 impactCount:string;impactNoMatches:string;impactClear:string;
};
export function ImpactCards({records,locale,words}:{records:ImpactHighlight[];locale:ImpactLocale;words:ImpactWords}){
 return <div className="impact-grid">{records.map((item,i)=><article key={item.id} className={"impact-card impact-card--"+item.category}>
   <div className="impact-card-top"><span className="impact-card-icon" aria-hidden="true">
    <svg width="27" height="27" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {item.category==="engineering"?<><path d="M6 9 15 4l9 5v12l-9 5-9-5V9Z"/><path d="m6 9 9 5 9-5M15 14v12M10 19l5 3 5-3"/></>:<><rect x="3.5" y="6" width="23" height="18" rx="3"/><path d="M3.5 11h23M9 17h8m-8 3h13"/></>}
    </svg>
   </span><span className="impact-card-number" dir="ltr">{String(i+1).padStart(2,"0")} / {String(records.length).padStart(2,"0")}</span></div>
   <span className="impact-card-category">{item.category==="engineering"?words.impactEngineering:words.impactProducts}</span>
   <h3>{item.title}</h3><p className="impact-card-description">{item.summary}</p>
   <details className="impact-card-details"><summary>{words.impactEvidence} <span aria-hidden="true">+</span></summary>
    <div className="impact-evidence-list">{item.examples.map(example=><div className="impact-evidence" key={example.slug}>
      <div><strong>{example.title}</strong><span>{example.technicalLabel}</span></div>
      <div className="impact-evidence-actions"><Link href={localizePath(locale,"/projects/"+example.slug)}>{words.impactCase}<ArrowUpRightIcon width="14" height="14"/></Link><a href={example.repoUrl} target="_blank" rel="noopener noreferrer">{words.impactSource}<ArrowUpRightIcon width="14" height="14"/></a></div>
      <small>{example.sourceEvidence}</small>
    </div>)}</div>
   </details>
 </article>)}</div>;
}
export function ImpactExplorer({records,locale,words}:{records:ImpactHighlight[];locale:ImpactLocale;words:ImpactWords}){
 const [filter,setFilter]=useState<"all"|ImpactCategory>("all");
 const filtered=useMemo(()=>filter==="all"?records:records.filter(x=>x.category===filter),[records,filter]);
 const options=[{value:"all",label:words.impactAll},{value:"engineering",label:words.impactEngineering},{value:"product",label:words.impactProducts}] as const;
 return <div className="impact-explorer">
   <div className="impact-filterbar"><div role="group" aria-label={words.impactFilter} className="impact-filters">{options.map(option=><button type="button" key={option.value} aria-pressed={filter===option.value} className={filter===option.value?"impact-filter impact-filter--active":"impact-filter"} onClick={()=>setFilter(option.value)}>{option.label}</button>)}</div>
     <p role="status" aria-live="polite">{words.impactCount.replace("{count}",String(filtered.length)).replace("{total}",String(records.length))}</p>
   </div>
   {filtered.length?<ImpactCards records={filtered} locale={locale} words={words}/>:<div className="impact-none"><p>{words.impactNoMatches}</p><button type="button" onClick={()=>setFilter("all")}>{words.impactClear}</button></div>}
 </div>;
}
