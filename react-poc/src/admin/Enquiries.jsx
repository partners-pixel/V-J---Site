import { useEffect, useState } from 'react';
import { authFetch, fmtDate } from './api.js';

export default function Enquiries({ onAuthFail }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const r = await authFetch('/api/admin/enquiries');
    if (r.status === 401) { onAuthFail(); return; }
    const d = await r.json().catch(() => ({}));
    setItems(d.enquiries || []); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    const r = await authFetch(`/api/admin/enquiries/${id}`, { method: 'DELETE' });
    if (r.status === 401) return onAuthFail();
    if (r.ok) load();
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.5rem', color: 'var(--tdark)', marginBottom: '1.2rem' }}>Enquiries ({items.length})</h2>
      {loading ? <p style={{ color: 'var(--tmute)' }}>Loading…</p>
        : items.length === 0 ? <p style={{ fontSize: '.9rem', color: 'var(--tmute)' }}>No enquiries yet. Submissions from the contact form will appear here.</p>
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.9rem' }}>
            {items.map((e) => (
              <div key={e.id} style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,.08)', borderRadius: 10, padding: '1.1rem 1.3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '.5rem' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--tdark)' }}>{e['First Name']} {e['Last Name']}</span>
                    {e['Service Enquiry'] && <span style={{ marginLeft: '.6rem', fontSize: '.68rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', background: 'var(--gold-pale)', color: 'var(--gold-dim)', padding: '.16rem .55rem', borderRadius: 4 }}>{e['Service Enquiry']}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '.8rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '.74rem', color: 'var(--tmute)' }}>{fmtDate(e.date)}</span>
                    <button onClick={() => onDelete(e.id)} style={{ background: 'none', border: '1px solid rgba(231,76,60,.4)', color: '#e74c3c', borderRadius: 6, padding: '.3rem .65rem', fontSize: '.74rem', cursor: 'pointer' }}>Delete</button>
                  </div>
                </div>
                <div style={{ fontSize: '.82rem', color: 'var(--tmid)', marginBottom: '.5rem', display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
                  {e['Email Address'] && <a href={`mailto:${e['Email Address']}`} style={{ color: 'var(--gold-dim)' }}>✉️ {e['Email Address']}</a>}
                  {e['Phone Number'] && <a href={`tel:${e['Phone Number']}`} style={{ color: 'var(--gold-dim)' }}>📞 {e['Phone Number']}</a>}
                  {e['Company / Organisation'] && <span>🏢 {e['Company / Organisation']}</span>}
                </div>
                {e.Message && <p style={{ fontSize: '.85rem', color: 'var(--tmute)', lineHeight: 1.6, margin: 0 }}>{e.Message}</p>}
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
