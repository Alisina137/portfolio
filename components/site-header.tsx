"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRightIcon, CloseIcon, MenuIcon } from "./icons";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { label: "Home", href: "/", current: true },
  { label: "Selected work", href: "#selected-work", current: false },
  { label: "Approach", href: "#approach", current: false },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 14);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(panelRef.current?.querySelectorAll<HTMLElement>("a, button:not([disabled])") ?? []);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    function onPointerDown(event: PointerEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    function onResize() { if (window.innerWidth >= 768) setOpen(false); }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return <header ref={headerRef} className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
    <div className="container header-inner">
      <a className="brand" href="/" aria-label="Alisina — homepage" onClick={() => setOpen(false)}>
        <span className="brand-mark" aria-hidden="true"><span>AS</span></span>
        <span className="brand-wordmark">Alisina<span className="brand-dot">.</span></span>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => <a className={item.current ? "nav-link nav-link--active" : "nav-link"}
          href={item.href} key={item.href} aria-current={item.current ? "page" : undefined}>{item.label}</a>)}
      </nav>
      <div className="header-tools">
        <a className="header-github" href="https://github.com/Alisina137" target="_blank" rel="noopener noreferrer">
          GitHub <ArrowUpRightIcon width="15" height="15" /><span className="sr-only">(opens in a new tab)</span>
        </a>
        <ThemeToggle />
        <button type="button" ref={triggerRef} className="icon-button menu-trigger" aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)}>
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </div>
    {open && <div className="menu-backdrop" aria-hidden="true" onClick={close} />}
    <div id="mobile-navigation" className={`mobile-navigation ${open ? "mobile-navigation--open" : ""}`}
      ref={panelRef} aria-hidden={!open} inert={!open}>
      <nav aria-label="Mobile navigation" className="container mobile-nav-list">
        {navItems.map((item, index) => <a href={item.href} className="mobile-nav-link" onClick={close} key={item.href}>
          <span className="mobile-nav-index">0{index + 1}</span><span>{item.label}</span>
          <span aria-hidden="true" className="mobile-nav-trailing">↗</span>
        </a>)}
        <a href="https://github.com/Alisina137" target="_blank" rel="noopener noreferrer" className="mobile-nav-link" onClick={close}>
          <span className="mobile-nav-index">↗</span><span>GitHub profile</span><span className="mobile-nav-trailing" aria-hidden="true">↗</span>
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </nav>
    </div>
  </header>;
}
