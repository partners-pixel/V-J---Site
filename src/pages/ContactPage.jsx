import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm.jsx';
import '../styles/contact-page.css';

export default function ContactPage() {
  const detailsRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    document.title = 'Contact Us | V J Desai & Co. LLP';
    document.body.dataset.page = 'contact';
  }, []);

  const scrollTo = (ref) => () => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <main>
      {/* HERO */}
      <section className="cou-hero">
        <div className="cou-hero-inner">
          <div className="cou-crumbs">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span className="now">Contact Us</span>
          </div>
          <div className="cou-badge2">✉️&nbsp;&nbsp;Contact V J Desai &amp; Co. LLP</div>
          <h1 className="cou-h1">Get in <em>Touch With Us</em></h1>
        </div>
      </section>

      {/* SUB-NAV */}
      <nav className="cou-snav" aria-label="Contact page sections">
        <div className="cou-snav-inner">
          <button type="button" className="cou-sn on" onClick={scrollTo(detailsRef)}>Contact Details</button>
          <button type="button" className="cou-sn" onClick={scrollTo(formRef)}>Book Consultation</button>
        </div>
      </nav>

      {/* SECTION 1: CONTACT DETAILS + FORM */}
      <section ref={detailsRef} className="cou-s-off">
        <div className="cou-inn">
          <div className="cou-mg">

            {/* LEFT — contact details */}
            <div>
              <div className="cou-stg">Our Details</div>
              <h2 className="cou-hd">Reach <em>Our Office</em></h2>
              <p className="cou-intro">
                Visit us at our Satellite, Ahmedabad office or reach out by phone, email, or the consultation form. We reply to every enquiry within one business day.
              </p>

              <div className="cou-ic" style={{ borderLeft: '3px solid #1A5276' }}>
                <div className="cou-ic-ico" style={{ background: 'rgba(26,82,118,.12)' }}>📍</div>
                <div>
                  <div className="cou-ic-lbl">Office Address</div>
                  <div className="cou-ic-val">
                    B-901/902, Ratnaakar Nine Square,<br />
                    132 Feet Ring Rd, Opp. ITC Narmada,<br />
                    Satellite,<br />
                    Ahmedabad, Gujarat, 380015
                  </div>
                </div>
              </div>

              <div className="cou-ic" style={{ borderLeft: '3px solid #1E8449' }}>
                <div className="cou-ic-ico" style={{ background: 'rgba(30,132,73,.12)' }}>📞</div>
                <div>
                  <div className="cou-ic-lbl">Phone</div>
                  <a href="tel:+919825062515" className="cou-ic-val" style={{ color: '#1E8449' }}>+91 98250 62515</a>
                  <div className="cou-ic-note">Available Mon – Sat, 10:30 AM – 7:30 PM</div>
                </div>
              </div>

              <div className="cou-ic" style={{ borderLeft: '3px solid #6C3483' }}>
                <div className="cou-ic-ico" style={{ background: 'rgba(108,52,131,.12)' }}>✉️</div>
                <div>
                  <div className="cou-ic-lbl">Email</div>
                  <a href="mailto:info@vjdesai.com" className="cou-ic-val" style={{ color: '#6C3483' }}>info@vjdesai.com</a>
                  <div className="cou-ic-note">We reply within 1 business day</div>
                </div>
              </div>

              <div className="cou-ic" style={{ borderLeft: '3px solid #B7770D' }}>
                <div className="cou-ic-ico" style={{ background: 'rgba(183,119,13,.12)' }}>🌐</div>
                <div>
                  <div className="cou-ic-lbl">Website</div>
                  <a href="https://vjdesai.com" target="_blank" rel="noopener noreferrer" className="cou-ic-val" style={{ color: '#B7770D' }}>www.vjdesai.com</a>
                </div>
              </div>

              <div className="cou-hrs">
                <div className="cou-hrs-lbl">🕐&nbsp;&nbsp;Office Hours</div>
                <div className="cou-hrs-row"><span className="cou-hrs-day">Monday – Saturday</span><span className="cou-hrs-time">10:30 AM – 7:30 PM</span></div>
                <div className="cou-hrs-row"><span className="cou-hrs-day">Sunday</span><span className="cou-hrs-closed">Closed</span></div>
                <p className="cou-hrs-note">
                  For urgent compliance matters, GST notices, IT assessments, RERA deadlines, call us directly for same-day support.
                </p>
              </div>

              <div className="cou-fq">
                <blockquote>"We create a unique process for each client to ensure business objectives are met, with integrity, reliability, and proficiency."</blockquote>
                <cite>V J Desai &amp; Co. LLP · Chartered Accountants since 1993</cite>
              </div>

              <div className="cou-map">
                <div className="cou-map-lbl">📍&nbsp;&nbsp;Our Office Location, Ratnaakar Nine Square, Satellite</div>
                <iframe
                  src="https://www.google.com/maps?q=Ratnaakar+Nine+Square,+132+Feet+Ring+Road,+Vastrapur,+Ahmedabad,+Gujarat+380015&z=16&output=embed"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="V J Desai and Co LLP Office Location, Ratnaakar Nine Square, 132 Feet Ring Road, Ahmedabad"
                />
              </div>
            </div>

            {/* RIGHT — form box */}
            <div ref={formRef} className="cou-fb">
              <h3 className="cou-fb-title">Book a Free Consultation</h3>
              <p className="cou-fb-desc">
                Fill in the form and we will respond within one business day. Your first consultation is always free and without obligation.
              </p>
              <div className="cou-trust">
                <span className="cou-tp">✓ Free First Consultation</span>
                <span className="cou-tp">✓ No Obligation</span>
                <span className="cou-tp">✓ Confidential</span>
                <span className="cou-tp">✓ Reply Within 24 hrs</span>
              </div>

              <ContactForm />

              <p className="cou-priv">
                🔒&nbsp;&nbsp;All information shared is strictly confidential and governed by ICAI professional ethics. We do not share your data with third parties.
              </p>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
