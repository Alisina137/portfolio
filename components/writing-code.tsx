"use client";
import { useState } from "react";

/** Copy is progressive enhancement: selecting the code manually always works. */
export function WritingCode({ code, language, children }: { code: string; language: string; children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unsupported');
      await navigator.clipboard.writeText(code);
      setMessage("Copied");
    } catch {
      setMessage("Copy unavailable — select the code to copy it");
    }
  }
  return <figure className="writing-code">
    <figcaption className="writing-code-toolbar"><span>{language === "text" ? "EXAMPLE" : language.toUpperCase()}</span><button type="button" onClick={copy} aria-label={`Copy ${language} code example`}>Copy code</button></figcaption>
    <pre tabIndex={0} aria-label={`${language} code example`}><code>{children}</code></pre>
    <span className="writing-code-feedback" aria-live="polite" role="status">{message}</span>
  </figure>;
}
