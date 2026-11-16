import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { selectPublicEducation, selectPublicCertificates, selectPublicTraining } from "../lib/qualifications-core.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
const records = read("content/qualifications.json");
const projectRecords = read("content/projects.json");
const cases = read("content/case-studies.json");
const published = new Set(projectRecords.filter(p => p.publicationStatus === "published" && p.repoUrlVerified && cases.some(c => c.slug === p.slug)).map(p => p.slug));
const issues = [];
const fail = reason => issues.push(reason);

if (records.schemaVersion !== 1) fail("qualifications schemaVersion must equal 1");
for (const [category, selector] of [
  ["education", selectPublicEducation],
  ["certifications", selectPublicCertificates],
  ["training", selectPublicTraining],
]) {
  const rows = records[category];
  if (!Array.isArray(rows)) { fail(category + " must be an array"); continue; }
  const safe = selector(records);
  if (safe.length !== rows.length) fail(category + " must not contain unapproved or malformed credential data in this public repo");
  const ids = rows.map(row => row?.id);
  if (new Set(ids).size !== ids.length) fail(category + " credential ids must be unique");
}
for (const item of records.education ?? []) {
  if (!Array.isArray(item.academicProjects) && item.academicProjects !== undefined) fail("academicProjects must be an array");
  for (const slug of item.academicProjects ?? []) if (!published.has(slug)) fail("Unknown or unpublished academic project " + slug);
}
if (!Array.isArray(records.independentLearningProjects) ||
  records.independentLearningProjects.length === 0 ||
  records.independentLearningProjects.length > 4) {
  fail("independentLearningProjects must list 1–4 real, published project examples");
} else {
  if (new Set(records.independentLearningProjects).size !== records.independentLearningProjects.length) fail("duplicate learning project slug");
  for (const slug of records.independentLearningProjects) if (!published.has(slug)) fail("Unknown or unpublished independent learning project " + slug);
}
if (issues.length) {
  console.error("Credential content review failed:\n" + issues.map(message => "- " + message).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Qualifications checked: " + records.education.length + " reviewed education, " +
    records.certifications.length + " reviewed certificates, " + records.training.length +
    " reviewed training records; " + records.independentLearningProjects.length + " source-backed project examples.");
}
