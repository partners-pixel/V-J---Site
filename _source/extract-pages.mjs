/* ─────────────────────────────────────────────────────────────
   extract-pages.mjs — V J Desai & Co. LLP
   Pulls every <div class="page" id="page-X">…</div> block out of
   _source/original.html and injects it into pages/<X>.html
   (using "index" instead of "home" for the home page).

   Run from the project root:
       node _source/extract-pages.mjs

   Idempotent: re-running overwrites pages/*.html with the latest
   content from _source/original.html.
   ───────────────────────────────────────────────────────────── */

import fs from 'node:fs';
import path from 'node:path';

const ROOT       = process.cwd();
const SOURCE     = path.join(ROOT, '_source', 'original.html');
const PAGES_DIR  = path.join(ROOT, 'pages');

if (!fs.existsSync(SOURCE)) {
  console.error(`Source HTML not found at ${SOURCE}`);
  process.exit(1);
}
if (!fs.existsSync(PAGES_DIR)) {
  console.error(`pages/ directory not found at ${PAGES_DIR}`);
  process.exit(1);
}

const html = fs.readFileSync(SOURCE, 'utf8');

/* ─── 1. Extract page blocks with proper <div> depth counting ── */
function extractPages(src) {
  const out = {};
  const openRe = /<div class="page[^"]*" id="page-([^"]+)">/g;
  let m;
  while ((m = openRe.exec(src)) !== null) {
    const id = m[1];
    const start = m.index + m[0].length;
    let depth = 1;
    let pos = start;
    while (depth > 0 && pos < src.length) {
      const nextOpen  = src.indexOf('<div', pos);
      const nextClose = src.indexOf('</div>', pos);
      if (nextClose === -1) break;
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        pos = nextOpen + 4;
      } else {
        depth--;
        pos = nextClose + 6;
      }
    }
    if (depth === 0) {
      out[id] = src.substring(start, pos - 6).trim();
    } else {
      // The source HTML has an unbalanced div for #page-contact —
      // fall back to the nearest known structural boundary that
      // marks the end of all page blocks in the original SPA.
      var fallbackMarkers = [
        '\n<script>',                      // trailing inline scripts
        '\n<a class="wa-float"',           // WhatsApp float button
        '\n<footer ',                      // <footer> element
        '\n<!-- âââ WHATSAPP',             // legacy comment with weird chars
      ];
      let cut = -1;
      for (const marker of fallbackMarkers) {
        const idx = src.indexOf(marker, start);
        if (idx !== -1 && (cut === -1 || idx < cut)) cut = idx;
      }
      if (cut !== -1) {
        // The very last </div> before that boundary closes the page block.
        const lastClose = src.lastIndexOf('</div>', cut);
        if (lastClose > start) {
          out[id] = src.substring(start, lastClose).trim();
          console.warn(`  ~ recovered <div id="page-${id}"> via fallback (file has missing close)`);
          continue;
        }
      }
      console.warn(`  ! could not close <div id="page-${id}">`);
    }
  }
  return out;
}

const pages = extractPages(html);
console.log(`Extracted ${Object.keys(pages).length} page blocks from original.`);

/* ─── 2. slug → filename mapping ─────────────────────────────── */
const slugToFile = (slug) => (slug === 'home' ? 'index' : slug) + '.html';

/* ─── 3. Inject each block into the matching stub ────────────── */
let written = 0;
let skipped = 0;
const missingStubs = [];

for (const [slug, body] of Object.entries(pages)) {
  const fileName = slugToFile(slug);
  const target = path.join(PAGES_DIR, fileName);

  if (!fs.existsSync(target)) {
    missingStubs.push(`${slug} → ${fileName}`);
    skipped++;
    continue;
  }

  const stub = fs.readFileSync(target, 'utf8');

  /*
    Wrap the extracted content in a <div id="page-X"> so the few inline
    <style> blocks in the original (career page, contact page) that use
    "#page-career …" selectors continue to scope correctly. We don't
    add the .page class because that defaults to display:none in our
    base.css; the wrapper is just for selector parity.
  */
  const wrapped =
`<main>

<div id="page-${slug}">
${body}
</div>

</main>`;

  // Replace the entire <main>…</main> block.
  const mainRe = /<main>[\s\S]*?<\/main>/;
  const next = stub.replace(mainRe, wrapped);

  if (next === stub) {
    console.warn(`  ! could not find <main>…</main> in ${fileName}`);
    skipped++;
    continue;
  }

  fs.writeFileSync(target, next, 'utf8');
  written++;
}

console.log(`\nDone:`);
console.log(`  wrote   ${written} pages`);
console.log(`  skipped ${skipped}`);
if (missingStubs.length) {
  console.log(`  missing stub files for: ${missingStubs.join(', ')}`);
}
