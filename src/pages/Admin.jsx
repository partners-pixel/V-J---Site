import { useEffect, useState } from 'react';
import useDocTitle from '../lib/useDocTitle.js';
import { getKey, clearKey } from '../admin/api.js';
import Login from '../admin/Login.jsx';
import Dashboard from '../admin/Dashboard.jsx';
import Pages from '../admin/Pages.jsx';
import BlogManager from '../admin/BlogManager.jsx';
import Enquiries from '../admin/Enquiries.jsx';
import Reviews from '../admin/Reviews.jsx';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'pages', label: 'Pages', icon: '📄' },
  { id: 'blog', label: 'Blog', icon: '📝' },
  { id: 'enquiries', label: 'Enquiries', icon: '📨' },
  { id: 'reviews', label: 'Reviews', icon: '⭐' },
];

export default function Admin() {
  useDocTitle('Admin');
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [section, setSection] = useState('dashboard');

  // Re-validate stored key on load (stay signed in across refresh).
  useEffect(() => {
    const stored = getKey();
    if (!stored) { setChecking(false); return; }
    fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminKey: stored }) })
      .then((r) => { if (r.ok) setAuthed(true); else clearKey(); })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const logout = () => { clearKey(); setAuthed(false); };
  const onAuthFail = logout;

  if (checking) return <div className="ph"><div className="phi"><p style={{ color: 'var(--tdim)' }}>Loading…</p></div></div>;
  if (!authed) return <div id="page-admin"><Login onAuth={() => setAuthed(true)} /></div>;

  const Section = { dashboard: Dashboard, pages: Pages, blog: BlogManager, enquiries: Enquiries, reviews: Reviews }[section];

  return (
    <div id="page-admin" style={{ display: 'flex', minHeight: '70vh', background: 'var(--off)' }}>
      {/* Sidebar */}
      <aside style={{ width: 210, flexShrink: 0, background: 'var(--navy)', padding: '1.4rem 0', position: 'sticky', top: 0, alignSelf: 'flex-start', minHeight: '70vh' }}>
        <div style={{ padding: '0 1.3rem 1.1rem', color: 'var(--gold)', fontFamily: "'EB Garamond',serif", fontSize: '1.05rem', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,.1)', marginBottom: '.8rem' }}>
          Admin Panel
        </div>
        {NAV.map((n) => (
          <button key={n.id} onClick={() => setSection(n.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '.6rem', width: '100%', textAlign: 'left', padding: '.7rem 1.3rem', background: section === n.id ? 'rgba(201,168,76,.14)' : 'none', border: 'none', borderLeft: section === n.id ? '3px solid var(--gold)' : '3px solid transparent', color: section === n.id ? 'var(--gold)' : 'rgba(255,255,255,.7)', fontSize: '.88rem', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
            <span>{n.icon}</span>{n.label}
          </button>
        ))}
        <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '.6rem', width: '100%', textAlign: 'left', padding: '.7rem 1.3rem', marginTop: '1.2rem', background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', fontSize: '.85rem', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
          ⏻ Log out
        </button>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: '2rem 2.2rem', minWidth: 0 }}>
        <Section onAuthFail={onAuthFail} go={setSection} />
      </main>
    </div>
  );
}
