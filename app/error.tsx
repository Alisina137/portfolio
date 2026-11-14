"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("Portfolio route failure", error); }, [error]);
  return <main id="main" tabIndex={-1} className="recovery-page section-pad">
    <div className="container recovery-layout">
      <span className="recovery-code" aria-hidden="true">! /</span>
      <div className="recovery-copy" role="alert"><span className="page-eyebrow">SOMETHING WENT WRONG</span><h1>That didn’t<br/><em>load correctly.</em></h1><p>Try again, or use a direct route back to the published projects. Your browser navigation remains available.</p>
        <div className="recovery-actions"><button type="button" className="button button-primary" onClick={() => reset()}>Try again <ArrowRightIcon /></button><Link className="button button-outline" href="/projects">Browse projects <ArrowRightIcon /></Link></div>
      </div>
    </div>
  </main>;
}
