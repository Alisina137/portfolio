import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
const config=JSON.parse(read("content/repositories.json"));
const published=JSON.parse(read("content/projects.json")).filter(p=>p.publicationStatus==="published"&&p.repoUrlVerified);
const cases=new Set(JSON.parse(read("content/case-studies.json")).map(c=>c.slug));

test("Phase 14 features only verified public GitHub project repositories, not invented metrics",()=>{
  assert.equal(config.context,"verified_public_repository_links");
  assert.equal(config.schemaVersion,1);
  assert.equal(config.verifiedOn,"2026-11-16");
  assert.equal(config.repositories.length,7);
  assert.deepEqual(config.featured,["maktablink","futsal","dandanlink"]);
  for(const r of config.repositories){
    assert.match(r.repository,/^Alisina137\/[\w.-]+$/);
    assert.equal(r.defaultBranch,"main");
    assert.equal(r.language,"TypeScript");
    if(r.slug==="portfolio"){assert.equal(r.repository,"Alisina137/portfolio");continue;}
    const p=published.find(p=>p.slug===r.slug);
    assert.ok(p, r.slug);
    assert.ok(cases.has(r.slug),r.slug);
    assert.equal(p.repoUrl,"https://github.com/"+r.repository);
    assert.ok(p.technologies.length);
  }
  for(const r of config.repositories)for(const key of ["stars","forks","latestCommit","lastPushed","currentSprint","completionPercent"])assert.ok(!Object.hasOwn(r,key),key);
});

test("Server repository projection safeguards publication and keeps URLs tied to case evidence",()=>{
  const code=read("lib/repositories.ts");
  for(const fragment of ["getPublishedProjects()","getCaseStudy(p.slug)","project?.repoUrlVerified","project.repoUrl!==url","getDevelopmentLabel","getTranslatedProject","getFeaturedRepositories","records.verifiedOn","publicRepoPattern"])assert.ok(code.includes(fragment),fragment);
  assert.doesNotMatch(code,/stargazers_count|forks_count|contributors_count|latest_commit|latestCommit/);
});

test("Home preview and dedicated interactive repository directory provide meaningful links",()=>{
  const home=read("app/page.tsx");
  const local=read("components/locale-public-pages.tsx");
  const section=read("components/repositories-section.tsx");
  const explorer=read("components/repository-explorer.tsx");
  assert.ok(home.includes("<RepositoriesPreview />"));
  assert.ok(local.includes("<RepositoriesPreview locale={locale} />"));
  assert.ok(read("app/repositories/page.tsx").includes("<RepositoriesPageView"));
  for(const snippet of ["getFeaturedRepositories(locale)","getRepositories(locale)","RepositoryExplorer","RepositoryGrid","localizePath(locale,\"/repositories\")"])assert.ok(section.includes(snippet),snippet);
  for(const snippet of ["useState","useMemo","type=\"search\"","aria-pressed","aria-live=\"polite\"","role=\"status\"","role=\"status\"","setKind(\"all\")","target=\"_blank\" rel=\"noopener noreferrer\"","localizePath(locale,\"/projects/\"+repo.projectSlug)"])assert.ok(explorer.includes(snippet),snippet);
  assert.ok(read("components/site-header.tsx").includes('href: "/repositories"'));
  assert.ok(read("components/site-footer.tsx").includes('path("/repositories")'));
  assert.ok(read("app/about/page.tsx").includes('href="/repositories"'));
});

test("GitHub route is localized and SEO/sitemap follow preexisting approval safeguards",()=>{
  const route=read("app/[locale]/[[...path]]/page.tsx");
  assert.ok(route.includes("pathname === '/repositories'"));
  assert.ok(route.includes("localePubliclyVisible(locale)"));
  assert.ok(route.includes("translationsOwnerApproved(locale)"));
  assert.ok(read("lib/i18n-core.mjs").includes("path === '/repositories'"));
  assert.ok(read("lib/i18n.ts").includes("englishRepositories"));
  assert.ok(read("app/sitemap.ts").includes('"/repositories"'));
  assert.ok(read("app/repositories/page.tsx").includes("createPageMetadata("));
  assert.ok(read("app/repositories/opengraph-image.tsx").includes("renderOgCard("));
  assert.equal(JSON.parse(read("content/launch-approval.json")).approvedForPublicLaunch,false);
  assert.equal(JSON.parse(read("content/locales/approval.json")).fa.ownerApproved,false);
  assert.equal(JSON.parse(read("content/locales/approval.json")).ps.ownerApproved,false);
});

test("Dari/Pashto draft labels are complete and never automatically approved",()=>{
  const fa=JSON.parse(read("content/locales/fa-ui.json")),ps=JSON.parse(read("content/locales/ps-ui.json"));
  assert.deepEqual(Object.keys(fa).sort(),Object.keys(ps).sort());
  for(const t of [fa,ps])for(const key of ["repositories","repoPreviewIntro","repoHeroTitle","repoOpen","repoCase","repoSearch","repoCount","repoNoMetrics","repoSiteDescription"])assert.ok(typeof t[key]==="string"&&t[key].length>=4,key);
  assert.ok(read("scripts/check-locales.mjs").includes("read('content/repositories.json')"));
  assert.ok(read("lib/i18n.ts").includes("englishRepositories"));
});

test("Repository cards are responsive, readable, keyboard-operable and reduced-motion aware",()=>{
  const css=read("styles/phase14.css");
  assert.ok(read("app/layout.tsx").includes('styles/phase14.css'));
  for(const token of ["--type-section","--type-page","--type-body","--type-small","--type-card","--border","--focus"])assert.ok(css.includes(token),token);
  for(const media of ["@media(max-width:1170px)","@media(max-width:800px)","@media(max-width:680px)","@media(prefers-reduced-motion:reduce)"])assert.ok(css.includes(media),media);
  assert.ok(css.includes('html[dir="rtl"]'));
  assert.ok(css.includes("overscroll-behavior:contain"));
  assert.ok(css.includes(":focus-visible"));
  assert.ok(read("components/site-header.tsx").includes("window.innerWidth >= 1721"));
});

test("Repository content checker enforces full evidence coverage",()=>{
  const stdout=execFileSync(process.execPath,["scripts/check-repositories.mjs"],{encoding:"utf8"});
  assert.match(stdout,/seven source-reviewed repositories/);
});
