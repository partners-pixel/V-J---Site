import { useEffect, useState, useRef } from 'react';
import useDocTitle from '../lib/useDocTitle.js';

const CATEGORIES = ['Blog', 'GST', 'Direct Tax', 'RERA', 'FEMA', 'Audit', 'Compliance'];
const fmtDate = (iso) => { try { return new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return ''; } };

/* ─── Login gate ─────────────────────────────────────────────────── */
function Login({ onAuth }) {
  const [key, setKey] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const r = await fetch('/api/blog/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey: key }),
      });
      if (r.ok) { localStorage.setItem('vjd_admin_key', key); onAuth(key); }
      else { const d = await r.json().catch(() => ({})); setErr(d.message || 'Invalid admin key.'); }
    } catch { setErr('Could not reach the server. Is server.js running on :3000?'); }
    finally { setBusy(false); }
  };

  return (
    <div className="ph" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="phi" style={{ width: '100%' }}>
        <div className="cof" style={{ maxWidth: 420, margin: '0 auto' }}>
          <div className="pgbadge" style={{ marginBottom: '1rem' }}>🔐 Admin Login</div>
          <h3>Blog Admin</h3>
          <p style={{ fontSize: '.86rem', color: 'var(--tmute)', margin: '0 0 1.4rem' }}>Enter the admin key to manage blog posts.</p>
          <form onSubmit={submit}>
            <div className="fg">
              <label>Admin Key</label>
              <input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter admin key" autoFocus required />
            </div>
            {err && <p style={{ color: '#e74c3c', fontSize: '.83rem', marginBottom: '.7rem' }}>{err}</p>}
            <button className="bgs" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign In →'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ─── Management panel (after login) ─────────────────────────────── */
function Panel({ adminKey, onLogout }) {
  const [form, setForm] = useState({ title: '', category: 'Blog', excerpt: '', content: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState({ state: 'idle', msg: '' });
  const fileRef = useRef(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const loadPosts = async () => {
    try { const r = await fetch('/api/blog'); const d = await r.json(); setPosts(d.posts || []); } catch { /* ignore */ }
  };
  useEffect(() => { loadPosts(); }, []);

  const onFile = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f); setPreview(f ? URL.createObjectURL(f) : '');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'saving', msg: '' });
    const fd = new FormData();
    fd.append('title', form.title); fd.append('category', form.category);
    fd.append('excerpt', form.excerpt); fd.append('content', form.content);
    if (file) fd.append('image', file);
    try {
      const r = await fetch('/api/blog', { method: 'POST', headers: { 'x-admin-key': adminKey }, body: fd });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.success) {
        setStatus({ state: 'ok', msg: 'Post published.' });
        setForm({ title: '', category: 'Blog', excerpt: '', content: '' });
        setFile(null); setPreview(''); if (fileRef.current) fileRef.current.value = '';
        loadPosts();
      } else if (r.status === 401) { onLogout(); }
      else setStatus({ state: 'error', msg: d.message || 'Could not publish.' });
    } catch { setStatus({ state: 'error', msg: 'Could not reach the server.' }); }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      const r = await fetch(`/api/blog/${id}`, { method: 'DELETE', headers: { 'x-admin-key': adminKey } });
      if (r.status === 401) { onLogout(); return; }
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.success) loadPosts();
      else setStatus({ state: 'error', msg: d.message || 'Could not delete.' });
    } catch { setStatus({ state: 'error', msg: 'Could not reach the server.' }); }
  };

  return (
    <>
      <div className="ph"><div className="phi">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div className="pgbadge">🔐 Admin</div>
            <h1>Blog <em>Admin Panel</em></h1>
            <p>Publish a blog post with a cover image. Posts appear on the Knowledge Center → Blog page.</p>
          </div>
          <button className="ph-cta-outline" onClick={onLogout}>Log out</button>
        </div>
      </div></div>

      <section className="s" style={{ background: 'var(--off)' }}>
        <div className="si">
          <div className="cog" style={{ gridTemplateColumns: '1.1fr 1fr' }}>
            <div className="cof">
              <h3>New Post</h3>
              <form onSubmit={onSubmit}>
                <div className="fg"><label>Title *</label><input type="text" value={form.title} onChange={set('title')} placeholder="Post title" required /></div>
                <div className="fr">
                  <div className="fg">
                    <label>Category</label>
                    <select value={form.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
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

            <div>
              <h3 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.28rem', marginBottom: '1rem', color: 'var(--tdark)' }}>Published Posts ({posts.length})</h3>
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
    </>
  );
}

export default function Admin() {
  useDocTitle('Blog Admin');
  const [adminKey, setAdminKey] = useState(null); // null = not logged in
  const [checking, setChecking] = useState(true);

  // Re-validate any stored key on load (so refresh keeps you signed in).
  useEffect(() => {
    const stored = localStorage.getItem('vjd_admin_key');
    if (!stored) { setChecking(false); return; }
    fetch('/api/blog/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminKey: stored }) })
      .then((r) => { if (r.ok) setAdminKey(stored); else localStorage.removeItem('vjd_admin_key'); })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const logout = () => { localStorage.removeItem('vjd_admin_key'); setAdminKey(null); };

  if (checking) return <div className="ph"><div className="phi"><p style={{ color: 'var(--tdim)' }}>Loading…</p></div></div>;
  return (
    <div id="page-admin">
      {adminKey ? <Panel adminKey={adminKey} onLogout={logout} /> : <Login onAuth={setAdminKey} />}
    </div>
  );
}
