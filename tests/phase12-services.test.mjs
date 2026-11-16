import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const data=JSON.parse(read("content/services.json"));
const projects=JSON.parse(read("content/projects.json"));
const cases=new Set(JSON.parse(read("content/case-studies.json")).map(p=>p.slug));
const live=new Map(projects.filter(p=>p.publicationStatus==="published"&&p.repoUrlVerified&&cases.has(p.slug)).map(p=>[p.slug,p]));

test("P12 services point to existing published cases and source-backed technologies",()=>{
  assert.deepEqual(data.map(s=>s.id),["web","mobile","backend","data","fullstack","improvements"]);
  assert.deepEqual(data.filter(s=>s.featured).map(s=>s.id),["web","mobile","backend"]);
  for(const entry of data){
    assert.equal(entry.capabilities.length,3);
    assert.ok(entry.projects.length>=2,entry.id);
    for(const slug of entry.projects)assert.ok(live.has(slug),entry.id+" -> "+slug);
    for(const tech of entry.technologies)assert.ok(entry.projects.some(slug=>live.get(slug).technologies.includes(tech)),entry.id+" -> "+tech);
    assert.equal(typeof entry.summary,"string");
  }
});

test("P12 Home preview, full Services route, and case-study links are wired",()=>{
  const component=read("components/services-section.tsx");
  assert.ok(component.includes("getServices(locale, variant)"));
  assert.ok(component.includes('variant === "preview"'));
  assert.ok(component.includes("item.examples.map"));
  assert.ok(component.includes('localizePath(locale,"/projects/"+project.slug)'));
  assert.ok(component.includes('href={localizePath(locale,"/services")}'));
  assert.ok(component.includes('href={localizePath(locale,"/contact")}'));
  assert.ok(component.includes('aria-labelledby={id + "-title"}'));
  assert.ok(read("app/page.tsx").includes('<ServicesSection variant="preview"'));
  assert.ok(read("app/services/page.tsx").includes("<ServicesPageView"));
  assert.ok(read("app/about/page.tsx").includes('href="/services"'));
  assert.ok(read("components/site-footer.tsx").includes('path("/services")'));
  assert.ok(read("components/site-header.tsx").includes('href: "/services"'));
  assert.ok(read("components/locale-public-pages.tsx").includes('<ServicesSection locale={locale} variant="preview"'));
});

test("Localized Services routes and metadata respect existing approval gates",()=>{
  const router=read("app/[locale]/[[...path]]/page.tsx");
  assert.ok(router.includes("pathname === '/services'"));
  assert.ok(router.includes("<ServicesPageView locale={locale}"));
  assert.ok(router.includes("localePubliclyVisible(locale)"));
  assert.ok(router.includes("translationsOwnerApproved(locale)"));
  assert.ok(read("lib/i18n-core.mjs").includes("path === '/services'"));
  assert.ok(read("lib/i18n.ts").includes("englishServices"));
  assert.ok(read("app/sitemap.ts").includes('"/services"'));
  assert.ok(read("app/services/page.tsx").includes("createPageMetadata("));
  assert.ok(read("scripts/check-locales.mjs").includes("read('content/services.json')"));
  for(const locale of ["fa","ps"]){
    const copy=JSON.parse(read("content/locales/"+locale+"-services.json"));
    assert.deepEqual(Object.keys(copy),data.map(s=>s.id));
    const ui=JSON.parse(read("content/locales/"+locale+"-ui.json"));
    for(const key of ["services","serviceTitle","serviceScope","serviceHeroTitle","serviceNoPromises"]) assert.ok(ui[key]?.length>4,key);
    for(const entry of data)assert.equal(copy[entry.id].capabilities.length,3);
  }
  assert.equal(JSON.parse(read("content/locales/approval.json")).fa.ownerApproved,false);
  assert.equal(JSON.parse(read("content/launch-approval.json")).approvedForPublicLaunch,false);
});

test("Service descriptions are project-backed rather than commercial promises",()=>{
  const source=read("lib/services.ts");
  assert.ok(source.includes("getPublishedProjects()"));
  assert.ok(source.includes("getCaseStudy(p.slug)"));
  assert.ok(source.includes("row.technologies.filter"));
  assert.ok(source.includes("if (!evidence.length || !tech.length) return null"));
  const copy=read("components/services-section.tsx");
  assert.ok(copy.includes("not a guarantee of availability"));
  assert.ok(copy.includes("Contact options are shown only when approved"));
  assert.doesNotMatch(copy,/guaranteed delivery|500\+ clients|trusted by|99\.9% uptime/i);
});

test("Services CSS supports tablet menu, RTL, accessibility and reduced motion",()=>{
  const css=read("styles/phase12.css");
  assert.ok(read("app/layout.tsx").includes("styles/phase12.css"));
  for(const token of ["--type-section","--type-card","--type-body","--type-small","--border"]) assert.ok(css.includes(token),token);
  assert.ok(css.includes("@media(max-width:1160px)"));
  assert.ok(css.includes("@media(max-width:680px)"));
  assert.ok(css.includes("@media(prefers-reduced-motion:reduce)"));
  assert.ok(css.includes('html[dir="rtl"]'));
  assert.ok(css.includes("overscroll-behavior:contain"));
  assert.ok(read("components/site-header.tsx").includes("window.innerWidth >= 1361"));
  assert.doesNotMatch(css,/https?:\/\//);
});
