"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons";
import type { NowProject } from "@/lib/now";
import { localizePath } from "@/lib/i18n-core.mjs";

export type ExplorerWords = {
  searchLabel: string; searchPlaceholder: string; all: string; showCount: string;
  cleared: string; noResults: string; clear: string; sourceReviewed: string;
  nextCheck: string; caseStudy: string; noPercentage: string;
};
type Props = { projects: NowProject[]; locale: "en" | "fa" | "ps"; words: ExplorerWords };

export function NowExplorer({ projects, locale, words }: Props) {
  const [search,setSearch] = useState("");
  const [domain,setDomain] = useState("all");
  const inputId = useId();
  const domains = useMemo(() => [...new Set(projects.map(project => project.category))].sort((a,b)=>a.localeCompare(b)),[projects]);
  const filtered = useMemo(() => {
    const query=search.trim().toLocaleLowerCase();
    return projects.filter(project => (domain==="all"||project.category===domain) &&
      (!query || [project.title,project.description,project.category,...project.technologies]
        .some(value => value.toLocaleLowerCase().includes(query))));
  },[projects,domain,search]);

  return <div className="now-explorer">
    <div className="now-explorer-controls">
      <div className="now-search"><label htmlFor={inputId}>{words.searchLabel}</label>
        <input type="search" id={inputId} value={search} placeholder={words.searchPlaceholder} autoComplete="off" onChange={event=>setSearch(event.target.value)}/>
      </div>
      <div className="now-filters" role="group" aria-label={words.searchLabel}>
        {[{id:"all",label:words.all},...domains.map(label=>({id:label,label}))].map(item => <button type="button" key={item.id} className={domain===item.id?"now-filter now-filter--selected":"now-filter"} aria-pressed={domain===item.id} onClick={()=>setDomain(item.id)}>{item.label}</button>)}
      </div>
    </div>
    <div className="now-results-count" role="status" aria-live="polite">{words.showCount.replace("{count}",String(filtered.length)).replace("{total}",String(projects.length))}</div>
    {filtered.length ? <ul className="now-results-grid">{filtered.map(project => <li key={project.slug}><article className="now-work-card">
      <div className="now-work-top"><span className="now-work-category">{project.category}</span><span className="now-work-status">{project.status}</span></div>
      <h3>{project.title}</h3><p>{project.description}</p>
      <div className="now-work-tech">{project.technologies.map(tech=><span key={tech} dir="ltr">{tech}</span>)}</div>
      {project.nextReview && <div className="now-work-check"><strong>{words.nextCheck}</strong><p>{project.nextReview}</p></div>}
      <div className="now-work-end"><span className="now-work-review">{words.sourceReviewed}: <time dateTime={project.sourceReviewedAt} dir="ltr">{project.sourceReviewedAt}</time></span>
        <Link href={localizePath(locale,"/projects/"+project.slug)}>{words.caseStudy}<ArrowUpRightIcon width="17" height="17"/></Link>
      </div>
    </article></li>)}</ul> :
    <div className="now-empty" role="status"><p>{words.noResults}</p><button type="button" onClick={()=>{setSearch("");setDomain("all");}}>{words.clear}</button></div>}
    <p className="now-explorer-disclaimer">{words.noPercentage}</p>
  </div>;
}
