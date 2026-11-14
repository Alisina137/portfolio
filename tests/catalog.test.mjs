import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const require = createRequire(import.meta.url);
let ts;
try { ts = require('typescript'); } catch { ts = require(path.join(execFileSync('npm', ['root','-g'], {encoding:'utf8'}).trim(), 'typescript')); }
const source=fs.readFileSync(new URL('../lib/catalog.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const exportsObj={};
vm.runInNewContext(js,{exports:exportsObj,URLSearchParams,console}, {filename:'catalog.js'});
const {normalizeCatalogQuery,listCatalog,catalogHref,caseHref,returnToCatalog,relatedProjects,optionsFor}=exportsObj;
const projects=JSON.parse(fs.readFileSync(new URL('../content/projects.json',import.meta.url),'utf8')).filter(p=>p.publicationStatus==='published');
const query=(str='', ps=projects)=>normalizeCatalogQuery(new URLSearchParams(str),ps);

// Contents tested without Next runtime: the same pure functions run in the client catalog.
test('P02 catalog default includes exactly the source-backed public cases',()=>{
  const result=listCatalog(projects,query());
  assert.equal(result.total,6);
  assert.equal(result.visible[0].slug,'maktablink');
  assert.equal(new Set(projects.map(p=>p.slug)).size,projects.length);
});

test('P02 search is Unicode normalized, case insensitive and intersects category and status',()=>{
  assert.deepEqual(Array.from(listCatalog(projects,query('q=SCHOOL')).matches,v=>v.slug),['maktablink']);
  assert.deepEqual(Array.from(listCatalog(projects,query('q=%EF%BC%B3%EF%BC%A3%EF%BC%A8%EF%BC%AF%EF%BC%AF%EF%BC%AC')).matches,v=>v.slug),['maktablink']);
  assert.equal(listCatalog(projects,query('q=school&category=Marketplace')).total,0);
  assert.equal(listCatalog(projects,query('q=school&category=Education&status=in_development')).total,1);
  assert.equal(listCatalog(projects,query('q=school&status=released')).total,1); // invalid status normalizes to All; no released entries
});

test('P02 invalid and excessive URL params are safely bounded; back link cannot redirect externally',()=>{
  const v=query(`q=${'a'.repeat(180)}&category=missing&status=released&sort=bogus&page=-99`);
  assert.equal(v.q.length,100);
  assert.equal(v.category,'');assert.equal(v.status,'');assert.equal(v.sort,'featured');assert.equal(v.page,1);
  assert.equal(returnToCatalog('https://evil.invalid/?q=secret',projects),'/projects');
  assert.equal(returnToCatalog('q=school&category=Education&sort=az&page=2',projects),'/projects?q=school&category=Education&sort=az&page=2');
  assert.ok(caseHref('maktablink',query('q=school&category=Education')).includes('back='));
});

test('P02 0, 1, 9, 10, and 50 results: nine-item increments, page clamping, stable sorting',()=>{
  for(const count of [0,1,9,10,50]) {
    const samples=Array.from({length:count},(_,i)=>({...projects[0],slug:'item-'+i,title:`Item ${String(i).padStart(2,'0')}`,featuredOrder:i+1}));
    const values=query('page=1',samples);
    const first=listCatalog(samples,values);
    assert.equal(first.showing,Math.min(9,count));assert.equal(first.total,count);
    assert.equal(first.hasMore,count>9);
    const next=listCatalog(samples,{...values,page:2});
    assert.equal(next.showing,Math.min(18,count));
    const last=listCatalog(samples,{...values,page:999});
    assert.equal(last.showing,count); assert.equal(last.hasMore,false);
  }
  const sorted=listCatalog(projects,query('sort=az')).matches;
  assert.deepEqual(Array.from(sorted,p=>p.title),Array.from(sorted,p=>p.title).sort((a,b)=>a.localeCompare(b)));
});

test('P02 related projects exclude current/duplicates and cap at two; only published inputs are accepted',()=>{
  const related=relatedProjects(projects[0],projects);
  assert.equal(related.length,2);
  assert.ok(related.every(p=>p.slug!==projects[0].slug));
  assert.equal(new Set(related.map(p=>p.slug)).size,2);
  const categories=optionsFor(projects).categories;
  assert.ok(categories.includes('Marketplace'));
  assert.ok(!categories.includes('Web'));
});
