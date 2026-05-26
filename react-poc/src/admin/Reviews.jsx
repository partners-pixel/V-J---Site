import { useEffect, useState } from 'react';
import { authFetch, fmtDate } from './api.js';

const EMPTY = { name: '', role: 'Google Review', rating: 5, text: '' };

export default function Reviews({ onAuthFail }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState({ state: 'idle', msg: '' });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const load = async () => { try { const r = await fetch('/api/reviews'); const d = await r.json(); setItems(d.reviews || []); } catch { /* */ } };
  useEffect(() => { load(); }, []);

  const reset = () => { setForm(EMPTY); setEditId(null); };
  const edit = (r) => { setForm({ name: r.name, role: r.role, rating: r.rating, text: r.text }); setEditId(r.id); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'saving', msg: '' });
    const url = editId ? `/api/reviews/${editId}` : '/api/reviews';
    const r = await authFetch(url, { method: editId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (r.status === 401) return onAuthFail();
    const d = await r.json().catch(() => ({}));
    if (r.ok && d.success) { setStatus({ state: 'ok', msg: editId ? 'Review updated.' : 'Review added.' }); reset(); load(); }
    else setStatus({ state: 'error', msg: d.message || 'Could not save.' });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    const r = await authFetch(`/api/reviews/${id}`, { method: 'DELETE' });
    if (r.status === 401) return onAuthFail();
    if (r.ok) { if (editId === id) reset(); load(); }
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.5rem', color: 'var(--tdark)', marginBottom: '1.2rem' }}>Reviews ({items.length})</h2>
      <div className="cog" style={{ gridTemplateColumns: '1fr 1.2fr', marginTop: 0 }}>
        <div className="cof">
          <h3>{editId ? 'Edit Review' : 'Add Review'}</h3>
          <form onSubmit={onSubmit}>
            <div className="fg"><label>Reviewer Name *</label><input type="text" value={form.name} onChange={set('name')} placeholder="e.g. Adam Dayma" required /></div>
            <div className="fr">
              <div className="fg"><label>Label / Source</label><input type="text" value={form.role} onChange={set('role')} placeholder="Google Review · 2 months ago" /></div>
              <div className="fg"><label>Rating</label><select value={form.rating} onChange={set('rating')}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}</select></div>
            </div>
            <div className="fg"><label>Review Text *</label><textarea value={form.text} onChange={set('text')} placeholder="The review…" style={{ minHeight: 130 }} required /></div>
            {status.state === 'error' && <p style={{ color: '#e74c3c', fontSize: '.83rem', marginBottom: '.7rem' }}>{status.msg}</p>}
            {status.state === 'ok' && <p style={{ color: '#1E8449', fontSize: '.83rem', marginBottom: '.7rem' }}>✓ {status.msg}</p>}
            <div style={{ display: 'flex', gap: '.6rem' }}>
              <button className="bgs" type="submit" disabled={status.state === 'saving'}>{editId ? 'Update Review' : 'Add Review'}</button>
              {editId && <button type="button" className="bdo" onClick={reset} style={{ border: '1px solid rgba(0,0,0,.15)', color: 'var(--tmid)' }}>Cancel</button>}
            </div>
          </form>
        </div>
        <div>
          <h3 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--tdark)' }}>Published</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
            {items.map((r) => (
              <div key={r.id} style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,.08)', borderRadius: 8, padding: '.9rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.3rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--tdark)', fontSize: '.9rem' }}>{r.name}</span>
                  <span style={{ color: 'var(--gold)', fontSize: '.8rem' }}>{'★'.repeat(r.rating)}</span>
                </div>
                <div style={{ fontSize: '.72rem', color: 'var(--tmute)', marginBottom: '.45rem' }}>{r.role} · {fmtDate(r.date)}</div>
                <p style={{ fontSize: '.82rem', color: 'var(--tmute)', lineHeight: 1.55, margin: '0 0 .6rem' }}>{r.text.length > 160 ? r.text.slice(0, 160) + '…' : r.text}</p>
                <div style={{ display: 'flex', gap: '.5rem' }}>
                  <button onClick={() => edit(r)} style={{ background: 'none', border: '1px solid rgba(201,168,76,.5)', color: 'var(--gold-dim)', borderRadius: 6, padding: '.3rem .7rem', fontSize: '.74rem', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => onDelete(r.id)} style={{ background: 'none', border: '1px solid rgba(231,76,60,.4)', color: '#e74c3c', borderRadius: 6, padding: '.3rem .7rem', fontSize: '.74rem', cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
