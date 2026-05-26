import { useState } from 'react';
import { setKey } from './api.js';

export default function Login({ onAuth }) {
  const [key, setK] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminKey: key }) });
      if (r.ok) { setKey(key); onAuth(key); }
      else { const d = await r.json().catch(() => ({})); setErr(d.message || 'Invalid admin key.'); }
    } catch { setErr('Could not reach the server. Is server.js running on :3000?'); }
    finally { setBusy(false); }
  };

  return (
    <div className="ph" style={{ minHeight: '78vh', display: 'flex', alignItems: 'center' }}>
      <div className="phi" style={{ width: '100%' }}>
        <div className="cof" style={{ maxWidth: 420, margin: '0 auto' }}>
          <div className="pgbadge" style={{ marginBottom: '1rem' }}>🔐 Admin Login</div>
          <h3>V J Desai &amp; Co. — Admin</h3>
          <p style={{ fontSize: '.86rem', color: 'var(--tmute)', margin: '0 0 1.4rem' }}>Enter the admin key to manage the website.</p>
          <form onSubmit={submit}>
            <div className="fg"><label>Admin Key</label><input type="password" value={key} onChange={(e) => setK(e.target.value)} placeholder="Enter admin key" autoFocus required /></div>
            {err && <p style={{ color: '#e74c3c', fontSize: '.83rem', marginBottom: '.7rem' }}>{err}</p>}
            <button className="bgs" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign In →'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
