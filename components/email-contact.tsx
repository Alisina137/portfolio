"use client";

import { useRef, useState } from "react";
import { ArrowUpRightIcon } from "@/components/icons";
import { getUi } from "@/lib/i18n-client";

/** Receives ONLY an owner-approved public address from the server-side profile projection. */
export function EmailContact({ email, locale='en' }: { email: string; locale?: 'en'|'fa'|'ps' }) {
  const ui=locale==='en'?null:getUi(locale);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">("idle");
  const address = useRef<HTMLSpanElement>(null);

  async function copyEmail() {
    setCopyState("idle");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard not available");
      await navigator.clipboard.writeText(email);
      setCopyState("copied");
    } catch {
      // A blocked/unsupported clipboard is not a success. Select for manual Ctrl+C.
      try {
        const selection = window.getSelection();
        if (address.current && selection) {
          const range = document.createRange();
          range.selectNodeContents(address.current);
          selection.removeAllRanges();
          selection.addRange(range);
          address.current.focus();
        }
      } catch { /* Selectable visible text remains available. */ }
      setCopyState("manual");
    }
  }

  return <section className="contact-email-card" aria-labelledby="email-title">
    <div className="contact-card-icon" aria-hidden="true">@</div>
    <span className="contact-card-eyebrow">{ui?.directContact ?? 'DIRECT CONTACT'}</span>
    <h2 id="email-title">{ui?.sendMessage ?? 'Send a message.'}</h2>
    <p>{ui?.emailIntro ?? 'For a role, project, or collaboration, email is the simplest way to get in touch.'}</p>
    <span className="contact-address" dir="ltr" ref={address} tabIndex={-1}>{email}</span>
    <div className="contact-actions">
      <a className="button button-primary" href={`mailto:${email}`}>Open email app <ArrowUpRightIcon /><span className="sr-only">(opens your configured email application)</span></a>
      <button className="button button-outline" type="button" onClick={copyEmail}>{ui?.copyEmail ?? 'Copy email address'}</button>
    </div>
    <p className="contact-copy-state" role="status" aria-live="polite" aria-atomic="true">{copyState === "copied" ? (ui?.copied ?? "Email address copied to clipboard.") : copyState === "manual" ? (ui?.copyManual ?? "Automatic copy was unavailable. Select the visible address and press Ctrl+C (or Copy on your device).") : ""}</p>
  </section>;
}
