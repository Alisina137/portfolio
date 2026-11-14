import type { ProjectStatus } from "@/lib/content";

/** Pure UI mapping, safe to include in client bundles without importing editorial records. */
export function getDevelopmentLabel(status: ProjectStatus): string {
  switch (status) {
    case "concept": return "Concept";
    case "prototype": return "Prototype";
    case "in_development": return "In development";
    case "pilot": return "Pilot / beta";
    case "released": return "Released";
    case "maintained": return "Maintained";
    case "retired": return "Retired";
  }
}
