/**
 * Owner-reviewed availability is a potentially stale factual claim.
 * A public status must be approved, dated and time-limited; draft preferences
 * are NEVER projected to a public route or passed to React.
 */
export const AVAILABILITY_STATUSES=Object.freeze(["not_shared","open","selective","unavailable"]);
export const EMPLOYMENT_TYPES=Object.freeze(["full_time","part_time","contract","internship"]);
export const WORK_MODES=Object.freeze(["remote","hybrid","on_site"]);
export const WORK_REGIONS=Object.freeze(["afghanistan","international_remote"]);
export const FOCUS_AREAS=Object.freeze(["web","mobile","backend","data","fullstack","improvements"]);
const allowedKeys=new Set(["schemaVersion","ownerApproval","status","employmentTypes","workModes","regions","focus","reviewedAt","validUntil","note"]);
const validDate=value=>typeof value==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(value)
  && !Number.isNaN(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
const safeArray=(value,allowed)=>Array.isArray(value)&&value.length<=allowed.length
  && new Set(value).size===value.length&&value.every(item=>allowed.includes(item));
const safeNote=value=>value===null||(typeof value==="string"&&value.trim()===value
  && value.length>=20&&value.length<=260&&!/[<>\u0000-\u001f\u007f]/u.test(value)
  && !/(?:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:\+?\d[\d\s().-]{8,}\d))/iu.test(value));
const daysBetween=(from,to)=>(Date.parse(to+"T00:00:00Z")-Date.parse(from+"T00:00:00Z"))/86400000;

/** Valid for both draft and approved records. Invalid or private keys fail CI. */
export function validateAvailabilityRecord(value){
  if(!value||typeof value!=="object"||Array.isArray(value)
    ||Object.keys(value).some(key=>!allowedKeys.has(key))
    ||Object.keys(value).length!==allowedKeys.size)return false;
  if(value.schemaVersion!==1||!["owner_pending","owner_approved"].includes(value.ownerApproval)
    ||!AVAILABILITY_STATUSES.includes(value.status)
    ||!safeArray(value.employmentTypes,EMPLOYMENT_TYPES)
    ||!safeArray(value.workModes,WORK_MODES)
    ||!safeArray(value.regions,WORK_REGIONS)
    ||!safeArray(value.focus,FOCUS_AREAS)
    ||!safeNote(value.note))return false;
  if(value.regions.includes("international_remote")&&!value.workModes.includes("remote"))return false;
  if(value.ownerApproval==="owner_pending"){
    return value.reviewedAt===null&&value.validUntil===null;
  }
  if(value.status==="not_shared"||!validDate(value.reviewedAt)||!validDate(value.validUntil)
    ||daysBetween(value.reviewedAt,value.validUntil)<1||daysBetween(value.reviewedAt,value.validUntil)>90)return false;
  if(["open","selective"].includes(value.status)){
    return value.employmentTypes.length>0&&value.workModes.length>0&&value.focus.length>0;
  }
  return true; // An owner may announce unavailability without publishing preferences.
}
/** Never show stale status; today is injectable for deterministic regression tests. */
export function isPublicAvailability(record,today=new Date().toISOString().slice(0,10)){
  return validateAvailabilityRecord(record)
    &&record.ownerApproval==="owner_approved"
    &&validDate(today)
    &&record.reviewedAt<=today
    &&record.validUntil>=today;
}
export function projectPublicAvailability(record,today){
  if(!isPublicAvailability(record,today))return null;
  return {
    status:record.status,
    employmentTypes:[...record.employmentTypes],
    workModes:[...record.workModes],
    regions:[...record.regions],
    focus:[...record.focus],
    reviewedAt:record.reviewedAt,
    validUntil:record.validUntil,
    note:record.note
  };
}
