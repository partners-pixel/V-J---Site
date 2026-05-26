import fs from 'node:fs';

const base = process.argv[2] || 'http://localhost:3001';
const pagePaths = fs.readdirSync('pages')
  .filter((file) => file.endsWith('.html'))
  .sort()
  .map((file) => `/pages/${file}`);

const paths = ['/index.html', ...pagePaths];
let failures = 0;

for (const pagePath of paths) {
  const url = `${base}${pagePath}`;
  try {
    const res = await fetch(url, { redirect: 'manual' });
    const html = await res.text();
    const title = (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '')
      .replace(/\s+/g, ' ')
      .trim();
    const hasComponentsCss = html.includes('assets/css/components.css') ||
      html.includes('../assets/css/components.css');

    if (!res.ok) failures += 1;
    console.log([
      res.status,
      url,
      hasComponentsCss ? 'components.css' : 'NO components.css',
      title || '(no title)',
    ].join('\t'));
  } catch (err) {
    failures += 1;
    console.log(['ERROR', url, 'request failed', err.message].join('\t'));
  }
}

if (failures > 0) process.exitCode = 1;
