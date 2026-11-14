/** Server-only content projection. Never send unapproved raw profile data to the client. */
import fs from "node:fs";
import path from "node:path";
import rawProfile from "@/content/profile.json";
import { resolvePublicIdentity, type IdentityInput } from "@/lib/public-identity-core";

export function getPublicIdentity() {
  const pdfExists = fs.existsSync(path.join(process.cwd(), "public", "resume.pdf"));
  return resolvePublicIdentity(rawProfile as IdentityInput, pdfExists);
}
