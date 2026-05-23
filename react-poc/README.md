# V J Desai & Co. LLP — React POC

A proof-of-concept rebuild of the static site in **React + Vite + React Router**,
reusing the existing design system (`assets/css/*`) verbatim.

## What's included
- **Shared layout** — `Nav` (9-item menu with hover dropdowns + mobile toggle + active-link
  highlighting) and `Footer` (single-tier, 4 service columns), as real components.
- **Client-side routing** — React Router, with scroll-to-top on navigation.
- **Fully ported pages** — Home (`/`), Audit & Advisory (`/audit`), Contact (`/contact`).
- **Every other nav/footer link** resolves to a `Placeholder` route (catch-all `/:slug`),
  so navigation is complete even though those pages aren't ported yet.

## Not yet done (would be needed for production)
- Porting the remaining ~47 pages.
- Wiring the contact form to a real backend (API route / form service) — currently it
  just shows a success state.
- SEO/meta per route (e.g. react-helmet), 404 handling, deploy config.

## Run it
```bash
cd react-poc
npm install
npm run dev      # http://localhost:5174
npm run build    # production bundle in dist/
```
