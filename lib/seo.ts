import type { Metadata } from "next";
import profile from "@/content/profile.json";
import { getPublishedProjects } from "@/lib/content";
import { getSiteUrl, isPublicIndexingEnabled, getPageUrl } from "@/lib/site-url.mjs";

const brand = "Alisina Sarwari";

/** Publication cannot be enabled by an environment variable alone. */
export function canIndexPortfolio(): boolean {
  return isPublicIndexingEnabled()
    && profile.ownerBioApproved
    && profile.publicEmailApproved
    && Boolean(profile.publicEmail)
    && getPublishedProjects().every(project => project.contentApproval === "owner_approved");
}

export function createPageMetadata({ title, description, pathname }: { title: string; description: string; pathname: string }): Metadata {
  const origin = getSiteUrl();
  const url = getPageUrl(pathname);
  const indexable = canIndexPortfolio();
  const image = `${pathname === "/" ? "" : pathname}/opengraph-image`;
  return {
    title,
    description,
    ...(origin && { metadataBase: new URL(origin) }),
    ...(url && { alternates: { canonical: url } }),
    robots: { index: indexable, follow: indexable, googleBot: { index: indexable, follow: indexable } },
    openGraph: {
      type: "website",
      siteName: `${brand} — Portfolio`,
      locale: "en_US",
      title,
      description,
      ...(url && { url }),
      ...(origin && { images: [{ url: `${origin}${image}`, width: 1200, height: 630, alt: `${title} — portfolio preview` }] }),
    },
    twitter: { card: "summary_large_image", title, description,
      ...(origin && { images: [`${origin}${image}`] }),
    },
  };
}
