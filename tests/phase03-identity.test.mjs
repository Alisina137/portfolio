import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
const require = createRequire(import.meta.url);
let ts;
try { ts = require('typescript'); } catch { ts = require(path.join(execFileSync('npm',['root','-g'],{encoding:'utf8'}).trim(),'typescript')); }
const read=(p)=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
const profile=JSON.parse(read('../content/profile.json'));
const source=read('../lib/public-identity-core.ts');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const outputs={};
vm.runInNewContext(compiled,{exports:outputs,URL,console},{filename:'public-identity-core.js'});
const { resolvePublicIdentity, isValidPublicEmail }=outputs;
const base={...profile};

test('P03 no unapproved email, education, LinkedIn, résumé or contact detail leaks to public projection',()=>{
  const data=resolvePublicIdentity({...base,publicEmail:'private@example.com',publicEmailApproved:false,
    education:'Unverified award',educationApproved:false,linkedInUrl:'https://www.linkedin.com/in/example',linkedInApproved:false,
    resumeUrl:'/resume.pdf',resumeApproved:false},true);
  assert.equal(data.email,null);assert.equal(data.education,null);assert.equal(data.linkedIn,null);assert.equal(data.resume,null);
  assert.equal(data.github,'https://github.com/Alisina137');
  assert.equal(profile.publicEmail,null);
});

test('P03 approved and valid contact address is exposed; invalid, unapproved and unsafe values are not',()=>{
  for(const value of ['', 'not-an-email', 'a@', 'a b@example.com','<script>@example.com']) {
    assert.equal(isValidPublicEmail(value),false);
    assert.equal(resolvePublicIdentity({...base, publicEmail:value,publicEmailApproved:true},false).email,null);
  }
  assert.equal(resolvePublicIdentity({...base,publicEmail:'hello@example.org',publicEmailApproved:true},false).email,'hello@example.org');
});

test('P03 résumé is visible ONLY when an approved real PDF is present and the public path is exact',()=>{
  assert.equal(resolvePublicIdentity({...base,resumeApproved:true,resumeUrl:'/resume.pdf'},false).resume,null);
  assert.equal(resolvePublicIdentity({...base,resumeApproved:false,resumeUrl:'/resume.pdf'},true).resume,null);
  assert.equal(resolvePublicIdentity({...base,resumeApproved:true,resumeUrl:'https://evil.test/cv.pdf'},true).resume,null);
  assert.equal(resolvePublicIdentity({...base,resumeApproved:true,resumeUrl:'/resume.pdf'},true).resume,'/resume.pdf');
});

test('P03 only HTTPS valid, approved network destinations reach public pages',()=>{
  assert.equal(resolvePublicIdentity({...base,linkedInApproved:true,linkedInUrl:'https://www.linkedin.com/in/profile'},false).linkedIn,'https://www.linkedin.com/in/profile');
  for (const value of ['http://www.linkedin.com/in/profile','https://www.linkedin.com.evil.example/in/profile','https://somewhere.example','javascript:alert(1)']) {
    assert.equal(resolvePublicIdentity({...base,linkedInApproved:true,linkedInUrl:value},false).linkedIn,null);
  }
});

test('P03 About and Contact routes contain real sections and project-linked capability cards',()=>{
  const about=read('../app/about/page.tsx');const contact=read('../app/contact/page.tsx');
  assert.match(about,/Web applications/);assert.match(about,/Mobile experiences/);
  assert.match(about,/Backend & APIs/);assert.match(about,/Data & product engineering/);
  assert.match(about,/getPublishedProjects/);assert.match(about,/getPublicIdentity/);
  assert.match(about,/href="\/projects"/);assert.match(about,/href="\/contact"/);
  assert.doesNotMatch(about,/BSc|Kabul University|years of experience|worked at/);
  assert.match(contact,/getPublicIdentity/);assert.match(contact,/<EmailContact email=\{identity.email\}/);
  assert.match(contact,/No personal contact information is collected/);
  assert.doesNotMatch(contact,/<form|fake|coming soon|Testimonial/i);
});

test('P03 navigation is complete, résumé/contact conditional, and all three primary journeys connect',()=>{
  const header=read('../components/site-header.tsx');const footer=read('../components/site-footer.tsx');
  const home=read('../app/page.tsx');const casePage=read('../app/projects/[slug]/page.tsx');const layout=read('../app/layout.tsx');
  for(const route of ['/', '/projects', '/about', '/contact']) assert.ok(header.includes(`href: "${route}"`));
  assert.match(header,/resumeHref &&/);assert.match(footer,/resume &&/);
  assert.match(home,/href="\/contact"/);assert.match(home,/href="\/about"/);
  assert.match(casePage,/href="\/contact"/);
  assert.match(layout,/getPublicIdentity\(\)/);
  assert.doesNotMatch(header,/href: "\/writing"/);
});

test('P03 clipboard component reports real success only after writeText resolves and provides manual fallback',()=>{
  const source=read('../components/email-contact.tsx');
  assert.match(source,/await navigator\.clipboard\.writeText\(email\)/);
  assert.match(source,/setCopyState\("copied"\)/);
  assert.match(source,/setCopyState\("manual"\)/);
  assert.match(source,/selectNodeContents/);assert.match(source,/aria-live="polite"/);
  assert.match(source,/mailto:\$\{email\}/);
  assert.doesNotMatch(source,/alert\(/);
});
