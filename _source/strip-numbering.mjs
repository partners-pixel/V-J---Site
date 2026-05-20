/* ─────────────────────────────────────────────────────────────
   strip-numbering.mjs — V J Desai & Co. LLP
   Removes the section-number prefixes (3.1, 4.2, 5.2.2, 7.1, …)
   from headers/labels across the nav and all pages.

   Run from project root:  node _source/strip-numbering.mjs
   ───────────────────────────────────────────────────────────── */

import fs from 'node:fs';

const files = [
  'components/nav.html',
  ...fs.readdirSync('pages')
       .filter((f) => f.endsWith('.html'))
       .map((f) => 'pages/' + f),
];

const NUM = '\\d+\\.\\d+(?:\\.\\d+)?'; // N.N or N.N.N

let changed = 0;
for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  let html = before;

  // 1) Nav dropdown labels:  <a class="dda" …>3.1 GST</a>  →  >GST</a>
  html = html.replace(
    new RegExp('(<a class="dda"[^>]*>)\\s*' + NUM + '\\s+', 'g'),
    '$1'
  );

  // 2) Hero eyebrows:  class="gst-hero-eyebrow">3.2 GST Classification Services
  html = html.replace(
    new RegExp('(class="gst-hero-eyebrow">)\\s*' + NUM + '\\s+', 'g'),
    '$1'
  );

  // 3) Page badges (KC pages):  class="pgbadge">🧾 7.1 GST  →  🧾 GST
  //    Keep any leading emoji/space, drop the number + following space.
  html = html.replace(
    new RegExp('(class="pgbadge">[^<0-9]*?)' + NUM + '\\s+', 'g'),
    '$1'
  );

  // 4) Section tags with trailing ", 5.1":  Audit Services, 5.1  →  Audit Services
  html = html.replace(
    new RegExp('(class="stag[^"]*">[^<]*?),\\s*' + NUM + '(\\s*<)', 'g'),
    '$1$2'
  );

  // 5) Decorative card number badges:  <div class="smc-num">2.1</div>  → removed
  html = html.replace(/<div class="smc-num">[\d.]+<\/div>\s*/g, '');

  if (html !== before) {
    fs.writeFileSync(file, html, 'utf8');
    changed++;
    console.log('  updated', file);
  }
}
console.log('Files changed:', changed);
