import { useEffect, useState } from 'react';
import PageHero from '../templates/PageHero.jsx';
import useDocTitle from '../lib/useDocTitle.js';

// Shown when no posts have been published yet via the admin panel.
const SAMPLE = [
  { id: 's1', category: 'GST', date: '2025', title: 'GST Council Updates, Rate Changes & Compliance Decisions', excerpt: 'Summary of rate changes, exemptions, and compliance relaxations from recent GST Council meetings.', image: null },
  { id: 's2', category: 'Direct Tax', date: '2025', title: 'Budget 2025-26, Tax Highlights for Individuals & Corporates', excerpt: 'Key changes in income tax slabs, deductions, and compliance requirements for FY 2025-26.', image: null },
  { id: 's3', category: 'RERA', date: '2025', title: 'Gujarat RERA, Latest Circulars & Developer Compliance Updates', excerpt: 'Latest circulars and compliance requirements for real estate developers under Gujarat RERA.', image: null },
];

const fmtDate = (d) => { if (!d) return ''; const t = new Date(d); return isNaN(t) ? d : t.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }); };

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
      <PageHero
        current="Blog"
        badge="📝 Blog"
        title={{ pre: 'Insights & ', em: 'Updates' }}
        lead="Articles and regulatory updates across GST, direct tax, RERA, FEMA, and audit, explained in clear, practical terms by our Chartered Accountant team."
        tags={['GST', 'Direct Tax', 'RERA', 'FEMA', 'Audit']}
        ctas={[{ label: 'Talk to an Expert →', to: 'contact' }, { label: 'Compliance Checklist', to: 'kc-checklist', outline: true }]}
        stats={[{ n: 'CA', l: 'Expert Authored' }, { n: 'Free', l: 'Access' }, { n: 'Weekly', l: 'Updates' }, { n: '5+', l: 'Topics' }]}
        highlight={{ quote: '"We share what we learn from the field, so you can stay ahead of compliance changes, not chase them."', cite: 'Editorial · V J Desai & Co. LLP' }}
      />

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
