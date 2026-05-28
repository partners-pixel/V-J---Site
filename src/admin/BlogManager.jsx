import { useEffect, useState, useRef } from 'react';
import { authFetch, fmtDate } from './api.js';
import RichTextEditor from './RichTextEditor.jsx';

const CATEGORIES = ['Blog', 'GST', 'Direct Tax', 'RERA', 'FEMA', 'Audit', 'Compliance'];
const EMPTY = { title: '', category: 'Blog', excerpt: '', content: '' };

export default function BlogManager({ onAuthFail }) {
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null); // null = creating a new post
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [existingImage, setExistingImage] = useState(null); // current image when editing
  const [removeImage, setRemoveImage] = useState(false);
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState({ state: 'idle', msg: '' });
  const fileRef = useRef(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const load = async () => { try { const r = await fetch('/api/blog'); const d = await r.json(); setPosts(d.posts || []); } catch { /* */ } };
  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm(EMPTY); setEditingId(null); setFile(null); setPreview('');
    setExistingImage(null); setRemoveImage(false);
    if (fileRef.current) fileRef.current.value = '';
    setStatus({ state: 'idle', msg: '' });
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({ title: p.title || '', category: p.category || 'Blog', excerpt: p.excerpt || '', content: p.content || '' });
    setExistingImage(p.image || null);
    setRemoveImage(false); setFile(null); setPreview('');
    if (fileRef.current) fileRef.current.value = '';
    setStatus({ state: 'idle', msg: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onFile = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f); setPreview(f ? URL.createObjectURL(f) : '');
    if (f) setRemoveImage(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'saving', msg: '' });
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);
    if (editingId && removeImage && !file) fd.append('removeImage', 'true');

    const url = editingId ? `/api/blog/${editingId}` : '/api/blog';
    const method = editingId ? 'PUT' : 'POST';
    try {
      const r = await authFetch(url, { method, body: fd });
      if (r.status === 401) return onAuthFail();
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.success) {
        setStatus({ state: 'ok', msg: editingId ? 'Post updated.' : 'Post published.' });
        resetForm();
        load();
      } else setStatus({ state: 'error', msg: d.message || 'Could not save.' });
    } catch { setStatus({ state: 'error', msg: 'Could not reach the server.' }); }
  };

  const onDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    const r = await authFetch(`/api/blog/${postId}`, { method: 'DELETE' });
    if (r.status === 401) return onAuthFail();
    if (r.ok) { if (editingId === postId) resetForm(); load(); }
  };

  const showCurrentImage = editingId && existingImage && !removeImage && !preview;

  return (
    <div>
      <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.5rem', color: 'var(--tdark)', marginBottom: '1.2rem' }}>Blog</h2>
      <div className="cog" style={{ gridTemplateColumns: '1.15fr 1fr', marginTop: 0 }}>
        <div className="cof">
          <h3>{editingId ? 'Edit Post' : 'New Post'}</h3>
          <form onSubmit={onSubmit}>
            <div className="fg"><label>Title *</label><input type="text" value={form.title} onChange={set('title')} placeholder="Post title" required /></div>
            <div className="fr">
              <div className="fg"><label>Category</label><select value={form.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></div>
              <div className="fg"><label>Cover Image</label><input ref={fileRef} type="file" accept="image/*" onChange={onFile} /></div>
            </div>
            {preview && <img src={preview} alt="preview" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 8, margin: '0 0 .9rem' }} />}
            {showCurrentImage && (
              <div style={{ margin: '0 0 .9rem' }}>
                <img src={existingImage} alt="current cover" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 8 }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontSize: '.8rem', color: 'var(--tmute)', marginTop: '.4rem' }}>
                  <input type="checkbox" checked={removeImage} onChange={(e) => setRemoveImage(e.target.checked)} /> Remove current image
                </label>
              </div>
            )}
            <div className="fg"><label>Excerpt</label><input type="text" value={form.excerpt} onChange={set('excerpt')} placeholder="Short summary shown on the card" /></div>
            <div className="fg">
              <label>Content</label>
              <RichTextEditor value={form.content} onChange={(html) => setForm((f) => ({ ...f, content: html }))} placeholder="Write the full post… use the toolbar to format." />
            </div>
            {status.state === 'error' && <p style={{ color: '#e74c3c', fontSize: '.83rem', margin: '.7rem 0' }}>{status.msg}</p>}
            {status.state === 'ok' && <p style={{ color: '#1E8449', fontSize: '.83rem', margin: '.7rem 0' }}>✓ {status.msg}</p>}
            <div style={{ display: 'flex', gap: '.7rem', marginTop: '.8rem' }}>
              <button className="bgs" type="submit" disabled={status.state === 'saving'}>
                {status.state === 'saving' ? 'Saving…' : editingId ? 'Update Post →' : 'Publish Post →'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} style={{ background: 'none', border: '1px solid rgba(0,0,0,.2)', borderRadius: 6, padding: '.55rem 1rem', fontSize: '.85rem', cursor: 'pointer', color: 'var(--tmute)' }}>Cancel</button>
              )}
            </div>
          </form>
        </div>
        <div>
          <h3 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--tdark)' }}>Published ({posts.length})</h3>
          {posts.length === 0 && <p style={{ fontSize: '.88rem', color: 'var(--tmute)' }}>No posts yet.</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
            {posts.map((p) => (
              <div key={p.id} style={{ display: 'flex', gap: '.9rem', alignItems: 'center', background: 'var(--white)', border: editingId === p.id ? '1px solid var(--gold)' : '1px solid rgba(0,0,0,.08)', borderRadius: 8, padding: '.7rem .9rem' }}>
                {p.image ? <img src={p.image} alt="" style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                  : <div style={{ width: 64, height: 48, borderRadius: 6, background: 'var(--light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>📝</div>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '.88rem', fontWeight: 600, color: 'var(--tdark)' }}>{p.title}</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--tmute)' }}>{p.category} · {fmtDate(p.date)}{p.updated ? ' · edited' : ''}</div>
                </div>
                <button onClick={() => startEdit(p)} style={{ background: 'none', border: '1px solid rgba(201,168,76,.5)', color: 'var(--gold-dim,#A88830)', borderRadius: 6, padding: '.35rem .7rem', fontSize: '.78rem', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => onDelete(p.id)} style={{ background: 'none', border: '1px solid rgba(231,76,60,.4)', color: '#e74c3c', borderRadius: 6, padding: '.35rem .7rem', fontSize: '.78rem', cursor: 'pointer' }}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
