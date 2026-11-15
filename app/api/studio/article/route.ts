import { NextRequest } from 'next/server';
import { getStudioSession } from '@/lib/studio-auth';
import { studioConfig } from '@/lib/phase08-core.mjs';
import { readRepoContent } from '@/lib/github-studio';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
  if(!studioConfig().enabled)return new Response('Not found',{status:404});
  if(!await getStudioSession())return Response.json({error:'Sign in required'},{status:401});
  const slug=req.nextUrl.searchParams.get('slug')||'';
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))return Response.json({error:'Invalid article'},{status:400});
  try{
    const manifest=JSON.parse((await readRepoContent('content/writing/articles.json')).content);
    if(!manifest.some((a:{slug:string})=>a.slug===slug))return Response.json({error:'Not found'},{status:404});
    const file=await readRepoContent(`content/writing/${slug}.md`);
    return Response.json({body:file.content},{headers:{'Cache-Control':'no-store'}});
  }catch{return Response.json({error:'Unable to fetch article'},{status:503});}
}
