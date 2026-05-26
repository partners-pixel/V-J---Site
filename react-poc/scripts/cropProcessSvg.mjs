/* Tighten process-diagram SVG viewBoxes to their actual content height,
   removing the empty bottom band that leaves large gaps between sections.
   Shrink-only and conservative: skips SVGs using relative <tspan dy> (whose
   extent can't be computed from absolute coords).

   Usage:  node scripts/cropProcessSvg.mjs           # dry run (report)
           node scripts/cropProcessSvg.mjs --write    # rewrite legacy files
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEGACY = path.join(__dirname, '../src/legacy');
const PAD = 18;

function contentMaxY(svg) {
  let max = 0;
  const upd = (v) => { if (Number.isFinite(v)) max = Math.max(max, v); };
  let m;
  // text / tspan absolute y
  const textRe = /<(?:text|tspan)\b[^>]*\by="([\d.]+)"/g;
  while ((m = textRe.exec(svg))) upd(parseFloat(m[1]) + 4);
  // circles: cy + r
  const cRe = /<circle\b[^>]*\bcy="([\d.]+)"[^>]*\br="([\d.]+)"|<circle\b[^>]*\br="([\d.]+)"[^>]*\bcy="([\d.]+)"/g;
  while ((m = cRe.exec(svg))) {
    if (m[1]) upd(parseFloat(m[1]) + parseFloat(m[2]));
    else upd(parseFloat(m[4]) + parseFloat(m[3]));
  }
  // rects: y + height
  const rRe = /<rect\b[^>]*\by="([\d.]+)"[^>]*\bheight="([\d.]+)"/g;
  while ((m = rRe.exec(svg))) upd(parseFloat(m[1]) + parseFloat(m[2]));
  // lines: y1, y2
  const lRe = /<line\b[^>]*\by1="([\d.]+)"[^>]*\by2="([\d.]+)"/g;
  while ((m = lRe.exec(svg))) { upd(parseFloat(m[1])); upd(parseFloat(m[2])); }
  return max;
}

const files = fs.readdirSync(LEGACY).filter((f) => f.endsWith('.html'));
const write = process.argv.includes('--write');
let changed = 0;

for (const f of files) {
  const p = path.join(LEGACY, f);
  let html = fs.readFileSync(p, 'utf8');
  let touched = false;

  html = html.replace(/<svg\b([^>]*?)viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"([^>]*)>([\s\S]*?)<\/svg>/g,
    (full, pre, w, h, post, body) => {
      // Skip diagrams that rely on relative tspan dy (extent not computable).
      if (/<tspan\b[^>]*\bdy=/.test(body)) return full;
      // Skip path-heavy diagrams (extent not computed from <path>).
      if (/<path\b/.test(body)) return full;
      const maxY = contentMaxY(body);
      const newH = Math.ceil(maxY + PAD);
      if (maxY > 0 && newH < Number(h) - 8) {
        touched = true;
        console.log(`${f}: viewBox H ${h} -> ${newH}`);
        return `<svg${pre}viewBox="0 0 ${w} ${newH}"${post}>${body}</svg>`;
      }
      return full;
    });

  if (touched) { changed++; if (write) fs.writeFileSync(p, html); }
}
console.log(`\n${changed} file(s) ${write ? 'rewritten' : 'would change'} (dry run: pass --write).`);
