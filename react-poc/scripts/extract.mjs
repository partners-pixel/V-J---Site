/* Generate data objects for GST-template pages straight from the source
   markup in src/legacy/*.html. Hero + services become real data-driven JSX;
   the bespoke lower sections (process/engagement/contact) are listed as
   selectors to pull from source at render time.

   Usage:  node scripts/extract.mjs <slug>          # print one page's data
           node scripts/extract.mjs --write          # write src/data/auto.js
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEGACY = path.join(__dirname, '../src/legacy');

const SLUGS = [
  'stat-audit', 'tax-audit', 'int-audit', 'comp-audit', 'biz-setup', 'biz-val',
  'company-law', 'exim', 'fema', // mgmt-cfo excluded: two service groups, stays on LegacyPage

  'gst-class', 'gst-audit', 'gst-dd', 'gst-lit', 'gst-opinion', 'gst-refund', 'gst-search', // gst-ebill removed
  // corp-tax excluded: bespoke multi-section page (overview/cases/experts/faqs), stays on LegacyPage
  'income-tax', 'income-tax-adv', 'nri-tax',
];

const decode = (s) => (s || '')
  .replace(/&amp;/g, '&').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—')
  .replace(/&nbsp;/g, ' ').replace(/&rsquo;/g, '’').replace(/&lsquo;/g, '‘')
  .replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”').replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();

const stripTags = (s) => decode((s || '').replace(/<[^>]+>/g, ''));

function emTitle(html) {
  // "Pre <em>Em</em> Post"
  const m = html.match(/^([\s\S]*?)<em>([\s\S]*?)<\/em>([\s\S]*)$/i);
  if (!m) return { pre: stripTags(html) };
  const pre = stripTags(m[1]); const em = stripTags(m[2]); const post = stripTags(m[3]);
  return { pre: pre ? pre + ' ' : '', em, ...(post ? { post: ' ' + post } : {}) };
}

function section(html, id) {
  // capture <section id="id" ...> ... </section> OR <div id="id" ...> ... </div>
  const re = new RegExp(`<(section|div)\\s+id="${id}"[\\s\\S]*?</\\1>`, 'i');
  const m = html.match(re);
  return m ? m[0] : '';
}

function extract(slug) {
  const html = fs.readFileSync(path.join(LEGACY, `${slug}.html`), 'utf8');

  // ── breadcrumb (links + final span) ──
  const bcBlock = (html.match(/<div class="bc">([\s\S]*?)<\/div>/i) || [])[1] || '';
  const breadcrumb = [];
  const bcRe = /<a[^>]*onclick="go\('([^']+)'\)"[^>]*>([\s\S]*?)<\/a>|<span>([\s\S]*?)<\/span>/gi;
  let bm;
  while ((bm = bcRe.exec(bcBlock))) {
    if (bm[1]) breadcrumb.push({ label: stripTags(bm[2]), to: bm[1] });
    else if (stripTags(bm[3]) !== '/') breadcrumb.push({ label: stripTags(bm[3]) });
  }

  // ── hero ──
  const hero = (html.match(/<section class="gst-hero">([\s\S]*?)<\/section>/i) || [])[1] || '';
  const eyebrow = stripTags((hero.match(/<div class="gst-hero-eyebrow">([\s\S]*?)<\/div>/i) || [])[1]);
  const h1m = hero.match(/<h1([^>]*)>([\s\S]*?)<\/h1>/i) || [];
  const heroTitleSize = ((h1m[1] || '').match(/font-size:([^";]+)/) || [])[1]?.trim();
  const h1inner = h1m[2] || '';
  const firstLine = stripTags(h1inner.split(/<br\s*\/?>/i)[0]);
  const emLine = stripTags((h1inner.match(/<em>([\s\S]*?)<\/em>/i) || [])[1]);
  const heroLead = stripTags((hero.match(/<p class="gst-hero-lead">([\s\S]*?)<\/p>/i) || [])[1]);
  const heroParas = [];
  const pRe = /<p style="[^"]*color:var\(--tdim\)[^"]*">([\s\S]*?)<\/p>/gi;
  let pm; while ((pm = pRe.exec(hero))) heroParas.push(stripTags(pm[1]));
  const heroBtn = stripTags((hero.match(/<button class="bgs"[^>]*>([\s\S]*?)<\/button>/i) || [])[1]) || 'Book a Consultation';
  // hero-right stats (optional)
  const heroRight = [];
  const hr = (hero.match(/<div class="gst-hero-right">([\s\S]*?)<\/div>\s*<\/div>/i) || [])[1] || hero;
  const statRe = /<div class="gst-stat"><div class="gst-stat-num">([\s\S]*?)<\/div><div class="gst-stat-lbl">([\s\S]*?)<\/div><\/div>/gi;
  let sm; while ((sm = statRe.exec(hero))) heroRight.push({ n: stripTags(sm[1]), l: stripTags(sm[2]) });
  const twoCol = /grid-template-columns:1fr\s*\.?9?fr/.test(hero) || heroRight.length > 0;

  // ── subnav ──
  const subnav = [];
  const snRe = /<a class="gsn[^"]*"\s+href="(#[^"]+)">([\s\S]*?)<\/a>/gi;
  let snm; while ((snm = snRe.exec(html))) subnav.push({ label: stripTags(snm[2]), href: snm[1] });

  // ── services section (id ends with -services) ──
  const svcId = (html.match(/id="([a-z0-9-]*services)"\s+class="gst-services-wrap/i) || [])[1];
  const svc = section(html, svcId);
  const servicesTag = stripTags((svc.match(/<div class="stag"[^>]*>([\s\S]*?)<\/div>/i) || [])[1]);
  const servicesTitle = emTitle((svc.match(/<h2 class="ht"[^>]*>([\s\S]*?)<\/h2>/i) || [])[1] || '');
  const servicesSub = stripTags((svc.match(/<p class="ssub"[^>]*>([\s\S]*?)<\/p>/i) || [])[1]) || undefined;
  const servicesCols = Number(((svc.match(/gst-svc-grid"[^>]*grid-template-columns:repeat\((\d)/) || [])[1])) || undefined;
  const services = [];
  const itemRe = /<div class="gst-svc-item">\s*<div class="gst-svc-ico">([\s\S]*?)<\/div>\s*<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/gi;
  let im; while ((im = itemRe.exec(svc))) services.push({ icon: stripTags(im[1]), h3: stripTags(im[2]), p: stripTags(im[3]) });

  // ── lower sections to pull (ordered): every id'd block with gst-scroll, except services ──
  const sections = [];
  const secRe = /<(?:section|div)\s+id="([a-z0-9-]+)"\s+class="[^"]*gst-scroll[^"]*"/gi;
  let secm; while ((secm = secRe.exec(html))) if (secm[1] !== svcId) sections.push({ fromSlug: slug, selector: `#${secm[1]}` });

  return {
    breadcrumb, eyebrow, heroTitleSize, heroTitle: { first: firstLine, em: emLine },
    heroLead, heroParas, heroBtn: { label: heroBtn, to: 'contact' },
    ...(twoCol && heroRight.length ? { heroRight } : {}),
    ids: { services: svcId }, subnav,
    servicesTag, servicesTitle, servicesSub, servicesCols, services, sections,
  };
}

if (process.argv.includes('--write')) {
  const out = {};
  for (const s of SLUGS) out[s] = extract(s);
  const body = `// AUTO-GENERATED by scripts/extract.mjs — GST-template sub-pages.\n// Hero + services are data-driven JSX; lower sections pull from source markup.\nconst auto = ${JSON.stringify(out, null, 2)};\nexport default auto;\n`;
  fs.writeFileSync(path.join(__dirname, '../src/data/auto.js'), body);
  console.log('Wrote src/data/auto.js with', SLUGS.length, 'pages');
} else {
  const slug = process.argv[2] || 'stat-audit';
  console.log(JSON.stringify(extract(slug), null, 2));
}
