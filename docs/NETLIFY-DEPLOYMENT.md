# Netlify preview deployment and GitHub continuous deployment

This portfolio uses Next.js 16 App Router, SSR/route handlers, and `proxy.ts`.
Import it as a **Next.js** project, not a static HTML/drag-and-drop site.
Netlify's built-in OpenNext integration is automatic; do **not** install or pin
a legacy Next.js build plugin or use `next export`.

## Owner-only account steps

1. Sign into https://app.netlify.com using an account you control.
2. Choose **Add new project → Import an existing project → GitHub**.
3. Approve Netlify's GitHub App only for `Alisina137/portfolio` if you want
   limited access. Choose repository `Alisina137/portfolio`.
4. Set **Production branch** to `main`. Keep base directory as repository
   root. This repository's `netlify.toml` specifies build command
   `npm run build`, publish directory `.next`, and Node 24. Confirm that the
   framework is detected as Next.js.
5. Before publishing, configure environment variable
   `PORTFOLIO_LAUNCH_APPROVED=false`. Keep
   `PORTFOLIO_STUDIO_ENABLED=false`,
   `PORTFOLIO_CONTACT_ENABLED=false`, and
   `PORTFOLIO_LOCALE_PREVIEW=false` (or leave their optional
   functionality unconfigured). Do not put secrets or `.env` files in Git.
6. Select **Deploy**. Inspect the Netlify deploy log until it shows
   **Published**. When published, Netlify assigns an HTTPS
   `https://<your-actual-site-name>.netlify.app` URL; this is not known
   until Netlify creates your site. If a new site is private by default,
   make it public when you intend to share this preview.
7. Once the real HTTPS site address is known, set
   `NEXT_PUBLIC_SITE_URL=https://<your-actual-site-name>.netlify.app`
   **without a trailing slash or any path** in the Netlify project
   environment variables. Trigger a fresh deployment so generated
   metadata uses the real HTTPS origin.
8. Open the final URL in a browser and verify `/`, `/projects`,
   `/projects/maktablink`, `/about`, `/contact`, a fake URL
   that must return 404, theme switching and mobile navigation.
   Also confirm `/robots.txt` disallows indexing until P05 approval.
   For automated remote HTTP checks, run locally:
   `npm run smoke:deployed -- --url=https://<actual-site>.netlify.app --mode=preview`.
9. In Netlify's **Project configuration → Developer settings →
   Continuous deployment**, confirm the linked repository is
   `Alisina137/portfolio`, production branch is `main`, and builds
   are active. Future **merged/pushed commits to main** trigger a fresh
   Netlify production deployment automatically. Unmerged PRs do not
   replace the production deployment.
10. On a bad deploy, use Netlify's deploy history to **restore/publish
    a known-good deploy**. Do not force-reset the Git repository.

## Preview is online, but not yet launch-approved

Netlify publishing makes an internet-accessible site, **not** a guarantee
that the owner approved its text, contact details, project claims,
screenshots or public search indexing. Current release gates deliberately
leave `PORTFOLIO_LAUNCH_APPROVED=false` and robots noindex/disallow until
the checklist in `docs/PHASE-05.md` has been genuinely completed.
Noindex is not authentication: anyone with the URL may still view the
preview. Use Netlify access controls if it must be confidential.
No genuine owner Studio or public contact form should be enabled without
all their documented providers and secrets.

Netlify's project import walkthrough:
https://docs.netlify.com/manage/projects/add-new-project/
Next.js runtime:
https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
