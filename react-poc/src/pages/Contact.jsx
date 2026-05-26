import { useState } from 'react';
import { Link } from 'react-router-dom';
import useDocTitle from '../lib/useDocTitle.js';

const INFO = [
  ['📞', 'Call Us', <a href="tel:+919825062515" key="t">+91 98250 62515</a>],
  ['✉️', 'Email', <a href="mailto:info@vjdesai.com" key="e">info@vjdesai.com</a>],
  ['📍', 'Office', <span key="a">B-901/902, Ratnaakar Nine Square, 132 Feet Ring Rd, Opp. ITC Narmada, Satellite, Ahmedabad, Gujarat 380015</span>],
  ['🕐', 'Hours', <span key="h">Mon – Sat: 10:30 AM – 7:30 PM · Sunday: Closed</span>],
];

const EMPTY = {
  'First Name': '', 'Last Name': '', email: '', Phone: '',
  Company: '', 'Entity Type': '', 'Service Enquiry': '', Message: '', _honey: '',
};

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState({ state: 'idle', msg: '' }); // idle | sending | ok | error
  useDocTitle('Contact Us');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'sending', msg: '' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStatus({ state: 'ok', msg: data.message || 'Enquiry sent successfully.' });
      } else {
        setStatus({ state: 'error', msg: data.message || 'Something went wrong. Please try again.' });
      }
    } catch {
      setStatus({ state: 'error', msg: 'Could not reach the server. Is the mail backend (server.js) running on :3000?' });
    }
  };

  return (
    <div id="page-contact">
      <div className="ph"><div className="phi">
        <div className="bc"><Link to="/">Home</Link><span>/</span><span>Contact Us</span></div>
        <div className="pgbadge">✉️ Contact V J Desai &amp; Co. LLP</div>
        <h1>Get in <em>Touch With Us</em></h1>
      </div></div>

      <section className="s" style={{ background: 'var(--off)' }}>
        <div className="si">
          <div className="stag">Contact</div>
          <h2 className="ht">Let's <em>Start a Conversation</em></h2>
          <div className="cog">
            <div className="coi">
              {INFO.map(([ico, label, val]) => (
                <div className="cox" key={label}>
                  <div className="coxi">{ico}</div>
                  <div><h4>{label}</h4><p>{val}</p></div>
                </div>
              ))}
            </div>

            <div className="cof">
              <h3>Book a Free Consultation</h3>
              {status.state === 'ok' ? (
                <div className="fi" style={{ display: 'block' }}>
                  <div className="fh">✓ {status.msg}</div>
                  <div className="fp">Thank you — we'll respond within one business day.</div>
                </div>
              ) : (
                <form onSubmit={onSubmit}>
                  {/* Honeypot (hidden from humans) */}
                  <input type="text" value={form._honey} onChange={set('_honey')} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                  <div className="fr">
                    <div className="fg"><label>First Name *</label><input type="text" value={form['First Name']} onChange={set('First Name')} placeholder="Rajesh" required /></div>
                    <div className="fg"><label>Last Name *</label><input type="text" value={form['Last Name']} onChange={set('Last Name')} placeholder="Mehta" required /></div>
                  </div>
                  <div className="fr">
                    <div className="fg"><label>Email Address *</label><input type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" required /></div>
                    <div className="fg"><label>Phone Number *</label><input type="tel" value={form.Phone} onChange={set('Phone')} placeholder="+91 98765 43210" required /></div>
                  </div>
                  <div className="fr">
                    <div className="fg"><label>Company / Organisation</label><input type="text" value={form.Company} onChange={set('Company')} placeholder="Your Company Pvt. Ltd." /></div>
                    <div className="fg">
                      <label>Entity Type</label>
                      <select value={form['Entity Type']} onChange={set('Entity Type')}>
                        <option value="">Select entity type</option>
                        <option>Private Limited Company</option>
                        <option>LLP / Partnership Firm</option>
                        <option>Proprietorship</option>
                        <option>Individual / HUF</option>
                        <option>NRI</option>
                      </select>
                    </div>
                  </div>
                  <div className="fg">
                    <label>Service Enquiry *</label>
                    <select value={form['Service Enquiry']} onChange={set('Service Enquiry')} required>
                      <option value="">Select a service</option>
                      <option>GST / Indirect Tax</option>
                      <option>Direct Tax</option>
                      <option>Audit &amp; Advisory</option>
                      <option>RERA Compliance</option>
                      <option>FEMA / International</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="fg"><label>How can we help? *</label><textarea value={form.Message} onChange={set('Message')} placeholder="Briefly describe your requirement…" required /></div>
                  {status.state === 'error' && (
                    <p style={{ color: '#e74c3c', fontSize: '.83rem', marginBottom: '.8rem' }}>{status.msg}</p>
                  )}
                  <button className="bgs" type="submit" disabled={status.state === 'sending'}>
                    {status.state === 'sending' ? 'Sending…' : 'Send Enquiry →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
