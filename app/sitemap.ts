import type { MetadataRoute } from "next";
import { getPublishedProjects, getCaseStudy } from "@/lib/content";
import { canIndexPortfolio } from "@/lib/seo";
import { getPageUrl } from "@/lib/site-url.mjs";
import { getPublicWriting, writingIsLive } from "@/lib/writing";

/** Only approved, reachable, case-study routes are included. No draft slugs. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!canIndexPortfolio()) return [];
  const staticPaths = ["/", "/projects", "/about", "/contact"];
  const projectPaths = getPublishedProjects().filter(p => p.contentApproval === "owner_approved" && Boolean(getCaseStudy(p.slug)))
    .map(p => `/projects/${p.slug}`);
  const writingPaths = writingIsLive() ? ["/writing", ...getPublicWriting().map(article => `/writing/${article.slug}`)] : [];
  return [...staticPaths, ...projectPaths, ...writingPaths].map(path => ({ url: getPageUrl(path)!, changeFrequency: "monthly" as const, priority: path === "/" ? 1 : path.startsWith("/projects/") ? 0.6 : 0.8 }));
}
