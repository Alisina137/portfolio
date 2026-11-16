import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),"utf8"));
const config=read("content/repositories.json");
const projects=read("content/projects.json");
const studies=new Set(read("content/case-studies.json").map(p=>p.slug));
const publicProjects=new Map(projects.filter(p=>p.publicationStatus==="published"&&p.repoUrlVerified&&studies.has(p.slug)).map(p=>[p.slug,p]));
const problems=[];
const verify=(test,why)=>{if(!test)problems.push(why);};
verify(config.schemaVersion===1,"Invalid repository config version");
verify(config.context==="verified_public_repository_links","Repository directory must represent dated verified public links");
verify(/^\d{4}-\d{2}-\d{2}$/.test(config.verifiedOn??"") && !Number.isNaN(Date.parse(config.verifiedOn)), "Verification date is missing/malformed");
const rows=Array.isArray(config.repositories)?config.repositories:[];
verify(rows.length===7,"Exactly six project repositories plus portfolio source required");
const seen=new Set();
for(const row of rows){
  verify(typeof row.slug==="string" && !seen.has(row.slug),"Duplicate/invalid repo slug: "+row.slug);
  seen.add(row.slug);
  verify(/^Alisina137\/[A-Za-z0-9_.-]+$/.test(row.repository??""),"Unsafe GitHub repository URL: "+row.slug);
  verify(row.defaultBranch==="main","Unreviewed default branch for: "+row.slug);
  verify(row.language==="TypeScript","Unreviewed GitHub language for: "+row.slug);
  if(row.slug==="portfolio"){
    verify(row.repository==="Alisina137/portfolio","Portfolio source URL mismatch");
  } else {
    const project=publicProjects.get(row.slug);
    verify(Boolean(project),"Missing published project/case for: "+row.slug);
    verify(project?.repoUrl==="https://github.com/"+row.repository,"Repo URL differs from approved published case record: "+row.slug);
    verify(Array.isArray(project?.technologies)&&project.technologies.length>0,"No published technology evidence for: "+row.slug);
  }
}
verify(seen.has("portfolio"),"Portfolio repository record missing");
verify(rows.filter(row=>row.slug!=="portfolio").length===publicProjects.size,"Public project repo coverage is incomplete");
verify(Array.isArray(config.featured)&&config.featured.length===3,"Exactly three featured repository links required");
verify(new Set(config.featured).size===3,"Duplicate featured repository");
for(const slug of config.featured??[])verify(publicProjects.has(slug) && seen.has(slug),"Featured repo must link to a real published project: "+slug);
verify(!rows.some(row=>["stars","forks","latestCommit","lastPushed","lastActive","activity","contributors"].some(key=>Object.hasOwn(row,key))),"Do not hard-code unverifiable activity/popularity metrics");
if(problems.length){console.error("Repository directory check failed:\n"+problems.map(x=>"- "+x).join("\n"));process.exitCode=1;}
else console.log("Public GitHub directory verified: seven source-reviewed repositories, three featured project links, no fabricated GitHub metrics.");
