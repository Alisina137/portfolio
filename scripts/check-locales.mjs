import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { localeApproved } from '../lib/i18n-core.mjs';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read=relative=>JSON.parse(fs.readFileSync(path.join(root,relative),'utf8'));
const ui={fa:read('content/locales/fa-ui.json'),ps:read('content/locales/ps-ui.json')};
const cases={fa:read('content/locales/fa-projects.json'),ps:read('content/locales/ps-projects.json')};
const approvals=read('content/locales/approval.json');
const english=read('content/case-studies.json');
const projects=read('content/projects.json').filter(p=>p.publicationStatus==='published');
const fingerprint=createHash('sha256').update(JSON.stringify([
  read('content/profile.json'), read('content/projects.json'), read('content/case-studies.json'), read('content/writing/articles.json'), read('content/experience.json'), read('content/qualifications.json'), read('content/services.json'),
])).digest('hex');
const errors=[];
const requiredCaseFields=['audience','productType','platforms','problem','features','technicalNotes','tradeoffs','currentState','nextSteps','sourceEvidence','eyebrow','oneLiner','ownerRole','coverTitle'];
const referenceKeys=Object.keys(ui.fa).sort().join('\0');
for (const locale of ['fa','ps']) {
  if(Object.keys(ui[locale]).sort().join('\0')!==referenceKeys) errors.push(`${locale}: UI key set differs from other locales`);
  for (const [key,value] of Object.entries(ui[locale])) if(typeof value!=='string'||value.trim().length<2) errors.push(`${locale}: empty/invalid UI ${key}`);
  if(Object.keys(cases[locale]).sort().join('\0')!==english.map(p=>p.slug).sort().join('\0')) errors.push(`${locale}: project case coverage differs`);
  for(const item of english) {
    const trans=cases[locale][item.slug];if(!trans){errors.push(`${locale}/${item.slug}: missing translation`);continue;}
    for(const key of requiredCaseFields) {
      const value=trans[key];if(value===null||value===undefined) errors.push(`${locale}/${item.slug}: missing ${key}`);
      else if(typeof value==='string'&&value.trim().length<6) errors.push(`${locale}/${item.slug}: too short ${key}`);
      else if(Array.isArray(value)) {
        if(!Array.isArray(item[key])||value.length!==item[key].length) errors.push(`${locale}/${item.slug}: ${key} does not match source count`);
        if(value.some(v=>typeof v==='string'?!v.trim():!v?.title?.trim()||!v?.description?.trim())) errors.push(`${locale}/${item.slug}: empty ${key}`);
      }
    }
    if(item.media?.length>0) errors.push(`${locale}/${item.slug}: approved gallery requires translated alt/captions`);
  }
  if(!approvals[locale]||typeof approvals[locale].ownerApproved!=='boolean'||typeof approvals[locale].rtlQaPassed!=='boolean') errors.push(`${locale}: missing approval flags`);
  if(approvals[locale]?.ownerApproved && approvals[locale]?.sourceFingerprint!==fingerprint) errors.push(`${locale}: approved source fingerprint stale; re-review translation`);
  if(localeApproved(locale,approvals,fingerprint) && !approvals[locale].rtlQaPassed) errors.push(`${locale}: cannot publish before RTL QA`);
}
for(const p of projects) if (!cases.fa[p.slug] || !cases.ps[p.slug]) errors.push(`Published project ${p.slug} is untranslated`);
for(const file of ['app/[locale]/[[...path]]/page.tsx','proxy.ts','components/locale-document.tsx','styles/locales.css']) if(!fs.existsSync(path.join(root,file))) errors.push(`Missing locale route component: ${file}`);
if(errors.length){console.error(errors.map(e=>`- ${e}`).join('\n'));process.exit(1);}
console.log(`Locale content verified: ${Object.keys(ui.fa).length} UI strings per language, ${english.length} full case studies in both Dari and Pashto; both locale releases owner-gated. Source SHA256: ${fingerprint}`);
