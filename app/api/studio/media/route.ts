import { NextRequest } from 'next/server';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { getStudioSession } from '@/lib/studio-auth';
import { createEditorialPr,readRepoContent,GitHubStudioError } from '@/lib/github-studio';
import { studioConfig,validSameOrigin,validMediaDetails } from '@/lib/phase08-core.mjs';
export const runtime='nodejs';
export async function POST(req:NextRequest){
  const cfg=studioConfig(); if(!cfg.enabled)return new Response('Not found',{status:404});
  if(!await getStudioSession())return Response.json({error:'Sign in required'},{status:401});
  if(!validSameOrigin(req,cfg.origin))return Response.json({error:'Forbidden'},{status:403});
  if(Number(req.headers.get('content-length')||0)>6_000_000)return Response.json({error:'Image too large'},{status:413});
  try{
    const form=await req.formData();const file=form.get('file');
    if(!(file instanceof File)||file.size>4_000_000 || file.size<100 || !['image/jpeg','image/png','image/webp'].includes(file.type))return Response.json({error:'Choose a JPEG, PNG or WebP smaller than 4 MB'},{status:422});
    const details=validMediaDetails({slug:form.get('slug'),group:form.get('group'),alt:form.get('alt'),caption:form.get('caption'),confirmNoPrivateData:form.get('confirmNoPrivateData')});
    const expectedHead=form.get('expectedHead');
    if(!details || typeof expectedHead!=='string'||!/^[a-f0-9]{40}$/.test(expectedHead))return Response.json({error:'Complete the image description, privacy confirmation and refresh the editor'},{status:422});
    const input=Buffer.from(await file.arrayBuffer());
    const metadata=await sharp(input,{failOn:'error',limitInputPixels:16_000_000}).metadata();
    if(!metadata.width||!metadata.height||metadata.width*metadata.height>16_000_000||!['jpeg','png','webp'].includes(metadata.format||''))return Response.json({error:'Unsupported image'},{status:422});
    // Normalize and re-encode to remove EXIF, GPS, comments and embedded metadata.
    const cleaned=await sharp(input,{failOn:'error',limitInputPixels:16_000_000}).rotate().resize({width:1600,height:1400,fit:'inside',withoutEnlargement:true}).webp({quality:78,effort:4}).toBuffer();
    if(cleaned.length>2_000_000)return Response.json({error:'Optimized image is too large'},{status:422});
    const manifest=await readRepoContent('content/case-studies.json');const cases=JSON.parse(manifest.content);
    const caseStudy=cases.find((v:any)=>v.slug===details.slug);
    if(!caseStudy)return Response.json({error:'Project case not found'},{status:404});
    const path=`/media/${randomUUID()}.webp`;
    caseStudy.media.push({src:path,alt:details.alt,caption:details.caption,group:details.group,approved:true});
    const proposal=await createEditorialPr([
      {path:`public${path}`,content:cleaned},
      {path:'content/case-studies.json',content:JSON.stringify(cases,null,2)+'\n'}
    ],`review media for ${details.slug}`,expectedHead);
    return Response.json({ok:true,...proposal},{status:201,headers:{'Cache-Control':'no-store'}});
  }catch(e){
    if(e instanceof GitHubStudioError)return Response.json({error:e.message},{status:e.code});
    return Response.json({error:'Image processing or GitHub review failed'},{status:422});
  }
}
