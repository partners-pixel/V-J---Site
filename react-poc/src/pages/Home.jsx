import { useNavigate } from 'react-router-dom';

const TICKER = ['Statutory Audit', 'Tax Audit', 'GST Compliance', 'Income Tax', 'FEMA & RBI',
  'Internal Audit', 'Due Diligence', 'Business Setup', 'RERA', 'NRI Taxation', 'Transfer Pricing', 'CFO Services'];

const SERVICES = [
  ['🧾', 'GST & Indirect Tax', 'Registration, return filing, audit, litigation, classification, and e-bill consultancy services.', '/gst'],
  ['📊', 'Direct Taxation', 'Corporate tax, income tax, NRI taxation, and strategic tax advisory for all taxpayer categories.', '/corp-tax'],
  ['⚖️', 'Audit & Advisory', 'Statutory, tax, internal, management, and compliance audits with full corporate advisory services.', '/audit'],
  ['🏘️', 'RERA Compliance', 'Project registration, quarterly disclosures, extension regulations, and dispute response.', '/rera-reg'],
  ['📚', 'Knowledge Center', 'Tax circulars, regulatory updates, compliance calendars, and expert insights.', '/kc'],
  ['🤝', 'Book a Consultant', 'Schedule a no-obligation consultation with our expert CA team for your specific needs.', '/contact'],
];

const INDUSTRIES = [
  ['🏭', 'Manufacturing'], ['🛒', 'Trading & Retail'], ['🏦', 'Banking & Finance'], ['🏗️', 'Real Estate'],
  ['💻', 'IT & Technology'], ['🌱', 'NGOs & Trusts'], ['🏥', 'Healthcare'], ['🚢', 'Import & Export'],
];

const STATS = [['33+', 'Years of Experience'], ['2500+', 'Clients Served'], ['35+', 'Industry Sectors'], ['ICAI', 'Registered Firm']];

const GALLERY = [
  ['🤝', 'Client Meetings', 'Partner Consultations', 'linear-gradient(135deg,#1A5276 0%,#2471A3 100%)'],
  ['📊', 'Tax Advisory Sessions', 'Direct Tax Advisory', 'linear-gradient(135deg,#1E8449 0%,#27AE60 100%)'],
  ['⚖️', 'Audit & Assurance', 'Audit Work', 'linear-gradient(135deg,#6C3483 0%,#8E44AD 100%)'],
  ['🎓', 'Training & Mentorship', 'Article Training', 'linear-gradient(135deg,#B7770D 0%,#D4AC0D 100%)'],
  ['🏗️', 'RERA Compliance Work', 'RERA & Real Estate', 'linear-gradient(135deg,#0E6655 0%,#117A65 100%)'],
];

const TESTIMONIALS = [
  ['"V J Desai & Co. has been our CA firm for over 12 years. Their expertise in GST and corporate tax has saved us significant compliance costs. We trust them completely with our financials."', 'RK', 'var(--gold)', undefined, 'Rajesh Kapadia', 'MD, Kapadia Textiles Pvt. Ltd. · Ahmedabad'],
  ['"Their RERA compliance team handled our entire project registration, QPR submissions and all documentation seamlessly. As a developer, this peace of mind is invaluable."', 'SM', '#1E8449', '#fff', 'Suresh Mehta', 'Director, Mehta Developers LLP · Ahmedabad'],
  ['"As an NRI, navigating Indian tax laws was challenging. CA Vinod Desai\'s team handled all our FEMA filings, DTAA advisory and ITRs with complete professionalism and transparency."', 'PD', '#1A5276', '#fff', 'Priya Desai', 'NRI Client · USA'],
  ['"Their GST audit team found ₹8 lakh in eligible ITC we had missed. They are thorough, responsive, and genuinely invested in their clients\' financial well-being."', 'AP', '#6C3483', '#fff', 'Ankit Patel', 'Partner, Patel Trading Co. · Surat'],
  ['"We engaged VJ Desai for our company\'s statutory audit and income tax filing. Their attention to detail and quick turnaround is exceptional. Highly recommend to any growing business."', 'NS', '#B7770D', '#fff', 'Nisha Shah', 'CFO, Shah Pharma Pvt. Ltd. · Vadodara'],
  ['"From business incorporation to ongoing GST compliance and CFO advisory, VJ Desai has been a one-stop solution for our startup. Their proactive approach makes all the difference."', 'HV', '#0E6655', '#fff', 'Harsh Vora', 'Founder, VoraTech Solutions · Ahmedabad'],
];

