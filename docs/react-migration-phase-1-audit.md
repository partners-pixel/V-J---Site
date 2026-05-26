# React Migration Phase 1 Audit

Project: V J Desai & Co. LLP website  
Phase: Current static-site audit and React migration architecture  
Status: Completed audit, ready for Phase 2 foundation setup

## 1. Current Site Summary

The current website is a multi-page static HTML site with shared CSS, shared HTML includes, and a small Node/PHP mail backend.

Current stack:

- Static pages: `pages/*.html`
- Shared layout fragments: `components/nav.html`, `components/footer.html`
- Styling: `assets/css/variables.css`, `base.css`, `nav.css`, `footer.css`, `components.css`
- Client behavior: `assets/js/include.js`, `nav.js`, `main.js`, `lock.js`
- Contact backend: `server.js`, `api/contact.js`, `mailer.php`
- Existing React proof-of-concept: `react-poc/`

Inventory:

- Page count: 46 HTML pages in `pages/`
- Real live forms: 1 (`pages/contact.html`)
- Inline click handlers in pages: 422
- Shared include placeholders: 92 (`nav` and `footer` includes across pages)
- Repeated page JS script tags: 184
- Largest CSS file: `assets/css/components.css` at about 93 KB

## 2. Existing React POC Finding

There is already a `react-poc/` folder.

It contains:

- Vite + React + React Router setup
- Shared `Nav`, `Footer`, and `Layout`
- Fully ported sample pages: Home, Audit, Contact
- Placeholder route for other slugs
- Existing CSS copied into `react-poc/src/styles/`

Recommendation:

Use `react-poc` as a reference, but do not blindly treat it as production-ready. It is a useful start for `Nav`, `Footer`, and routing shape, but the production migration should either:

1. Promote and harden `react-poc` into the main app, or
2. Create a clean `src/` structure in the root and copy only the useful POC components.

Preferred path: promote the POC concepts, but build the production React app in the repository root so deployment and API code stay in one project.

## 3. Route Inventory

Recommended React routes should be extensionless, while supporting legacy `.html` redirects later if needed.

| Current file | Current slug | React route | Group |
|---|---|---|---|
| `index.html` | `index` | `/` | Home |
| `about.html` | `about` | `/about` | Company |
| `team.html` | `team` | `/team` | Company |
| `why-choose-us.html` | `why-choose-us` | `/why-choose-us` | Company |
| `contact.html` | `contact` | `/contact` | Company |
| `career.html` | `career` | `/career` | Company |
| `sitemap.html` | `sitemap` | `/sitemap` | Utility |
| `gst.html` | `gst` | `/gst` | GST |
| `gst-audit.html` | `gst-audit` | `/gst-audit` | GST |
| `gst-class.html` | `gst-class` | `/gst-class` | GST |
| `gst-dd.html` | `gst-dd` | `/gst-dd` | GST |
| `gst-ebill.html` | `gst-ebill` | `/gst-ebill` | GST |
| `gst-lit.html` | `gst-lit` | `/gst-lit` | GST |
| `gst-opinion.html` | `gst-opinion` | `/gst-opinion` | GST |
| `gst-refund.html` | `gst-refund` | `/gst-refund` | GST |
| `gst-search.html` | `gst-search` | `/gst-search` | GST |
| `dtax.html` | `dtax` | `/dtax` | Direct Tax |
| `corp-tax.html` | `corp-tax` | `/corp-tax` | Direct Tax |
| `income-tax.html` | `income-tax` | `/income-tax` | Direct Tax |
| `income-tax-adv.html` | `income-tax-adv` | `/income-tax-adv` | Direct Tax |
| `nri-tax.html` | `nri-tax` | `/nri-tax` | Direct Tax |
| `audit.html` | `audit` | `/audit` | Audit and Advisory |
| `stat-audit.html` | `stat-audit` | `/stat-audit` | Audit and Advisory |
| `tax-audit.html` | `tax-audit` | `/tax-audit` | Audit and Advisory |
| `int-audit.html` | `int-audit` | `/int-audit` | Audit and Advisory |
| `comp-audit.html` | `comp-audit` | `/comp-audit` | Audit and Advisory |
| `biz-setup.html` | `biz-setup` | `/biz-setup` | Corporate Advisory |
| `biz-val.html` | `biz-val` | `/biz-val` | Corporate Advisory |
| `company-law.html` | `company-law` | `/company-law` | Corporate Advisory |
| `exim.html` | `exim` | `/exim` | Corporate Advisory |
| `fema.html` | `fema` | `/fema` | Corporate Advisory |
| `mgmt-cfo.html` | `mgmt-cfo` | `/mgmt-cfo` | Corporate Advisory |
| `rera.html` | `rera` | `/rera` | RERA |
| `rera-reg.html` | `rera-reg` | `/rera-reg` | RERA |
| `rera-qud.html` | `rera-qud` | `/rera-qud` | RERA |
| `rera-ext.html` | `rera-ext` | `/rera-ext` | RERA |
| `rera-disp.html` | `rera-disp` | `/rera-disp` | RERA |
| `kc.html` | `kc` | `/kc` | Knowledge Center |
| `kc-gst.html` | `kc-gst` | `/kc-gst` | Knowledge Center |
| `kc-dtax.html` | `kc-dtax` | `/kc-dtax` | Knowledge Center |
| `kc-audit.html` | `kc-audit` | `/kc-audit` | Knowledge Center |
| `kc-fema.html` | `kc-fema` | `/kc-fema` | Knowledge Center |
| `kc-intl.html` | `kc-intl` | `/kc-intl` | Knowledge Center |
| `kc-rera.html` | `kc-rera` | `/kc-rera` | Knowledge Center |
| `kc-checklist.html` | `kc-checklist` | `/kc-checklist` | Knowledge Center |
| `kc-glossary.html` | `kc-glossary` | `/kc-glossary` | Knowledge Center |

