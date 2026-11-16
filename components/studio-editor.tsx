'use client';
import { useEffect,useState,FormEvent } from 'react';
import { StudioWritingPreview } from '@/components/studio-writing-preview';
import type { AvailabilityInput, EmploymentType, WorkMode, WorkRegion, FocusArea } from '@/lib/availability-core.mjs';

type Project={slug:string;title:string;oneLiner:string;ownerRole:string;developmentStatus:string;contentApproval:string};
type Case={slug:string;audience:string;productType:string;currentState:string;sourceEvidence:string;problem:string[]};
type Article={slug:string;title:string;excerpt:string;category:string;tags:string[];relatedProjects:string[];publicationStatus:string;ownerApproval:string;publishedAt:string|null;updatedAt:string|null};
type Profile={professionalTitle:string;headline:string;intro:string;shortBio:string;locationText:string;publicEmail:string|null;publicEmailApproved:boolean;ownerBioApproved:boolean};
type Data={head:string;projects:Project[];cases:Case[];writing:Article[];profile:Profile;testimonials:{entries:{id:string;name:string;relationship:string}[]};availability:AvailabilityInput;prs:{url:string;title:string;number:number;draft:boolean}[]};
type Kind='profile'|'project'|'case'|'article'|'media'|'testimonial'|'availability'|'reviews';
const tabs:{id:Kind;label:string}[]=[{id:'profile',label:'Profile'},{id:'project',label:'Projects'},{id:'case',label:'Case studies'},{id:'article',label:'Writing'},{id:'media',label:'Media'},{id:'testimonial',label:'Recommendations'},{id:'availability',label:'Availability'},{id:'reviews',label:'Review queue'}];

