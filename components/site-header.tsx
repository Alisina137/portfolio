"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRightIcon, CloseIcon, MenuIcon } from "./icons";
import { ThemeToggle } from "./theme-toggle";
import { getUi, localeFromPath, localizePath } from "@/lib/i18n-client";
import { supportedPublicPath, stripLocale } from "@/lib/i18n-core.mjs";
import type { Locale } from "@/lib/i18n-core.mjs";

const mainNavItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Now", href: "/now" },
  { label: "Repositories", href: "/repositories" },
  { label: "Skills", href: "/#skills" },
  { label: "Experience", href: "/#experience" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader({ resumeHref, showWriting = false, availableLocales = ['en'] }: { resumeHref?: string | null; showWriting?: boolean; availableLocales?: Locale[] }) {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const ui = locale === 'en' ? null : getUi(locale);
  const showLocaleWriting = showWriting && locale === "en";
  const navItems = (showLocaleWriting ? [...mainNavItems.slice(0, 2), { label: 'Writing', href: '/writing' }, ...mainNavItems.slice(2)] : mainNavItems)
    .map(item => ({ ...item, label: ui ? ui[item.label.toLowerCase() as 'home'|'projects'|'services'|'now'|'repositories'|'skills'|'experience'|'about'|'contact'|'writing'] : item.label, href: localizePath(locale, item.href) }));
  function selectLocale(next: Locale) {
    if (next === locale) return;
    if (next === 'en') document.cookie = 'portfolio-language=en; path=/; SameSite=Lax; max-age=31536000';
    window.location.assign(`${localizePath(next, pathname)}${window.location.search}${window.location.hash}`);
  }
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]);

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
    function onResize() { if (window.innerWidth >= 1601) setOpen(false); }
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
      <Link className="brand" href={localizePath(locale, "/")} aria-label={ui ? `Alisina — ${ui.home}` : "Alisina — homepage"} onClick={() => setOpen(false)}>
        <span className="brand-mark" aria-hidden="true"><span>AS</span></span>
        <span className="brand-wordmark">Alisina<span className="brand-dot">.</span></span>
      </Link>
      <nav className="desktop-nav" aria-label={ui?.nav ?? "Primary navigation"}>
        {navItems.map((item) => { const active = item.href === localizePath(locale, "/") ? pathname === item.href : pathname.startsWith(item.href); return <Link className={active ? "nav-link nav-link--active" : "nav-link"}
          href={item.href} key={item.href} aria-current={active ? "page" : undefined}>{item.label}</Link>; })}
      </nav>
      <div className="header-tools">
        <a className="header-github" href="https://github.com/Alisina137" target="_blank" rel="noopener noreferrer">
          GitHub <ArrowUpRightIcon width="15" height="15" /><span className="sr-only">({ui?.newTab ?? "opens in a new tab"})</span>
        </a>
        {resumeHref && <a className="header-resume" href={resumeHref} target="_blank" rel="noopener noreferrer">{ui?.resume ?? "Résumé"} <ArrowUpRightIcon width="14" height="14" /><span className="sr-only">({ui?.newTab ?? "opens PDF in a new tab"})</span></a>}
        {availableLocales.length > 1 && supportedPublicPath(stripLocale(pathname)) && <label className="locale-selector">
          <span className="sr-only">{ui?.language ?? 'Website language'}</span>
          <select value={locale} aria-label={ui?.language ?? 'Website language'} onChange={event => selectLocale(event.target.value as Locale)}>
            {availableLocales.map(option => <option value={option} key={option}>{option === 'en' ? 'English' : option === 'fa' ? 'دری' : 'پښتو'}</option>)}
          </select>
        </label>}
        <ThemeToggle />
        <button type="button" ref={triggerRef} className="icon-button menu-trigger" aria-label={open ? (ui?.menuClose ?? "Close navigation menu") : (ui?.menuOpen ?? "Open navigation menu")}
          aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)}>
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </div>
    {open && <div className="menu-backdrop" aria-hidden="true" onClick={close} />}
    <div id="mobile-navigation" className={`mobile-navigation ${open ? "mobile-navigation--open" : ""}`}
      ref={panelRef} aria-hidden={!open} inert={!open}>
      <nav aria-label={ui?.mobileNav ?? "Mobile navigation"} className="container mobile-nav-list">
        {navItems.map((item, index) => <Link href={item.href} aria-current={(item.href === localizePath(locale, "/") ? pathname === item.href : pathname.startsWith(item.href)) ? "page" : undefined} className="mobile-nav-link" onClick={close} key={item.href}>
          <span className="mobile-nav-index">0{index + 1}</span><span>{item.label}</span>
          <span aria-hidden="true" className="mobile-nav-trailing">↗</span>
        </Link>)}
        {resumeHref && <a href={resumeHref} target="_blank" rel="noopener noreferrer" className="mobile-nav-link" onClick={close}><span className="mobile-nav-index">PDF</span><span>{ui?.viewResume ?? "View résumé"}</span><span className="mobile-nav-trailing" aria-hidden="true">↗</span></a>}
        <a href="https://github.com/Alisina137" target="_blank" rel="noopener noreferrer" className="mobile-nav-link" onClick={close}>
          <span className="mobile-nav-index">↗</span><span>{ui?.githubProfile ?? "GitHub profile"}</span><span className="mobile-nav-trailing" aria-hidden="true">↗</span>
          <span className="sr-only">({ui?.newTab ?? "opens in a new tab"})</span>
        </a>
      </nav>
    </div>
  </header>;
}
