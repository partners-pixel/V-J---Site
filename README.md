# V J Desai &amp; Co. LLP — Website

Multi-page static site for V J Desai &amp; Co. LLP, Chartered Accountants
(ICAI registered · Est. 1993 · Ahmedabad, Gujarat).

Converted from a single-file SPA into a maintainable multi-page
structure with shared CSS, shared `nav.html` / `footer.html`, and a
small fetch-based include loader.

---

## Project structure

```
.
├── index.html                 ← Home page (fully populated)
├── about.html, gst.html, …    ← One file per route (stubbed; see below)
├── components/
│   ├── nav.html               ← Shared top navigation
│   └── footer.html            ← Shared footer (with contact details)
├── assets/
│   ├── css/
│   │   ├── variables.css      ← :root design tokens (colours, transitions)
│   │   ├── base.css           ← Reset, html/body, page system, content-lock
│   │   ├── nav.css            ← Logo, nav bar, dropdowns, mobile toggle
│   │   ├── footer.css         ← WhatsApp button + site footer
│   │   └── components.css     ← Everything else (hero, cards, forms, …)
│   └── js/
│       ├── include.js         ← Fetches nav.html / footer.html
│       ├── nav.js             ← Mobile menu, dropdown click, active link
│       ├── main.js            ← Scroll reveal, FAQ toggle, scroll-spy
│       └── lock.js            ← Right-click / DevTools / copy deterrents
└── README.md
```

---

## Local development

The site uses `fetch()` to load `components/nav.html` and
`components/footer.html`. **`fetch()` is blocked on the `file://`
protocol** — opening pages by double-clicking will fail to load the nav
and footer.

You need a tiny local web server. Pick one:

### Option A — Python (no install needed if Python is on PATH)
```bash
cd "c:\Users\Admin\Desktop\V J Desai"
python -m http.server 5500
```
Then open <http://localhost:5500> in your browser.

### Option B — VS Code Live Server extension
1. Install the **Live Server** extension by Ritwick Dey
2. Right-click `index.html` → **Open with Live Server**

### Option C — Node http-server
```bash
npx http-server -p 5500
```

---

## Editing content

* **Contact details** (phone, email, address, hours, social links) —
  edit `components/footer.html`. The change propagates to every page on
  next load.
* **Top navigation** (labels, link order, dropdowns) — edit
  `components/nav.html`.
* **Design tokens** (colours, transitions) — edit
  `assets/css/variables.css`.
* **Per-page content** — edit each individual `*.html` file's `<main>`
  block. Pages that begin with a `<!-- TODO: paste original SPA content
  here -->` comment are stubs ready for content from your original
  single-file SPA.

---

## Active-state nav highlighting

When you're on `gst-audit.html`, the **GST / Indirect Tax** parent in
the top nav is automatically highlighted (gold underline). This is
driven by:

* `data-page="<slug>"` on each `<li class="ni">` and on each dropdown
  `<a class="dda">` in `components/nav.html`
* A small inline `<script>` at the bottom of `nav.html` that reads
  `location.pathname` and adds `.active`
* A fallback re-runner in `assets/js/nav.js`

---

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). Uses
`fetch`, `IntersectionObserver`, and `:has()` selectors.

---

## Logo

The original SPA inlined a ~50 KB base64 image. The nav + footer now
use a CSS-only text logo (the `.logo-name` / `.amp` / `.logo-sub`
classes that were already in your stylesheet, explicitly described in
the CSS comment as an "exact match to uploaded image"). To switch back
to the image:

1. Save the original base64 image as `assets/img/logo.jpg`
2. In `components/nav.html` and `components/footer.html`, replace the
   `<div class="logo-name">…</div>` block with
   `<img src="assets/img/logo.jpg" height="44" alt="…">`
