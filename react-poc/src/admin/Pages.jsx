import { useState, useEffect } from 'react';
import { authFetch } from './api.js';

/* Pages — list every page, and edit any page's content. Editing loads the
   page's current HTML, and saving stores an override the live site renders
   in place of the default page. "Revert" restores the original. */

const GROUPS = [
  { group: 'Main', pages: [
    ['Home', '/', 'React'],
    ['About Us', '/why-choose-us', 'Legacy'],
    ['Team', '/team', 'Legacy'],
    ['Career', '/career', 'Legacy'],
    ['Contact Us', '/contact', 'React'],
    ['Sitemap', '/sitemap', 'Legacy'],
  ] },
  { group: 'GST / Indirect Tax', pages: [
    ['GST / Indirect Tax', '/gst', 'Template'],
    ['GST Classification', '/gst-class', 'Template'],
    ['GST Audit', '/gst-audit', 'Template'],
    ['GST Due Diligence', '/gst-dd', 'Template'],
    ['GST Litigation', '/gst-lit', 'Template'],
    ['GST Opinion', '/gst-opinion', 'Template'],
    ['GST – Refund', '/gst-refund', 'Template'],
    ['GST – Search Inquiry Support', '/gst-search', 'Template'],
  ] },
  { group: 'Direct Tax', pages: [
    ['Direct Tax', '/dtax', 'Legacy'],
    ['Corporate Tax', '/corp-tax', 'Legacy'],
    ['Income Tax', '/income-tax', 'Template'],
    ['Income Tax – Advisory', '/income-tax-adv', 'Template'],
    ['NRI – Taxation', '/nri-tax', 'Template'],
  ] },
  { group: 'Audit & Advisory', pages: [
    ['Audit & Advisory', '/audit', 'Template'],
    ['Statutory Audit', '/stat-audit', 'Template'],
    ['Tax Audit', '/tax-audit', 'Template'],
    ['Internal Audit', '/int-audit', 'Template'],
    ['Compliance Audit', '/comp-audit', 'Template'],
    ['Business Setup Services', '/biz-setup', 'Template'],
    ['Business Valuation & Restructuring', '/biz-val', 'Template'],
    ['Company Law', '/company-law', 'Template'],
    ['Exim Policy', '/exim', 'Template'],
    ['FEMA', '/fema', 'Template'],
    ['Management Consultancy & CFO', '/mgmt-cfo', 'Legacy'],
  ] },
  { group: 'RERA', pages: [
    ['RERA Compliance', '/rera', 'Template'],
    ['Project Registration Compliance', '/rera-reg', 'Template'],
    ['Quarterly Updates Disclosure', '/rera-qud', 'Template'],
    ['Project Extension Regulations', '/rera-ext', 'Template'],
    ['RERA Dispute Response Support', '/rera-disp', 'Template'],
  ] },
  { group: 'Knowledge Center', pages: [
    ['Knowledge Center', '/kc', 'Template'],
    ['Blog', '/kc-blog', 'React'],
    ['Checklist', '/kc-checklist', 'Legacy'],
  ] },
];

