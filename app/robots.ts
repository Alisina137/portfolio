import type { MetadataRoute } from "next";
import { canIndexPortfolio } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url.mjs";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteUrl();
  if (!canIndexPortfolio() || !origin) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${origin}/sitemap.xml`, host: origin };
}
