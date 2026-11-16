import Link from "next/link";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/icons";
import { RepositoryExplorer, RepositoryGrid, type RepoWords } from "@/components/repository-explorer";
import { getFeaturedRepositories, getRepositories, type RepoLocale } from "@/lib/repositories";
import { getTranslatedUi } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n-core.mjs";

const en={
  repositories:"Repositories",repoEyebrow:"CODE & CASE STUDIES",
  repoPreviewTitle:"Open source. Real project context.",
  repoPreviewIntro:"Selected public repositories connected to real product case studies—explore the code as well as the decisions behind it.",
  repoPreviewAction:"Explore all GitHub repositories",
  repoHeroEyebrow:"GITHUB / VERIFIED PUBLIC SOURCES",
  repoHeroTitle:"Explore the code behind the projects.",
  repoHeroIntro:"A curated directory of public repositories, each checked against its GitHub URL and linked back to the corresponding case study.",
  repoHeroNote:"This is a dated public-repository directory, not a live GitHub activity feed. No unverified stars, commit counts, forks, or popularity metrics.",
  repoSearch:"Find repository",repoSearchPlaceholder:"Search repos, technologies and projects",
  repoAll:"All repositories",repoApps:"Product projects",repoSite:"Portfolio source",
  repoSortLabel:"Sort repositories",repoSortFeatured:"Featured first",repoSortName:"Name A–Z",
  repoCount:"Showing {count} of {total} verified public repositories",
  repoEmpty:"No repositories match those filters.",repoClear:"Clear filters",
  repoOpen:"Open on GitHub",repoCase:"Read case study",
  repoSourceChecked:"URL verified",repoLanguage:"GitHub language",repoBranch:"Default branch",
  repoNoMetrics:"GitHub links, default branches and primary languages were verified on the displayed date. Project descriptions and technologies come from reviewed portfolio records, not a live API. No activity or popularity statistics are implied.",
  repoFooterTitle:"Code tells part of the story.",repoFooterText:"Explore the purpose, architecture, trade-offs and present development state behind each repository.",
  repoFooterAction:"Explore project case studies",
};
function words(locale:RepoLocale){return locale==="en"?en:getTranslatedUi(locale);}
export function RepositoriesPreview({locale="en"}:{locale?:RepoLocale}){
  const t=words(locale),repos=getFeaturedRepositories(locale);
  if(!repos.length)return null;
  const subset:RepoWords={
    repoSearch:t.repoSearch,repoSearchPlaceholder:t.repoSearchPlaceholder,repoAll:t.repoAll,
    repoApps:t.repoApps,repoSite:t.repoSite,repoSortLabel:t.repoSortLabel,repoSortFeatured:t.repoSortFeatured,
    repoSortName:t.repoSortName,repoCount:t.repoCount,repoEmpty:t.repoEmpty,repoClear:t.repoClear,
    repoOpen:t.repoOpen,repoCase:t.repoCase,repoSourceChecked:t.repoSourceChecked,repoLanguage:t.repoLanguage,
    repoBranch:t.repoBranch,repoNoMetrics:t.repoNoMetrics,
  };
  return <section id="repositories" className="repo-preview section-pad" aria-labelledby="repositories-preview-title"><div className="container">
    <div className="repo-heading"><span className="section-eyebrow"><span>07</span><span className="section-eyebrow-line"/>{t.repoEyebrow}</span>
      <div className="repo-heading-grid"><h2 id="repositories-preview-title">{t.repoPreviewTitle}</h2><p>{t.repoPreviewIntro}</p></div></div>
    <RepositoryGrid repos={repos} locale={locale} words={subset}/>
    <div className="repo-preview-footer"><p>{t.repoHeroNote}</p><Link className="button button-outline" href={localizePath(locale,"/repositories")}>{t.repoPreviewAction}<ArrowRightIcon width="18" height="18"/></Link></div>
  </div></section>;
}
export function RepositoriesPageView({locale="en"}:{locale?:RepoLocale}){
  const t=words(locale),repos=getRepositories(locale);
  const w:RepoWords={
    repoSearch:t.repoSearch,repoSearchPlaceholder:t.repoSearchPlaceholder,repoAll:t.repoAll,
    repoApps:t.repoApps,repoSite:t.repoSite,repoSortLabel:t.repoSortLabel,repoSortFeatured:t.repoSortFeatured,
    repoSortName:t.repoSortName,repoCount:t.repoCount,repoEmpty:t.repoEmpty,repoClear:t.repoClear,
    repoOpen:t.repoOpen,repoCase:t.repoCase,repoSourceChecked:t.repoSourceChecked,repoLanguage:t.repoLanguage,
    repoBranch:t.repoBranch,repoNoMetrics:t.repoNoMetrics,
  };
  return <main id="main" tabIndex={-1}>
    <section className="repo-hero section-pad" aria-labelledby="repositories-title"><div className="container repo-hero-grid">
      <div><span className="page-eyebrow"><span>06 /</span> {t.repoHeroEyebrow}</span>
        <h1 id="repositories-title">{t.repoHeroTitle}</h1>
        <p>{t.repoHeroIntro}</p>
        <a className="button button-primary" href="#repository-directory">{t.repoPreviewAction}<ArrowRightIcon width="18" height="18"/></a>
      </div>
      <div className="repo-hero-visual" role="img" aria-label={t.repoEyebrow}>
        <svg viewBox="0 0 390 320" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M82 70v180h210M82 160h122v-80h88M204 160v75h88" stroke="currentColor" strokeWidth="2" strokeDasharray="7 8" opacity=".55"/>
          <rect x="43" y="35" width="78" height="68" rx="18" stroke="currentColor" strokeWidth="2"/>
          <rect x="166" y="126" width="76" height="68" rx="18" stroke="currentColor" strokeWidth="2"/>
          <rect x="256" y="43" width="76" height="68" rx="18" stroke="currentColor" strokeWidth="2"/>
          <circle cx="82" cy="250" r="13" fill="currentColor"/>
          <circle cx="292" cy="250" r="13" fill="currentColor"/>
          <circle cx="292" cy="81" r="12" fill="currentColor"/>
          <path d="m65 69 12 9 25-25M187 155l12 9 25-25M274 80h35" stroke="var(--bg)" strokeWidth="2.3" strokeLinecap="round"/>
        </svg>
        <span className="repo-visual-caption" dir="ltr">SOURCE → PRODUCT → LEARNING</span>
      </div>
    </div></section>
    <section className="repo-directory section-pad" id="repository-directory" aria-labelledby="repo-directory-title"><div className="container">
      <div className="repo-heading"><span className="section-eyebrow"><span>01</span><span className="section-eyebrow-line"/>{t.repoEyebrow}</span>
        <div className="repo-heading-grid"><h2 id="repo-directory-title">{t.repoPreviewTitle}</h2><p>{t.repoHeroNote}</p></div></div>
      <RepositoryExplorer repos={repos} locale={locale} words={w}/>
    </div></section>
    <section className="repo-close section-pad" aria-labelledby="repo-close-title"><div className="container">
      <h2 id="repo-close-title">{t.repoFooterTitle}</h2><p>{t.repoFooterText}</p>
      <Link href={localizePath(locale,"/projects")} className="button button-primary">{t.repoFooterAction}<ArrowRightIcon width="18" height="18"/></Link>
    </div></section>
  </main>;
}
