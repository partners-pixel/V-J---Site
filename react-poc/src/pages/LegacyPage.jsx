import { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

/* Eagerly import every static page's raw HTML (reused verbatim).
   Keys look like '../legacy/gst.html'. */
const RAW = import.meta.glob('../legacy/*.html', { query: '?raw', import: 'default', eager: true });

// slug (filename without .html) -> raw HTML string
const PAGES = Object.fromEntries(
  Object.entries(RAW).map(([path, html]) => [path.split('/').pop().replace(/\.html$/, ''), html])
);

// slug -> '/route' (mirrors the static site's window.go: 'home' -> index)
const toPath = (slug) => (slug === 'home' || slug === 'index' ? '/' : '/' + slug);

// Pull just the <main> content out of a full HTML document string.
function extractMain(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const main = doc.querySelector('main');
  const title = doc.querySelector('title')?.textContent;
  return { inner: main ? main.innerHTML : '<p style="padding:2rem">No content.</p>', title };
}

export default function LegacyPage() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();
  const html = PAGES[slug];

  const { inner, title } = useMemo(() => (html ? extractMain(html) : { inner: null, title: null }), [html]);

  // Expose window.go for the inline onclick="go('x')" handlers in the markup.
  useEffect(() => {
    const go = (s) => navigate(s === 'home' || s === 'index' ? '/' : '/' + s);
    window.go = go;
    if (title) document.title = title;
    return () => { if (window.go === go) delete window.go; };
  }, [navigate, title]);

  // Intercept clicks on legacy "<a href='x.html'>" links → client-side route.
  const onClick = (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (/\.html(\?|#|$)/i.test(href)) {
      e.preventDefault();
      const file = href.split('/').pop().split(/[?#]/)[0].replace(/\.html$/i, '');
      navigate(toPath(file));
    }
    // hash-only (#section) and external links fall through to default behaviour
  };

  if (!html) {
    const title2 = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return (
      <div className="ph"><div className="phi">
        <div className="bc"><Link to="/">Home</Link><span>/</span><span>{title2 || 'Page'}</span></div>
        <h1>Page <em>Not Found</em></h1>
        <p>No page exists for “{slug}”. <Link to="/" style={{ color: 'var(--gold)' }}>Return home →</Link></p>
      </div></div>
    );
  }

  return <div onClickCapture={onClick} dangerouslySetInnerHTML={{ __html: inner }} />;
}
