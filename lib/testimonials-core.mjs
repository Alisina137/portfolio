/**
 * Phase 17: Third-party endorsements are not portfolio copy.
 * Never show a quote unless its speaker, context and written publishing permission
 * have been separately checked. Unreviewed submissions are not made public.
 */
export const RELATIONSHIP_TYPES = Object.freeze(["client", "collaborator", "colleague", "mentor"]);
const cleanText=(value,min,max)=>typeof value==="string" && value===value.trim() &&
  value.length>=min && value.length<=max && !/[<>\u0000-\u001f]/u.test(value);
const slug=value=>typeof value==="string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(value);
const day=value=>typeof value==="string" && /^\d{4}-\d{2}-\d{2}$/u.test(value) &&
  !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10)===value;
function safeProfileUrl(value){
  if(value===undefined)return true;
  if(typeof value!=="string" || value.length>350)return false;
  try{
    const url=new URL(value);
    return url.protocol==="https:" && !url.username && !url.password && !url.port &&
      ["github.com","www.linkedin.com","linkedin.com"].includes(url.hostname) &&
      /^\/[\w.%/-]+$/u.test(url.pathname) && url.pathname.length>1 &&
      !url.search && !url.hash;
  }catch{return false;}
}
function noContactData(value){
  return !/(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:\+?\d[\d\s().-]{8,}\d))/iu.test(value);
}
export function isApprovedTestimonial(row){
  return Boolean(row && typeof row==="object" && !Array.isArray(row) &&
    row.published===true && row.ownerApproved===true &&
    row.identityVerified===true && row.evidenceReviewed===true &&
    row.consentToPublish===true &&
    slug(row.id) && cleanText(row.name,3,90) &&
    cleanText(row.role,3,110) &&
    (row.organization===undefined || cleanText(row.organization,2,120)) &&
    RELATIONSHIP_TYPES.includes(row.relationship) &&
    cleanText(row.quote,40,900) && noContactData(row.quote) &&
    cleanText(row.context,15,260) && noContactData(row.context) &&
    day(row.consentedAt) && day(row.reviewedAt) && row.consentedAt<=row.reviewedAt &&
    (row.projectSlug===undefined || slug(row.projectSlug)) &&
    (row.language===undefined || ["en","fa","ps"].includes(row.language)) &&
    safeProfileUrl(row.profileUrl));
}
export function approvedTestimonials(data){
  const entries=Array.isArray(data?.entries)?data.entries:[];
  const seen=new Set();
  return entries.filter(row=>{
    if(!isApprovedTestimonial(row) || seen.has(row.id))return false;
    seen.add(row.id);
    // Public projection: do not expose approval audit fields or internal evidence.
    return true;
  }).map(row=>({
    id:row.id, name:row.name, role:row.role, organization:row.organization,
    relationship:row.relationship, quote:row.quote, context:row.context,
    projectSlug:row.projectSlug, profileUrl:row.profileUrl, language:row.language??"en"
  }));
}
