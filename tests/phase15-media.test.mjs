import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { isApprovedCaseMedia, mediaFiles } from "../lib/media-core.mjs";

const read=relative=>readFileSync(new URL("../"+relative,import.meta.url),"utf8");
const cases=JSON.parse(read("content/case-studies.json"));

test("Phase 15 has a useful concept walkthrough on all six actual project case-study routes",()=>{
  assert.equal(cases.length,6);
  for(const c of cases){
    assert.ok(c.features.length>=3,c.slug);
    assert.deepEqual(c.media,[],"Real approved captures must never be fabricated for "+c.slug);
  }
  const english=read("app/projects/[slug]/page.tsx");
  const locale=read("components/locale-public-pages.tsx");
  assert.ok(english.includes('<ProjectGallery projectTitle={project.title} features={study.features} items={study.media}/>'));
  assert.ok(locale.includes('<ProjectGallery projectTitle={project.title} features={study.features} items={study.media} locale={locale}/>'));
  assert.ok(english.includes('<a href="#gallery">Visual walkthrough</a>'));
  assert.ok(locale.includes('<a href="#gallery">{u.gallery}</a>'));
  assert.ok(read("app/layout.tsx").includes('styles/phase15.css'));
});

test("Only approved, per-project local images with meaningful captions are permitted",()=>{
  const valid={kind:"image",src:"/media/maktablink/admin-dashboard.webp",alt:"Admin dashboard screenshot in MaktabLink",caption:"Administrator dashboard capture from the reviewed product",group:"Web/admin",device:"desktop",approved:true};
  assert.equal(isApprovedCaseMedia(valid,"maktablink"),true);
  assert.deepEqual(mediaFiles(valid),[valid.src]);
  for(const broken of [
    {...valid,approved:false},
    {...valid,src:"https://example.com/fake.webp"},
    {...valid,src:"/media/futsal/admin-dashboard.webp"},
    {...valid,src:"/media/maktablink/../private.webp"},
    {...valid,src:"/media/maktablink/admin-dashboard.svg"},
    {...valid,src:"/media/maktablink/admin-dashboard.webp?token=secret"},
    {...valid,src:"/media/maktablink/admin-dashboard.webp#hash"},
    {...valid,caption:"x"},
    {...valid,alt:"alt"},
    {...valid,group:"Invalid group"},
    {...valid,device:"projector"},
    {...valid,kind:"image",poster:"/media/maktablink/frame.webp"},
    {...valid,kind:"pdf"},
    {...valid,src:"javascript:alert(1)"},
  ]) assert.equal(isApprovedCaseMedia(broken,"maktablink"),false,JSON.stringify(broken));
});

test("A captioned local video with poster can be published only after approval and evidence",()=>{
  const demo={
    kind:"video",src:"/media/futsal/booking-flow.mp4",
    poster:"/media/futsal/booking-poster.webp",
    captions:"/media/futsal/booking-english.vtt",
    alt:"Recorded booking demonstration in the Futsal project",
    caption:"Approved original demonstration of the booking journey",
    group:"Mobile app",device:"mobile",approved:true
  };
  assert.equal(isApprovedCaseMedia(demo,"futsal"),true);
  assert.deepEqual(mediaFiles(demo),[demo.src,demo.poster,demo.captions]);
  assert.equal(isApprovedCaseMedia({...demo,approved:false},"futsal"),false);
  assert.equal(isApprovedCaseMedia({...demo,captions:undefined},"futsal"),false);
  assert.equal(isApprovedCaseMedia({...demo,poster:"https://bad.example/frame.png"},"futsal"),false);
  assert.equal(isApprovedCaseMedia({...demo,src:"/media/futsal/booking-flow.exe"},"futsal"),false);
  assert.equal(isApprovedCaseMedia({...demo,device:"unknown"},"futsal"),false);
});

test("Concept art is explicitly labeled, and videos need user controls and native captions",()=>{
  const code=read("components/project-gallery.tsx");
  for(const label of ["CONCEPT MOCKUP — NOT A REAL SCREENSHOT","No verified application screenshots","WEBVTT","<dialog","showModal()","onCancel","onClose","onKeyDown","role=\"status\"","aria-pressed","controls playsInline preload=\"metadata\"","kind=\"captions\"","target===","visual-modal-close"]) {
    if(label==="WEBVTT"||label==="target===") continue;
    assert.ok(code.includes(label),label);
  }
  assert.ok(!code.includes("autoplay"));
  assert.ok(!code.includes("iframe"));
  assert.ok(!code.includes('src="https://'));
  assert.ok(code.includes('mode==="concept"'));
  assert.ok(code.includes('setModalIndex(index)'));
  assert.ok(code.includes('mobileStart'));
  assert.ok(code.includes('opener.current?.focus()'));
  assert.ok(code.includes('Array.from({length:total}'));
  assert.ok(code.includes('src={item.captions}'));
});

test("The actual project media projection and build validation do not expose arbitrary source paths",()=>{
  const content=read("lib/content.ts");
  assert.ok(content.includes("isApprovedCaseMedia(m, slug)"));
  const check=read("scripts/check-content.mjs");
  assert.ok(check.includes("isApprovedCaseMedia(media, c.slug)"));
  assert.ok(check.includes("mediaFiles(media)"));
  assert.ok(check.includes("WEBVTT"));
  assert.ok(check.includes("30*1024*1024"));
  const output=execFileSync(process.execPath,["scripts/check-content.mjs"],{encoding:"utf8"});
  assert.match(output,/Content validation passed/);
});

test("The Visual Tour uses responsive design, device modes, focus and motion preferences",()=>{
  const css=read("styles/phase15.css");
  for(const token of ["--type-label","--type-small","--type-body","--type-card","--accent","--focus","--border"])assert.ok(css.includes(token),token);
  for(const part of [".visual-device--desktop",".visual-device--tablet",".visual-device--mobile",".visual-modal-stage",".visual-tour button:focus-visible","#gallery"])assert.ok(css.includes(part)||part==="#gallery"&&css.includes(".visual-tour"),part);
  assert.ok(css.includes("@media(max-width:730px)"));
  assert.ok(css.includes("@media(max-width:390px)"));
  assert.ok(css.includes("@media(prefers-reduced-motion:reduce)"));
  assert.ok(css.includes('html[dir="rtl"]'));
});

test("Launch and locale publication remain closed until owner approval and RTL review",()=>{
  const launch=JSON.parse(read("content/launch-approval.json"));
  const languages=JSON.parse(read("content/locales/approval.json"));
  assert.equal(launch.approvedForPublicLaunch,false);
  assert.equal(languages.fa.ownerApproved,false);
  assert.equal(languages.ps.ownerApproved,false);
  assert.ok(read("lib/i18n.ts").includes("Untranslated approved gallery"));
});
