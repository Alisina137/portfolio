import type { Metadata } from "next";
import profile from "@/content/profile.json";
import launchApproval from "@/content/launch-approval.json";
import { hasLaunchApproval } from "@/lib/release-audit.mjs";
import { getPublishedProjects } from "@/lib/content";
import { getSiteUrl, isPublicIndexingEnabled, getPageUrl } from "@/lib/site-url.mjs";
import { localizePath, stripLocale, supportedPublicPath } from "@/lib/i18n-core.mjs";
import { translationsOwnerApproved } from "@/lib/i18n";

const brand = "Alisina Sarwari";

/** Publication cannot be enabled by an environment variable alone. */
export function canIndexPortfolio(): boolean {
  return isPublicIndexingEnabled()
    && hasLaunchApproval(launchApproval)
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
  const sourcePath = stripLocale(pathname);
  // Never advertise a translation whose owner approval, RTL acceptance or source revision is pending.
  const available = supportedPublicPath(sourcePath) && !sourcePath.startsWith('/writing') ?
    (['fa','ps'] as const).filter(translationsOwnerApproved) : [];
  const languages = available.length && origin ? Object.fromEntries([
    ['en', getPageUrl(sourcePath)],
    ...available.map(locale => [locale, getPageUrl(localizePath(locale, sourcePath))]),
    ['x-default', getPageUrl(sourcePath)],
  ].filter((entry): entry is [string,string] => Boolean(entry[1]))) : undefined;
  return {
    title,
    description,
    ...(origin && { metadataBase: new URL(origin) }),
    ...(url && { alternates: { canonical: url, ...(languages && { languages }) } }),
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
