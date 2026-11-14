"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { CaseMedia } from "@/lib/content";

type Props = { items: CaseMedia[] };

/** Approved, locally hosted media only. Hidden entirely while approved media is absent. */
export function ProjectGallery({ items }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active !== null && !dialog.open) dialog.showModal();
    if (active === null && dialog.open) dialog.close();
  }, [active]);
  if (!items.length) return null;
  const selected = active === null ? null : items[active];
  function close() { setActive(null); openerRef.current?.focus(); }
  function move(delta: number) { setActive(i => i === null ? null : (i + delta + items.length) % items.length); }
  function handleKeys(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Escape") { event.preventDefault(); close(); }
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
  }
  return <section className="case-section" id="gallery" aria-labelledby="gallery-heading">
    <div className="case-section-label">04 / VISUAL EVIDENCE</div><h2 id="gallery-heading">Inside the product.</h2>
    <p className="case-section-lead">Actual approved captures, grouped by the part of the product they show.</p>
    <div className="case-gallery">{items.map((item, index) => <figure className="case-thumb" key={item.src}>
      <button type="button" className="case-thumb-button" onClick={event => { openerRef.current = event.currentTarget; setActive(index); }} aria-label={`Expand ${item.caption}`}><Image src={item.src} alt={item.alt} width={960} height={600} sizes="(max-width: 700px) 100vw, 45vw"/><span className="case-expand" aria-hidden="true">Expand ↗</span></button>
      <figcaption><span>{item.group}</span>{item.caption}</figcaption></figure>)}</div>
    <dialog ref={dialogRef} className="case-lightbox" aria-label="Project image viewer" onClose={() => { setActive(null); openerRef.current?.focus(); }} onCancel={event => { event.preventDefault(); close(); }} onKeyDown={handleKeys} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="case-lightbox-inner">{selected && <>
        <div className="case-lightbox-toolbar"><span>IMAGE {String((active ?? 0) + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span><button type="button" className="case-lightbox-close" onClick={close} aria-label="Close image viewer">Close ×</button></div>
        <Image src={selected.src} alt={selected.alt} width={1440} height={900} sizes="90vw"/>
        <div className="case-lightbox-footer"><button type="button" onClick={() => move(-1)} aria-label="Previous image" disabled={items.length < 2}>← Previous</button><p>{selected.caption}</p><button type="button" onClick={() => move(1)} aria-label="Next image" disabled={items.length < 2}>Next →</button></div>
      </>}</div>
    </dialog>
  </section>;
}
