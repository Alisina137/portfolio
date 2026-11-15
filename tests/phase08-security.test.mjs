import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {studioConfig,contactConfig,validateContact,validSameOrigin,validateStudioChange,validMediaDetails,hashLimiterKey} from '../lib/phase08-core.mjs';
const read=(s)=>readFileSync(new URL(`../${s}`,import.meta.url),'utf8');
const configured={NODE_ENV:'production',NEXT_PUBLIC_SITE_URL:'https://portfolio.example',PORTFOLIO_STUDIO_ENABLED:'true',PORTFOLIO_GITHUB_CLIENT_ID:'abc123clientid',PORTFOLIO_GITHUB_CLIENT_SECRET:'server-secret',PORTFOLIO_STUDIO_SESSION_SECRET:'a'.repeat(64),PORTFOLIO_OWNER_GITHUB_ID:'150026622',PORTFOLIO_STUDIO_GITHUB_TOKEN:'private-studio-token',PORTFOLIO_STUDIO_REPOSITORY:'Alisina137/portfolio'};
test('P08 editor fails closed by default and when any sensitive input is absent',()=>{
  assert.equal(studioConfig({}).enabled,false);
  assert.equal(studioConfig(configured).enabled,true);
  for(const key of ['PORTFOLIO_STUDIO_ENABLED','NEXT_PUBLIC_SITE_URL','PORTFOLIO_GITHUB_CLIENT_ID','PORTFOLIO_GITHUB_CLIENT_SECRET','PORTFOLIO_STUDIO_SESSION_SECRET','PORTFOLIO_OWNER_GITHUB_ID','PORTFOLIO_STUDIO_GITHUB_TOKEN'])assert.equal(studioConfig({...configured,[key]:''}).enabled,false,key);
  assert.equal(studioConfig({...configured,PORTFOLIO_STUDIO_REPOSITORY:'other/repo'}).enabled,false);
  assert.equal(studioConfig({...configured,NEXT_PUBLIC_SITE_URL:'http://portfolio.example'}).enabled,false);
});
test('P08 contact form requires an approved explicit provider configuration',()=>{
  const full={...configured,PORTFOLIO_CONTACT_ENABLED:'true',PORTFOLIO_CONTACT_TO:'owner@example.com',PORTFOLIO_CONTACT_FROM:'site@example.com',PORTFOLIO_RESEND_API_KEY:'resend-key',PORTFOLIO_TURNSTILE_SECRET:'challenge-secret',NEXT_PUBLIC_PORTFOLIO_TURNSTILE_SITE_KEY:'site-key',PORTFOLIO_UPSTASH_REDIS_REST_URL:'https://example.upstash.io',PORTFOLIO_UPSTASH_REDIS_REST_TOKEN:'ratelimit-key'};
  assert.equal(contactConfig({}).enabled,false);
  assert.equal(contactConfig(full).enabled,true);
  for(const key of ['PORTFOLIO_CONTACT_ENABLED','PORTFOLIO_CONTACT_TO','PORTFOLIO_CONTACT_FROM','PORTFOLIO_RESEND_API_KEY','PORTFOLIO_TURNSTILE_SECRET','NEXT_PUBLIC_PORTFOLIO_TURNSTILE_SITE_KEY','PORTFOLIO_UPSTASH_REDIS_REST_URL','PORTFOLIO_UPSTASH_REDIS_REST_TOKEN'])assert.equal(contactConfig({...full,[key]:''}).enabled,false,key);
});
test('P08 contact validation rejects email injection, short text, overlong text and bots',()=>{
  const good={name:'Software Engineer',email:'person@example.com',subject:'Hello about the portfolio',message:'I am interested in discussing a web application project in more detail.',turnstileToken:'turnstile-token-valid-looking'};
  assert.ok(validateContact(good));
  assert.equal(validateContact({...good,website:'https://spam.example'}),null);
  assert.equal(validateContact({...good,email:'bad\nBcc: victim@example.com'}),null);
  assert.equal(validateContact({...good,subject:'x'}),null);
  assert.equal(validateContact({...good,message:'x'.repeat(4001)}),null);
  assert.equal(validateContact({...good,name:'bad\r\nX:'}),null);
  assert.equal(validateContact({...good,turnstileToken:''}),null);
});
test('P08 write requests require exact same site origin',()=>{
  const req=(origin)=>({headers:{get:(key)=>key==='origin'?origin:null}});
  assert.equal(validSameOrigin(req('https://portfolio.example'),'https://portfolio.example'),true);
  assert.equal(validSameOrigin(req('https://evil.example'),'https://portfolio.example'),false);
  assert.equal(validSameOrigin(req(null),'https://portfolio.example'),false);
});
test('P08 profile editor cannot modify privileged repository-controlled keys',()=>{
  const base={displayName:'Alisina Sarwari',shortBio:'Known original biography',publicEmail:null,publicEmailApproved:false};
  assert.equal(validateStudioChange({kind:'profile',fields:{profileUrl:'https://evil.invalid'}},base),null);
  assert.equal(validateStudioChange({kind:'profile',fields:{publicEmailApproved:true}},base),null);
  const edited=validateStudioChange({kind:'profile',fields:{shortBio:'I build practical web and mobile systems for real people.',publicEmail:'person@example.com',publicEmailApproved:true}},base);
  assert.equal(edited.publicEmail,'person@example.com');
  assert.equal(edited.displayName,'Alisina Sarwari');
});
test('P08 project editor enforces truthful release claims and approved fields',()=>{
  const base={slug:'maktablink',oneLiner:'Original description',ownerRole:'Developer',developmentStatus:'in_development',contentApproval:'owner_pending',repoUrl:'https://github.com/Alisina137/maktab'};
  assert.equal(validateStudioChange({kind:'project',slug:'maktablink',fields:{developmentStatus:'released'}},base),null);
  assert.equal(validateStudioChange({kind:'project',slug:'maktablink',fields:{repoUrl:'https://evil.invalid'}},base),null);
  assert.equal(validateStudioChange({kind:'project',slug:'maktablink',fields:{contentApproval:'owner_approved',developmentStatus:'released'}},base)?.developmentStatus,'released');
});
test('P08 article transitions preserve owner review before publication',()=>{
  const base={slug:'engineering-writing',publicationStatus:'draft',ownerApproval:'owner_pending',publishedAt:null,updatedAt:null};
  assert.equal(validateStudioChange({kind:'article',slug:'../secret',fields:{}},base),null);
  const edited=validateStudioChange({kind:'article',slug:'engineering-writing',fields:{body:'# Intro\n'+('A'.repeat(300))}},base);
  assert.equal(edited.record.publicationStatus,'draft');
  assert.equal(edited.body.length>300,true);
  const draft=validateStudioChange({kind:'article',slug:'engineering-writing',fields:{publicationStatus:'draft',ownerApproval:'owner_approved'}},base);
  assert.equal(draft.record.ownerApproval,'owner_pending');
});
test('P08 media approval requires real alt text, caption and explicit privacy review',()=>{
  const m={slug:'maktablink',alt:'Screenshot of class attendance list',caption:'School attendance management page',group:'Web/admin',confirmNoPrivateData:'true'};
  assert.ok(validMediaDetails(m));
  assert.equal(validMediaDetails({...m,confirmNoPrivateData:'false'}),null);
  assert.equal(validMediaDetails({...m,slug:'../files'}),null);
  assert.equal(validMediaDetails({...m,alt:''}),null);
});
test('P08 IP limiter uses a salted one-way digest',()=>{
  assert.equal(hashLimiterKey('127.0.0.1','a'),hashLimiterKey('127.0.0.1','a'));
  assert.notEqual(hashLimiterKey('127.0.0.1','a'),hashLimiterKey('127.0.0.1','b'));
});
test('P08 private route, PR-only changes, captcha and image reencoding exist',()=>{
  assert.match(read('app/studio/page.tsx'),/getStudioSession/);
  assert.match(read('app/api/studio/proposals/route.ts'),/validSameOrigin/);
  assert.match(read('lib/github-studio.ts'),/draft:true/);
  assert.match(read('lib/github-studio.ts'),/head:branch,base:'main'/);
  assert.match(read('app/api/studio/media/route.ts'),/sharp\(input/);
  assert.match(read('app/api/contact/route.ts'),/turnstile\/v0\/siteverify/);
  assert.match(read('app/api/contact/route.ts'),/rateLimit/);
  assert.ok(existsSync(new URL('../scripts/export-content-backup.mjs',import.meta.url)));
});
