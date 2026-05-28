import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useDocTitle from '../lib/useDocTitle.js';

const fmtDate = (d) => {
  if (!d) return '';
  const t = new Date(d);
  return Number.isNaN(t.getTime()) ? d : t.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(undefined); // undefined = loading, null = not found

  useDocTitle(post ? post.title : 'Blog');

  useEffect(() => {
    let alive = true;
    setPost(undefined);
    fetch(`/api/blog/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (alive) setPost(d?.post || null); })
      .catch(() => { if (alive) setPost(null); });
    return () => { alive = false; };
  }, [id]);

  if (post === undefined) {
    return <div className="ph"><div className="phi"><p style={{ color: 'rgba(255,255,255,.7)' }}>Loading…</p></div></div>;
  }

  if (!post) {
    return (
      <div className="ph"><div className="phi">
        <div className="bc"><Link to="/">Home</Link><span>/</span><Link to="/kc-blog">Blog</Link><span>/</span><span>Not found</span></div>
        <h1>Article <em>not found</em></h1>
        <div className="ph-ctas" style={{ marginTop: '1.2rem' }}><Link className="ph-cta" to="/kc-blog">← Back to Blog</Link></div>
      </div></div>
    );
  }

  return (
    <div id="page-kc-blog-post">
      <div className="ph"><div className="phi">
        <div className="bc">
          <Link to="/">Home</Link><span>/</span>
          <Link to="/kc-blog">Blog</Link><span>/</span>
          <span>{post.category || 'Blog'}</span>
        </div>
        <div className="pgbadge">📝 {post.category || 'Blog'}</div>
        <h1>{post.title}</h1>
        <div style={{ color: 'rgba(255,255,255,.55)', fontSize: '.82rem', marginTop: '.6rem' }}>
          {fmtDate(post.date)}{post.updated ? ' · updated' : ''}
        </div>
      </div></div>

      <section className="s" style={{ background: 'var(--white)' }}><div className="si" style={{ maxWidth: 820 }}>
        {post.image && (
          <img src={post.image} alt={post.title} style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 12, marginBottom: '1.8rem' }} />
        )}
        {post.excerpt && <p style={{ fontSize: '1.05rem', color: 'var(--tmute)', lineHeight: 1.7, marginBottom: '1.6rem', fontStyle: 'italic' }}>{post.excerpt}</p>}
        {post.content
          ? <div className="blog-article" dangerouslySetInnerHTML={{ __html: post.content }} />
          : <p style={{ color: 'var(--tmute)' }}>No content.</p>}
        <div className="ph-ctas" style={{ marginTop: '2.4rem' }}>
          <Link className="ph-cta-outline" to="/kc-blog">← Back to Blog</Link>
        </div>
      </div></section>
    </div>
  );
}
