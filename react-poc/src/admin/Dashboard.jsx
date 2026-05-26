import { useEffect, useState } from 'react';
import { authFetch } from './api.js';

export default function Dashboard({ onAuthFail, go }) {
  const [counts, setCounts] = useState({ posts: '–', enquiries: '–', reviews: '–' });

  useEffect(() => {
    (async () => {
      try {
        const [b, rv] = await Promise.all([fetch('/api/blog'), fetch('/api/reviews')]);
        const bd = await b.json().catch(() => ({})); const rd = await rv.json().catch(() => ({}));
        const e = await authFetch('/api/admin/enquiries');
        if (e.status === 401) return onAuthFail();
        const ed = await e.json().catch(() => ({}));
        setCounts({ posts: (bd.posts || []).length, enquiries: (ed.enquiries || []).length, reviews: (rd.reviews || []).length });
      } catch { /* */ }
    })();
  }, []);

  const cards = [
    { k: 'posts', label: 'Blog Posts', icon: '📝', to: 'blog', color: '#1A5276' },
    { k: 'enquiries', label: 'Enquiries', icon: '📨', to: 'enquiries', color: '#1E8449' },
    { k: 'reviews', label: 'Reviews', icon: '⭐', to: 'reviews', color: '#B7770D' },
  ];

  return (
    <div>
      <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.5rem', color: 'var(--tdark)', marginBottom: '.4rem' }}>Dashboard</h2>
      <p style={{ color: 'var(--tmute)', fontSize: '.9rem', marginBottom: '1.6rem' }}>Manage your website content from here.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.1rem' }}>
        {cards.map((c) => (
          <button key={c.k} onClick={() => go(c.to)} style={{ textAlign: 'left', background: 'var(--white)', border: '1px solid rgba(0,0,0,.08)', borderTop: `3px solid ${c.color}`, borderRadius: 10, padding: '1.5rem', cursor: 'pointer' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '.5rem' }}>{c.icon}</div>
            <div style={{ fontFamily: "'EB Garamond',serif", fontSize: '2rem', fontWeight: 700, color: 'var(--tdark)', lineHeight: 1 }}>{counts[c.k]}</div>
            <div style={{ fontSize: '.8rem', color: 'var(--tmute)', marginTop: '.3rem' }}>{c.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
