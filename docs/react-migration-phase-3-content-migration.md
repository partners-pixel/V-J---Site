# React Migration Phase 3 Content Migration

Project: V J Desai & Co. LLP website  
Phase: Legacy content migrated into React routes  
Status: First-pass content migration complete

## What Changed

- All 46 legacy HTML page bodies now render through React Router.
- The shared React `Nav`, `Footer`, and `SiteLayout` remain the only layout shell.
- Existing page UI is preserved by importing each legacy page as raw HTML and extracting its `<main>` content.
- Legacy `../assets/...` references are normalized to `/assets/...` for React routes.
- Legacy `../mailer.php` fallback references are normalized to `/mailer.php`.
- Page title, description, and `body[data-page]` are updated per route.

## Runtime Behaviors Recreated

- `go('slug')` now navigates through React Router instead of loading `.html` files.
- `toggleFaq(this)` is available for FAQ sections such as corporate tax.
- `tab(...)`, `snScroll(...)`, `mob()`, and `handleForm(...)` compatibility shims are available.
- In-page anchor scrolling is handled inside the React page container.
- Scroll reveal and GST sub-navigation scroll spy are reinitialized per route.
- The contact form submit behavior is handled by React and posts to `/api/contact`, with `/mailer.php` fallback preserved.

## Build Strategy

Legacy pages are lazy-loaded with Vite dynamic raw imports. This keeps the main React bundle small and creates separate content chunks for the page bodies.

Build result after Phase 3:

- Main app JS: about 192 KB
- Content chunks: one per legacy page
- Total React routes: 46

## Verification

Commands run:

```bash
npm.cmd run react:build
npm.cmd run test:react-routes -- http://localhost:4174
```

Results:

- Production React build passed.
- All 46 routes returned `200`.
- All 46 source HTML pages contain extractable `<main>` content.
- Vite generated 47 JS chunks: main app bundle plus 46 lazy page chunks.

## Remaining Phase 4 Work

- Convert high-value raw HTML pages into true JSX components.
- Replace inline `onclick` attributes with component props and React handlers.
- Replace page-level inline `<style>` blocks with scoped CSS files.
- Decide whether to permanently remove legacy `assets/js/main.js`, `include.js`, `nav.js`, and `lock.js`.
- Add browser-based visual regression checks once browser automation is available.
