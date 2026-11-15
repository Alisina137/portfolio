import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname,'..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const cases = JSON.parse(read('content/case-studies.json'));

test('premium project storytelling is available on English and full Dari/Pashto case routes', () => {
  const english = read('app/projects/[slug]/page.tsx');
  const localized = read('components/locale-public-pages.tsx');
  for (const txt of [english,localized]) {
    assert.match(txt,/FeatureShowcase/);
    assert.match(txt,/projectSlug=\{project.slug\}/);
    assert.match(txt,/features=\{study.features\}/);
  }
  assert.match(localized,/locale=\{locale\}/);
  assert.match(localized,/conceptualLabel=\{u.notScreenshot\}/);
});

test('case-study concepts never impersonate captured application screenshots', () => {
  const comp=read('components/feature-showcase.tsx');
  assert.match(comp,/not an app screenshot/);
  assert.match(comp,/approvedShot/);
  assert.match(comp,/locale === "en" \? feature.screenshot : undefined/);
  assert.match(comp,/src=\{approvedShot.src\}/);
  assert.match(comp,/aria-label/);
  assert.match(read('lib/content.ts'),/approved: true/);
  for(const caseStudy of cases) {
    assert.ok(caseStudy.features.length>=3,caseStudy.slug);
    assert.ok(caseStudy.features.every(f=>!f.screenshot),`No unapproved sample image should be treated as authentic in ${caseStudy.slug}`);
  }
});

test('premium styling is locally self-contained, responsive, RTL-aware and reduced-motion safe', () => {
  const css=read('styles/premium.css');
  assert.match(read('app/layout.tsx'),/styles\/premium.css/);
  for(const selector of ['.feature-row--reverse','.feature-scene-glass','.hero-art-crystal','html[dir="rtl"]','.feature-flow-connector']) assert.ok(css.includes(selector),selector);
  assert.match(css,/@media\(max-width:850px\)/);
  assert.match(css,/@media\(max-width:550px\)/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.doesNotMatch(css,/https?:\/\//);
  assert.ok(read('app/page.tsx').includes('hero-art-crystal'));
});

test('feature visual types use only illustrated labels and technical anchors are real',()=>{
  const comp=read('components/feature-showcase.tsx');
  for (const slug of ['maktablink','futsal','bazaarlink','amlaklink','dandanlink','kankorprep']) assert.match(comp,new RegExp(slug+':'));
  assert.match(comp,/href="#technical"/);
  assert.match(read('app/projects/[slug]/page.tsx'),/id="technical"/);
  assert.match(read('components/locale-public-pages.tsx'),/id="technical"/);
  assert.match(comp,/type Props =/);
});
