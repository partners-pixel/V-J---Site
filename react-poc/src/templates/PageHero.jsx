import { useNavigate } from 'react-router-dom';

/* Shared inner-page hero (.ph) used by service, RERA and knowledge-center pages. */
export default function PageHero({ current, badge, title, lead, tags = [], ctas = [], stats = [], highlight }) {
  const navigate = useNavigate();
  const go = (slug) => navigate(slug === 'home' || slug === 'index' ? '/' : '/' + slug);
  return (
    <div className="ph"><div className="phi">
      <div className="ph-grid">
        <div className="ph-left">
          <div className="bc"><a onClick={() => go('home')} style={{ cursor: 'pointer' }}>Home</a><span>/</span><span>{current}</span></div>
          <div className="pgbadge">{badge}</div>
          <h1>{title.pre}<em>{title.em}</em>{title.post}</h1>
          <p>{lead}</p>
          {tags.length > 0 && <div className="ph-tags">{tags.map((t) => <span className="ph-tag" key={t}>{t}</span>)}</div>}
          {ctas.length > 0 && (
            <div className="ph-ctas">
              {ctas.map((c, i) => (
                <button key={i} className={c.outline ? 'ph-cta-outline' : 'ph-cta'} onClick={() => go(c.to)}>{c.label}</button>
              ))}
            </div>
          )}
        </div>
        <div className="ph-right">
          <div className="ph-stat-grid">
            {stats.map((s, i) => <div className="ph-stat" key={i}><div className="ph-stat-n">{s.n}</div><div className="ph-stat-l">{s.l}</div></div>)}
          </div>
          {highlight && <div className="ph-hl"><p>{highlight.quote}</p><cite>{highlight.cite}</cite></div>}
        </div>
      </div>
    </div></div>
  );
}
