import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { INQUIRY_INTENTS, INQUIRY_FOCUSES, INQUIRY_TIMINGS, validateInquiry, formatInquiry } from "../lib/inquiry-core.mjs";
const root=dirname(dirname(fileURLToPath(import.meta.url)));
const read=p=>readFileSync(join(root,p),"utf8");
const json=p=>JSON.parse(read(p));
const issues=[];
const check=(ok,why)=>{if(!ok)issues.push(why);};
const services=json("content/services.json").map(x=>x.id);
check(INQUIRY_INTENTS.join("|")==="employment|contract|collaboration","Unsupported inquiry intents");
check(INQUIRY_FOCUSES.filter(x=>x!=="unsure").join("|")===services.join("|"),"Inquiry focus list must match real service categories");
check(INQUIRY_TIMINGS.join("|")==="flexible|soon|later","Timeframe options changed");
const keys=[
  "inquiryEyebrow","inquiryTitle","inquiryIntro","inquiryEmployment","inquiryEmploymentDesc",
  "inquiryContract","inquiryContractDesc","inquiryCollaboration","inquiryCollaborationDesc",
  "inquiryFocus","inquiryFocusUnsure","inquiryTiming","inquiryFlexible","inquirySoon","inquiryLater",
  "inquiryGoal","inquiryGoalHint","inquiryDetails","inquiryDetailsHint","inquiryPreview",
  "inquiryPreviewIntro","inquiryGenerate","inquiryCopy","inquiryCopied","inquiryCopyManual",
  "inquiryInvalid","inquiryNotSent","inquiryOpenEmail","inquiryUseForm","inquiryFormReady",
  "inquiryReady","inquiryQuestionTitle","inquiryQuestionIntro","inquiryFaq1","inquiryFaq1Body",
  "inquiryFaq2","inquiryFaq2Body","inquiryFaq3","inquiryFaq3Body","inquiryFaq4","inquiryFaq4Body",
  "inquiryProofTitle","inquiryProofBody","inquiryProofAction"
];
for(const locale of ["fa","ps"]){
  const ui=json(`content/locales/${locale}-ui.json`);
  for(const key of keys)check(typeof ui[key]==="string"&&ui[key].trim().length>2,`${locale}: missing/empty ${key}`);
}
for(const p of ["lib/inquiry-core.d.mts","components/inquiry-planner.tsx","components/collaboration-section.tsx","styles/phase19.css","tests/phase19-inquiry.test.mjs"])check(read(p).length>120,p+" missing");
const input={intent:"employment",focus:"web",timing:"flexible",goal:"Frontend engineering",details:"A practical discussion of team needs and a suitable technical role."};
check(Boolean(validateInquiry(input)),"Valid inquiry rejected");
check(formatInquiry(input)?.body.includes("Frontend engineering"),"Inquiry formatting invalid");
check(json("content/profile.json").publicEmailApproved===false,"Unexpected public email approval change");
check(json("content/launch-approval.json").approvedForPublicLaunch===false,"Unexpected release approval change");
if(issues.length){console.error("Inquiry checks failed:\n"+issues.map(x=>"- "+x).join("\n"));process.exitCode=1;}
else console.log("Phase 19 inquiry checks passed: 3 intents, 6 evidence-backed focus areas, full draft translations and no unapproved public email/release flags.");
