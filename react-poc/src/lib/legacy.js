/* Shared access to the original static pages' markup (imported ?raw).
   Used by LegacyPage (whole <main>) and by templates that reuse a single
   bespoke section (e.g. a page's hand-built process diagram). */

const RAW = import.meta.glob('../legacy/*.html', { query: '?raw', import: 'default', eager: true });

// slug (filename without .html) -> raw HTML string
export const PAGES = Object.fromEntries(
  Object.entries(RAW).map(([path, html]) => [path.split('/').pop().replace(/\.html$/, ''), html])
);

const cache = {};
function docFor(slug) {
  if (!cache[slug]) cache[slug] = new DOMParser().parseFromString(PAGES[slug] || '', 'text/html');
  return cache[slug];
}

export function getMain(slug) {
  const main = docFor(slug).querySelector('main');
  return { inner: main ? main.innerHTML : null, title: docFor(slug).querySelector('title')?.textContent };
}

// Return the outerHTML of a single element (by CSS selector) from a page.
export function getSection(slug, selector) {
  const el = docFor(slug).querySelector(selector);
  return el ? el.outerHTML : '';
}
