/**
 * Phase 11 — keep personal credentials out of public HTML until approved and reviewed.
 * Data is stored in the public repository: don't commit private scans or unapproved details.
 */
export function isSafeCredentialUrl(value) {
  if (typeof value !== "string" || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.port &&
      !url.hash.startsWith("#javascript") && url.hostname.includes(".");
  } catch { return false; }
}
const text = value => typeof value === "string" && value.trim().length >= 3 && value.length <= 240;
const year = value => value === undefined || (Number.isInteger(value) && value >= 1900 && value <= 2100);
const credentialDate = value => value === undefined || (typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value));
const reviewed = row => row?.ownerApproved === true && row?.documentReviewed === true;
const common = row => reviewed(row) && text(row.id) && /^[a-z0-9-]+$/.test(row.id) &&
  text(row.title) && (row.description === undefined || text(row.description));

function safeList(value) { return Array.isArray(value) ? value : []; }

export function selectPublicEducation(raw) {
  return safeList(raw?.education).filter(row =>
    common(row) && text(row.institution) &&
    year(row.startYear) && year(row.endYear) &&
    (row.startYear === undefined || row.endYear === undefined || row.endYear >= row.startYear) &&
    (row.field === undefined || text(row.field)) &&
    (row.academicProjects === undefined || (Array.isArray(row.academicProjects) &&
      row.academicProjects.every(slug => typeof slug === "string" && /^[a-z0-9-]+$/.test(slug))))
  );
}
export function selectPublicCertificates(raw) {
  return safeList(raw?.certifications).filter(row =>
    common(row) && text(row.issuer) && credentialDate(row.issuedOn) &&
    (row.credentialUrl === undefined || isSafeCredentialUrl(row.credentialUrl))
  );
}
export function selectPublicTraining(raw) {
  return safeList(raw?.training).filter(row =>
    common(row) && text(row.provider) && credentialDate(row.completedOn)
  );
}
