/**
 * Public measurable results are a separate, evidence-reviewed channel.
 * Project scope and repository counts never imply user adoption or client impact.
 */
const safeText=(x,min=3,max=280)=>typeof x==="string" && x.trim().length>=min && x.length<=max;
const slug=x=>typeof x==="string" && /^[a-z0-9-]+$/.test(x);
const number=x=>typeof x==="number" && Number.isFinite(x) && x>=0 && x<=1e12;
const safeSource=x=>{
  if(typeof x!=="string" || x.length>1000)return false;
  try{const u=new URL(x);return u.protocol==="https:" && !u.username && !u.password && !u.port && u.hostname==="github.com" && u.pathname.startsWith("/Alisina137/");}catch{return false;}
};
export function approvedMeasuredOutcomes(data){
  const rows=Array.isArray(data?.measuredOutcomes)?data.measuredOutcomes:[];
  return rows.filter(x=>x && typeof x==="object" &&
    x.ownerApproved===true && x.evidenceReviewed===true &&
    slug(x.id) && safeText(x.title) && safeText(x.unit,2,60) &&
    safeText(x.timeframe,6,90) && safeText(x.methodology,24,500) &&
    number(x.value) && safeSource(x.sourceUrl) &&
    (x.projectSlug===undefined || slug(x.projectSlug)));
}
