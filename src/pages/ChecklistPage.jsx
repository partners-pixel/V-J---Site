import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useDocTitle from '../lib/useDocTitle.js';

const fmtDate = (d) => {
  if (!d) return '';
  const t = new Date(d);
  return Number.isNaN(t.getTime()) ? d : t.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

const fmtSize = (b) => {
  if (!b && b !== 0) return '';
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
};

export default function ChecklistPage() {
  useDocTitle('Compliance Checklists');
  const [items, setItems] = useState(null); // null = loading

  useEffect(() => {
    let alive = true;
    fetch('/api/checklist')
      .then((r) => r.json())
      .then((d) => { if (alive) setItems(d.items || []); })
      .catch(() => { if (alive) setItems([]); });
    return () => { alive = false; };
  }, []);

  return (
    <div id="page-kc-checklist">
      <div className="ph"><div className="phi">
        <div className="bc">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/kc-blog">Knowledge Center</Link><span>/</span>
          <span>Checklists</span>
        </div>
        <div className="pgbadge">📋 Compliance Checklists</div>
        <h1>Compliance <em>Checklists</em></h1>
        <div className="ph-ctas">
          <Link className="ph-cta" to="/contact">Talk to an Expert →</Link>
          <Link className="ph-cta-outline" to="/kc-blog">Read the Blog</Link>
        </div>
      </div></div>

      <section className="s" style={{ background: 'var(--white)' }}><div className="si">
        <div className="stag">Download</div>
        <h2 className="ht" style={{ marginBottom: '1.4rem' }}>Ready-to-use <em>Checklists</em></h2>

        {items === null ? (
          <p style={{ color: 'var(--tmute)', fontSize: '.9rem' }}>Loading…</p>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '1px dashed rgba(0,0,0,.15)', borderRadius: 12, color: 'var(--tmute)' }}>
            <div style={{ fontSize: '2.4rem', marginBottom: '.6rem' }}>📋</div>
            <p style={{ fontSize: '1rem', marginBottom: '.3rem', color: 'var(--tdark)' }}>No checklists published yet.</p>
            <p style={{ fontSize: '.88rem' }}>Compliance checklists will appear here once published. Meanwhile, <Link to="/contact" style={{ color: 'var(--gold-dim,#A88830)' }}>get in touch</Link> for guidance.</p>
          </div>
        ) : (
          <div className="blog-grid">
            {items.map((it) => (
              <a className="bcard" href={it.file} target="_blank" rel="noreferrer" key={it.id} style={{ textDecoration: 'none' }}>
                <div className="bcard-img" style={{ background: 'linear-gradient(135deg,var(--navy-card),var(--navy-hover))', padding: 0 }}>
                  <span style={{ fontSize: '2.4rem' }}>📋</span>
                  <span className="bcard-badge">{it.category || 'General'}</span>
                </div>
                <div className="bcard-body">
                  <h3 className="bcard-title">{it.title}</h3>
                  {it.description && <p className="bcard-excerpt">{it.description}</p>}
                  <div className="bcard-meta">
                    <span>{fmtSize(it.size)} · {fmtDate(it.date)}</span>
                    <span style={{ color: 'var(--gold)', fontWeight: 600 }}>Download ↓</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div></section>
    </div>
  );
}
