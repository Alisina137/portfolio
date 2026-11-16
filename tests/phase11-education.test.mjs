import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { selectPublicEducation, selectPublicCertificates, selectPublicTraining, isSafeCredentialUrl } from "../lib/qualifications-core.mjs";

const read = filename => readFileSync(new URL("../" + filename, import.meta.url), "utf8");
const credentials = JSON.parse(read("content/qualifications.json"));
const published = new Set(JSON.parse(read("content/projects.json")).filter(p => p.publicationStatus === "published" && p.repoUrlVerified).map(p => p.slug));

test("Phase 11 stores no unapproved personal education or certification details", () => {
  assert.equal(credentials.schemaVersion, 1);
  assert.deepEqual(credentials.education, []);
  assert.deepEqual(credentials.certifications, []);
  assert.deepEqual(credentials.training, []);
  assert.deepEqual(credentials.independentLearningProjects, ["maktablink","kankorprep"]);
  for (const slug of credentials.independentLearningProjects) assert.ok(published.has(slug),slug);
  assert.equal(JSON.parse(read("content/profile.json")).educationApproved,false);
});

test("Education is hidden without both owner approval and document review", () => {
  const approved = {
    id:"university-record", title:"A verified degree", institution:"Reviewed institution",
    field:"Information Technology",startYear:2019,endYear:2023,
    academicProjects:["maktablink"],ownerApproved:true,documentReviewed:true
  };
  const input = {education:[
    {...approved, ownerApproved:false},
    {...approved, id:"missing-review", documentReviewed:false},
    {...approved, id:"bad-year", startYear:2024,endYear:2020},
    {...approved, id:"injection", academicProjects:["javascript:alert(1)"]},
    approved
  ]};
  assert.deepEqual(selectPublicEducation(input).map(item=>item.id),["university-record"]);
  assert.deepEqual(selectPublicEducation({education:[]}),[]);
  assert.deepEqual(selectPublicEducation({education:"not-an-array"}),[]);
});

test("Certificates and training fail closed and unsafe links never surface", () => {
  const certificate = { id:"cert-one",title:"Reviewed course certificate",issuer:"Example training institution", issuedOn:"2026-10",ownerApproved:true,documentReviewed:true };
  assert.equal(isSafeCredentialUrl("https://example.org/credentials/one"),true);
  for (const url of ["javascript:alert(1)","http://example.org","https://user:pass@example.org","https://example.org:8080"]) assert.equal(isSafeCredentialUrl(url),false,url);
  const certs={certifications:[
    {...certificate,documentReviewed:false},
    {...certificate,id:"bad-link",credentialUrl:"javascript:alert(1)"},
    {...certificate,id:"bad-date",issuedOn:"2026-22"},
    certificate
  ]};
  assert.deepEqual(selectPublicCertificates(certs).map(item=>item.id),["cert-one"]);
  const training={training:[
    {id:"training-one",title:"Completed training example",provider:"Reviewed provider",ownerApproved:true,documentReviewed:true},
    {id:"no-review",title:"Unreviewed training",provider:"Sample provider",ownerApproved:false,documentReviewed:true}
  ]};
  assert.deepEqual(selectPublicTraining(training).map(item=>item.id),["training-one"]);
});

test("Education is visible on English and localized Home and About with correct anchors", () => {
  const home=read("app/page.tsx"),about=read("app/about/page.tsx"),intl=read("components/locale-public-pages.tsx");
  assert.ok(home.includes('<EducationSection variant="home"'));
  assert.ok(about.includes('<EducationSection locale="en" variant="about"'));
  assert.ok(intl.includes('<EducationSection locale={locale} variant="home"'));
  assert.ok(intl.includes('<EducationSection locale={locale} variant="about"'));
  const ui=read("components/education-section.tsx");
  for (const expected of ['<section','<article','<ol','<ul','localizePath(locale, "/projects/" + project.slug)','variant === "home"','getPublicQualifications()','getReviewedAcademicProjects']) assert.ok(ui.includes(expected),expected);
  assert.ok(read("components/site-footer.tsx").includes('path("/about") + "#education"'));
  assert.ok(!about.includes('className="about-education"'));
});

test("Draft translations and required publication gates are retained", () => {
  const fa=JSON.parse(read("content/locales/fa-ui.json"));
  const ps=JSON.parse(read("content/locales/ps-ui.json"));
  assert.deepEqual(Object.keys(fa).sort(),Object.keys(ps).sort());
  for (const t of [fa,ps]) for (const key of ["qualHeading","qualEducationPending","qualCertificationsPending","qualTrainingPending","qualPracticeTitle","qualDisclaimer","qualYearSeparator"]) assert.ok(t[key].length>1,key);
  assert.ok(read("lib/i18n.ts").includes("englishQualifications"));
  assert.ok(read("scripts/check-locales.mjs").includes("read('content/qualifications.json')"));
  assert.equal(JSON.parse(read("content/locales/approval.json")).fa.ownerApproved,false);
  assert.equal(JSON.parse(read("content/launch-approval.json")).approvedForPublicLaunch,false);
});

test("Phase 11 visual system respects fluid type, screen sizes, RTL and reduced motion", () => {
  const css=read("styles/phase11.css");
  assert.ok(read("app/layout.tsx").includes('styles/phase11.css'));
  for (const token of ["--type-section","--type-body","--type-small","--type-card","--border"]) assert.ok(css.includes(token),token);
  assert.ok(css.includes("@media(max-width:1080px)"));
  assert.ok(css.includes("@media(max-width:720px)"));
  assert.ok(css.includes("@media(prefers-reduced-motion:reduce)"));
  assert.ok(css.includes('html[dir="rtl"]'));
  assert.ok(css.includes(":focus-visible"));
  assert.doesNotMatch(css,/https?:\/\//);
});
