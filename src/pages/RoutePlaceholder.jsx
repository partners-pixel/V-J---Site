import { Link, useLocation } from 'react-router-dom';
import { routeBySlug } from '../data/routes.js';

function titleFromPath(pathname) {
  const slug = pathname.replace(/^\//, '').replace(/\.html$/i, '');
  if (!slug) return 'Home';
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function RoutePlaceholder({ route }) {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '').replace(/\.html$/i, '') || 'index';
  const resolved = route || routeBySlug[slug];
  const title = resolved?.title || titleFromPath(pathname);
  const group = resolved?.group || 'Unmapped';
  const legacyFile = resolved?.legacyFile;

  return (
    <div className="react-page-shell">
      <section className="ph react-route-hero">
        <div className="phi">
          <div className="bc">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>{title}</span>
          </div>
          <div className="pgbadge">React Phase 2 Route Shell</div>
          <h1>{title} <em>Route Ready</em></h1>
          <p>
            This route is wired into the production React app shell. Full page
            content migration for this section is scheduled for Phase 3.
          </p>
          <div className="react-route-meta">
            <span>Group: {group}</span>
            {legacyFile && <span>Legacy file: {legacyFile}</span>}
            <span>Path: {pathname}</span>
          </div>
          <div className="ph-ctas">
            <Link className="ph-cta" to="/contact">Open Contact Route</Link>
            <Link className="ph-cta-outline" to="/">Back to Home Route</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
