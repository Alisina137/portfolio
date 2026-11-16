"use client";
import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons";
import { localizePath } from "@/lib/i18n-core.mjs";
import type { RepoCard, RepoLocale } from "@/lib/repositories";

export type RepoWords = {
  repoSearch:string;repoSearchPlaceholder:string;repoAll:string;repoApps:string;
  repoSite:string;repoSortLabel:string;repoSortFeatured:string;repoSortName:string;
  repoCount:string;repoEmpty:string;repoClear:string;repoOpen:string;repoCase:string;
  repoSourceChecked:string;repoLanguage:string;repoBranch:string;repoNoMetrics:string;
};
type Props={repos:RepoCard[];locale:RepoLocale;words:RepoWords};
function RepoTile({repo,locale,words}:{repo:RepoCard;locale:RepoLocale;words:RepoWords}){
  return <article className={"repo-card repo-card--"+repo.kind}>
    <div className="repo-card-upper">
      <span className="repo-card-glyph" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.5 10.5 16 4l10.5 6.5V25L16 29 5.5 25V10.5Z"/><path d="M5.5 10.5 16 16l10.5-5.5M16 16v13"/><path d="M16 16v-5.5"/></svg></span>
      <span className="repo-card-status">{repo.status}</span>
    </div>
    <span className="repo-card-category">{repo.category}</span>
    <h3>{repo.title}</h3>
    <div className="repo-card-path" dir="ltr">{repo.repoFullName}</div>
    <p className="repo-card-desc">{repo.description}</p>
    <div className="repo-card-tech">{repo.technologies.map(t=><span key={t} dir="ltr">{t}</span>)}</div>
    <dl className="repo-card-meta">
      <div><dt>{words.repoBranch}</dt><dd dir="ltr">{repo.branch}</dd></div>
      <div><dt>{words.repoLanguage}</dt><dd dir="ltr">{repo.language}</dd></div>
      <div><dt>{words.repoSourceChecked}</dt><dd><time dateTime={repo.checkedOn} dir="ltr">{repo.checkedOn}</time></dd></div>
    </dl>
    <div className="repo-card-actions">
      <a className="repo-card-primary" href={repo.repoHref} target="_blank" rel="noopener noreferrer">{words.repoOpen}<ArrowUpRightIcon width="16" height="16"/><span className="sr-only">(GitHub; {locale==="en"?"opens in new tab":"↗"})</span></a>
      {repo.projectSlug&&<Link href={localizePath(locale,"/projects/"+repo.projectSlug)}>{words.repoCase}<ArrowUpRightIcon width="16" height="16" /></Link>}
    </div>
  </article>;
}
export function RepositoryGrid({repos,locale,words}:{repos:RepoCard[];locale:RepoLocale;words:RepoWords}) {
  return <div className="repo-grid">{repos.map(repo=><RepoTile key={repo.slug} repo={repo} locale={locale} words={words}/>)}</div>;
}
export function RepositoryExplorer({repos,locale,words}:Props){
  const id=useId();
  const [query,setQuery]=useState("");
  const [kind,setKind]=useState<"all"|"project"|"portfolio">("all");
  const [sort,setSort]=useState<"featured"|"name">("featured");
  const shown=useMemo(()=>{
    const term=query.trim().toLocaleLowerCase();
    return repos.filter(r=>(kind==="all" || r.kind===kind) && (!term ||
      [r.title,r.repoFullName,r.description,r.category,r.language,r.branch,...r.technologies].some(s=>s.toLocaleLowerCase().includes(term))))
      .sort((a,b)=>sort==="name"?a.title.localeCompare(b.title):
        (Number(b.featured)-Number(a.featured)) || a.title.localeCompare(b.title));
  },[repos,query,kind,sort]);
  return <div className="repo-explorer">
    <div className="repo-toolbar">
      <div className="repo-search"><label htmlFor={id}>{words.repoSearch}</label><input id={id} type="search" autoComplete="off" placeholder={words.repoSearchPlaceholder} value={query} onChange={e=>setQuery(e.target.value)}/></div>
      <fieldset className="repo-kind"><legend>{words.repoSearch}</legend>{([{key:"all",label:words.repoAll},{key:"project",label:words.repoApps},{key:"portfolio",label:words.repoSite}] as const).map(o=><button type="button" key={o.key} onClick={()=>setKind(o.key)} aria-pressed={kind===o.key} className={"repo-filter"+(kind===o.key?" repo-filter--selected":"")}>{o.label}</button>)}</fieldset>
      <div className="repo-sort"><label htmlFor={id+"-sort"}>{words.repoSortLabel}</label><select id={id+"-sort"} value={sort} onChange={e=>setSort(e.target.value as "featured"|"name")}><option value="featured">{words.repoSortFeatured}</option><option value="name">{words.repoSortName}</option></select></div>
    </div>
    <p className="repo-result-count" aria-live="polite" role="status">{words.repoCount.replace("{count}",String(shown.length)).replace("{total}",String(repos.length))}</p>
    {shown.length?<RepositoryGrid repos={shown} locale={locale} words={words}/>:
      <div className="repo-empty" role="status"><p>{words.repoEmpty}</p><button type="button" onClick={()=>{setQuery("");setKind("all");setSort("featured")}}>{words.repoClear}</button></div>}
    <p className="repo-disclaimer">{words.repoNoMetrics}</p>
  </div>;
}
