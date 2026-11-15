import type { Metadata, Viewport } from "next";
import { createPageMetadata } from "@/lib/seo";
import "@/styles/globals.css";
import "@/styles/phase08.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getPublicIdentity } from "@/lib/public-identity";
import { writingIsLive } from "@/lib/writing";

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { github, linkedIn, email, resume } = getPublicIdentity();
  const showWriting = writingIsLive();
  return <html lang="en" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: themeBootstrap }} /></head>
    <body>
      <a className="skip-link" href="#main">Skip to main content</a>
      <div id="top" />
      <SiteHeader resumeHref={resume} showWriting={showWriting} />
      {children}
      <SiteFooter github={github} linkedIn={linkedIn} email={email} resume={resume} showWriting={showWriting} />
    </body>
  </html>;
}
