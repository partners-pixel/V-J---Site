import { routeMap } from '../src/data/routes.js';

const base = process.argv[2] || 'http://localhost:4174';
let failures = 0;

for (const route of routeMap) {
  const url = `${base}${route.path}`;
  try {
    const res = await fetch(url, { redirect: 'manual' });
    const html = await res.text();
    const hasRoot = html.includes('id="root"');
    const hasBundle = html.includes('/assets/');

    if (!res.ok || !hasRoot || !hasBundle) failures += 1;
    console.log([
      res.status,
      url,
      hasRoot ? 'react-root' : 'NO react-root',
      hasBundle ? 'bundle' : 'NO bundle',
      route.title,
    ].join('\t'));
  } catch (err) {
    failures += 1;
    console.log(['ERROR', url, 'request failed', err.message, route.title].join('\t'));
  }
}

if (failures > 0) process.exitCode = 1;