export default function Home() {
  const navigate = useNavigate();
  return (
    <div id="page-home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-in">
          <div>
            <h1 className="hh">Your Trusted Partner in<br /><span className="gline">Tax &amp; Financial<br />Advisory</span></h1>
            <p className="hdesc">Navigate complex tax regulations with confidence. We provide comprehensive GST, direct tax, audit, and advisory services tailored to your business needs.</p>
            <div className="hbtns">
              <button className="bgs" onClick={() => navigate('/contact')}>Book a Consultation →</button>
              <button className="bdo" onClick={() => navigate('/why-choose-us')}>Learn More</button>
            </div>
          </div>
          <div className="hcards">
            <div className="hcard" onClick={() => navigate('/gst')}><div className="hcico">🧾</div><div><div className="hctit">GST / Indirect Tax</div><div className="hcdesc">Expert guidance on GST compliance, refunds, and indirect tax matters.</div></div></div>
            <div className="hcard" onClick={() => navigate('/corp-tax')}><div className="hcico">📈</div><div><div className="hctit">Direct Tax</div><div className="hcdesc">Comprehensive income tax planning and compliance services.</div></div></div>
            <div className="hcard" onClick={() => navigate('/audit')}><div className="hcico">🛡️</div><div><div className="hctit">Audit &amp; Advisory</div><div className="hcdesc">Professional audit services and strategic business advisory.</div></div></div>
            <div className="hcard" onClick={() => navigate('/rera-reg')}><div className="hcico">🏘️</div><div><div className="hctit">RERA Compliance</div><div className="hcdesc">Complete RERA registration, disclosures, and dispute support.</div></div></div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="ticker"><div className="tki">
        {[...TICKER, ...TICKER].map((t, i) => <span className="ti" key={i}>{t}</span>)}
      </div></div>

      {/* Services */}
      <section className="s svcs"><div className="si">
        <div className="svch">
          <div><div className="stag">Our Practice Areas</div><h2 className="ht">Comprehensive <em>Financial Services</em></h2></div>
          <p className="ssub">End-to-end financial solutions delivered by dedicated chartered accountants, from statutory compliance to strategic advisory.</p>
        </div>
        <div className="svcg">
          {SERVICES.map(([ico, h, p, to]) => (
            <div className="sc" key={h} onClick={() => navigate(to)}>
              <div className="scico">{ico}</div><h3>{h}</h3><p>{p}</p><span className="sclnk">Explore →</span>
            </div>
          ))}
        </div>
      </div></section>

      {/* About strip */}
      <div className="abts"><div className="abtg">
        <div style={{ position: 'relative' }}>
          <div className="abtq"><p>"We create a unique process for each client to ensure that business objectives are met with integrity, reliability, and proficiency at the heart of every engagement."</p><cite>V J Desai &amp; Co. LLP, Firm Philosophy</cite></div>
        </div>
        <div>
          <div className="stag" style={{ color: 'var(--gold)' }}>Who We Are</div>
          <h2 className="ht dk">A Coalition of <em>Specialized Skills</em></h2>
          <p style={{ fontSize: '.9rem', lineHeight: 1.85, color: 'var(--tdim)', marginTop: '.75rem' }}>V J Desai &amp; Co. LLP amalgamates decades of senior expertise with the energy of young professionals, delivering personal attention alongside deep technical proficiency.</p>
          <ul className="vlist">
            <li className="vi"><span className="vd"></span><span>Integrity in every engagement, without compromise</span></li>
            <li className="vi"><span className="vd"></span><span>Reliability built through decades of consistent delivery</span></li>
            <li className="vi"><span className="vd"></span><span>Proficiency across audit, tax, law, and advisory</span></li>
            <li className="vi"><span className="vd"></span><span>Client-first approach. Your objectives drive our process.</span></li>
          </ul>
          <div style={{ marginTop: '1.6rem' }}><button className="bgs" onClick={() => navigate('/why-choose-us')}>Know Our Firm</button></div>
        </div>
      </div></div>

      {/* Industries */}
      <section className="s inds"><div className="si">
        <div className="stag">Sectors We Serve</div><h2 className="ht">Across <em>Industries &amp; Sectors</em></h2>
        <div className="indg">
          {INDUSTRIES.map(([ico, name]) => (
            <div className="ic" key={name}><div className="iico">{ico}</div><h4>{name}</h4></div>
          ))}
        </div>
      </div></section>

      {/* Stats */}
      <div className="stats"><div className="stsi">
        {STATS.map(([n, l]) => <div key={l}><div className="sn">{n}</div><div className="sl">{l}</div></div>)}
      </div></div>

      {/* Gallery */}
      <div className="gallery-sec">
        <div className="gallery-inner">
          <div style={{ textAlign: 'center', marginBottom: '.5rem' }}>
            <div className="stag" style={{ justifyContent: 'center' }}>Our Office &amp; Team</div>
            <h2 className="ht">A Glimpse Into <em>Our World</em></h2>
            <p style={{ fontSize: '.9rem', color: 'var(--tmute)', maxWidth: 520, margin: '.4rem auto 0', lineHeight: 1.7 }}>Our Ahmedabad office at Ratnaakar Nine Square, Satellite, where expertise meets professionalism.</p>
          </div>
          <div className="gallery-grid">
            <div className="gal-item" style={{ minHeight: 280 }}>
              <div className="gal-inner-img" style={{ minHeight: 280, background: 'linear-gradient(135deg,#1C2437 0%,#2E3A52 100%)' }}>
                <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '.8rem' }}>🏛️</div>
                  <div style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.1rem', fontWeight: 600, color: 'var(--gold)' }}>Our Office</div>
                  <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.5)', marginTop: '.3rem' }}>B-901/902, Ratnaakar Nine Square, 132 Feet Ring Rd,<br />Opp. ITC Narmada,<br />Satellite, Ahmedabad, Gujarat 380015</div>
                </div>
              </div>
              <div className="gal-overlay"><span>📍 Office Premises</span></div>
            </div>
            {GALLERY.map(([ico, title, overlay, bg]) => (
              <div className="gal-item" key={title}>
                <div className="gal-inner-img" style={{ background: bg }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '.4rem' }}>{ico}</div>
                    <div style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.7)', fontWeight: 600 }}>{title}</div>
                  </div>
                </div>
                <div className="gal-overlay"><span>{overlay}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="testi-sec">
        <div className="testi-inner">
          <div style={{ textAlign: 'center' }}>
            <div className="stag" style={{ justifyContent: 'center', color: 'var(--gold)' }}>Client Testimonials</div>
            <h2 className="ht" style={{ color: 'var(--white)' }}>What Our <em>Clients Say</em></h2>
            <p style={{ fontSize: '.9rem', color: 'rgba(255,255,255,.5)', maxWidth: 560, margin: '.5rem auto 0', lineHeight: 1.75 }}>Trusted by 2500+ businesses and individuals across Gujarat and beyond since 1993.</p>
          </div>
          <div className="testi-grid">
            {TESTIMONIALS.map(([text, ini, bg, color, name, role]) => (
              <div className="tcard" key={name}>
                <div className="tcard-stars">★★★★★</div>
                <p className="tcard-text">{text}</p>
                <div className="tcard-author">
                  <div className="tcard-avatar" style={{ background: bg, color }}>{ini}</div>
                  <div><div className="tcard-name">{name}</div><div className="tcard-role">{role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
