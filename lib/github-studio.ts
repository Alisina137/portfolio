/** Owner-only editorial PR integration. No direct main writes. No external URL accepted from clients. */
import { randomUUID } from 'node:crypto';
import { studioConfig } from './phase08-core.mjs';

const base='https://api.github.com';
export class GitHubStudioError extends Error { constructor(message:string,public code=502){super(message);} }
async function gh(path:string, init:RequestInit = {}){
  if (!studioConfig().enabled || !path.startsWith('/')) throw new GitHubStudioError('Editor is unavailable',503);
  const controller=new AbortController();const abort=setTimeout(()=>controller.abort(),12000);
  try{
    const response=await fetch(base+path,{
      ...init,signal:controller.signal,cache:'no-store',
      headers:{'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',
        'Authorization':`Bearer ${process.env.PORTFOLIO_STUDIO_GITHUB_TOKEN}`,
        ...(init.body?{'Content-Type':'application/json'}:{}),...(init.headers||{})}
    });
    const json=await response.json().catch(()=>({}));
    if(!response.ok) throw new GitHubStudioError(response.status===403?'GitHub access denied; check token permissions':`GitHub request failed (${response.status})`,response.status===409?409:502);
    return json;
  } catch(e){if(e instanceof GitHubStudioError) throw e;throw new GitHubStudioError('Cannot reach GitHub right now');}
  finally{clearTimeout(abort);}
}
const root=()=>`/repos/${studioConfig().repo}`;
export async function repoHead(){
  const ref=await gh(root()+'/git/ref/heads/main');return String(ref.object?.sha||'');
}
export async function readRepoContent(path:string){
  const allowed = ['content/profile.json','content/projects.json','content/case-studies.json','content/testimonials.json','content/availability.json','content/writing/articles.json'];
  if(!allowed.includes(path) && !/^content\/writing\/[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(path)) throw new GitHubStudioError('Invalid file',400);
  const file=await gh(`${root()}/contents/${path}?ref=main`);
  if(file.encoding!=='base64' || typeof file.content!=='string')throw new GitHubStudioError('Unsupported content');
  return {content:Buffer.from(file.content.replace(/\s/g,''),'base64').toString('utf8'),sha:String(file.sha)};
}
export type FileToWrite={path:string;content:string|Buffer};
export async function createEditorialPr(files:FileToWrite[],title:string,expectedHead:string){
  if(!files.length||files.length>3)throw new GitHubStudioError('Invalid change set',400);
  const head=await repoHead();
  if(head!==expectedHead)throw new GitHubStudioError('The portfolio changed since you opened this editor. Refresh and try again.',409);
  const commit=await gh(root()+`/git/commits/${head}`);
  const elements=[];
  for(const file of files){
    if(!/^content\/(?:profile\.json|projects\.json|case-studies\.json|testimonials\.json|availability\.json|writing\/(?:articles\.json|[a-z0-9-]+\.md))$/.test(file.path)
      && !/^public\/media\/[0-9a-f-]{36}\.webp$/.test(file.path)) throw new GitHubStudioError('Unsafe file path',400);
    const blob=await gh(root()+'/git/blobs',{method:'POST',body:JSON.stringify({content:Buffer.isBuffer(file.content)?file.content.toString('base64'):file.content,encoding:Buffer.isBuffer(file.content)?'base64':'utf-8'})});
    elements.push({path:file.path,mode:'100644',type:'blob',sha:blob.sha});
  }
  const tree=await gh(root()+'/git/trees',{method:'POST',body:JSON.stringify({base_tree:commit.tree.sha,tree:elements})});
  const edited=await gh(root()+'/git/commits',{method:'POST',body:JSON.stringify({message:`studio: ${title}`,tree:tree.sha,parents:[head]})});
  const branch=`studio/review-${Date.now()}-${randomUUID().slice(0,8)}`;
  await gh(root()+'/git/refs',{method:'POST',body:JSON.stringify({ref:`refs/heads/${branch}`,sha:edited.sha})});
  const pr=await gh(root()+'/pulls',{method:'POST',body:JSON.stringify({head:branch,base:'main',title:`Studio: ${title}`,draft:true,
    body:'Owner-submitted content change. **Review the full diff and CI checks before merging.** No direct publication occurs from the editor. Review the content approval/launch checks, screenshots and privacy before enabling public discovery.'})});
  return {url:String(pr.html_url),number:Number(pr.number),branch};
}
export async function listEditorialPrs(){
  const pulls=await gh(root()+'/pulls?state=open&per_page=30');
  if(!Array.isArray(pulls))return [];
  return pulls.filter(p=>String(p.head?.ref||'').startsWith('studio/review-')).map(p=>({number:p.number,title:p.title,url:p.html_url,draft:Boolean(p.draft)}));
}
