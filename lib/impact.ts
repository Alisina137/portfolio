import evidence from "@/content/impact.json";
import publicRepositories from "@/content/repositories.json";
import faImpact from "@/content/locales/fa-impact.json";
import psImpact from "@/content/locales/ps-impact.json";
import { approvedMeasuredOutcomes } from "@/lib/impact-core.mjs";
import { getPublishedProjects, getCaseStudy, getPublicProject, type CaseStudy } from "@/lib/content";
import { getTranslatedProject, getTranslatedCase } from "@/lib/i18n";

export type ImpactLocale="en"|"fa"|"ps";
export type ImpactCategory="engineering"|"product";
export type ImpactHighlight={
 id:string;category:ImpactCategory;title:string;summary:string;
 examples:{slug:string;title:string;technicalLabel:string;source:"features"|"technicalNotes";repoUrl:string;sourceEvidence:string}[];
};
export type Measurement={
 id:string;title:string;value:number;unit:string;timeframe:string;methodology:string;sourceUrl:string;projectSlug?:string;
};
export function getEvidenceTotals(){
 const cases=getPublishedProjects().filter(project=>Boolean(getCaseStudy(project.slug)));
 const slugs=new Set(cases.map(p=>p.slug));
 const repositories=publicRepositories.repositories.filter(r=>r.slug!=="portfolio" && slugs.has(r.slug));
 return {
   cases:cases.length,
   repositories:repositories.length,
   domains:new Set(cases.map(p=>p.category)).size
 };
}
export function getImpactHighlights(locale:ImpactLocale="en",variant:"preview"|"full"="full"):ImpactHighlight[]{
 const byProject=new Map(getPublishedProjects().map(project=>[project.slug,project]));
 const localizedCopy=locale==="fa"?faImpact:psImpact;
 return evidence.highlights.slice(0,variant==="preview"?2:undefined).flatMap(row=>{
   const examples=row.evidence.flatMap(ref=>{
     const project=byProject.get(ref.slug),study=getCaseStudy(ref.slug);
     if(!project || !project.repoUrl || !project.repoUrlVerified || !study)return [];
     const key=ref.source as "features"|"technicalNotes";
     const records=study[key] as CaseStudy["features"]|CaseStudy["technicalNotes"];
     const matched=records.find(item=>item.title===ref.note);
     if(!matched)return [];
     const localizedProject=locale==="en"?project:getTranslatedProject(locale,project);
     const localizedStudy=locale==="en"?study:getTranslatedCase(locale,study);
     const localizedRecords=localizedStudy[key] as CaseStudy["features"]|CaseStudy["technicalNotes"];
     const idx=records.findIndex(item=>item.title===ref.note);
     return [{
       slug:ref.slug,title:localizedProject.title,
       technicalLabel:localizedRecords[idx]?.title??matched.title,
       source:key,repoUrl:project.repoUrl,sourceEvidence:study.sourceEvidence
     }];
   });
   if(examples.length!==row.evidence.length)return [];
   const trans=locale==="en"?null:localizedCopy[row.id as keyof typeof localizedCopy];
   return [{id:row.id,category:row.category as ImpactCategory,title:trans?.title??row.title,summary:trans?.summary??row.summary,examples}];
 });
}
export function getReviewedOutcomes():Measurement[]{
 const records=approvedMeasuredOutcomes(evidence);
 return records.filter(item=>item.projectSlug===undefined || Boolean(getPublicProject(item.projectSlug))).map(item=>({
   id:item.id,title:item.title,value:item.value,unit:item.unit,timeframe:item.timeframe,methodology:item.methodology,sourceUrl:item.sourceUrl,projectSlug:item.projectSlug,
 }));
}
