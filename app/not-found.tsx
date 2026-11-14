import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

export default function NotFound() {
  return <main id="main" tabIndex={-1} className="recovery-page section-pad">
    <div className="container recovery-layout">
      <span className="recovery-code" aria-hidden="true">404 /</span>
      <div className="recovery-copy"><span className="page-eyebrow">WRONG TURN</span><h1>This page<br/><em>isn’t here.</em></h1><p>The link might have changed, or this project may no longer be publicly listed. You can still explore the currently available work.</p>
        <div className="recovery-actions"><Link href="/projects" className="button button-primary">Browse projects <ArrowRightIcon /></Link><Link href="/" className="button button-outline">Back home <ArrowRightIcon /></Link></div>
      </div>
    </div>
  </main>;
}
