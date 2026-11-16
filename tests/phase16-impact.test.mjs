import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { approvedMeasuredOutcomes } from "../lib/impact-core.mjs";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const impact=JSON.parse(read("content/impact.json"));
const projects=JSON.parse(read("content/projects.json")).filter(p=>p.publicationStatus==="published"&&p.repoUrlVerified);
const cases=new Map(JSON.parse(read("content/case-studies.json")).map(c=>[c.slug,c]));
const reps=JSON.parse(read("content/repositories.json")).repositories;

test("Phase 16 shows portfolio evidence counts rather than invented business KPIs",()=>{
 assert.equal(projects.length,6);
 assert.equal(cases.size,6);
 assert.equal(new Set(projects.map(p=>p.category)).size,4);
 assert.equal(reps.filter(r=>projects.some(p=>p.slug===r.slug)).length,6);
 assert.equal(impact.framing,"repository_and_case_study_evidence_not_business_outcomes");
 assert.deepEqual(impact.measuredOutcomes,[]);
 assert.deepEqual(impact.highlights.map(x=>x.id),["architecture","workflows","marketplaces","learning"]);
 for(const item of impact.highlights){
   assert.ok(item.evidence.length>=2);
   for(const evidence of item.evidence){
     assert.ok(projects.some(p=>p.slug===evidence.slug),evidence.slug);
     assert.ok(cases.get(evidence.slug)[evidence.source]?.some(v=>v.title===evidence.note),evidence.note);
   }
 }
});
test("Measurable claims require owner approval, independent source review and safe evidence",()=>{
 const example={id:"evidence-one",title:"Time saved in a measured study",value:125,unit:"hours",timeframe:"2026-09 to 2026-10",methodology:"A documented before-and-after process with matching controls.",sourceUrl:"https://github.com/Alisina137/portfolio/blob/main/docs/review.md",projectSlug:"maktablink",ownerApproved:true,evidenceReviewed:true};
 assert.deepEqual(approvedMeasuredOutcomes({measuredOutcomes:[example]}),[example]);
 for(const row of [
 {...example,ownerApproved:false},{...example,evidenceReviewed:false},
 {...example,value:-10},{...example,value:NaN},{...example,methodology:"guess"},
 {...example,sourceUrl:"http://github.com/Alisina137/portfolio"},
 {...example,sourceUrl:"https://evil.com/report"},
 {...example,sourceUrl:"javascript:alert(1)"},{...example,timeframe:"x"},
 ])assert.deepEqual(approvedMeasuredOutcomes({measuredOutcomes:[row]}),[]);
 assert.deepEqual(approvedMeasuredOutcomes({measuredOutcomes:null}),[]);
});
test("Home, About, route, nav and SEO are connected across supported languages",()=>{
 const home=read("app/page.tsx"),about=read("app/about/page.tsx"),l=read("components/locale-public-pages.tsx");
 assert.ok(home.includes("<ImpactPreview />"));
 assert.ok(l.includes("<ImpactPreview locale={locale} />"));
 assert.ok(about.includes('href="/impact"'));
 assert.ok(l.includes('projectHref(locale,"/impact")'));
 assert.ok(read("app/impact/page.tsx").includes("createPageMetadata("));
 assert.ok(read("app/impact/opengraph-image.tsx").includes("renderOgCard("));
 assert.ok(read("components/site-header.tsx").includes('href: "/impact"'));
 assert.ok(read("components/site-footer.tsx").includes('path("/impact")'));
 assert.ok(read("app/[locale]/[[...path]]/page.tsx").includes("pathname === '/impact'"));
 assert.ok(read("lib/i18n-core.mjs").includes("path === '/impact'"));
 assert.ok(read("app/sitemap.ts").includes('"/impact"'));
});
test("Only reviewable achievements are passed to the client, with functional filters and case/source links",()=>{
 const source=read("lib/impact.ts");
 for(const token of ["getPublishedProjects()","getCaseStudy","getTranslatedCase","getTranslatedProject","getEvidenceTotals","getImpactHighlights","getReviewedOutcomes","approvedMeasuredOutcomes","repoUrlVerified"])assert.ok(source.includes(token),token);
 const explorer=read("components/impact-explorer.tsx");
 for(const token of ["useState","useMemo","aria-pressed","aria-live=\"polite\"","<details","<summary","localizePath(locale,\"/projects/\"+example.slug)","href={example.repoUrl}","noopener noreferrer"])assert.ok(explorer.includes(token),token);
 const section=read("components/impact-section.tsx");
 assert.ok(section.includes("<ImpactExplorer"));
 assert.ok(section.includes("<Snapshot"));
 assert.ok(section.includes("impactResultsEmpty"));
 assert.ok(section.includes("getReviewedOutcomes()"));
});
test("RTL draft translation completeness with unchanged search-index and locale approval gates",()=>{
 const fa=JSON.parse(read("content/locales/fa-ui.json")),ps=JSON.parse(read("content/locales/ps-ui.json"));
 assert.deepEqual(Object.keys(fa).sort(),Object.keys(ps).sort());
 for(const t of [fa,ps])for(const key of ["impact","impactTitle","impactHeroIntro","impactResultsEmpty","impactEvidence","impactMetricFoot","impactCount"])assert.ok(t[key]?.length>3,key);
 const stringsFa=JSON.parse(read("content/locales/fa-impact.json")),stringsPs=JSON.parse(read("content/locales/ps-impact.json"));
 assert.deepEqual(Object.keys(stringsFa).sort(),Object.keys(stringsPs).sort());
 assert.ok(read("lib/i18n.ts").includes("englishImpact"));
 assert.ok(read("scripts/check-locales.mjs").includes("read('content/impact.json')"));
 assert.equal(JSON.parse(read("content/launch-approval.json")).approvedForPublicLaunch,false);
 assert.equal(JSON.parse(read("content/locales/approval.json")).fa.ownerApproved,false);
 assert.equal(JSON.parse(read("content/locales/approval.json")).ps.ownerApproved,false);
});
test("Impact cards and data displays are responsive and accessible",()=>{
 const css=read("styles/phase16.css");
 assert.ok(read("app/layout.tsx").includes("styles/phase16.css"));
 for(const token of ["--type-page","--type-body","--type-section","--type-card","--focus","--border"])assert.ok(css.includes(token),token);
 for(const token of ["@media(max-width:970px)","@media(max-width:750px)","@media(max-width:540px)","@media(prefers-reduced-motion:reduce)",'html[dir="rtl"]',":focus-visible"])assert.ok(css.includes(token),token);
 assert.ok(css.includes("max-width:1720px"));
 assert.ok(read("components/site-header.tsx").includes("window.innerWidth >= 1721"));
});
test("CI guards reject unsourced outcomes or dishonest repository highlights",()=>{
 const output=execFileSync(process.execPath,["scripts/check-impact.mjs"],{encoding:"utf8"});
 assert.match(output,/six documented case studies/);
});
