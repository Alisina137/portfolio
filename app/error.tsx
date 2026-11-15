"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { usePathname } from "next/navigation";
import { localeFromPath, localizePath } from "@/lib/i18n-core.mjs";
import { getUi } from "@/lib/i18n-client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Portfolio route failure", error); }, [error]);
  const locale = localeFromPath(usePathname());
  const ui = locale === "en" ? null : getUi(locale);
  const title = locale === "fa" ? "صفحه درست بار نشد." : locale === "ps" ? "پاڼه سمه نه شوه پرانیستل." : "That didn’t load correctly.";
  const summary = locale === "fa" ? "دوباره کوشش کنید یا از مسیر مستقیم به پروژه‌ها برگردید." : locale === "ps" ? "بیا هڅه وکړئ یا په مستقیم ډول پروژو ته لاړ شئ." : "Try again, or use a direct route back to the published projects. Your browser navigation remains available.";
  return <main id="main" tabIndex={-1} className="recovery-page section-pad">
    <div className="container recovery-layout">
      <span className="recovery-code" aria-hidden="true">! /</span>
      <div className="recovery-copy" role="alert"><span className="page-eyebrow">{locale === "fa" ? "خطا" : locale === "ps" ? "تېروتنه" : "SOMETHING WENT WRONG"}</span><h1>{title}</h1><p>{summary}</p>
        <div className="recovery-actions"><button type="button" className="button button-primary" onClick={() => reset()}>{locale === "fa" ? "دوباره کوشش کنید" : locale === "ps" ? "بیا هڅه وکړئ" : "Try again"} <ArrowRightIcon /></button><Link className="button button-outline" href={localizePath(locale, "/projects")}>{ui?.browseProjects ?? "Browse projects"} <ArrowRightIcon /></Link></div>
      </div>
    </div>
  </main>;
}
