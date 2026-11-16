import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { validateInquiry, formatInquiry, INQUIRY_FOCUSES, INQUIRY_INTENTS, INQUIRY_TIMINGS } from "../lib/inquiry-core.mjs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const payload={intent:"employment",focus:"web",timing:"flexible",goal:"Frontend engineering role",details:"Discussing an engineering role with a focus on usable web applications."};
test("Phase 19 offers three genuine inquiry categories and six source-backed technical focus choices",()=>{
 assert.deepEqual(INQUIRY_INTENTS,["employment","contract","collaboration"]);
 assert.deepEqual(INQUIRY_TIMINGS,["flexible","soon","later"]);
 assert.deepEqual(INQUIRY_FOCUSES.slice(1),JSON.parse(read("content/services.json")).map(s=>s.id));
 for(const intent of INQUIRY_INTENTS)assert.ok(validateInquiry({...payload,intent}));
});
test("Client-side inquiry validation rejects unsafe and incomplete drafts",()=>{
 assert.deepEqual(validateInquiry(payload),payload);
 for(const mod of [
  {intent:"admin"},{focus:"invalid"},{timing:"yesterday"},{goal:"short"},
  {goal:"X".repeat(121)},{goal:"hello\r\nBCC: evil"},{details:"incomplete"},
  {details:"X".repeat(1201)},{details:"text\u0000with forbidden control"},
  {goal:"\n\n"}
 ])assert.equal(validateInquiry({...payload,...mod}),null,JSON.stringify(mod));
 for(const invalid of [null,false,[],{}])assert.equal(validateInquiry(invalid),null);
});
test("Formatting produces a useful subject and body without pretending to submit or schedule",()=>{
 const value=formatInquiry(payload);
 assert.ok(value);
 assert.match(value.subject,/Portfolio inquiry: Frontend engineering role/);
 assert.match(value.body,/Opportunity type: Engineering role/);
 assert.match(value.body,/Focus area: Web applications/);
 assert.match(value.body,/Context:\nDiscussing an engineering role/);
 assert.ok(value.subject.length<=140);
 assert.equal(formatInquiry({...payload,details:"Short"}),null);
 const truncated=formatInquiry({...payload,goal:"A".repeat(120)});
 assert.ok(truncated.subject.length<=140);
});
test("Browser planner drafts privately: no API POST, no automatic transmission, explicit contact/email actions",()=>{
 const component=read("components/inquiry-planner.tsx");
 for(const token of ["useState","formatInquiry(draft,labels)","validateInquiry(draft)","navigator.clipboard?.writeText","inquiryCopyManual","readOnly","portfolio:inquiry-draft","formEnabled","mailto:","inquiryNotSent","aria-pressed","aria-live"])assert.ok(component.includes(token),token);
 assert.doesNotMatch(component,/fetch\(|localStorage|sessionStorage|sendBeacon|navigator\.geolocation/);
 const contact=read("components/contact-form.tsx");
 for(const token of ["portfolio:inquiry-draft","useEffect","messageField.value=values.body","subject.value=values.subject","subject.focus","/api/contact"])assert.ok(contact.includes(token),token);
 assert.ok(contact.includes("event.preventDefault()"));
 assert.ok(contact.includes("if(busy)return"));
});
test("Contact page remains functional in English and review-gated Dari/Pashto, with correct privacy boundaries",()=>{
 const en=read("app/contact/page.tsx"),translated=read("components/locale-public-pages.tsx");
 assert.ok(en.includes("<CollaborationSection />"));
 assert.ok(translated.includes("<CollaborationSection locale={locale}/>"));
 assert.ok(en.includes('id="contact-methods"') && translated.includes('id="contact-methods"'));
 const section=read("components/collaboration-section.tsx");
 assert.ok(section.includes('getServices(locale,"full")'));
 assert.ok(section.includes("getPublicIdentity().email"));
 assert.ok(section.includes("contactConfig().enabled"));
 assert.ok(section.includes("<InquiryPlanner"));
 assert.ok(section.includes("inquiryFaqItem")===false);
 for(const locale of ["fa","ps"]){
  const ui=JSON.parse(read(`content/locales/${locale}-ui.json`));
  for(const key of ["inquiryEmployment","inquiryFocusUnsure","inquiryGoal","inquiryDetails","inquiryNotSent","inquiryFaq4Body"])assert.ok(ui[key].length>3,key);
 }
 assert.deepEqual(Object.keys(JSON.parse(read("content/locales/fa-ui.json"))).sort(),Object.keys(JSON.parse(read("content/locales/ps-ui.json"))).sort());
 assert.equal(JSON.parse(read("content/locales/approval.json")).fa.ownerApproved,false);
 assert.equal(JSON.parse(read("content/locales/approval.json")).ps.ownerApproved,false);
 assert.equal(JSON.parse(read("content/profile.json")).publicEmail,null);
});
test("Responsive CSS, accessible accordion controls and prior security barriers remain intact",()=>{
 const css=read("styles/phase19.css");
 for(const token of ["--type-body","--type-card","--type-section","--focus","--border","@media(max-width:960px)","@media(max-width:750px)","@media(max-width:540px)","@media(prefers-reduced-motion:reduce)",'html[dir="rtl"]',":focus-visible"])assert.ok(css.includes(token),token);
 assert.ok(read("app/layout.tsx").includes("styles/phase19.css"));
 assert.ok(read("components/collaboration-section.tsx").includes("<details"));
 assert.ok(read("components/collaboration-section.tsx").includes("<summary"));
 assert.ok(read("app/api/contact/route.ts").includes("verifyChallenge("));
 assert.ok(read("app/api/contact/route.ts").includes("validSameOrigin("));
 assert.ok(read("app/api/contact/route.ts").includes("rateLimit("));
 assert.doesNotMatch(css,/https?:\/\//);
});
test("Phase 19 build-time inquiry checks pass",()=>{
 assert.match(execFileSync(process.execPath,["scripts/check-inquiry.mjs"],{encoding:"utf8"}),/Phase 19 inquiry checks passed/);
});
