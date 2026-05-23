import { useParams, Link } from 'react-router-dom';

/* Catch-all stub for routes not yet ported in this POC.
   Demonstrates that every nav/footer link resolves to a real route. */
export default function Placeholder() {
  const { slug = '' } = useParams();
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <div className="ph"><div className="phi">
      <div className="bc"><Link to="/">Home</Link><span>/</span><span>{title || 'Page'}</span></div>
      <div className="pgbadge">React POC</div>
      <h1>{title || 'Page'} <em>Coming Soon</em></h1>
      <p>This route is wired up and reachable, but its content hasn’t been ported into the
        proof-of-concept yet. The Home, Audit &amp; Advisory, and Contact pages are fully built —
        use the nav to explore them. Every other link resolves here so navigation is complete.</p>
      <div className="ph-ctas">
        <Link className="ph-cta" to="/">← Back to Home</Link>
        <Link className="ph-cta-outline" to="/audit">See a ported page</Link>
      </div>
    </div></div>
  );
}
