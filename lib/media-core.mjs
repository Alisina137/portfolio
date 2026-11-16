/**
 * Owner-reviewed, locally hosted case-study media only.
 * No external embeds or URLs, tracking iframes, unapproved screenshots,
 * cross-project file paths, or silent video playback.
 */
const groups = new Set(["Mobile app", "Web/admin", "Workflow/architecture"]);
const devices = new Set(["mobile","desktop","tablet"]);
const cleanText = (x,n) => typeof x === "string" && x.trim().length >= n && x.length <= 360;
function pathOk(value,slug,extension) {
  if(typeof value !== "string" || value.includes("..") || value.includes("%") || value.includes("\\") || value.includes("?") || value.includes("#"))return false;
  return value.startsWith("/media/"+slug+"/") && new RegExp("^/media/"+slug+"/[a-zA-Z0-9_-]+\\."+extension+"$","i").test(value);
}
export function isApprovedCaseMedia(item,slug) {
  if(!item || typeof item !== "object" || !/^[a-z0-9-]+$/.test(slug) || item.approved !== true) return false;
  if(!groups.has(item.group) || !cleanText(item.alt,12) || !cleanText(item.caption,10))return false;
  if(item.device !== undefined && !devices.has(item.device))return false;
  if(item.kind === "video")return pathOk(item.src,slug,"(?:mp4|webm)") &&
    pathOk(item.poster,slug,"(?:png|jpg|jpeg|webp|avif)") &&
    pathOk(item.captions,slug,"vtt");
  if(item.kind === undefined || item.kind === "image")return pathOk(item.src,slug,"(?:png|jpg|jpeg|webp|avif)") &&
    item.poster === undefined && item.captions === undefined;
  return false;
}
export function mediaFiles(item) {
  if(!item || typeof item !== "object") return [];
  return item.kind === "video" ? [item.src,item.poster,item.captions] : [item.src];
}
