import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const config=JSON.parse(read("content/now.json"));
const registry=JSON.parse(read("content/projects.json"));
const cases=JSON.parse(read("content/case-studies.json"));
const ongoing=new Map(registry.filter(p=>p.publicationStatus==="published"&&p.repoUrlVerified&&["concept","prototype","in_development","pilot"].includes(p.developmentStatus) && cases.some(c=>c.slug===p.slug)).map(p=>[p.slug,p]));
test("Phase 13 is an honest source-reviewed snapshot, not a live sprint feed",()=>{
  assert.equal(config.schemaVersion,1);
  assert.equal(config.context,"source_reviewed_portfolio_snapshot");
  assert.deepEqual(config.featuredProjects,["maktablink","futsal","dandanlink"]);
  assert.equal(config.learningGoals.length,0);
  for(const slug of config.featuredProjects)assert.ok(ongoing.has(slug),slug);
  for(const row of config.focusAreas){
    assert.ok(row.projectSlugs.length>=2);
    for(const slug of row.projectSlugs)assert.ok(ongoing.has(slug));
    for(const technology of row.technologies)assert.ok(row.projectSlugs.some(slug=>ongoing.get(slug).technologies.includes(technology)),technology);
  }
  assert.ok(!config.progressPercentage && !config.sprintDate && !config.commitCount);
});
test("Phase 13 projects, roadmap review notes and technical themes derive from published case evidence",()=>{
  const source=read("lib/now.ts");
  assert.ok(source.includes("getPublishedProjects()"));
  assert.ok(source.includes("getCaseStudy(project.slug)"));
  assert.ok(source.includes("sourceCheckedAt"));
  assert.ok(source.includes("translatedCase.nextSteps[0]"));
  assert.ok(source.includes("getDevelopmentLabel(project.developmentStatus)"));
  assert.ok(source.includes("ongoing.has(project.developmentStatus)"));
  assert.ok(source.includes("item.ownerApproved === true"));
});
test("Home preview, full interactive Now route and related case-study links are wired",()=>{
  const home=read("app/page.tsx"),about=read("app/about/page.tsx"),components=read("components/now-section.tsx");
  const explorer=read("components/now-explorer.tsx");
  assert.ok(home.includes("<NowPreview />"));
  assert.ok(about.includes('href="/now"'));
  assert.ok(components.includes('getFeaturedNowProjects(locale)'));
  assert.ok(components.includes('getNowProjects(locale)'));
  assert.ok(components.includes('getNowFocus(locale)'));
  assert.ok(components.includes('<NowExplorer'));
  assert.ok(components.includes('href={localizePath(locale,"/now")}'));
  assert.ok(components.includes('localizePath(locale,"/projects/"+project.slug)'));
  assert.ok(explorer.includes('useState("all")'));
  assert.ok(explorer.includes('type="search"'));
  assert.ok(explorer.includes("aria-pressed={domain===item.id}"));
  assert.ok(explorer.includes('role="status"'));
  assert.ok(explorer.includes("filtered.length ?"));
  assert.ok(explorer.includes('onClick={()=>{setSearch("");setDomain("all");}}'));
});
test("Now route is exposed safely in English and guarded in Dari/Pashto",()=>{
  const router=read("app/[locale]/[[...path]]/page.tsx");
  assert.ok(read("app/now/page.tsx").includes("createPageMetadata("));
  assert.ok(read("app/now/opengraph-image.tsx").includes("renderOgCard"));
  assert.ok(router.includes("pathname === '/now'"));
  assert.ok(router.includes("<NowPageView locale={locale}"));
  assert.ok(router.includes("localePubliclyVisible(locale)"));
  assert.ok(read("lib/i18n-core.mjs").includes("path === '/now'"));
  assert.ok(read("components/site-footer.tsx").includes('path("/now")'));
  assert.ok(read("components/site-header.tsx").includes('href: "/now"'));
  assert.ok(read("app/sitemap.ts").includes('"/now"'));
  assert.ok(read("components/locale-public-pages.tsx").includes('<NowPreview locale={locale}'));
  assert.ok(read("lib/i18n.ts").includes("englishNow"));
  assert.ok(read("scripts/check-locales.mjs").includes("read('content/now.json')"));
  for(const locale of ["fa","ps"]){
    const labels=JSON.parse(read("content/locales/"+locale+"-ui.json"));
    for(const k of ["now","nowHeroTitle","nowPreviewIntro","nowNextCheck","nowNoPercentage","nowSearchLabel"])assert.ok(labels[k]?.length>=2,k);
    const focus=JSON.parse(read("content/locales/"+locale+"-now.json"));
    assert.deepEqual(Object.keys(focus),["interfaces","mobile","systems"]);
  }
  assert.equal(JSON.parse(read("content/locales/approval.json")).fa.ownerApproved,false);
  assert.equal(JSON.parse(read("content/launch-approval.json")).approvedForPublicLaunch,false);
});
test("Now UI is responsive, accessible and follows the existing typography and color systems",()=>{
  const css=read("styles/phase13.css");
  assert.ok(read("app/layout.tsx").includes("styles/phase13.css"));
  for(const token of ["--type-page","--type-section","--type-body","--type-small","--type-card","--border"])assert.ok(css.includes(token),token);
  for(const marker of ["@media(max-width:1100px)","@media(max-width:800px)","@media(max-width:680px)","@media(prefers-reduced-motion:reduce)",'html[dir="rtl"]',":focus-visible"])assert.ok(css.includes(marker),marker);
  assert.ok(read("components/site-header.tsx").includes("window.innerWidth >= 1601"));
  assert.ok(read("styles/phase12.css").includes("@media(min-width:1051px) and (max-width:1500px)"));
  assert.ok(!css.includes("https://"));
});
test("Content checker validates supported projects, translated focus areas and goals",()=>{
  const output=execFileSync(process.execPath,["scripts/check-now.mjs"],{encoding:"utf8"});
  assert.match(output,/no invented activity metrics/);
});
