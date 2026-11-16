import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const services=JSON.parse(read("content/services.json"));
const projects=JSON.parse(read("content/projects.json"));
const cases=JSON.parse(read("content/case-studies.json"));
const published=new Map(projects.filter(p=>p.publicationStatus==="published"&&p.repoUrlVerified&&cases.some(c=>c.slug===p.slug)).map(p=>[p.slug,p]));
test("Phase 12 describes six source-backed service capabilities with exactly three homepage highlights",()=>{
  assert.deepEqual(services.map(x=>x.id),["web","mobile","backend","data","fullstack","improvements"]);
  assert.equal(services.filter(x=>x.featured).length,3);
  for(const s of services){
    assert.ok(s.summary.length>40);
    assert.equal(s.capabilities.length,3);
    assert.ok(s.projects.length>=2);
    for(const slug of s.projects)assert.ok(published.has(slug),slug);
    for(const tech of s.technologies)assert.ok(s.projects.some(slug=>published.get(slug).technologies.includes(tech)),s.id+" "+tech);
    assert.ok(!Object.hasOwn(s,"price")&&!Object.hasOwn(s,"sales")&&!Object.hasOwn(s,"deliveryTime"));
  }
});
test("Service catalogs include matching localized titles, summaries and capabilities",()=>{
  const fa=JSON.parse(read("content/locales/fa-services.json"));
  const ps=JSON.parse(read("content/locales/ps-services.json"));
  for(const translation of [fa,ps]){
    assert.deepEqual(Object.keys(translation).sort(),services.map(s=>s.id).sort());
    for(const service of services){
      const row=translation[service.id];
      assert.ok(row.title.length>3);
      assert.ok(row.summary.length>35);
      assert.equal(row.capabilities.length,service.capabilities.length);
    }
  }
  const faui=JSON.parse(read("content/locales/fa-ui.json"));
  const psui=JSON.parse(read("content/locales/ps-ui.json"));
  assert.deepEqual(Object.keys(faui).sort(),Object.keys(psui).sort());
  for(const t of [faui,psui])for(const key of ["services","serviceTitle","serviceHeroTitle","servicePreviewNote","serviceContact","serviceNoPromises"])assert.ok(t[key]?.length>3,key);
});
test("Pages, project cases and public navigation use real routes",()=>{
 const home=read("app/page.tsx"),about=read("app/about/page.tsx"),routes=read("app/[locale]/[[...path]]/page.tsx"),locale=read("components/locale-public-pages.tsx"),page=read("components/services-section.tsx");
 assert.match(home,/<ServicesSection variant="preview"/);
 assert.match(about,/href="\/services"/);
 assert.match(locale,/<ServicesSection locale=\{locale\} variant="preview"/);
 assert.match(routes,/pathname === '\/services'/);
 assert.ok(page.includes('localizePath(locale,"/projects/"+project.slug)'));
 assert.ok(page.includes('localizePath(locale,"/services")'));
 assert.ok(page.includes('<section'));
 assert.ok(page.includes('<article'));
 assert.ok(page.includes('aria-labelledby={id + "-title"}'));
 assert.ok(read("components/site-header.tsx").includes('href: "/services"'));
 assert.ok(read("components/site-footer.tsx").includes('path("/services")'));
 assert.ok(read("app/sitemap.ts").includes('"/services"'));
 assert.ok(read("lib/i18n-core.mjs").includes("path === '/services'"));
 assert.ok(read("app/services/page.tsx").includes('createPageMetadata('));
 assert.ok(read("app/services/opengraph-image.tsx").includes('renderOgCard'));
});
test("Launch and locale approval gates remain closed",()=>{
 assert.equal(JSON.parse(read("content/launch-approval.json")).approvedForPublicLaunch,false);
 assert.equal(JSON.parse(read("content/locales/approval.json")).fa.ownerApproved,false);
 assert.equal(JSON.parse(read("content/locales/approval.json")).ps.ownerApproved,false);
 assert.ok(read("lib/i18n.ts").includes("englishServices"));
 assert.ok(read("scripts/check-locales.mjs").includes("read('content/services.json')"));
 const ui=read("components/services-section.tsx");
 assert.match(ui,/getPublicIdentity\(\)/);
 assert.match(ui,/!identity.email/);
 assert.doesNotMatch(ui,/\bmailto:[^'"]+@/);
});
test("Service layout maintains fluid typography, responsive screens, keyboard, RTL and motion preference",()=>{
 const css=read("styles/phase12.css");
 assert.ok(read("app/layout.tsx").includes('styles/phase12.css'));
 for(const token of ["--type-section","--type-page","--type-body","--type-small","--type-card","--border"])assert.ok(css.includes(token),token);
 assert.ok(css.includes("@media(max-width:1160px)"));
 assert.ok(css.includes("@media(max-width:800px)"));
 assert.ok(css.includes("@media(max-width:680px)"));
 assert.ok(css.includes("@media(prefers-reduced-motion:reduce)"));
 assert.ok(css.includes('html[dir="rtl"]'));
 assert.ok(css.includes(":focus-visible"));
 assert.ok(read("components/site-header.tsx").includes("window.innerWidth >= 1361"));
});
test("Service checker validates all supported projects and translation coverage",()=>{
 const result=execFileSync(process.execPath,["scripts/check-services.mjs"],{encoding:"utf8"});
 assert.match(result,/six evidence-backed areas/);
});
