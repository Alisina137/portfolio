import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { studioConfig } from './phase08-core.mjs';

const SESSION = 'portfolio_studio_session';
const FOUR_HOURS = 4 * 60 * 60;

type StudioSession = { id:string; login:string; issuedAt:number; expiresAt:number };
function sign(value:string):string {
  return createHmac('sha256', process.env.PORTFOLIO_STUDIO_SESSION_SECRET ?? '').update(value).digest('base64url');
}
export function createStudioSession(id:string,login:string):string {
  const now=Math.floor(Date.now()/1000);
  const payload=Buffer.from(JSON.stringify({id,login,issuedAt:now,expiresAt:now+FOUR_HOURS})).toString('base64url');
  return `${payload}.${sign(payload)}`;
}
export function verifyStudioSession(raw:string|undefined):StudioSession|null {
  if(!studioConfig().enabled || !raw || raw.length>4000) return null;
  const parts=raw.split('.'); if(parts.length!==2 || !parts[0] || !parts[1])return null;
  const expected=Buffer.from(sign(parts[0]));const supplied=Buffer.from(parts[1]);
  if(expected.length!==supplied.length || !timingSafeEqual(expected,supplied))return null;
  try{
    const parsed:StudioSession=JSON.parse(Buffer.from(parts[0],'base64url').toString('utf8'));
    const now=Math.floor(Date.now()/1000);
    if(parsed.id!==studioConfig().ownerId || typeof parsed.login!=='string' || !/^[a-z\d-]{1,39}$/i.test(parsed.login)
      || !Number.isSafeInteger(parsed.issuedAt) || !Number.isSafeInteger(parsed.expiresAt)
      || parsed.issuedAt>now+60 || parsed.expiresAt<=now || parsed.expiresAt>now+FOUR_HOURS+60)return null;
    return parsed;
  }catch{return null;}
}
export async function getStudioSession(){
  const jar=await cookies();return verifyStudioSession(jar.get(SESSION)?.value);
}
export const studioCookieName=SESSION;
export const studioCookieOptions={httpOnly:true,sameSite:'lax' as const,secure:process.env.NODE_ENV==='production',path:'/',maxAge:FOUR_HOURS};