function Field({label,value,onChange,multiline=false,rows=4,maxLength=1200}:{label:string;value:string;onChange:(s:string)=>void;multiline?:boolean;rows?:number;maxLength?:number}){
  return <label className="studio-field"><span>{label}</span>{multiline?<textarea rows={rows} maxLength={maxLength} value={value} onChange={e=>onChange(e.target.value)}/>:<input maxLength={maxLength} value={value} onChange={e=>onChange(e.target.value)}/>}</label>;
}
function Choice({label,value,options,onChange}:{label:string;value:string;options:string[];onChange:(s:string)=>void}){
  return <label className="studio-field"><span>{label}</span><select value={value} onChange={e=>onChange(e.target.value)}>{options.map(s=><option key={s} value={s}>{s.replaceAll('_',' ')}</option>)}</select></label>;
}
function Checkbox({label,checked,onChange}:{label:string;checked:boolean;onChange:(c:boolean)=>void}){return <label className="studio-check"><input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)}/><span>{label}</span></label>;}
function ContentForm({kind,original,slug,head,onResult}:{kind:'profile'|'project'|'case'|'article';original:Profile|Project|Case|Article;slug?:string;head:string;onResult:(url:string)=>void}){
  const [form,setForm]=useState<any>({...original,problem:'problem' in original?original.problem.join('\n\n'):undefined,tags:'tags'in original?original.tags.join(', '):undefined,relatedProjects:'relatedProjects'in original?original.relatedProjects.join(', '):undefined});
  const [body,setBody]=useState('');const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  useEffect(()=>{
    if(kind!=='article'||!slug)return;
    const controller=new AbortController();
    fetch(`/api/studio/article?slug=${encodeURIComponent(slug)}`,{cache:'no-store',signal:controller.signal}).then(r=>r.json()).then(v=>{if(typeof v.body==='string')setBody(v.body);else setError('Article body could not be loaded.');}).catch(()=>{if(!controller.signal.aborted)setError('Could not load article body.');});
    return ()=>controller.abort();
  },[kind,slug]);
  const field=(key:string)=>(value:string|boolean)=>setForm((s:any)=>({...s,[key]:value}));
  async function submit(e:FormEvent){
    e.preventDefault();setError('');setBusy(true);
    try{
      let fields:Record<string,any>={};
      if(kind==='profile'){
        for(const k of ['professionalTitle','headline','intro','shortBio','locationText','publicEmail','ownerBioApproved','publicEmailApproved'])fields[k]=form[k];
      }else if(kind==='project'){
        for(const k of ['oneLiner','ownerRole','developmentStatus','contentApproval'])fields[k]=form[k];
      }else if(kind==='case'){
        for(const k of ['audience','productType','currentState','sourceEvidence'])fields[k]=form[k];
        fields.problem=String(form.problem||'').split(/\n\s*\n/).map((s:string)=>s.trim()).filter(Boolean);
      }else{
        for(const k of ['title','excerpt','category','publicationStatus','ownerApproval','publishedAt','updatedAt'])fields[k]=form[k];
        fields.tags=String(form.tags).split(',').map((s:string)=>s.trim()).filter(Boolean);
        fields.relatedProjects=String(form.relatedProjects).split(',').map((s:string)=>s.trim()).filter(Boolean);
        fields.publishedAt=fields.publishedAt||null;fields.updatedAt=fields.updatedAt||null;
        fields.body=body;
      }
      const response=await fetch('/api/studio/proposals',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind,slug,fields,expectedHead:head})});
      const result=await response.json();if(!response.ok)throw new Error(result.error||'Could not submit proposal');
      onResult(result.url);
    }catch(e){setError(e instanceof Error?e.message:'Unexpected error');}finally{setBusy(false);}
  }
  return <form className="studio-form" onSubmit={submit}>
    {kind==='profile'&&<>
      <Field label="Professional title" value={form.professionalTitle} onChange={field('professionalTitle')}/>
      <Field label="Headline" value={form.headline} onChange={field('headline')}/>
      <Field label="Introduction" value={form.intro} onChange={field('intro')} multiline/>
      <Field label="Biography" value={form.shortBio} onChange={field('shortBio')} multiline rows={6} maxLength={1600}/>
      <Field label="Location (public region only)" value={form.locationText} onChange={field('locationText')}/>
      <Field label="Public email (optional)" value={form.publicEmail||''} onChange={field('publicEmail')}/>
      <Checkbox label="I reviewed the public biography and approve it for publication" checked={form.ownerBioApproved} onChange={field('ownerBioApproved')}/>
      <Checkbox label="I approve displaying the public contact email" checked={form.publicEmailApproved} onChange={field('publicEmailApproved')}/>
    </>}
    {kind==='project'&&<>
      <Field label="Project summary" value={form.oneLiner} onChange={field('oneLiner')} multiline/>
      <Field label="Your role (fact-checked)" value={form.ownerRole} onChange={field('ownerRole')} multiline/>
      <Choice label="Development status" value={form.developmentStatus} onChange={field('developmentStatus')} options={['concept','prototype','in_development','pilot','released','maintained','retired']}/>
      <Choice label="Owner copy approval" value={form.contentApproval} onChange={field('contentApproval')} options={['owner_pending','owner_approved']}/>
    </>}
    {kind==='case'&&<>
      <Field label="Intended audience" value={form.audience} onChange={field('audience')}/>
      <Field label="Product type" value={form.productType} onChange={field('productType')}/>
      <Field label="User problem — one paragraph per block, blank line between blocks" value={form.problem} onChange={field('problem')} multiline rows={8} maxLength={4800}/>
      <Field label="Current implementation status (verified claims only)" value={form.currentState} onChange={field('currentState')} multiline rows={5}/>
      <Field label="Source evidence" value={form.sourceEvidence} onChange={field('sourceEvidence')}/>
    </>}
    {kind==='article'&&<>
      <Field label="Article title" value={form.title} onChange={field('title')}/>
      <Field label="Excerpt" value={form.excerpt} onChange={field('excerpt')} multiline/>
      <Field label="Category" value={form.category} onChange={field('category')}/>
      <Field label="Tags (comma separated)" value={form.tags} onChange={field('tags')}/>
      <Field label="Related project slugs (comma separated)" value={form.relatedProjects} onChange={field('relatedProjects')}/>
      <Field label="Markdown article body" value={body} onChange={setBody} multiline rows={20} maxLength={60000}/>
      <StudioWritingPreview title={form.title} excerpt={form.excerpt} body={body}/>
      <Choice label="Publication status" value={form.publicationStatus} onChange={field('publicationStatus')} options={['draft','published','archived']}/>
      <Choice label="Owner approval" value={form.ownerApproval} onChange={field('ownerApproval')} options={['owner_pending','owner_approved']}/>
      {form.publicationStatus==='published'&&<>
        <Field label="Actual publication date (YYYY-MM-DD)" value={form.publishedAt||''} onChange={field('publishedAt')}/>
        <Field label="Update date (YYYY-MM-DD or blank)" value={form.updatedAt||''} onChange={field('updatedAt')}/>
      </>}
      <p className="studio-hint">Writing will remain private until at least two full articles are approved and their reviewed pull requests merge. Publication dates must not be invented.</p>
    </>}
    <p className="studio-hint">Submitting creates a draft GitHub pull request. Nothing changes on the public site until you review, pass CI and merge it.</p>
    {error&&<p className="studio-alert" role="alert">{error}</p>}
    <button className="button button-primary" type="submit" disabled={busy}>{busy?'Preparing review…':'Create review proposal →'}</button>
  </form>;
}
function MediaForm({projects,head,onResult}:{projects:Project[];head:string;onResult:(url:string)=>void}){
  const [slug,setSlug]=useState(projects[0]?.slug||'');const [group,setGroup]=useState('Mobile app');const [alt,setAlt]=useState('');const [caption,setCaption]=useState('');const [confirm,setConfirm]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setError('');setBusy(true);
    try{const input=e.currentTarget.querySelector<HTMLInputElement>('input[type=file]');const file=input?.files?.[0];if(!file)throw new Error('Choose an image');
      const body=new FormData();body.set('file',file);body.set('slug',slug);body.set('group',group);body.set('alt',alt);body.set('caption',caption);body.set('confirmNoPrivateData',String(confirm));body.set('expectedHead',head);
      const r=await fetch('/api/studio/media',{method:'POST',body});const result=await r.json();if(!r.ok)throw new Error(result.error||'Could not create review');onResult(result.url);
    }catch(e){setError(e instanceof Error?e.message:'Upload failed');}finally{setBusy(false);}}
  return <form className="studio-form" onSubmit={submit}><p>Images are decoded, resized, re-encoded as WebP and stripped of metadata before being proposed as a GitHub pull request. Only upload genuine project imagery.</p>
    <Choice label="Project case study" value={slug} onChange={setSlug} options={projects.map(p=>p.slug)}/>
    <Choice label="Gallery group" value={group} onChange={setGroup} options={['Mobile app','Web/admin','Workflow/architecture']}/>
    <Field label="Accessible image description" value={alt} onChange={setAlt}/>
    <Field label="Visible caption" value={caption} onChange={setCaption}/>
    <label className="studio-field"><span>Image file: JPEG, PNG or WebP, up to 4 MB</span><input type="file" accept="image/jpeg,image/png,image/webp" required/></label>
    <Checkbox label="I have reviewed the image and confirm it contains no private records, patient data, student data, credentials or personal identifiers." checked={confirm} onChange={setConfirm}/>
    {error&&<p role="alert" className="studio-alert">{error}</p>}
    <button type="submit" disabled={busy||!confirm} className="button button-primary">{busy?'Sanitizing image…':'Submit media for review →'}</button>
  </form>;
}
/** Genuine endorsements are proposed as review PRs, never published by pressing Submit. */
function TestimonialForm({head,projects,current,onResult}:{head:string;projects:Project[];current:{id:string;name:string;relationship:string}[];onResult:(url:string)=>void}){
  const [form,setForm]=useState({id:'',name:'',role:'',organization:'',relationship:'collaborator',
    quote:'',context:'',projectSlug:'',profileUrl:'',language:'en',consentedAt:'',reviewedAt:''});
  const [checks,setChecks]=useState({identityVerified:false,evidenceReviewed:false,consentToPublish:false,ownerApproved:false});
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  const field=(key:string)=>(value:string)=>setForm(v=>({...v,[key]:value}));
  const attest=(key:keyof typeof checks)=>(value:boolean)=>setChecks(v=>({...v,[key]:value}));
  const ready=Object.values(checks).every(Boolean);
  async function submit(e:FormEvent){
    e.preventDefault();setError('');setBusy(true);
    try{
      const fields={
        id:form.id.trim(),name:form.name.trim(),role:form.role.trim(),
        relationship:form.relationship,quote:form.quote.trim(),context:form.context.trim(),
        language:form.language,consentedAt:form.consentedAt,reviewedAt:form.reviewedAt,
        ...(form.organization.trim()?{organization:form.organization.trim()}:{}),
        ...(form.projectSlug?{projectSlug:form.projectSlug}:{}),
        ...(form.profileUrl.trim()?{profileUrl:form.profileUrl.trim()}:{}),
        published:true, ...checks
      };
      const response=await fetch('/api/studio/proposals',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({kind:'testimonial',fields,expectedHead:head})});
      const result=await response.json();
      if(!response.ok)throw new Error(result.error||'Could not submit this recommendation for review');
      onResult(result.url);
    }catch(e){setError(e instanceof Error?e.message:'Unexpected error');}
    finally{setBusy(false);}
  }
  return <div className="studio-testimonials">
    <p className="studio-hint">Only submit a genuine person's exact words after verifying their identity and obtaining written permission outside GitHub. Never upload private messages, phone numbers or consent evidence. The resulting draft pull request still requires a review and successful CI before publication.</p>
    <p className="studio-hint">Current approved public recommendations: {current.length}. To withdraw a published recommendation, remove its record through a reviewed GitHub pull request immediately.</p>
    {current.length>0 && <ul className="studio-prs">{current.map(record=><li key={record.id}>{record.name} · {record.relationship}</li>)}</ul>}
    <form className="studio-form" onSubmit={submit}>
      <Field label="Unique ID (lowercase letters, numbers and hyphens)" value={form.id} onChange={field('id')} maxLength={80}/>
      <Field label="Contributor's public name (with permission)" value={form.name} onChange={field('name')} maxLength={90}/>
      <Field label="Verified professional role" value={form.role} onChange={field('role')} maxLength={110}/>
      <Field label="Organization (optional, permission required)" value={form.organization} onChange={field('organization')} maxLength={120}/>
      <Choice label="Actual working relationship" value={form.relationship} options={['collaborator','colleague','mentor','client']} onChange={field('relationship')}/>
      <Field label="Original quote (40–900 characters)" value={form.quote} onChange={field('quote')} multiline rows={6} maxLength={900}/>
      <Field label="Public, accurate context (15–260 characters)" value={form.context} onChange={field('context')} multiline rows={3} maxLength={260}/>
      <Choice label="Related published project (optional)" value={form.projectSlug} options={['',...projects.map(p=>p.slug)]} onChange={field('projectSlug')}/>
      <Choice label="Original quote language" value={form.language} options={['en','fa','ps']} onChange={field('language')}/>
      <Field label="Consented GitHub/LinkedIn profile URL (optional)" value={form.profileUrl} onChange={field('profileUrl')} maxLength={350}/>
      <label className="studio-field"><span>Date of written consent</span><input type="date" required value={form.consentedAt} onChange={e=>field('consentedAt')(e.target.value)}/></label>
      <label className="studio-field"><span>Date of identity/content review</span><input type="date" required value={form.reviewedAt} onChange={e=>field('reviewedAt')(e.target.value)}/></label>
      <Checkbox label="I have personally verified this contributor's identity and relationship." checked={checks.identityVerified} onChange={attest('identityVerified')}/>
      <Checkbox label="I checked the quote and public project context, including privacy risks." checked={checks.evidenceReviewed} onChange={attest('evidenceReviewed')}/>
      <Checkbox label="I hold explicit written consent to publish this name, role, context and exact quote." checked={checks.consentToPublish} onChange={attest('consentToPublish')}/>
      <Checkbox label="I am the portfolio owner and approve submitting this recommendation to the public-review workflow." checked={checks.ownerApproved} onChange={attest('ownerApproved')}/>
      {error&&<p role="alert" className="studio-alert">{error}</p>}
      <button className="button button-primary" type="submit" disabled={busy||!ready}>{busy?'Submitting…':'Create review pull request →'}</button>
    </form>
  </div>;
}

