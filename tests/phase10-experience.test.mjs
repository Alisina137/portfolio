import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8");
const registry = JSON.parse(read("content/projects.json"));
const studies = JSON.parse(read("content/case-studies.json"));
const experience = JSON.parse(read("content/experience.json"));
const live = new Set(registry.filter(p => p.publicationStatus === "published" && p.repoUrlVerified).map(p => p.slug));

test("Phase 10 uses real reviewed projects, without invented dated employment", () => {
  assert.equal(experience.schemaVersion, 1);
  assert.equal(experience.presentation, "curated_project_sequence_not_chronological");
  assert.deepEqual(experience.formalRoles, []);
  assert.deepEqual(experience.independentWork.featured, ["maktablink","futsal","dandanlink"]);
  assert.equal(experience.independentWork.selected.length, 6);
  for (const [key, slugs] of Object.entries(experience.independentWork)) {
    assert.equal(new Set(slugs).size, slugs.length, key);
    for (const slug of slugs) {
      assert.ok(live.has(slug), slug + " requires published source-backed project");
      assert.ok(studies.some(item => item.slug === slug), slug + " has a real case study");
    }
  }
  assert.equal(experience.formalRoles.length, 0);
});

test("Professional employment is owner-gated; portfolio project dates are not fabricated", () => {
  const source=read("lib/experience.ts");
  assert.ok(source.includes("ownerApproved === true"));
  assert.ok(source.includes("Array.isArray(role.responsibilities)"));
  assert.ok(source.includes("Array.isArray(role.technologies)"));
  assert.ok(source.includes("validDate(role.startDate)"));
  assert.ok(source.includes("validDate(role.endDate)"));
  assert.ok(source.includes("getPublishedProjects()"));
  assert.ok(source.includes("getCaseStudy(slug)"));
  assert.doesNotMatch(source, /fake-employer|2024.*2026|yearsOfExperience/i);
});

test("Home/linked About pages show a real experience timeline and working native details", () => {
  const home = read("app/page.tsx");
  const about = read("app/about/page.tsx");
  const translated = read("components/locale-public-pages.tsx");
  assert.ok(home.includes('<ExperienceTimeline variant="home"'));
  assert.ok(about.includes('<ExperienceTimeline locale="en" variant="about"'));
  assert.ok(translated.includes('<ExperienceTimeline locale={locale} variant="home"'));
  assert.ok(translated.includes('<ExperienceTimeline locale={locale} variant="about"'));
  const ui=read("components/experience-timeline.tsx");
  for(const txt of ['<details','<summary','<ol','<h3','getApprovedEmployment()', 'getIndependentWork(locale, variant)','caseStudy.features.slice', 'caseStudy.technicalNotes.slice','"experience-about"','"experience"']) {
    assert.ok(ui.includes(txt), txt);
  }
  assert.ok(ui.includes('localizePath(locale, "/projects/" + project.slug)'));
  assert.ok(ui.includes('localizePath(locale,"/about")+"#experience-about"'));
  assert.ok(read("components/site-header.tsx").includes('href: "/#experience"'));
  assert.ok(read("components/site-footer.tsx").includes('path("/#experience")'));
});

test("Experience translations retain strict pending release gates and track new source records", () => {
  const fa=JSON.parse(read("content/locales/fa-ui.json"));
  const ps=JSON.parse(read("content/locales/ps-ui.json"));
  assert.deepEqual(Object.keys(fa).sort(), Object.keys(ps).sort());
  for (const language of [fa,ps]) for (const key of ["experience", "experienceIntro", "experienceExpand", "experienceFootnote","experienceMore","experienceFormalCurrent","experienceStage"]) {
    assert.ok(language[key]?.length>2, key);
  }
  assert.ok(read("lib/i18n.ts").includes("englishExperience"));
  assert.ok(read("scripts/check-locales.mjs").includes("read('content/experience.json')"));
  assert.equal(JSON.parse(read("content/locales/approval.json")).fa.ownerApproved,false);
  assert.equal(JSON.parse(read("content/locales/approval.json")).ps.ownerApproved,false);
  assert.equal(JSON.parse(read("content/launch-approval.json")).approvedForPublicLaunch,false);
});

test("Experience design is responsive, keyboard accessible and preserves reduced motion", () => {
  const css=read("styles/phase10.css");
  assert.ok(read("app/layout.tsx").includes('styles/phase10.css'));
  for(const token of ["--type-section","--type-body","--type-label","--text-muted","--border","--focus"]) assert.ok(css.includes(token),token);
  assert.ok(css.includes(".experience-details summary:focus-visible"));
  assert.ok(css.includes("html[dir=\"rtl\"]"));
  assert.ok(css.includes("@media (max-width:550px)"));
  assert.ok(css.includes("@media (max-width:800px)"));
  assert.ok(css.includes("@media (prefers-reduced-motion:reduce)"));
  assert.ok(css.includes("@media (min-width:768px) and (max-width:1050px)"));
  // Phase 13 adds a Now nav entry, so compact-menu threshold moves to 1501px.
  assert.ok(read("components/site-header.tsx").includes("window.innerWidth >= 1721"));
  assert.ok(read("styles/phase12.css").includes("@media(min-width:1051px) and (max-width:1500px)"));
  assert.doesNotMatch(css, /https?:\/\//);
});
