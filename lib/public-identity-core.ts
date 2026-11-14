/** Pure input-to-public projection: safe to test without Next or the filesystem. */
export type IdentityInput = {
  displayName: string;
  professionalTitle: string;
  headline: string;
  intro: string;
  shortBio: string;
  locationText: string;
  ownerBioApproved?: boolean;
  profileUrl?: string | null;
  profileUrlApproved?: boolean;
  publicEmail?: string | null;
  publicEmailApproved?: boolean;
  linkedInUrl?: string | null;
  linkedInApproved?: boolean;
  resumeUrl?: string | null;
  resumeApproved?: boolean;
  education?: string | null;
  educationApproved?: boolean;
};

export function isValidPublicEmail(value: unknown): value is string {
  return typeof value === "string" && value.length <= 254 &&
    /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
}
function validExternal(value: unknown, hostname: string): value is string {
  if (typeof value !== "string") return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && parsed.hostname === hostname &&
      !parsed.username && !parsed.password && !parsed.port;
  } catch { return false; }
}

export function resolvePublicIdentity(record: IdentityInput, pdfExists: boolean) {
  const email = record.publicEmailApproved && isValidPublicEmail(record.publicEmail)
    ? record.publicEmail : null;
  const github = record.profileUrlApproved && validExternal(record.profileUrl, "github.com")
    ? record.profileUrl : null;
  const linkedIn = record.linkedInApproved && validExternal(record.linkedInUrl, "www.linkedin.com")
    ? record.linkedInUrl : null;
  const resume = record.resumeApproved && record.resumeUrl === "/resume.pdf" && pdfExists
    ? "/resume.pdf" : null;
  const education = record.educationApproved && typeof record.education === "string" &&
    record.education.trim().length ? record.education.trim() : null;
  return {
    name: record.displayName,
    title: record.professionalTitle,
    headline: record.headline,
    intro: record.intro,
    shortBio: record.shortBio,
    location: record.locationText,
    email,
    github,
    linkedIn,
    resume,
    education,
    bioApproved: record.ownerBioApproved === true,
  };
}
