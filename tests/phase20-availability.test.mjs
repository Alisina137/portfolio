import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import {
 validateAvailabilityRecord, isPublicAvailability, projectPublicAvailability,
 AVAILABILITY_STATUSES, EMPLOYMENT_TYPES, WORK_MODES, WORK_REGIONS, FOCUS_AREAS
} from "../lib/availability-core.mjs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const json=p=>JSON.parse(read(p));
const today="2026-11-16";
const fixture={
 schemaVersion:1,ownerApproval:"owner_approved",status:"open",
 employmentTypes:["full_time","contract"],workModes:["remote","hybrid"],
 regions:["afghanistan","international_remote"],focus:["web","fullstack"],
 reviewedAt:"2026-11-16",validUntil:"2027-01-11",note:"An owner-verified availability example used only in unit tests."
};
test("Phase 20 does not invent a public availability claim or publish private preferences",()=>{
 const raw=json("content/availability.json");
 assert.equal(raw.ownerApproval,"owner_pending");
 assert.equal(raw.status,"not_shared");
 assert.deepEqual(raw.employmentTypes,[]);
 assert.deepEqual(raw.workModes,[]);
 assert.deepEqual(raw.regions,[]);
 assert.deepEqual(raw.focus,[]);
 assert.equal(raw.reviewedAt,null);
 assert.equal(raw.validUntil,null);
 assert.equal(raw.note,null);
 assert.equal(validateAvailabilityRecord(raw),true);
 assert.equal(projectPublicAvailability(raw,today),null);
});
test("Time-limited public statements require explicit owner approval, meaningful preferences and valid expiry",()=>{
 assert.equal(validateAvailabilityRecord(fixture),true);
 assert.equal(isPublicAvailability(fixture,today),true);
 assert.equal(isPublicAvailability(fixture,"2027-01-12"),false);
 assert.equal(isPublicAvailability(fixture,"2026-11-15"),false);
 for(const change of [
  {ownerApproval:"owner_pending"},{status:"not_shared"},
  {employmentTypes:[]},{workModes:[]},{focus:[]},
  {workModes:["hybrid"],regions:["international_remote"]},
  {validUntil:"2027-02-18"},{validUntil:"2026-11-16"},
  {reviewedAt:"2026-02-30"},{validUntil:"2026-13-18"}
 ])assert.equal(validateAvailabilityRecord({...fixture,...change}),false,JSON.stringify(change));
});
test("A valid unavailable status does not require employment preferences, and its claim still expires",()=>{
 const closed={...fixture,status:"unavailable",employmentTypes:[],workModes:[],regions:[],focus:[]};
 assert.equal(isPublicAvailability(closed,today),true);
 assert.equal(projectPublicAvailability(closed,today).status,"unavailable");
 assert.equal(isPublicAvailability(closed,"2027-01-12"),false);
});
test("Drafts are allowed to be edited privately but not published, and sensitive fields are rejected",()=>{
 const draft={...fixture,ownerApproval:"owner_pending",reviewedAt:null,validUntil:null};
 assert.equal(validateAvailabilityRecord(draft),true);
 assert.equal(isPublicAvailability(draft,today),false);
 for(const change of [
  {salary:"100000 USD"},{publicEmail:"person@example.com"},{status:"guaranteed"},
  {employmentTypes:["full_time","full_time"]},{employmentTypes:["consultant"]},
  {note:"Contact me at hidden@example.com about jobs."},
  {note:"Call +93 700 000 000 for a job."},
  {note:"<script>alert(1)</script>"},
  {note:"Tiny"},
  {focus:["not-a-real-specialty"]}
 ])assert.equal(validateAvailabilityRecord({...draft,...change}),false,JSON.stringify(change));
 assert.equal(validateAvailabilityRecord(null),false);
 assert.equal(validateAvailabilityRecord([]),false);
});
test("Only safe, reviewed display fields reach frontend; audit and owner metadata stay server-side",()=>{
 const record=projectPublicAvailability(fixture,today);
 assert.ok(record);
 assert.equal(record.status,"open");
 assert.equal(record.ownerApproval,undefined);
 assert.equal(record.schemaVersion,undefined);
 assert.deepEqual(record.employmentTypes,fixture.employmentTypes);
 record.employmentTypes.push("internship");
 assert.equal(fixture.employmentTypes.length,2);
 assert.deepEqual(AVAILABILITY_STATUSES,["not_shared","open","selective","unavailable"]);
 assert.deepEqual(EMPLOYMENT_TYPES,["full_time","part_time","contract","internship"]);
 assert.deepEqual(WORK_MODES,["remote","hybrid","on_site"]);
 assert.deepEqual(WORK_REGIONS,["afghanistan","international_remote"]);
 assert.deepEqual(FOCUS_AREAS,json("content/services.json").map(s=>s.id));
});
test("Home, About, Contact, footer, route and localized versions are connected without extra top-level nav",()=>{
 const home=read("app/page.tsx"),local=read("components/locale-public-pages.tsx");
 assert.ok(home.includes("<AvailabilityPreview />"));
 assert.ok(local.includes("<AvailabilityPreview locale={locale} />"));
 assert.ok(read("app/about/page.tsx").includes('href="/availability"'));
 assert.ok(read("app/contact/page.tsx").includes('href="/availability"'));
 assert.ok(read("components/site-footer.tsx").includes('path("/availability")'));
 assert.ok(local.includes('projectHref(locale,"/availability")'));
 assert.ok(read("app/availability/page.tsx").includes('pathname:"/availability"'));
 assert.ok(read("app/availability/opengraph-image.tsx").includes("renderOgCard"));
 assert.ok(read("app/[locale]/[[...path]]/page.tsx").includes("pathname === '/availability'"));
 assert.ok(read("lib/i18n-core.mjs").includes("path === '/availability'"));
 assert.ok(read("app/sitemap.ts").includes('"/availability"'));
 assert.ok(read("app/layout.tsx").includes("styles/phase20.css"));
 assert.ok(read("lib/i18n.ts").includes("englishAvailability"));
 assert.ok(read("scripts/check-locales.mjs").includes("read('content/availability.json')"));
 assert.ok(!read("components/site-header.tsx").includes('href: "/availability"'));
});
test("Review-gated Dari/Pashto copy, evidence-backed focus cards and approved channels are rendered safely",()=>{
 const view=read("components/availability-section.tsx");
 for(const token of [
  "getServices(locale","getPublicAvailability()","getPublicIdentity()",
  "identity.resume&&","identity.linkedIn&&","identity.github&&",
  "availabilityPending","record?.note","localizePath(locale,\"/contact\")"
 ])assert.ok(view.includes(token),token);
 const fa=json("content/locales/fa-ui.json"),ps=json("content/locales/ps-ui.json");
 assert.deepEqual(Object.keys(fa).sort(),Object.keys(ps).sort());
 for(const t of [fa,ps])for(const key of ["availability","availabilityPending","availabilityOpen","availabilityReviewed","availabilityInternational","availabilityContact"])assert.ok(t[key].length>2,key);
 assert.equal(json("content/locales/approval.json").fa.ownerApproved,false);
 assert.equal(json("content/locales/approval.json").ps.ownerApproved,false);
 assert.equal(json("content/launch-approval.json").approvedForPublicLaunch,false);
});
test("Studio uses owner auth, same-origin and review PRs; no anonymous availability write API",()=>{
 const server=read("app/api/studio/proposals/route.ts"),get=read("app/api/studio/content/route.ts");
 for(const token of ["getStudioSession()","validSameOrigin(req,cfg.origin)","validateAvailabilityRecord(fields)","isPublicAvailability(fields)","kind==='availability'","createEditorialPr(files"])assert.ok(server.includes(token),token);
 assert.ok(get.includes("availability:JSON.parse(availability.content)"));
 const git=read("lib/github-studio.ts");
 assert.ok(git.includes("content/availability.json"));
 const editor=read("components/studio-editor.tsx");
 for(const token of ["AvailabilityForm","kind:\"availability\"","owner_approved","owner_pending","create","90 days"])assert.ok(editor.includes(token),token);
});
test("Accessible, responsive light/dark visuals and deliberate empty states are available",()=>{
 const css=read("styles/phase20.css");
 for(const token of ["--type-section","--type-page","--type-body","--border","--focus","@media(max-width:1000px)","@media(max-width:720px)","@media(max-width:520px)","@media(prefers-reduced-motion:reduce)",":focus-visible"])assert.ok(css.includes(token),token);
 const view=read("components/availability-section.tsx");
 assert.ok(view.includes('aria-labelledby="availability-status-title"'));
 assert.ok(view.includes('availability-status--'));
 assert.ok(view.includes("record?"));
 const studioCss=read("styles/phase20-studio.css");
 assert.ok(studioCss.includes("availability-studio-choices"));
});
test("Build-time publication gate validates data without inventing availability",()=>{
 assert.match(execFileSync(process.execPath,["scripts/check-availability.mjs"],{encoding:"utf8"}),/Availability checked/);
});
