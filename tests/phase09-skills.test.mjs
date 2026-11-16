import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = p => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const projects = JSON.parse(read("content/projects.json"));
const declared = new Set(projects.filter(p => p.publicationStatus === "published" && p.repoUrlVerified).flatMap(p => p.technologies));

test("Phase 09 categories use actual project technologies and distinguish site delivery", () => {
  const source = read("lib/skills.ts");
  for (const id of ["frontend","mobile","backend","database","language","delivery"]) assert.ok(source.includes('id: "'+id+'"'),id);
  for (const name of ["Next.js","React Native","Expo","Fastify","Express","PostgreSQL","Drizzle","TypeScript"]) assert.ok(declared.has(name),name);
  assert.match(source,/evidence\.has\(tech\)/);
  assert.match(source,/getPublishedProjects\(\)/);
  assert.match(source,/PORTFOLIO_SOURCE_URL/);
  assert.ok(!source.includes("skillScore"));
});

test("Phase 09 is present in English, Dari and Pashto Home and About", () => {
  const home=read("app/page.tsx"), about=read("app/about/page.tsx"), localized=read("components/locale-public-pages.tsx");
  assert.ok(home.includes('<SkillsSection variant="home"'));
  assert.ok(about.includes('<SkillsSection locale="en" variant="about"'));
  assert.ok(localized.includes('<SkillsSection locale={locale} variant="home"'));
  assert.ok(localized.includes('<SkillsSection locale={locale} variant="about"'));
  assert.ok(read("components/site-header.tsx").includes('href: "/#skills"'));
  assert.ok(read("components/site-footer.tsx").includes('path("/#skills")'));
});

test("Evidence controls link to real case studies or portfolio source", () => {
  const component=read("components/skills-section.tsx");
  assert.ok(component.includes('getSkillGroups().map'));
  assert.ok(component.includes('group.examples.map'));
  assert.ok(component.includes('"/projects/" + project.slug'));
  assert.ok(component.includes('PORTFOLIO_SOURCE_URL'));
  assert.ok(component.includes('target="_blank" rel="noopener noreferrer"'));
  assert.ok(component.includes('aria-labelledby={id + "-title"}'));
});

test("Translations do not override pending release or locale approval gates", () => {
  const fa=JSON.parse(read("content/locales/fa-ui.json"));
  const ps=JSON.parse(read("content/locales/ps-ui.json"));
  assert.deepEqual(Object.keys(fa).sort(),Object.keys(ps).sort());
  for (const t of [fa,ps]) for (const key of ["skills","skillsSectionLabel","skillsHeadline","skillsIntro","skillsDelivery","skillsDisclaimer"]) assert.ok(t[key]?.length>2,key);
  const approval=JSON.parse(read("content/locales/approval.json"));
  assert.equal(approval.fa.ownerApproved,false);
  assert.equal(approval.ps.ownerApproved,false);
  assert.equal(JSON.parse(read("content/launch-approval.json")).approvedForPublicLaunch,false);
});

test("Skill cards use semantic type, theme, RTL and reduced-motion rules", () => {
  const css=read("styles/phase09.css");
  assert.ok(read("app/layout.tsx").includes('styles/phase09.css'));
  for (const token of ["--type-section","--type-body","--type-small","--type-label","--text-muted","--border"]) assert.ok(css.includes(token),token);
  assert.match(css,/@media \(max-width:1050px\)/);
  assert.match(css,/@media \(max-width:720px\)/);
  assert.match(css,/@media \(prefers-reduced-motion:reduce\)/);
  assert.match(css,/html\[dir="rtl"\]/);
  assert.ok(css.includes(':focus-within'));
  assert.doesNotMatch(css,/https?:\/\//);
});
