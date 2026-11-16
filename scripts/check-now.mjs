import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),"utf8"));
const configuration=read("content/now.json");
const projects=read("content/projects.json");
const cases=new Set(read("content/case-studies.json").map(c=>c.slug));
const fa=read("content/locales/fa-now.json"),ps=read("content/locales/ps-now.json");
const active=new Map(projects.filter(p=>
  p.publicationStatus==="published" && p.repoUrlVerified &&
  ["concept","prototype","in_development","pilot"].includes(p.developmentStatus) && cases.has(p.slug)
).map(p=>[p.slug,p]));
const issues=[];
const check=(ok,message)=>{if(!ok) issues.push(message);};
const string=(value,length)=>typeof value==="string" && value.trim().length>=length && value.length<1000;

check(configuration.schemaVersion===1,"Unknown current-work schema");
check(configuration.context==="source_reviewed_portfolio_snapshot","This view is not a live GitHub or sprint tracker");
check(Array.isArray(configuration.featuredProjects) && configuration.featuredProjects.length===3,"Home must feature three projects");
check(Array.isArray(configuration.focusAreas) && configuration.focusAreas.length===3,"Exactly three source-backed technical focus areas expected");
if(Array.isArray(configuration.featuredProjects)){
  check(new Set(configuration.featuredProjects).size===configuration.featuredProjects.length,"Duplicate featured projects");
  for(const slug of configuration.featuredProjects)check(active.has(slug),"Unpublished/retired/unknown featured project: "+slug);
}
const allowedIds=["interfaces","mobile","systems"];
if(Array.isArray(configuration.focusAreas)) for(const item of configuration.focusAreas){
  check(allowedIds.includes(item.id),"Unknown focus ID: "+item.id);
  check(string(item.title,8) && string(item.description,22),"Focus title/description required: "+item.id);
  check(Array.isArray(item.projectSlugs) && item.projectSlugs.length>=2,"Need 2+ project examples in "+item.id);
  check(Array.isArray(item.technologies) && item.technologies.length>0,"Need focus technologies "+item.id);
  const evidence=(item.projectSlugs??[]).map(slug=>active.get(slug));
  check(evidence.every(Boolean),"Unknown/unpublished project in focus "+item.id);
  check(new Set(item.projectSlugs).size===item.projectSlugs.length,"Duplicate project in focus "+item.id);
  for(const tech of item.technologies??[])check(evidence.some(p=>p?.technologies.includes(tech)),"Unsupported technology "+tech+" in "+item.id);
}
check(JSON.stringify(configuration.focusAreas?.map(f=>f.id))===JSON.stringify(allowedIds),"Missing/out-of-order focus groups");
for(const [locale,translation] of Object.entries({fa,ps})){
  check(JSON.stringify(Object.keys(translation).sort())===JSON.stringify(allowedIds.slice().sort()),locale+" requires all focus translations");
  for(const id of allowedIds)check(string(translation[id]?.title,8) && string(translation[id]?.description,22),locale+" missing translation for "+id);
}
check(Array.isArray(configuration.learningGoals),"learningGoals must be an array");
for(const goal of configuration.learningGoals??[]){
  check(goal.ownerApproved===true && /^[a-z0-9-]+$/.test(goal.id??"") &&
    string(goal.title,5) && string(goal.note,12),"Learning goals require explicit owner approval and meaningful content");
}
for(const project of active.values())check(/^\d{4}-\d{2}-\d{2}$/.test(project.sourceCheckedAt),"Source review date absent: "+project.slug);
if(issues.length){console.error("Now snapshot content validation failed:\n"+issues.map(x=>"- "+x).join("\n"));process.exitCode=1;}
else console.log("Current-work snapshot checked: "+active.size+" source-backed ongoing projects, three editorial highlights and three translated evidence areas; no invented activity metrics.");
