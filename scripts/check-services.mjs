import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read=relative=>JSON.parse(fs.readFileSync(path.join(root,relative),"utf8"));
const services=read("content/services.json");
const projects=read("content/projects.json");
const cases=read("content/case-studies.json");
const approved=new Map(projects.filter(p=>p.publicationStatus==="published" && p.repoUrlVerified && cases.some(c=>c.slug===p.slug)).map(p=>[p.slug,p]));
const translations={fa:read("content/locales/fa-services.json"),ps:read("content/locales/ps-services.json")};
const expectedIds=["web","mobile","backend","data","fullstack","improvements"];
const errors=[];
const add=(error)=>errors.push(error);
const plain=(x,n)=>typeof x==="string" && x.trim().length>=n && x.length<900;
if(!Array.isArray(services)||services.length!==6)add("Exactly six service cards required");
if(JSON.stringify(services.map(s=>s.id))!==JSON.stringify(expectedIds))add("Six service IDs must appear in defined order");
if(services.filter(s=>s.featured).length!==3)add("Homepage preview must show exactly three featured areas");
for(const row of services){
  if(!expectedIds.includes(row.id) || row.id!==row.category)add("Unexpected service ID/category");
  if(!plain(row.title,5)||!plain(row.summary,45))add("Service requires readable title and summary: "+row.id);
  if(!Array.isArray(row.capabilities)||row.capabilities.length!==3||row.capabilities.some(x=>!plain(x,12)))add("Three concrete work capabilities required: "+row.id);
  if(!Array.isArray(row.technologies)||!row.technologies.length)add("Technology evidence required: "+row.id);
  if(!Array.isArray(row.projects)||row.projects.length<2||new Set(row.projects).size!==row.projects.length)add("Two distinct project examples required: "+row.id);
  const matched=(row.projects??[]).map(slug=>approved.get(slug));
  if(matched.some(p=>!p))add("Service references unknown/unpublished project: "+row.id);
  for(const name of row.technologies??[]) if(!matched.some(p=>p?.technologies.includes(name)))add("Unsupported technology "+name+" in "+row.id);
}
for(const [locale,contents] of Object.entries(translations)){
  if(JSON.stringify(Object.keys(contents).sort())!==JSON.stringify([...expectedIds].sort()))add(locale+" must translate every service");
  for(const id of expectedIds){
    const entry=contents[id]; if(!entry){add(locale+" missing "+id);continue;}
    if(!plain(entry.title,4)||!plain(entry.summary,35))add(locale+" invalid title/summary: "+id);
    if(!Array.isArray(entry.capabilities)||entry.capabilities.length!==3||entry.capabilities.some(x=>!plain(x,10)))add(locale+" mismatched capabilities: "+id);
  }
}
if(errors.length){console.error("Service content validation failed:\n"+errors.map(x=>"- "+x).join("\n"));process.exitCode=1;}
else console.log("Services verified: six evidence-backed areas, three preview cards, matching Dari/Pashto translations.");