/**
 * Phase 20: owner-only, review-PR availability editor. Published statuses expire
 * automatically and are never inferred from résumé context or project activity.
 */
function AvailabilityForm({head,original,onResult}:{head:string;original:AvailabilityInput;onResult:(url:string)=>void}){
  const [state,setState]=useState({
    status:original.status,
    employmentTypes:[...original.employmentTypes],
    workModes:[...original.workModes],
    regions:[...original.regions],
    focus:[...original.focus],
    reviewedAt:original.reviewedAt||"",
    validUntil:original.validUntil||"",
    note:original.note||""
  });
  const [approval,setApproval]=useState(false);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const update=(key:string,value:any)=>setState(old=>({...old,[key]:value}));
  function toggle<T extends string>(key:"employmentTypes"|"workModes"|"regions"|"focus",value:T){
    setState(old=>{
      const current=old[key] as T[];
      return {...old,[key]:current.includes(value)?current.filter(x=>x!==value):[...current,value]};
    });
  }
  const choices={
    employmentTypes:[["full_time","Full-time"],["part_time","Part-time"],["contract","Contract / freelance"],["internship","Internship"]] as const,
    workModes:[["remote","Remote"],["hybrid","Hybrid"],["on_site","On-site"]] as const,
    regions:[["afghanistan","Across Afghanistan"],["international_remote","International remote"]] as const,
    focus:[["web","Web"],["mobile","Mobile"],["backend","Backend"],["data","Database"],["fullstack","Full-stack"],["improvements","UI and workflow refinement"]] as const
  };
  async function submit(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setError("");setBusy(true);
    try{
      const fields:AvailabilityInput={
        schemaVersion:1,ownerApproval:approval?"owner_approved":"owner_pending",
        status:state.status,employmentTypes:state.employmentTypes as EmploymentType[],
        workModes:state.workModes as WorkMode[],regions:state.regions as WorkRegion[],
        focus:state.focus as FocusArea[],note:state.note.trim()||null,
        reviewedAt:approval?(state.reviewedAt||null):null,validUntil:approval?(state.validUntil||null):null
      };
      const res=await fetch("/api/studio/proposals",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({kind:"availability",fields,expectedHead:head})});
      const result=await res.json();
      if(!res.ok)throw new Error(result.error||"Availability change could not be proposed");
      onResult(result.url);
    }catch(e){setError(e instanceof Error?e.message:"Unexpected submission error");}
    finally{setBusy(false);}
  }
  return <form className="studio-form availability-studio" onSubmit={submit}>
    <p className="studio-hint">Public job availability is a personal statement, not something inferred from repo work or older conversations. Choose current, accurate preferences, review the public wording, and then create a draft GitHub pull request. Until an owner-approved record is merged, visitors see “not publicly confirmed.”</p>
    <p className="studio-hint">Current source approval: {original.ownerApproval.replaceAll("_"," ")}. Approved dates expire after at most 90 days and are hidden automatically once stale.</p>
    <Choice label="Current status to display after approval" value={state.status} onChange={v=>update("status",v as AvailabilityInput["status"])}
      options={["not_shared","open","selective","unavailable"]}/>
    {(["employmentTypes","workModes","regions","focus"] as const).map(group=><fieldset className="availability-studio-choices" key={group}>
      <legend>{({employmentTypes:"Employment types",workModes:"Work arrangements",regions:"Location scope",focus:"Technical focus"})[group]}</legend>
      <div>{choices[group].map(([value,label])=><Checkbox key={value} label={label} checked={state[group].includes(value as never)}
        onChange={()=>toggle(group,value)}/>)}</div>
    </fieldset>)}
    <Field label="Optional public clarification (20–260 characters, no contact details)" value={state.note} onChange={v=>update("note",v)} multiline rows={3} maxLength={260}/>
    <Checkbox label="I personally reviewed these preferences, confirm they are accurate now and authorize them to be publicly visible after the reviewed pull request merges." checked={approval} onChange={setApproval}/>
    {approval&&<>
      <label className="studio-field"><span>Actual review date</span><input type="date" required value={state.reviewedAt} onChange={e=>update("reviewedAt",e.target.value)}/></label>
      <label className="studio-field"><span>Valid through date (within 90 days of review)</span><input type="date" required value={state.validUntil} onChange={e=>update("validUntil",e.target.value)}/></label>
    </>}
    <p className="studio-hint">Open/selective availability needs at least one actual employment type, work mode and technical focus. International remote requires Remote. An unavailable status may omit preferences. Never add a personal address, salary requirement or private phone number. This form does not promise meetings or response times.</p>
    {error&&<p className="studio-alert" role="alert">{error}</p>}
    <button className="button button-primary" type="submit" disabled={busy}>{busy?"Preparing review…":"Create draft review pull request →"}</button>
  </form>;
}

