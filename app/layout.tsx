import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Alisina Sarwari — Software Engineer & Product Builder",
  description: "Selected web and mobile product work by Alisina Sarwari, including education, marketplaces and booking systems.",
  robots: { index: false, follow: false }, // P01 preview is NOT launch-approved; P04/P05 controls indexing.
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0B111B" };

const themeBootstrap = `(()=>{try{const saved=localStorage.getItem('portfolio-theme');if(saved==='light'||saved==='dark')document.documentElement.setAttribute('data-theme',saved)}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: themeBootstrap }} /></head>
    <body>
      <a className="skip-link" href="#main">Skip to main content</a>
      <div id="top" />
      <SiteHeader />
      {children}
      <SiteFooter />
    </body>
  </html>;
}
