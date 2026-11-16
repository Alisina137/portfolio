import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),"utf8"));
const catalog=read("content/services.json");
const projects=read("content/projects.json");
const cases=new Set(read("content/case-studies.json").map(c=>c.slug));
const translations={fa:read("content/locales/fa-services.json"),ps:read("content/locales/ps-services.json")};
const live=new Map(projects.filter(p=>p.publicationStatus==="published" && p.repoUrlVerified && cases.has(p.slug)).map(p=>[p.slug,p]));
const expected=["web","mobile","backend","data","fullstack","improvements"];
const errs=[];
const check=(ok,message)=>{if(!ok)errs.push(message);};

check(Array.isArray(catalog) && catalog.length===6,"Six service groups required");
if(Array.isArray(catalog)) {
  const seen=new Set();
  for(const service of catalog){
    const label=service?.id ?? "unknown";
    check(expected.includes(label),label+": unknown service ID");
    check(!seen.has(label),label+": duplicate service");seen.add(label);
    check(label===service?.category,label+": mismatched category");
    check(typeof service?.title==="string" && service.title.trim().length>=5,label+": title required");
    check(typeof service?.summary==="string" && service.summary.trim().length>=30,label+": summary required");
    check(typeof service?.featured==="boolean",label+": featured must be boolean");
    check(Array.isArray(service?.capabilities) && service.capabilities.length===3 && service.capabilities.every(v=>typeof v==="string"&&v.trim().length>=9),label+": three meaningful capabilities required");
    check(Array.isArray(service?.projects) && service.projects.length>=2 && service.projects.length<=3 && new Set(service.projects).size===service.projects.length,label+": 2–3 unique evidence projects required");
    check(Array.isArray(service?.technologies) && service.technologies.length>=1 && service.technologies.length<=5 && new Set(service.technologies).size===service.technologies.length,label+": sensible technologies required");
    const evidence=Array.isArray(service?.projects)?service.projects.map(slug=>live.get(slug)):[];
    for(let i=0;i<evidence.length;i++)check(Boolean(evidence[i]),label+": "+service.projects[i]+" unpublished or lacks case evidence");
    for(const tech of service?.technologies ?? [])check(evidence.some(p=>p?.technologies.includes(tech)),label+": "+tech+" lacks evidence in linked projects");
  }
  check(catalog.filter(s=>s.featured).length===3,"Exactly three homepage preview services required");
  for(const [locale,copy] of Object.entries(translations)){
    check(Object.keys(copy).length===expected.length,locale+": translations must map all six IDs");
    for(const id of expected){
      const trans=copy[id];
      check(Boolean(trans),locale+": missing "+id);
      check(typeof trans?.title==="string" && trans.title.trim().length>=4,locale+"/"+id+": title required");
      check(typeof trans?.summary==="string"&&trans.summary.trim().length>=25,locale+"/"+id+": summary required");
      check(Array.isArray(trans?.capabilities) && trans.capabilities.length===3 && trans.capabilities.every(v=>typeof v==="string"&&v.trim().length>=6),locale+"/"+id+": three translated capabilities required");
    }
  }
}
if(errs.length){console.error("Services validation failed:\n"+errs.map(e=>"- "+e).join("\n"));process.exitCode=1;}
else console.log("Services verified: six evidence-linked groups, three homepage previews and complete owner-gated Dari/Pashto copy.");
