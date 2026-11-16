import type { Metadata, Viewport } from "next";
// Versioned, self-hosted variable fonts: no runtime connection to a font CDN.
import "@fontsource-variable/manrope/wght.css";
import "@fontsource-variable/vazirmatn/wght.css";
import { createPageMetadata } from "@/lib/seo";
import "@/styles/globals.css";
import "@/styles/phase08.css";
import "@/styles/locales.css";
import "@/styles/premium.css";
import "@/styles/type-scale.css";
import "@/styles/phase09.css";
import "@/styles/phase10.css";
import "@/styles/phase11.css";
import "@/styles/phase12.css";
import "@/styles/phase13.css";
import "@/styles/phase14.css";
import "@/styles/phase15.css";
import "@/styles/phase16.css";
import "@/styles/phase17.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getPublicIdentity } from "@/lib/public-identity";
import { writingIsLive } from "@/lib/writing";
import { headers } from "next/headers";
import { LocaleDocument } from "@/components/locale-document";
import { visibleLanguages } from "@/lib/i18n";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Alisina Sarwari — Software Engineer & Product Builder",
    description: "Explore source-reviewed web, mobile, education and marketplace projects by Alisina Sarwari, with engineering case studies and professional contact links.",
    pathname: "/",
  }),
  applicationName: "Alisina — Portfolio",
  category: "technology",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0B111B" };

const themeBootstrap = `(()=>{try{const saved=localStorage.getItem('portfolio-theme');if(saved==='light'||saved==='dark')document.documentElement.setAttribute('data-theme',saved)}catch(e){}})();`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const currentLocale = (await headers()).get("x-portfolio-locale");
  const locale = currentLocale === "fa" || currentLocale === "ps" ? currentLocale : "en";
  const availableLocales = visibleLanguages();
  const { github, linkedIn, email, resume } = getPublicIdentity();
  const showWriting = writingIsLive();
  return <html lang={locale} dir={locale === "en" ? "ltr" : "rtl"} data-scroll-behavior="smooth" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: themeBootstrap }} /></head>
    <body>
      <LocaleDocument availableLocales={availableLocales} />
      <a className="skip-link" href="#main">{locale === "fa" ? "رفتن به محتوای اصلی" : locale === "ps" ? "اصلي منځپانګې ته تلل" : "Skip to main content"}</a>
      <div id="top" />
      <SiteHeader resumeHref={resume} showWriting={showWriting} availableLocales={availableLocales} />
      {children}
      <SiteFooter github={github} linkedIn={linkedIn} email={email} resume={resume} showWriting={showWriting} />
    </body>
  </html>;
}
