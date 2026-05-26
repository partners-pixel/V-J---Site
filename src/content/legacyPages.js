const rawPageLoaders = import.meta.glob('../../pages/*.html', {
  import: 'default',
  query: '?raw',
});

const pageCache = new Map();

function fileNameFromPath(path) {
  return path.split('/').pop();
}

function firstMatch(html, pattern) {
  return html.match(pattern)?.[1]?.trim() || '';
}

function normalizeMainHtml(html) {
  return html
    .replace(/\.\.\/assets\//g, '/assets/')
    .replace(/\.\.\/mailer\.php/g, '/mailer.php');
}

function parseLegacyPage(html) {
  const mainHtml = firstMatch(html, /<main[^>]*>([\s\S]*?)<\/main>/i);
  const title = firstMatch(html, /<title>([\s\S]*?)<\/title>/i)
    .replace(/&amp;/g, '&');
  const description = firstMatch(
    html,
    /<meta\s+name=["']description["']\s+content=["']([^"']*)["'][^>]*>/i,
  ).replace(/&amp;/g, '&');
  const bodyPage = firstMatch(html, /<body[^>]*data-page=["']([^"']+)["'][^>]*>/i);

  return {
    html: normalizeMainHtml(mainHtml),
    title,
    description,
    bodyPage,
  };
}

const loaderByFile = Object.fromEntries(
  Object.entries(rawPageLoaders).map(([path, loader]) => [
    fileNameFromPath(path),
    loader,
  ]),
);

export async function getLegacyPage(legacyFile) {
  if (pageCache.has(legacyFile)) {
    return pageCache.get(legacyFile);
  }

  const loader = loaderByFile[legacyFile];
  if (!loader) {
    return null;
  }

  const page = parseLegacyPage(await loader());
  pageCache.set(legacyFile, page);
  return page;
}
