import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useDocTitle from '../lib/useDocTitle.js';

// Shown when no posts have been published yet via the admin panel.
const SAMPLE = [
  { id: 's1', category: 'GST', date: '2025', title: 'GST Council Updates, Rate Changes & Compliance Decisions', excerpt: 'Summary of rate changes, exemptions, and compliance relaxations from recent GST Council meetings.', image: null },
  { id: 's2', category: 'Direct Tax', date: '2025', title: 'Budget 2025-26, Tax Highlights for Individuals & Corporates', excerpt: 'Key changes in income tax slabs, deductions, and compliance requirements for FY 2025-26.', image: null },
  { id: 's3', category: 'RERA', date: '2025', title: 'Gujarat RERA, Latest Circulars & Developer Compliance Updates', excerpt: 'Latest circulars and compliance requirements for real estate developers under Gujarat RERA.', image: null },
];

const fmtDate = (d) => {
  if (!d) return '';
  const t = new Date(d);
  return Number.isNaN(t.getTime())
    ? d
    : t.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function Blog() {
  useDocTitle('Blog');
  const [posts, setPosts] = useState(null); // null = loading

  useEffect(() => {
    let alive = true;
    fetch('/api/blog')
      .then((r) => r.json())
      .then((d) => { if (alive) setPosts(d.posts || []); })
      .catch(() => { if (alive) setPosts([]); });
    return () => { alive = false; };
  }, []);

  const list = posts === null ? [] : (posts.length ? posts : SAMPLE);

  return (
    <div id="page-kc-blog">
      <div className="ph"><div className="phi">
        <div className="ph-grid">
          <div className="ph-left">
            <div className="bc">
              <Link to="/">Home</Link><span>/</span>
              <Link to="/kc">Knowledge Center</Link><span>/</span>
              <span>Blog</span>
            </div>
            <div className="pgbadge">📝 Blog</div>
            <h1>Insights &amp; <em>Updates</em></h1>
            <div className="ph-tags">
              <span className="ph-tag">GST</span>
              <span className="ph-tag">Direct Tax</span>
              <span className="ph-tag">RERA</span>
              <span className="ph-tag">FEMA</span>
              <span className="ph-tag">Audit</span>
            </div>
            <div className="ph-ctas">
              <Link className="ph-cta" to="/contact">Talk to an Expert →</Link>
              <Link className="ph-cta-outline" to="/kc-checklist">Compliance Checklist</Link>
            </div>
          </div>
          <div className="ph-right">
            <div className="ph-stat-grid">
              <div className="ph-stat"><div className="ph-stat-n">CA</div><div className="ph-stat-l">Expert Authored</div></div>
              <div className="ph-stat"><div className="ph-stat-n">Free</div><div className="ph-stat-l">Access</div></div>
              <div className="ph-stat"><div className="ph-stat-n">Weekly</div><div className="ph-stat-l">Updates</div></div>
              <div className="ph-stat"><div className="ph-stat-n">5+</div><div className="ph-stat-l">Topics</div></div>
            </div>
            <div className="ph-hl">
              <p>"We share what we learn from the field, so you can stay ahead of compliance changes, not chase them."</p>
              <cite>Editorial · V J Desai &amp; Co. LLP</cite>
            </div>
          </div>
        </div>
      </div></div>

      <section className="s scroll-sec" style={{ background: 'var(--white)' }}><div className="si">
        <div className="stag">Latest</div>
        <h2 className="ht" style={{ marginBottom: '1.4rem' }}>Recent <em>Articles</em></h2>
        {posts === null ? (
          <p style={{ color: 'var(--tmute)', fontSize: '.9rem' }}>Loading…</p>
        ) : (
          <div className="blog-grid">
            {list.map((p) => (
              <article className="bcard" key={p.id}>
                <div className="bcard-img" style={{ background: 'linear-gradient(135deg,var(--navy-card),var(--navy-hover))', padding: 0 }}>
                  {p.image
                    ? <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '2.4rem' }}>📝</span>}
                  <span className="bcard-badge">{p.category || 'Blog'}</span>
                </div>
                <div className="bcard-body">
                  <h3 className="bcard-title">{p.title}</h3>
                  {p.excerpt && <p className="bcard-excerpt">{p.excerpt}</p>}
                  <div className="bcard-meta"><span>{fmtDate(p.date)}</span></div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div></section>
    </div>
  );
}
