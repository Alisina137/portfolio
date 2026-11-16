import { NextRequest } from 'next/server';
import { getStudioSession } from '@/lib/studio-auth';
import { createEditorialPr,readRepoContent,GitHubStudioError } from '@/lib/github-studio';
import { studioConfig,validSameOrigin,validateStudioChange } from '@/lib/phase08-core.mjs';
import { readLimitedJson } from '@/lib/request-json';
import { validateWritingManifest,parseArticle } from '@/lib/writing-core.mjs';
import { isApprovedTestimonial } from '@/lib/testimonials-core.mjs';
import { validateAvailabilityRecord, isPublicAvailability } from '@/lib/availability-core.mjs';

export const runtime='nodejs';
const paths={profile:'content/profile.json',project:'content/projects.json',case:'content/case-studies.json',article:'content/writing/articles.json',testimonial:'content/testimonials.json',availability:'content/availability.json'};
export async function POST(req:NextRequest){
  const cfg=studioConfig();if(!cfg.enabled)return new Response('Not found',{status:404});
  if(!await getStudioSession())return Response.json({error:'Sign in required'},{status:401});
  if(!validSameOrigin(req,cfg.origin))return Response.json({error:'Cross-site requests are blocked'},{status:403});
  const len=Number(req.headers.get('content-length')||0);if(len>90000)return Response.json({error:'Request too large'},{status:413});
  try{
    const request=await readLimitedJson(req,90000) as Record<string,any>;
    const {kind,slug,fields,expectedHead}=request||{};
    if(!Object.hasOwn(paths,kind) || typeof expectedHead!=='string'||!/^[a-f0-9]{40}$/.test(expectedHead)||!fields||typeof fields!=='object')return Response.json({error:'Invalid change request'},{status:400});
    const path=paths[kind as keyof typeof paths];
    const source=await readRepoContent(path);const parsed=JSON.parse(source.content);
    const original=kind==='profile'||kind==='testimonial'||kind==='availability'?parsed:(Array.isArray(parsed)?parsed.find((v:any)=>v.slug===slug):undefined);
    if(!original)return Response.json({error:'Content record not found'},{status:404});
    const change=kind==='testimonial'||kind==='availability'?null:validateStudioChange({kind,slug,fields},original);
    if(kind!=='testimonial' && kind!=='availability' && !change)return Response.json({error:'Invalid content values'},{status:422});
    const files:{path:string;content:string}[]=[];
    if(kind==='availability'){
      // One single owner-authored, time-limited public status. Even Studio creates only a draft review PR.
      if(!validateAvailabilityRecord(fields) || (fields.ownerApproval==='owner_approved' && !isPublicAvailability(fields)))
        return Response.json({error:'Availability requires valid status, owner approval, dates and current truthful work preferences'},{status:422});
      files.push({path,content:JSON.stringify(fields,null,2)+'\n'});
    }else if(kind==='testimonial'){
      // Owner-authenticated, source-controlled PR only; no anonymous testimonial endpoint.
      const permitted=new Set(['id','name','role','organization','relationship','quote','context','projectSlug','profileUrl','language','published','ownerApproved','identityVerified','evidenceReviewed','consentToPublish','consentedAt','reviewedAt']);
      if(!Array.isArray(parsed.entries) || Object.keys(fields).some(key=>!permitted.has(key)) || !isApprovedTestimonial(fields))
        return Response.json({error:'Recommendation needs genuine identity, original quote, written permission and completed review'},{status:422});
      if(parsed.entries.some((row:{id:string})=>row.id===fields.id))
        return Response.json({error:'Recommendation ID already exists'},{status:409});
      if(fields.projectSlug){
        const projects=JSON.parse((await readRepoContent('content/projects.json')).content);
        if(!projects.some((project:{slug:string;publicationStatus:string;repoUrlVerified:boolean})=>
           project.slug===fields.projectSlug && project.publicationStatus==='published' && project.repoUrlVerified))
          return Response.json({error:'The linked project is not published'},{status:422});
      }
      files.push({path,content:JSON.stringify({...parsed,entries:[...parsed.entries,fields]},null,2)+'\n'});
    }else if(kind==='article'){
      const result=change as {record:Record<string,any>;body:string|null};
      const next=parsed.map((v:any)=>v.slug===slug?result.record:v);
      if(result.body!==null){
        parseArticle(result.body);
        files.push({path:`content/writing/${slug}.md`,content:result.body.endsWith('\n')?result.body:result.body+'\n'});
      }
      const slugs=(await readRepoContent('content/projects.json'));
      const projects=JSON.parse(slugs.content).filter((v:any)=>v.publicationStatus==='published').map((v:any)=>v.slug);
      if(validateWritingManifest(next,projects).length)return Response.json({error:'Article does not meet publication requirements'},{status:422});
      files.push({path,content:JSON.stringify(next,null,2)+'\n'});
    }else{
      const next=kind==='profile'?change:parsed.map((v:any)=>v.slug===slug?change:v);
      files.push({path,content:JSON.stringify(next,null,2)+'\n'});
    }
    const name=kind==='profile'?'profile':kind==='availability'?'availability preferences':kind==='testimonial'?`recommendation ${fields.id}`:`${kind} ${slug}`;
    const result=await createEditorialPr(files,`review ${name}`,expectedHead);
    return Response.json({ok:true,...result},{status:201,headers:{'Cache-Control':'no-store'}});
  }catch(e){
    if(e instanceof GitHubStudioError)return Response.json({error:e.message},{status:e.code});
    return Response.json({error:'Could not create a review proposal. Check article formatting and try again.'},{status:422});
  }
}
