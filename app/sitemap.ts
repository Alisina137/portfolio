import type { MetadataRoute } from "next";
import { getPublishedProjects, getCaseStudy } from "@/lib/content";
import { canIndexPortfolio } from "@/lib/seo";
import { getPageUrl } from "@/lib/site-url.mjs";

/** Only approved, reachable, case-study routes are included. No draft slugs. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!canIndexPortfolio()) return [];
  const staticPaths = ["/", "/projects", "/about", "/contact"];
  const projectPaths = getPublishedProjects().filter(p => p.contentApproval === "owner_approved" && Boolean(getCaseStudy(p.slug)))
    .map(p => `/projects/${p.slug}`);
  return [...staticPaths, ...projectPaths].map(path => ({ url: getPageUrl(path)!, changeFrequency: "monthly" as const, priority: path === "/" ? 1 : path.startsWith("/projects/") ? 0.6 : 0.8 }));
}
