import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import { localeFromPath, stripLocale, localizePath, supportedPublicPath, localeApproved, localeVisible, localeSwitchHref } from '../lib/i18n-core.mjs';
const src=(path)=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const json=(path)=>JSON.parse(src(path));
const review=json('content/locales/approval.json');

test('P07 locale route paths are stable, reversible and isolated from Studio',()=>{
  assert.equal(localeFromPath('/fa/projects/maktablink'),'fa');
  assert.equal(localeFromPath('/ps/contact'),'ps');
  assert.equal(localeFromPath('/studio'),'en');
  assert.equal(stripLocale('/fa/projects?category=Education'),'/projects?category=Education');
  assert.equal(localizePath('fa','/projects/maktablink'),'/fa/projects/maktablink');
  assert.equal(localizePath('en','/ps/about'),'/about');
  assert.equal(localeSwitchHref('/fa/projects/maktablink','ps','?back=q%3Dschool'),'/ps/projects/maktablink?back=q%3Dschool');
  assert.equal(supportedPublicPath('/studio'),false);
  assert.equal(supportedPublicPath('/projects/maktablink'),true);
  assert.equal(supportedPublicPath('/writing/published-article'),true);
});
test('P07 unreviewed locales never become public just because files exist',()=>{
  for(const locale of ['fa','ps']) {
    assert.equal(localeApproved(locale,review,'fake-fingerprint'),false);
    assert.equal(localeVisible(locale,review,'fake',{dev:false,preview:true}),false);
    assert.equal(localeVisible(locale,review,'fake',{dev:true,preview:false}),false);
    assert.equal(localeVisible(locale,review,'fake',{dev:true,preview:true}),true);
  }
});
test('P07 owner approval and source integrity cannot be bypassed',()=>{
  const record={fa:{ownerApproved:true,rtlQaPassed:true,sourceFingerprint:'expected'}};
  assert.equal(localeApproved('fa',record,'wrong'),false);
  assert.equal(localeApproved('fa',record,'expected',true,false),false);
  assert.equal(localeApproved('fa',record,'expected',false,false),true);
});
test('P07 Dari and Pashto translate all source-backed project sections and page labels',()=>{
  const en=json('content/case-studies.json');
  const originalProjects=json('content/projects.json');
  const fa=json('content/locales/fa-projects.json');
  const ps=json('content/locales/ps-projects.json');
  const uiFa=json('content/locales/fa-ui.json');
  const uiPs=json('content/locales/ps-ui.json');
  assert.deepEqual(Object.keys(uiFa).sort(),Object.keys(uiPs).sort());
  assert.ok(Object.keys(uiFa).length>200);
  for(const c of en){
    for(const translations of [fa,ps]){
      const caseCopy=translations[c.slug];
      assert.ok(caseCopy,'Missing translated case');
      for(const key of ['problem','features','technicalNotes','tradeoffs','nextSteps']) assert.equal(caseCopy[key].length,c[key].length,`${c.slug} ${key}`);
      assert.notEqual(caseCopy.oneLiner,originalProjects.find(p=>p.slug===c.slug).oneLiner);
      assert.ok(caseCopy.currentState.length>40);
    }
  }
});
test('P07 SEO and page gates retain no-index publication guard',()=>{
  const metadata=src('app/[locale]/[[...path]]/page.tsx');
  assert.match(metadata,/translationsOwnerApproved\(locale\)/);
  assert.match(metadata,/localePubliclyVisible\(locale\)/);
  assert.match(metadata,/Writing stays hidden/);
  assert.match(src('app/sitemap.ts'),/filter\(translationsOwnerApproved\)/);
  assert.match(src('lib/seo.ts'),/available\.length && origin/);
  assert.match(src('app/layout.tsx'),/dir=\{locale === "en" \? "ltr" : "rtl"\}/);
  assert.match(src('proxy.ts'),/x-portfolio-locale/);
  assert.match(src('components/locale-document.tsx'),/portfolio-language=/);
});
test('P07 navigation switches exact route without stripping filters and uses scoped active state',()=>{
  const header=src('components/site-header.tsx');
  assert.match(header,/window\.location\.search/);
  assert.match(header,/pathname === item\.href/);
  assert.match(header,/availableLocales\.length > 1/);
  assert.match(src('components/locale-catalog-explorer.tsx'),/localizePath\(locale,caseHref/);
});
