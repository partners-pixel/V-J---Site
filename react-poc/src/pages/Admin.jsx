import { useEffect, useState, useRef } from 'react';
import useDocTitle from '../lib/useDocTitle.js';

const CATEGORIES = ['Blog', 'GST', 'Direct Tax', 'RERA', 'FEMA', 'Audit', 'Compliance'];
const fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return ''; } };

export default function Admin() {
  useDocTitle('Blog Admin');
  const [key, setKey] = useState(() => localStorage.getItem('vjd_admin_key') || '');
  const [form, setForm] = useState({ title: '', category: 'Blog', excerpt: '', content: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState({ state: 'idle', msg: '' });
  const fileRef = useRef(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const loadPosts = async () => {
    try {
      const r = await fetch('/api/blog');
      const d = await r.json();
      setPosts(d.posts || []);
    } catch { /* ignore */ }
  };
  useEffect(() => { loadPosts(); }, []);

  const onFile = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : '');
  };

  const rememberKey = (v) => { setKey(v); localStorage.setItem('vjd_admin_key', v); };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!key) { setStatus({ state: 'error', msg: 'Enter the admin key first.' }); return; }
    setStatus({ state: 'saving', msg: '' });
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('category', form.category);
    fd.append('excerpt', form.excerpt);
    fd.append('content', form.content);
    if (file) fd.append('image', file);
    try {
      const r = await fetch('/api/blog', { method: 'POST', headers: { 'x-admin-key': key }, body: fd });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.success) {
        setStatus({ state: 'ok', msg: 'Post published.' });
        setForm({ title: '', category: 'Blog', excerpt: '', content: '' });
        setFile(null); setPreview(''); if (fileRef.current) fileRef.current.value = '';
        loadPosts();
      } else {
        setStatus({ state: 'error', msg: d.message || 'Could not publish.' });
      }
    } catch {
      setStatus({ state: 'error', msg: 'Could not reach the server. Is server.js running on :3000?' });
    }
  };

  const onDelete = async (id) => {
    if (!key) { setStatus({ state: 'error', msg: 'Enter the admin key first.' }); return; }
    if (!window.confirm('Delete this post?')) return;
    try {
      const r = await fetch(`/api/blog/${id}`, { method: 'DELETE', headers: { 'x-admin-key': key } });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.success) loadPosts();
      else setStatus({ state: 'error', msg: d.message || 'Could not delete.' });
    } catch { setStatus({ state: 'error', msg: 'Could not reach the server.' }); }
  };

  return (
    <div id="page-admin">
      <div className="ph"><div className="phi">
        <div className="pgbadge">🔐 Admin</div>
        <h1>Blog <em>Admin Panel</em></h1>
        <p>Publish a blog post with a cover image. Posts appear on the Knowledge Center → Blog page.</p>
      </div></div>

      <section className="s" style={{ background: 'var(--off)' }}>
        <div className="si">
          <div className="cog" style={{ gridTemplateColumns: '1.1fr 1fr' }}>
            {/* New post form */}
            <div className="cof">
              <h3>New Post</h3>

              <div className="fg">
                <label>Admin Key *</label>
                <input type="password" value={key} onChange={(e) => rememberKey(e.target.value)} placeholder="Enter admin key" />
              </div>

              <form onSubmit={onSubmit}>
                <div className="fg"><label>Title *</label><input type="text" value={form.title} onChange={set('title')} placeholder="Post title" required /></div>
                <div className="fr">
                  <div className="fg">
                    <label>Category</label>
                    <select value={form.category} onChange={set('category')}>
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="fg"><label>Cover Image</label><input ref={fileRef} type="file" accept="image/*" onChange={onFile} /></div>
                </div>
                {preview && <img src={preview} alt="preview" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 8, margin: '0 0 .9rem' }} />}
                <div className="fg"><label>Excerpt</label><input type="text" value={form.excerpt} onChange={set('excerpt')} placeholder="Short summary shown on the blog list" /></div>
                <div className="fg"><label>Content</label><textarea value={form.content} onChange={set('content')} placeholder="Full post body…" style={{ minHeight: 140 }} /></div>
                {status.state === 'error' && <p style={{ color: '#e74c3c', fontSize: '.83rem', marginBottom: '.7rem' }}>{status.msg}</p>}
                {status.state === 'ok' && <p style={{ color: '#1E8449', fontSize: '.83rem', marginBottom: '.7rem' }}>✓ {status.msg}</p>}
                <button className="bgs" type="submit" disabled={status.state === 'saving'}>{status.state === 'saving' ? 'Publishing…' : 'Publish Post →'}</button>
              </form>
            </div>

            {/* Existing posts */}
            <div>
              <h3 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.28rem', marginBottom: '1rem', color: 'var(--tdark)' }}>
                Published Posts ({posts.length})
              </h3>
              {posts.length === 0 && <p style={{ fontSize: '.88rem', color: 'var(--tmute)' }}>No posts yet. Publish your first one.</p>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
                {posts.map((p) => (
                  <div key={p.id} style={{ display: 'flex', gap: '.9rem', alignItems: 'center', background: 'var(--white)', border: '1px solid rgba(0,0,0,.08)', borderRadius: 8, padding: '.7rem .9rem' }}>
                    {p.image
                      ? <img src={p.image} alt="" style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
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
      </section>
    </div>
  );
}
