import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const projects=JSON.parse(fs.readFileSync(new URL('../content/projects.json',import.meta.url),'utf8'));
const cases=JSON.parse(fs.readFileSync(new URL('../content/case-studies.json',import.meta.url),'utf8'));
const queue=JSON.parse(fs.readFileSync(new URL('../content/review-queue.json',import.meta.url),'utf8'));
const read=(p)=>fs.readFileSync(new URL(p,import.meta.url),'utf8');

test('P02 all published projects have a truthful, substantial technical case and a working source route',()=>{
  const pub=projects.filter(p=>p.publicationStatus==='published');
  assert.equal(pub.length,cases.length);
  for(const p of pub){
    const story=cases.find(c=>c.slug===p.slug);
    assert.ok(story,`Missing case ${p.slug}`);
    assert.ok(story.problem.length>=2 && story.features.length>=3 && story.technicalNotes.length>=1 && story.tradeoffs.length>=1);
    assert.ok(story.currentState.length>30 && story.sourceEvidence.includes('2026'));
    assert.equal(story.media.length,0,'No fabricated or unapproved screenshots');
    assert.equal(p.developmentStatus,'in_development');
  }
});

test('P02 source inventory holds unreviewed projects outside public search and routes',()=>{
  const pub=new Set(projects.filter(p=>p.publicationStatus==='published').map(p=>p.repoUrl));
  assert.ok(queue.length>=5);
  assert.ok(queue.every(item=>!pub.has(item.repoUrl)));
  assert.ok(queue.every(item=>!cases.some(story=>story.slug===item.title)));
});

test('P02 route files retain complete catalog, case page, 404 and gallery flow',()=>{
  const catalog=read('../app/projects/page.tsx');
  const detail=read('../app/projects/[slug]/page.tsx');
  const gallery=read('../components/project-gallery.tsx');
  const header=read('../components/site-header.tsx');
  assert.match(catalog,/ProjectsExplorer/);
  assert.match(detail,/notFound\(\)/);
  assert.match(detail,/generateStaticParams/);
  assert.match(detail,/returnToCatalog/);
  assert.match(detail,/getRelatedProjects/);
  assert.match(gallery,/showModal\(\)/);
  assert.match(gallery,/Escape|ArrowRight|ArrowLeft/);
  assert.match(header,/Projects.*\/projects/);
  assert.match(header,/About.*\/about/);
  assert.match(header,/Contact.*\/contact/);
  assert.doesNotMatch(header,/label: "Writing"/);
});
