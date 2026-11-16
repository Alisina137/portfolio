import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateAvailabilityRecord, projectPublicAvailability, AVAILABILITY_STATUSES, EMPLOYMENT_TYPES, WORK_MODES, WORK_REGIONS, FOCUS_AREAS } from "../lib/availability-core.mjs";
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),"utf8"));
const current=read("content/availability.json");
const errors=[];
const check=(pass,message)=>{if(!pass)errors.push(message);};
check(validateAvailabilityRecord(current),"Availability source contains unapproved/invalid fields, dates, or an unsupported status");
const services=read("content/services.json").map(item=>item.id);
check(FOCUS_AREAS.join("|")===services.join("|"),"Availability technical focus must match sourced services");
check(AVAILABILITY_STATUSES.join("|")==="not_shared|open|selective|unavailable","Unreviewed status labels");
check(EMPLOYMENT_TYPES.length===4&&WORK_MODES.length===3&&WORK_REGIONS.length===2,"Unsupported work preferences");
const projection=projectPublicAvailability(current);
check(current.ownerApproval!=="owner_pending"||projection===null,"Pending availability must not appear publicly");
for(const locale of ["fa","ps"]){
  const ui=read(`content/locales/${locale}-ui.json`);
  for(const key of ["availability","availabilityEyebrow","availabilityPending","availabilityPendingBody","availabilityOpen","availabilitySelective","availabilityUnavailable","availabilityFullTime","availabilityRemote","availabilityInternational","availabilityContact","availabilityHeroTitle","availabilityEvidenceTitle"]){
    check(typeof ui[key]==="string"&&ui[key].trim().length>=3,`${locale} missing ${key}`);
  }
}
const approvals=read("content/locales/approval.json");
check(approvals.fa.ownerApproved===false&&approvals.ps.ownerApproved===false,"Availability must not automatically release translations");
check(read("content/launch-approval.json").approvedForPublicLaunch===false,"Availability must not change public launch approval");
if(errors.length){console.error("Availability validation failed:\n"+errors.map(item=>"- "+item).join("\n"));process.exitCode=1;}
else console.log(`Availability checked: source ${current.ownerApproval}, status ${current.status}; public projection ${projection?"active":"hidden"}; owner review, 90-day validity and locale gates enforced.`);