const TYPE_COLOR = { React: '#1E8449', Template: '#1A5276', Legacy: '#B7770D' };
export const PAGE_COUNT = GROUPS.reduce((n, g) => n + g.pages.length, 0);
const slugOf = (p) => (p === '/' ? 'home' : p.replace(/^\//, ''));

function Editor({ page, onAuthFail, onClose }) {
  const [title, path] = page;
  const slug = slugOf(path);
  const [html, setHtml] = useState(null); // null = loading
  const [status, setStatus] = useState({ state: 'idle', msg: '' });

  // Load current content for this page.
  useEffect(() => {
    let alive = true;
    authFetch(`/api/admin/page-source/${slug}`)
      .then((r) => { if (r.status === 401) { onAuthFail(); return null; } return r.json(); })
      .then((d) => { if (alive && d) setHtml(d.html || ''); })
      .catch(() => { if (alive) setHtml(''); });
    return () => { alive = false; };
  }, [slug]);

  const save = async () => {
    setStatus({ state: 'saving', msg: '' });
    const r = await authFetch(`/api/page-content/${slug}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ html }) });
    if (r.status === 401) return onAuthFail();
    if (r.ok) setStatus({ state: 'ok', msg: 'Saved — the live page now shows this content.' });
    else setStatus({ state: 'error', msg: 'Could not save.' });
  };
  const revert = async () => {
    if (!window.confirm('Revert this page to its original content?')) return;
    const r = await authFetch(`/api/page-content/${slug}`, { method: 'DELETE' });
    if (r.status === 401) return onAuthFail();
    if (r.ok) setStatus({ state: 'ok', msg: 'Reverted to the original page content.' });
  };

  return (
    <div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--gold-dim)', cursor: 'pointer', fontSize: '.85rem', marginBottom: '.8rem' }}>← Back to Pages</button>
      <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.4rem', color: 'var(--tdark)', marginBottom: '.2rem' }}>Edit: {title}</h2>
      <p style={{ color: 'var(--tmute)', fontSize: '.84rem', marginBottom: '1rem' }}>
        <code>{path}</code> — edit the page HTML below. Saving replaces the live page with this content; “Revert” restores the original.
      </p>
      {html === null ? <p style={{ color: 'var(--tmute)' }}>Loading content…</p> : (
        <>
          <textarea value={html} onChange={(e) => setHtml(e.target.value)} spellCheck={false}
            style={{ width: '100%', minHeight: 420, fontFamily: 'monospace', fontSize: '.78rem', lineHeight: 1.5, padding: '1rem', border: '1.5px solid rgba(0,0,0,.12)', borderRadius: 8, background: '#fff', color: '#1a202c' }} />
          {status.state === 'error' && <p style={{ color: '#e74c3c', fontSize: '.83rem', margin: '.6rem 0 0' }}>{status.msg}</p>}
          {status.state === 'ok' && <p style={{ color: '#1E8449', fontSize: '.83rem', margin: '.6rem 0 0' }}>✓ {status.msg}</p>}
          <div style={{ display: 'flex', gap: '.6rem', marginTop: '1rem' }}>
            <button className="bgs" onClick={save} disabled={status.state === 'saving'}>{status.state === 'saving' ? 'Saving…' : 'Save Changes'}</button>
            <button className="bdo" onClick={revert} style={{ border: '1px solid rgba(231,76,60,.4)', color: '#e74c3c' }}>Revert to Original</button>
          </div>
        </>
      )}
    </div>
  );
}

export default function Pages({ onAuthFail }) {
  const [editing, setEditing] = useState(null); // page tuple or null

  if (editing) return <Editor page={editing} onAuthFail={onAuthFail} onClose={() => setEditing(null)} />;

  return (
    <div>
      <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.5rem', color: 'var(--tdark)', marginBottom: '.3rem' }}>Pages ({PAGE_COUNT})</h2>
      <p style={{ color: 'var(--tmute)', fontSize: '.9rem', marginBottom: '1.4rem' }}>All pages on the website. Click <strong>Edit</strong> to change a page's content, or <strong>View</strong> to open it.</p>

      {GROUPS.map((g) => (
        <div key={g.group} style={{ marginBottom: '1.6rem' }}>
          <div style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '.5rem' }}>{g.group}</div>
          <div style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,.08)', borderRadius: 10, overflow: 'hidden' }}>
            {g.pages.map((page, i) => {
              const [title, path, type] = page;
              return (
                <div key={path + i} style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '.7rem 1.1rem', borderTop: i ? '1px solid var(--light)' : 'none' }}>
                  <div style={{ flex: 1, minWidth: 0, fontSize: '.88rem', fontWeight: 600, color: 'var(--tdark)' }}>{title}</div>
                  <code style={{ fontSize: '.74rem', color: 'var(--tmute)', flexShrink: 0 }}>{path}</code>
                  <span style={{ fontSize: '.62rem', fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: TYPE_COLOR[type], border: `1px solid ${TYPE_COLOR[type]}40`, borderRadius: 4, padding: '.12rem .5rem', flexShrink: 0 }}>{type}</span>
                  <button onClick={() => setEditing(page)} style={{ background: 'none', border: '1px solid rgba(201,168,76,.5)', color: 'var(--gold-dim)', borderRadius: 6, padding: '.3rem .7rem', fontSize: '.76rem', cursor: 'pointer', flexShrink: 0 }}>Edit</button>
                  <a href={path} target="_blank" rel="noopener" style={{ fontSize: '.76rem', fontWeight: 600, color: 'var(--tmute)', flexShrink: 0 }}>View ↗</a>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
