import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { approvedTestimonials, isApprovedTestimonial, RELATIONSHIP_TYPES } from "../lib/testimonials-core.mjs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

const fixture={
 id:"verified-example",name:"Example Contributor",role:"Software Engineer",
 relationship:"collaborator",
 quote:"This is a synthetic test fixture only, checking that a sufficiently detailed recommendation can be processed without publishing it.",
 context:"Worked alongside the portfolio owner on a small software prototype.",
 published:true,ownerApproved:true,identityVerified:true,evidenceReviewed:true,consentToPublish:true,
 consentedAt:"2026-10-10",reviewedAt:"2026-11-16",language:"en",
 projectSlug:"maktablink",profileUrl:"https://github.com/example"
};
test("No imaginary clients, employers or endorsements are in the real published dataset",()=>{
 const source=JSON.parse(read("content/testimonials.json"));
 assert.equal(source.schemaVersion,1);
 assert.equal(source.publicationPolicy,"identity_consent_owner_approval_and_review_required");
 assert.deepEqual(source.entries,[]);
 assert.deepEqual(approvedTestimonials(source),[]);
 assert.ok(read("components/testimonials-section.tsx").includes("testimonialEmptyBody"));
});
test("Endorsements require verified identity, context, written consent and owner approval",()=>{
 assert.equal(isApprovedTestimonial(fixture),true);
 assert.deepEqual(approvedTestimonials({entries:[fixture]}).map(v=>v.id),[fixture.id]);
 for(const field of ["published","ownerApproved","identityVerified","evidenceReviewed","consentToPublish"]){
  assert.equal(isApprovedTestimonial({...fixture,[field]:false}),false,field);
 }
 assert.equal(isApprovedTestimonial({...fixture,consentedAt:"2026-12-10"}),false);
 assert.equal(isApprovedTestimonial({...fixture,reviewedAt:"2026-02-31"}),false);
 assert.equal(isApprovedTestimonial({...fixture,relationship:"customer_review"}),false);
 assert.deepEqual(RELATIONSHIP_TYPES,["client","collaborator","colleague","mentor"]);
});
test("Malicious links, private contacts and inflated quotes fail publication validation",()=>{
 for(const changes of [
  {profileUrl:"javascript:alert(1)"},{profileUrl:"http://github.com/name"},
  {profileUrl:"https://not-linkedin.example/name"},{profileUrl:"https://github.com/name?tracking=1"},
  {quote:"<script>alert(1)</script>"},{quote:"Contact fake@example.com for my review. A recommendation filled with personal information."},
  {context:"Call +93 700 000 000 for the project details."},
  {name:" "},{role:"X"},{quote:"too short"},{id:"../../other"}
 ]) assert.equal(isApprovedTestimonial({...fixture,...changes}),false,JSON.stringify(changes));
});
test("Client projection includes only display fields and removes duplicate IDs",()=>{
 const data=approvedTestimonials({entries:[fixture,fixture,{...fixture,id:"second-example",projectSlug:undefined,profileUrl:undefined}]});
 assert.equal(data.length,2);
 assert.deepEqual(Object.keys(data[0]).sort(),["id","name","role","organization","relationship","quote","context","projectSlug","profileUrl","language"].sort());
 assert.equal(data[0].ownerApproved,undefined);
 assert.equal(data[0].consentToPublish,undefined);
});
test("Navigation, home, about, locales, metadata, sitemap and typography connect",()=>{
 const home=read("app/page.tsx"),about=read("app/about/page.tsx"),locale=read("components/locale-public-pages.tsx");
 assert.ok(home.includes("<TestimonialsPreview />"));
 assert.ok(locale.includes("<TestimonialsPreview locale={locale} />"));
 assert.ok(about.includes('href="/testimonials"'));
 assert.ok(locale.includes('projectHref(locale,"/testimonials")'));
 assert.ok(read("app/testimonials/page.tsx").includes('pathname: "/testimonials"'));
 assert.ok(read("app/testimonials/opengraph-image.tsx").includes("renderOgCard("));
 assert.ok(read("components/site-header.tsx").includes('href: "/testimonials"'));
 assert.ok(read("components/site-footer.tsx").includes('path("/testimonials")'));
 assert.ok(read("app/[locale]/[[...path]]/page.tsx").includes("pathname === '/testimonials'"));
 assert.ok(read("lib/i18n-core.mjs").includes("path === '/testimonials'"));
 assert.ok(read("app/sitemap.ts").includes('"/testimonials"'));
 assert.ok(read("app/layout.tsx").includes("styles/phase17.css"));
 assert.ok(read("lib/i18n.ts").includes("englishTestimonials"));
 assert.ok(read("scripts/check-locales.mjs").includes("read('content/testimonials.json')"));
});
test("Accessible, responsive recommendation filters and careful RTL display",()=>{
 const explorer=read("components/testimonials-explorer.tsx"),css=read("styles/phase17.css");
 for(const token of ["useState","useMemo","aria-pressed","aria-live=\"polite\"","<blockquote","<figcaption>","lang={item.language}","dir=\"auto\"","noopener noreferrer"])assert.ok(explorer.includes(token),token);
 for(const token of ["--type-page","--type-body","--type-section","--type-card","--focus","--border","@media(max-width:970px)","@media(max-width:750px)","@media(max-width:540px)","@media(prefers-reduced-motion:reduce)",'html[dir="rtl"]',":focus-visible"])assert.ok(css.includes(token),token);
 const fa=JSON.parse(read("content/locales/fa-ui.json")),ps=JSON.parse(read("content/locales/ps-ui.json"));
 assert.deepEqual(Object.keys(fa).sort(),Object.keys(ps).sort());
 for(const item of [fa,ps])for(const k of ["testimonials","testimonialHeroTitle","testimonialEmptyTitle","testimonialPermission"])assert.ok(item[k]?.length>=4);
 assert.equal(JSON.parse(read("content/locales/approval.json")).fa.ownerApproved,false);
 assert.equal(JSON.parse(read("content/locales/approval.json")).ps.ownerApproved,false);
});
test("Source gate is runnable as part of CI and build",()=>{
 assert.match(execFileSync(process.execPath,["scripts/check-testimonials.mjs"],{encoding:"utf8"}),/Testimonials validated/);
 assert.ok(read("package.json").includes("check:testimonials"));
});
