/** Typed interface for the credential filters implemented by qualifications-core.mjs. */
export function isSafeCredentialUrl(value: unknown): value is string;
export function selectPublicEducation(raw: unknown): unknown[];
export function selectPublicCertificates(raw: unknown): unknown[];
export function selectPublicTraining(raw: unknown): unknown[];
