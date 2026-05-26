# V J Desai & Co. LLP — React rebuild

A React + Vite + React Router rebuild of the static site, reusing the existing
design system (`assets/css/*`) verbatim.

## Architecture
- **Shared layout** — `Nav` (hover dropdowns, mobile toggle, active-link) + `Footer`.
- **Routing** — React Router with scroll-to-top and a sub-nav **scroll-spy** (`useScrollSpy`).
- **Real templates (data-driven JSX)**
  - `GstTemplate` — the GST "premium" family (flagship + 24 sub-pages via `src/data/*.js`, incl. auto-generated `auto.js`).
  - `ServiceTemplate` + `PageHero` — Audit & RERA service pages.
  - `KcTemplate` — Knowledge Center overview.
  - Each page's bespoke process diagram is pulled from source markup (`lib/legacy.js → getSection`) so hand-built SVG art is never re-encoded.
- **LegacyPage fallback** — renders any not-yet-converted page from its original `<main>` markup, with links/`go()` rewired to the router. Covers the bespoke one-off pages (KC guides, about/team/career/sitemap, mgmt-cfo, corp-tax, dtax).
- **Contact form** — controlled, POSTs to `/api/contact` (proxied to the Express mail backend in `../server.js`).
- **Per-route `<title>`** (`useDocTitle`), **404** page, code-split bundle (app / vendor / legacy chunks).

## Tooling
- `scripts/extract.mjs` — generates `src/data/auto.js` (hero + services as data) from the source pages.

## Run
```bash
cd react-poc
npm install
npm run dev      # http://localhost:4174  (proxies /api -> :3000)
npm run build    # production bundle in dist/
npm run preview  # serve the production build
```
The contact form needs the mail backend running: `node ../server.js` (port 3000) with SMTP env vars set in `../.env`.

## Deploy
- `netlify.toml` / `vercel.json` include SPA rewrites (so `/gst` etc. resolve on refresh) and an `/api/*` proxy — set `YOUR-MAIL-BACKEND` to your deployed server URL.
- `public/_redirects` is the Netlify SPA fallback.

## Remaining (optional)
- Convert the bespoke one-off pages (KC guides + about/team/why/career/sitemap) from LegacyPage to dedicated JSX (no visual change).
- Move SMTP config into the deploy environment.