## 4. Current Shared Layout Architecture

Current nav:

- Source: `components/nav.html`
- Behavior: active highlighting script inside the HTML fragment plus `assets/js/nav.js`
- Data model: top-level groups with dropdown links
- React replacement: `components/Nav.jsx` with route-aware active state using `useLocation`

Current footer:

- Source: `components/footer.html`
- Behavior: copyright year script
- Content: contact details, WhatsApp CTA, service link columns
- React replacement: `components/Footer.jsx` with static data arrays and `new Date().getFullYear()`

Current include system:

- Source: `assets/js/include.js`
- Purpose: fetches nav/footer HTML into every static page
- React replacement: remove completely; layout renders Nav/Footer once through `SiteLayout`

## 5. Current Script Behavior To Replace

| Current behavior | Current source | React replacement |
|---|---|---|
| `go('slug')` navigation | `assets/js/main.js` + inline `onclick` | `Link`, `NavLink`, `useNavigate` |
| Mobile nav toggle | `assets/js/nav.js` | `useState` in `Nav.jsx` |
| Dropdown open/close | `assets/js/nav.js` and CSS hover | React state + CSS hover/focus |
| Active nav highlighting | `components/nav.html` inline script | `NavLink` / `useLocation` |
| FAQ toggle | `assets/js/main.js` + inline `toggleFaq(this)` | `FAQAccordion` component |
| Subnav smooth scroll | inline `scrollIntoView` | `SubNav` component with refs/hash anchors |
| Scroll reveal | `assets/js/main.js` IntersectionObserver | `useScrollReveal` hook |
| Contact form AJAX | inline script in `contact.html` | `ContactForm.jsx` |
| Content lock/right-click deterrents | `assets/js/lock.js` | Prefer not to port initially unless required |

Important migration note:

The pages have 422 inline `onclick` handlers. Phase 2/3 should remove these gradually by converting navigation actions to React props and components.

## 6. Form and Backend Architecture

Current form:

- Only live form: `pages/contact.html`
- Posts to `/api/contact`
- Has PHP fallback: `../mailer.php`
- Uses SMTP destination `info@vjdesai.com`

React target:

- `ContactForm.jsx`
- POST to `/api/contact`
- Keep backend in server-only code:
  - Vercel: `api/contact.js`
  - Hostinger Node: `server.js`
  - Hostinger PHP fallback only if using shared PHP hosting

Rules:

- No SMTP secrets in React code
- Use `.env` locally
- Use host environment variables in production

## 7. CSS Migration Strategy

Current CSS is global and class-name based. This is good for a first UI-preserving migration.

Recommended order:

