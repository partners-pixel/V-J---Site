import { useEffect, useState, useRef } from 'react';
import { authFetch, fmtDate } from './api.js';

const CATEGORIES = ['General', 'GST', 'Direct Tax', 'RERA', 'FEMA', 'Audit', 'Company Law'];
const EMPTY = { title: '', category: 'General', description: '' };

const fmtSize = (b) => {
  if (!b && b !== 0) return '';
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
};

export default function ChecklistManager({ onAuthFail }) {
  const [form, setForm] = useState(EMPTY);
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState({ state: 'idle', msg: '' });
  const fileRef = useRef(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const load = async () => { try { const r = await fetch('/api/checklist'); const d = await r.json(); setItems(d.items || []); } catch { /* */ } };
  useEffect(() => { load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setStatus({ state: 'error', msg: 'Please choose a file to upload.' }); return; }
    setStatus({ state: 'saving', msg: '' });
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append('file', file);
    try {
      const r = await authFetch('/api/checklist', { method: 'POST', body: fd });
      if (r.status === 401) return onAuthFail();
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.success) {
        setStatus({ state: 'ok', msg: 'Checklist uploaded.' });
        setForm(EMPTY); setFile(null); if (fileRef.current) fileRef.current.value = '';
        load();
      } else setStatus({ state: 'error', msg: d.message || 'Could not upload.' });
    } catch { setStatus({ state: 'error', msg: 'Could not reach the server.' }); }
  };

  const onDelete = async (itemId) => {
    if (!window.confirm('Delete this checklist?')) return;
    const r = await authFetch(`/api/checklist/${itemId}`, { method: 'DELETE' });
    if (r.status === 401) return onAuthFail();
    if (r.ok) load();
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.5rem', color: 'var(--tdark)', marginBottom: '1.2rem' }}>Checklists</h2>
      <div className="cog" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 0 }}>
        <div className="cof">
          <h3>Upload Checklist</h3>
          <form onSubmit={onSubmit}>
            <div className="fg"><label>Title *</label><input type="text" value={form.title} onChange={set('title')} placeholder="e.g. GST Annual Return Checklist" required /></div>
            <div className="fr">
              <div className="fg"><label>Category</label><select value={form.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
              <div className="fg"><label>File * (PDF, Word, Excel…)</label><input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.png,.jpg,.jpeg" onChange={(e) => setFile(e.target.files?.[0] || null)} /></div>
            </div>
            {file && <p style={{ fontSize: '.8rem', color: 'var(--tmute)', margin: '0 0 .8rem' }}>Selected: {file.name} ({fmtSize(file.size)})</p>}
            <div className="fg"><label>Description</label><input type="text" value={form.description} onChange={set('description')} placeholder="Short note shown under the title" /></div>
            {status.state === 'error' && <p style={{ color: '#e74c3c', fontSize: '.83rem', marginBottom: '.7rem' }}>{status.msg}</p>}
            {status.state === 'ok' && <p style={{ color: '#1E8449', fontSize: '.83rem', marginBottom: '.7rem' }}>✓ {status.msg}</p>}
            <button className="bgs" type="submit" disabled={status.state === 'saving'}>{status.state === 'saving' ? 'Uploading…' : 'Upload Checklist →'}</button>
          </form>
        </div>
        <div>
          <h3 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--tdark)' }}>Uploaded ({items.length})</h3>
          {items.length === 0 && <p style={{ fontSize: '.88rem', color: 'var(--tmute)' }}>No checklists yet.</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
            {items.map((it) => (
              <div key={it.id} style={{ display: 'flex', gap: '.9rem', alignItems: 'center', background: 'var(--white)', border: '1px solid rgba(0,0,0,.08)', borderRadius: 8, padding: '.7rem .9rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 6, background: 'var(--light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.2rem' }}>📋</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '.88rem', fontWeight: 600, color: 'var(--tdark)' }}>{it.title}</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--tmute)' }}>{it.category} · {fmtSize(it.size)} · {fmtDate(it.date)}</div>
                </div>
                <a href={it.file} target="_blank" rel="noreferrer" style={{ border: '1px solid rgba(0,0,0,.18)', color: 'var(--tdark)', borderRadius: 6, padding: '.35rem .7rem', fontSize: '.78rem', textDecoration: 'none' }}>View</a>
                <button onClick={() => onDelete(it.id)} style={{ background: 'none', border: '1px solid rgba(231,76,60,.4)', color: '#e74c3c', borderRadius: 6, padding: '.35rem .7rem', fontSize: '.78rem', cursor: 'pointer' }}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
