import { useState } from 'react';
import { Link } from 'react-router-dom';

const INFO = [
  ['📞', 'Call Us', <a href="tel:+919825062515" key="t">+91 98250 62515</a>],
  ['✉️', 'Email', <a href="mailto:info@vjdesai.com" key="e">info@vjdesai.com</a>],
  ['📍', 'Office', <span key="a">B-901/902, Ratnaakar Nine Square, 132 Feet Ring Rd, Opp. ITC Narmada, Satellite, Ahmedabad, Gujarat 380015</span>],
  ['🕐', 'Hours', <span key="h">Mon – Sat: 10:30 AM – 7:30 PM · Sunday: Closed</span>],
];

export default function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    // POC: no backend wired. In production this posts to an API route / form service.
    setSent(true);
  };

  return (
    <div id="page-contact">
      <div className="ph"><div className="phi">
        <div className="bc"><Link to="/">Home</Link><span>/</span><span>Contact Us</span></div>
        <div className="pgbadge">✉️ Contact V J Desai &amp; Co. LLP</div>
        <h1>Get in <em>Touch With Us</em></h1>
        <p>Reach out for a no-obligation consultation with our Chartered Accountants. We respond to every enquiry within one business day.</p>
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
              {sent ? (
                <div className="fi" style={{ display: 'block' }}>
                  <div className="fh">✓ Thank you — your enquiry has been recorded.</div>
                  <div className="fp">This is a proof-of-concept; in production this submits to the mail backend. We'd respond within one business day.</div>
                </div>
              ) : (
                <form onSubmit={onSubmit}>
                  <div className="fr">
                    <div className="fg"><label>First Name *</label><input type="text" placeholder="Rajesh" required /></div>
                    <div className="fg"><label>Last Name *</label><input type="text" placeholder="Mehta" required /></div>
                  </div>
                  <div className="fr">
                    <div className="fg"><label>Email Address *</label><input type="email" placeholder="you@company.com" required /></div>
                    <div className="fg"><label>Phone Number *</label><input type="tel" placeholder="+91 98765 43210" required /></div>
                  </div>
                  <div className="fg"><label>Company / Organisation</label><input type="text" placeholder="Your Company Pvt. Ltd." /></div>
                  <div className="fg">
                    <label>Entity Type</label>
                    <select defaultValue="">
                      <option value="">Select entity type</option>
                      <option>Private Limited Company</option>
                      <option>LLP / Partnership Firm</option>
                      <option>Proprietorship</option>
                      <option>Individual / HUF</option>
                      <option>NRI</option>
                    </select>
                  </div>
                  <div className="fg"><label>How can we help? *</label><textarea placeholder="Briefly describe your requirement…" required /></div>
                  <button className="bgs" type="submit">Send Enquiry →</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
