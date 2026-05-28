import { useEffect, useState, useRef } from 'react';
import { authFetch, fmtDate } from './api.js';

const CATEGORIES = ['Blog', 'GST', 'Direct Tax', 'RERA', 'FEMA', 'Audit', 'Compliance'];

export default function BlogManager({ onAuthFail }) {
  const [form, setForm] = useState({ title: '', category: 'Blog', excerpt: '', content: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState({ state: 'idle', msg: '' });
  const fileRef = useRef(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const load = async () => { try { const r = await fetch('/api/blog'); const d = await r.json(); setPosts(d.posts || []); } catch { /* */ } };
  useEffect(() => { load(); }, []);

  const onFile = (e) => { const f = e.target.files?.[0] || null; setFile(f); setPreview(f ? URL.createObjectURL(f) : ''); };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'saving', msg: '' });
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);
    try {
      const r = await authFetch('/api/blog', { method: 'POST', body: fd });
      if (r.status === 401) return onAuthFail();
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.success) {
        setStatus({ state: 'ok', msg: 'Post published.' });
        setForm({ title: '', category: 'Blog', excerpt: '', content: '' });
        setFile(null); setPreview(''); if (fileRef.current) fileRef.current.value = '';
        load();
      } else setStatus({ state: 'error', msg: d.message || 'Could not publish.' });
    } catch { setStatus({ state: 'error', msg: 'Could not reach the server.' }); }
  };

  const onDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    const r = await authFetch(`/api/blog/${postId}`, { method: 'DELETE' });
    if (r.status === 401) return onAuthFail();
    if (r.ok) load();
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.5rem', color: 'var(--tdark)', marginBottom: '1.2rem' }}>Blog</h2>
      <div className="cog" style={{ gridTemplateColumns: '1.1fr 1fr', marginTop: 0 }}>
        <div className="cof">
          <h3>New Post</h3>
          <form onSubmit={onSubmit}>
            <div className="fg"><label>Title *</label><input type="text" value={form.title} onChange={set('title')} placeholder="Post title" required /></div>
            <div className="fr">
              <div className="fg"><label>Category</label><select value={form.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
              <div className="fg"><label>Cover Image</label><input ref={fileRef} type="file" accept="image/*" onChange={onFile} /></div>
            </div>
            {preview && <img src={preview} alt="preview" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 8, margin: '0 0 .9rem' }} />}
            <div className="fg"><label>Excerpt</label><input type="text" value={form.excerpt} onChange={set('excerpt')} placeholder="Short summary" /></div>
            <div className="fg"><label>Content</label><textarea value={form.content} onChange={set('content')} placeholder="Full post body…" style={{ minHeight: 130 }} /></div>
            {status.state === 'error' && <p style={{ color: '#e74c3c', fontSize: '.83rem', marginBottom: '.7rem' }}>{status.msg}</p>}
            {status.state === 'ok' && <p style={{ color: '#1E8449', fontSize: '.83rem', marginBottom: '.7rem' }}>✓ {status.msg}</p>}
            <button className="bgs" type="submit" disabled={status.state === 'saving'}>{status.state === 'saving' ? 'Publishing…' : 'Publish Post →'}</button>
          </form>
        </div>
        <div>
          <h3 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--tdark)' }}>Published ({posts.length})</h3>
          {posts.length === 0 && <p style={{ fontSize: '.88rem', color: 'var(--tmute)' }}>No posts yet.</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
            {posts.map((p) => (
              <div key={p.id} style={{ display: 'flex', gap: '.9rem', alignItems: 'center', background: 'var(--white)', border: '1px solid rgba(0,0,0,.08)', borderRadius: 8, padding: '.7rem .9rem' }}>
                {p.image ? <img src={p.image} alt="" style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                  : <div style={{ width: 64, height: 48, borderRadius: 6, background: 'var(--light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>📝</div>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '.88rem', fontWeight: 600, color: 'var(--tdark)' }}>{p.title}</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--tmute)' }}>{p.category} · {fmtDate(p.date)}</div>
                </div>
                <button onClick={() => onDelete(p.id)} style={{ background: 'none', border: '1px solid rgba(231,76,60,.4)', color: '#e74c3c', borderRadius: 6, padding: '.35rem .7rem', fontSize: '.78rem', cursor: 'pointer' }}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
