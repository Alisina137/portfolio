import { getStudioSession } from '@/lib/studio-auth';
import { listEditorialPrs,readRepoContent,repoHead } from '@/lib/github-studio';
import { studioConfig } from '@/lib/phase08-core.mjs';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(){
  if(!studioConfig().enabled)return new Response('Not found',{status:404});
  if(!await getStudioSession())return Response.json({error:'Sign in required'},{status:401,headers:{'Cache-Control':'no-store'}});
  try{
    const [head, profile, projects, cases, writing, testimonials, prs]=await Promise.all([
      repoHead(),readRepoContent('content/profile.json'),readRepoContent('content/projects.json'),readRepoContent('content/case-studies.json'),readRepoContent('content/writing/articles.json'),readRepoContent('content/testimonials.json'),listEditorialPrs()]);
    return Response.json({head,profile:JSON.parse(profile.content),projects:JSON.parse(projects.content),cases:JSON.parse(cases.content),writing:JSON.parse(writing.content),testimonials:JSON.parse(testimonials.content),prs},
      {headers:{'Cache-Control':'no-store'}});
  }catch{return Response.json({error:'Could not read content from GitHub. Check repository permissions.'},{status:503,headers:{'Cache-Control':'no-store'}});}
}
