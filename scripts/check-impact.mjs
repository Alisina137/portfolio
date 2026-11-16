import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { approvedMeasuredOutcomes } from "../lib/impact-core.mjs";

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read=filename=>JSON.parse(fs.readFileSync(path.join(root,filename),"utf8"));
const records=read("content/impact.json");
const projects=read("content/projects.json").filter(p=>p.publicationStatus==="published"&&p.repoUrlVerified);
const cases=new Map(read("content/case-studies.json").map(c=>[c.slug,c]));
const repositories=read("content/repositories.json").repositories;
const translations={fa:read("content/locales/fa-impact.json"),ps:read("content/locales/ps-impact.json")};
const issues=[];
const check=(cond,msg)=>{if(!cond)issues.push(msg);};
const ids=["architecture","workflows","marketplaces","learning"];
check(records.schemaVersion===1,"Unexpected impact schema");
check(records.framing==="repository_and_case_study_evidence_not_business_outcomes","Impact counts must be explicitly separated from measured outcomes");
check(Array.isArray(records.highlights) && records.highlights.length===4,"Exactly four evidence themes expected");
check(JSON.stringify(records.highlights.map(x=>x.id))===JSON.stringify(ids),"Evidence themes must use reviewed IDs and ordering");
check(projects.length===6 && cases.size===6,"Source-backed product case study count changed: review impact framing");
check(new Set(projects.map(p=>p.category)).size===4,"Product domain count changed: review impact framing");
check(repositories.filter(r=>r.slug!=="portfolio"&&projects.some(p=>p.slug===r.slug)).length===6,"Linked public repository count changed");
for(const item of records.highlights){
 check(["engineering","product"].includes(item.category),"Unsupported impact category: "+item.id);
 check(typeof item.title==="string" && item.title.trim().length>7 && typeof item.summary==="string" && item.summary.trim().length>=70,item.id+" needs meaningful title/description");
 check(Array.isArray(item.evidence) && item.evidence.length>=2,item.id+" needs 2+ real project evidence links");
 if(!Array.isArray(item.evidence))continue;
 const seen=new Set();
 for(const e of item.evidence){
   const project=projects.find(p=>p.slug===e.slug),study=cases.get(e.slug);
   check(Boolean(project&&study),item.id+": missing public project "+e.slug);
   check(!seen.has(e.slug),item.id+": duplicated project "+e.slug);
   seen.add(e.slug);
   check(["technicalNotes","features"].includes(e.source),item.id+": unreviewed case study section");
   check(Boolean(study?.[e.source]?.some(x=>x.title===e.note)),item.id+": missing source note "+e.note);
   check(Boolean(project?.repoUrl && repositories.some(r=>r.slug===e.slug && project.repoUrl==="https://github.com/"+r.repository)),item.id+": no verified GitHub source "+e.slug);
 }
}
for(const [language,translation] of Object.entries(translations)){
 check(JSON.stringify(Object.keys(translation).sort())===JSON.stringify([...ids].sort()),language+": missing impact translation");
 for(const id of ids){const row=translation[id];check(typeof row?.title==="string"&&row.title.trim().length>5,language+": missing title "+id);check(typeof row?.summary==="string"&&row.summary.trim().length>30,language+": missing summary "+id);}
}
check(Array.isArray(records.measuredOutcomes),"Measured outcomes must be a list");
if(Array.isArray(records.measuredOutcomes)){
 check(records.measuredOutcomes.length===approvedMeasuredOutcomes(records).length,"Only owner-approved, fully reviewed and sourced measurable results may be committed to the public repository");
 const set=new Set();
 for(const row of records.measuredOutcomes){
   check(!set.has(row.id),"Duplicate measured result id");set.add(row.id);
   check(row.projectSlug===undefined || projects.some(p=>p.slug===row.projectSlug),"Impact metric references unpublished project "+row.projectSlug);
 }
}
if(issues.length){console.error("Impact evidence validation failed:\n"+issues.map(x=>"- "+x).join("\n"));process.exitCode=1;}
else console.log("Impact evidence verified: six documented case studies, six project source links, four product domains, four source-reviewed highlights, no unverified outcome metrics.");