export function StudioEditor(){
  const [data,setData]=useState<Data|null>(null);const [status,setStatus]=useState('Loading latest content from GitHub…');const [tab,setTab]=useState<Kind>('profile');const [slug,setSlug]=useState('');const [lastProposal,setLastProposal]=useState('');
  async function refresh(){setStatus('Loading latest content…');try{const r=await fetch('/api/studio/content',{cache:'no-store'});const json=await r.json();if(!r.ok)throw new Error(json.error||'Access denied');setData(json);setSlug(json.projects?.[0]?.slug||'');setStatus('');}catch(e){setStatus(e instanceof Error?e.message:'Could not load content');}}
  useEffect(()=>{void refresh();},[]);
  const projects=data?.projects||[];const writing=data?.writing||[];const cases=data?.cases||[];
  const items=tab==='article'?writing:tab==='case'?cases:projects;
  const item=(items as any[]).find(v=>v.slug===slug)||items[0];
  const currentSlug=item?.slug||'';
  return <div className="studio-board">
    <nav aria-label="Studio sections" className="studio-tabs">{tabs.map(x=><button key={x.id} type="button" className={`studio-tab ${tab===x.id?'studio-tab--active':''}`} aria-pressed={tab===x.id} onClick={()=>{setTab(x.id);setSlug('');setLastProposal('');}}>{x.label}</button>)}</nav>
    <section className="studio-panel" aria-live="polite">
      <div className="studio-panel-head"><div><div className="page-eyebrow">EDITORIAL REVIEW / {tab.toUpperCase()}</div><h2>{tabs.find(x=>x.id===tab)?.label}</h2></div><button type="button" onClick={()=>void refresh()} className="button button-outline">Refresh from GitHub</button></div>
      {status&&<p className="studio-hint" role="status">{status}</p>}
      {lastProposal&&<div className="studio-success" role="status"><strong>Review proposal created.</strong><p>The changes are not live. Open GitHub to inspect, approve and merge after checks pass.</p><a href={lastProposal} target="_blank" rel="noopener noreferrer">Open draft pull request ↗</a></div>}
      {data&&tab==='reviews'&&<div className="studio-prs">{data.prs.length===0?<p>No open Studio pull requests. Create a proposal from the editor to start a review.</p>:data.prs.map(p=><a key={p.number} target="_blank" rel="noopener noreferrer" href={p.url}>#{p.number} — {p.title} <span>{p.draft?'Draft':'Open'}</span> ↗</a>)}<p className="studio-hint">GitHub is the review and audit history. Publishing requires a merge and a successful deployment; this workspace cannot bypass approval checks.</p></div>}
      {data&&tab==='media'&&<MediaForm head={data.head} projects={projects} onResult={setLastProposal}/>}
      {data&&tab==='testimonial'&&<TestimonialForm head={data.head} projects={projects} current={data.testimonials?.entries||[]} onResult={setLastProposal}/>}
      {data&&tab==='availability'&&<AvailabilityForm head={data.head} original={data.availability} onResult={setLastProposal}/>}
      {data&&tab==='profile'&&<ContentForm key="profile" kind="profile" original={data.profile} head={data.head} onResult={setLastProposal}/>}
      {data&&(['project','case','article'] as Kind[]).includes(tab)&&<>
        <label className="studio-field studio-picker"><span>Select {tab==='article'?'article':'project'}</span><select value={currentSlug} onChange={e=>{setSlug(e.target.value);setLastProposal('');}}>{items.map(v=><option key={v.slug} value={v.slug}>{'title'in v?v.title:v.slug}</option>)}</select></label>
        {item&&<ContentForm key={`${tab}:${currentSlug}`} kind={tab as 'project'|'case'|'article'} original={item} slug={currentSlug} head={data.head} onResult={setLastProposal}/>}
      </>}
    </section>
  </div>;
}
