import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isApprovedTestimonial, approvedTestimonials } from "../lib/testimonials-core.mjs";
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const input=read("content/testimonials.json");
const projects=new Set(read("content/projects.json").filter(p=>p.publicationStatus==="published"&&p.repoUrlVerified).map(p=>p.slug));
const issues=[];
const check=(ok,message)=>{if(!ok)issues.push(message);};
check(input.schemaVersion===1,"Invalid testimonials schema version");
check(input.publicationPolicy==="identity_consent_owner_approval_and_review_required","Consent and review policy must remain explicit");
check(Array.isArray(input.entries),"Testimonial entries must be an array");
const ids=new Set(),fields=new Set(["id","name","role","organization","relationship","quote","context","projectSlug","profileUrl","language","published","ownerApproved","identityVerified","evidenceReviewed","consentToPublish","consentedAt","reviewedAt"]);
for(const record of Array.isArray(input.entries)?input.entries:[]){
 check(isApprovedTestimonial(record),"Unreviewed, unconsented or unsafe recommendation: "+String(record?.id??"unknown"));
 if(record && typeof record==="object"){
  check(!ids.has(record.id),"Duplicate recommendation id: "+String(record.id));ids.add(record.id);
  check(record.projectSlug===undefined || projects.has(record.projectSlug),"Linked project is not publicly reviewed: "+String(record.projectSlug));
  for(const key of Object.keys(record))check(fields.has(key),"Unsupported or potentially private testimonial field: "+key);
 }
}
check(approvedTestimonials(input).length===(Array.isArray(input.entries)?input.entries.length:0),"Public testimonial projection excludes unsafe records");
const ui={fa:read("content/locales/fa-ui.json"),ps:read("content/locales/ps-ui.json")};
for(const locale of ["fa","ps"]) for(const key of ["testimonials","testimonialHeroTitle","testimonialEmptyTitle","testimonialPermission","testimonialCount","testimonialStepTwoDesc"]){
 check(typeof ui[locale][key]==="string"&&ui[locale][key].trim().length>=3,locale+": missing testimonial translation "+key);
}
if(issues.length){console.error("Testimonial publication check failed:\n"+issues.map(v=>"- "+v).join("\n"));process.exitCode=1;}
else console.log(`Testimonials validated: ${input.entries.length} written-consent, identity-reviewed public recommendations; unverified testimonials excluded.`);