1. Copy/import current CSS globally:
   - `variables.css`
   - `base.css`
   - `nav.css`
   - `footer.css`
   - `components.css`
2. Keep class names unchanged during page migration.
3. Only after all routes match visually, split CSS by domain:
   - `layout.css`
   - `home.css`
   - `service-pages.css`
   - `knowledge.css`
   - `forms.css`
   - `timelines.css`

Do not start with CSS modules. The current pages rely heavily on shared class names and inline styles, so CSS modules would slow the migration and increase visual risk.

## 8. Recommended React Project Architecture

Recommended root structure:

```txt
src/
  main.jsx
  App.jsx
  routes.jsx
  layouts/
    SiteLayout.jsx
  components/
    Nav.jsx
    Footer.jsx
    SEO.jsx
    PageHero.jsx
    Breadcrumb.jsx
    SubNav.jsx
    SectionHeader.jsx
    CTASection.jsx
    FAQAccordion.jsx
    ContactForm.jsx
    ServiceCard.jsx
    EngagementCard.jsx
    ProcessTimeline.jsx
  pages/
    Home.jsx
    About.jsx
    Team.jsx
    WhyChooseUs.jsx
    Contact.jsx
    Career.jsx
    Sitemap.jsx
    gst/
    tax/
    audit/
    advisory/
    rera/
    knowledge/
  data/
    navigation.js
    footerLinks.js
    routeMeta.js
    services.js
  hooks/
    useScrollReveal.js
    useScrollSpy.js
  styles/
    variables.css
    base.css
    nav.css
    footer.css
    components.css
```

## 9. Component Candidates

High-value components:

- `SiteLayout`
- `Nav`
- `Footer`
- `PageHero`
- `Breadcrumb`
- `SubNav`
- `SectionHeader`
- `ServiceGrid`
- `ServiceCard`
- `CTASection`
- `FAQAccordion`
- `ContactForm`
- `EngagementModels`
- `ProcessTimeline`
- `KnowledgeCard`
- `JobCard`

Migration rule:

First preserve the UI. Component extraction should follow repeated structure, not precede it.

## 10. Migration Sequence Recommendation

Phase 2 should start with foundation:

1. Decide whether to promote `react-poc` or create root `src/`.
2. Add Vite React dependencies to root project.
3. Create root React entry, routing, and layout.
4. Port/copy `Nav` and `Footer` from POC, then harden links and active states.
5. Import existing CSS globally.
6. Port `Home`, `Contact`, and one representative service page.
7. Add route map for all pages with placeholders.

Phase 3 should migrate content:

1. GST group
2. Direct tax group
3. Audit/advisory group
4. RERA group
5. Knowledge center group
6. Company/support pages

Phase 4 should clean behavior:

1. Remove `include.js`
2. Remove dependency on `main.js` navigation shims
3. Replace inline handlers
4. Replace contact page script with `ContactForm.jsx`
5. Decide whether to retire `lock.js`

## 11. Key Risks and Decisions

Risks:

- Heavy inline styles in pages can make JSX conversion noisy.
- Existing text has some encoding artifacts from extracted HTML.
- CSS is global and large; changes can affect many pages.
- 422 inline click handlers need conversion.
- Contact form depends on backend hosting choice.
- Current static `.html` URLs may need redirects after React migration.

Decisions needed before Phase 2:

1. Use root React app or continue inside `react-poc`?
2. Preferred deployment target: Vercel or Hostinger Node?
3. Keep old `.html` URL compatibility?
4. Keep content-lock behavior from `lock.js`?
5. Should knowledge-center pages be hand-componentized or migrated as JSX first?

Recommended answers:

1. Root React app, using POC as reference.
2. Vercel for React + `api/contact.js`, unless Hostinger Node is already purchased.
3. Yes, add redirects from `.html` URLs.
4. Do not port `lock.js` initially; it harms UX and is not real protection.
5. Migrate as JSX first, componentize after parity.

## 12. Phase 1 Completion Criteria

Completed:

- Page inventory
- Route grouping
- Shared layout dependency map
- Script behavior replacement map
- Form/backend architecture map
- CSS migration strategy
- Existing React POC assessment
- Phase 2 recommended starting path

Next deliverable:

Phase 2 should create the production React foundation and route shell.
