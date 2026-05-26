import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PAGES, getMain } from '../lib/legacy.js';
import RawHtml from '../components/RawHtml.jsx';

export default function LegacyPage() {
  const { slug = '' } = useParams();
  const html = PAGES[slug];
  const { inner, title } = useMemo(() => (html ? getMain(slug) : { inner: null, title: null }), [html, slug]);

  // Admin content override (if any) takes precedence over the legacy markup.
  const [override, setOverride] = useState(undefined);
  useEffect(() => {
    let alive = true;
    fetch(`/api/page-content/${slug}`).then((r) => r.json())
      .then((d) => { if (alive) setOverride(d.html || null); })
      .catch(() => { if (alive) setOverride(null); });
    return () => { alive = false; };
  }, [slug]);

  useEffect(() => { if (title) document.title = title; }, [title]);

  if (typeof override === 'string' && override.trim()) return <RawHtml html={override} />;

  if (!html) {
    const t = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return (
      <div className="ph"><div className="phi">
        <div className="bc"><Link to="/">Home</Link><span>/</span><span>{t || 'Page'}</span></div>
        <h1>Page <em>Not Found</em></h1>
        <p>No page exists for “{slug}”. <Link to="/" style={{ color: 'var(--gold)' }}>Return home →</Link></p>
      </div></div>
    );
  }

  return <RawHtml html={inner} />;
}
