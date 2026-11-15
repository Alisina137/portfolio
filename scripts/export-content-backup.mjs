/** Owner-run offline content snapshot. No network requests or secrets. */
import { mkdirSync,copyFileSync,readdirSync,statSync,writeFileSync,readFileSync } from 'node:fs';
import { join,relative,resolve } from 'node:path';
import { createHash } from 'node:crypto';
const root=resolve(import.meta.dirname,'..');
const destination=resolve(process.argv[2]||join(root,'.portfolio-backups',new Date().toISOString().replaceAll(':','-')));
if(!process.argv[2] && !destination.startsWith(resolve(root,'.portfolio-backups')+'/'))throw new Error('Invalid backup path');
if(destination===root||root.startsWith(destination+'/'))throw new Error('Backup target must not contain repository root');
const entries=[];
for(const sourceRoot of ['content','public/media']){
  const src=join(root,sourceRoot);
  function visit(p){try{
    for(const dirent of readdirSync(p,{withFileTypes:true})){
      const next=join(p,dirent.name);
      if(dirent.isSymbolicLink())throw new Error('Symlink not allowed in content backup');
      if(dirent.isDirectory()){visit(next);continue;}
      if(!dirent.isFile())continue;
      const dest=join(destination,relative(root,next));mkdirSync(resolve(dest,'..'),{recursive:true});copyFileSync(next,dest);
      const {size}=statSync(dest);const checksum=createHash('sha256').update(readFileSync(dest)).digest('hex');
      entries.push({path:relative(root,next).replaceAll('\\','/'),size,sha256:checksum});
    }
  }catch(e){if(e.code!=='ENOENT')throw e;}}
  visit(src);
}
const manifest={createdAt:new Date().toISOString(),source:'portfolio content and sanitized public media',entries};
writeFileSync(join(destination,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Created ${entries.length} backed-up files at ${destination}; store this snapshot securely outside the Git repository.`);
