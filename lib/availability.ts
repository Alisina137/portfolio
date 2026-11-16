import "server-only";
import source from "@/content/availability.json";
import { projectPublicAvailability, type AvailabilityInput } from "@/lib/availability-core.mjs";

/** Publication-safe projection; never return owner-pending preferences. */
export function getPublicAvailability(){
  return projectPublicAvailability(source as AvailabilityInput);
}
