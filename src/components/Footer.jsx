import { Link } from 'react-router-dom';
import logoUrl from '../../assets/img/logo.jpg';
import { footerColumns } from '../data/footerLinks.js';

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.845L.057 23.886l6.188-1.448A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.796 9.796 0 01-5.003-1.37l-.358-.213-3.716.869.937-3.63-.234-.373A9.769 9.769 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z" />
    </svg>
  );
}

function FooterColumn({ column }) {
  return (
    <div className="sft-col">
      <h4>{column.title}</h4>
      {column.sections ? (
        column.sections.map((section) => (
          <div key={section.label}>
            <div className="sft-sublabel">{section.label}</div>
            <ul>
              {section.links.map(([label, to]) => (
                <li key={to}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <ul>
          {column.links.map(([label, to]) => (
            <li key={to}><Link to={to}>{label}</Link></li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Footer() {
  return (
    <>
      <a
        className="wa-float"
        href="https://wa.me/919825062515?text=Hello%20V%20J%20Desai%20%26%20Co.%20LLP%2C%20I%20would%20like%20to%20book%20a%20consultation."
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp with V J Desai & Co. LLP"
      >
        <WhatsAppIcon />
        <span>Chat on WhatsApp</span>
      </a>

      <footer id="site-footer">
        <div className="sft-accent"></div>
        <div className="sft-body">
          <div className="sft-top">
            <div className="sft-card">
              <Link className="sft-logo" to="/" aria-label="V J Desai & Co. LLP, Home">
                <img
                  src={logoUrl}
                  alt="V J Desai & Co. LLP, Chartered Accountants"
                  style={{ height: '38px', width: 'auto', display: 'block', objectFit: 'contain' }}
                />
              </Link>

              <div className="sft-contacts">
                <a href="tel:09825062515" className="sft-cl" aria-label="Call us">
                  <span className="sft-ci" aria-hidden="true">Ph</span>
                  098250 62515
                </a>
                <a href="mailto:info@vjdesai.com" className="sft-cl" aria-label="Email us">
                  <span className="sft-ci" aria-hidden="true">@</span>
                  info@vjdesai.com
                </a>
                <div className="sft-cl">
                  <span className="sft-ci" aria-hidden="true" style={{ marginTop: 2 }}>Pin</span>
                  <span>
                    B-901/902, Ratnaakar Nine Square,<br />
                    132 Feet Ring Rd, Opp. ITC Narmada,<br />
                    Satellite,<br />
                    Ahmedabad, Gujarat 380015
                  </span>
                </div>
              </div>

              <div className="sft-hrs">
                <div className="sft-hrs-h">Office Hours</div>
                <div className="sft-hr-row"><b>Mon - Sat</b><span>10:30 AM - 7:30 PM</span></div>
                <div className="sft-hr-row"><b>Sunday</b><span className="sft-closed">Closed</span></div>
              </div>
            </div>

            {footerColumns.map((column) => (
              <FooterColumn column={column} key={column.title} />
            ))}
          </div>
        </div>

        <div className="sft-bar">
          <div className="sft-bar-in">
            <div className="sft-copy">&copy; {new Date().getFullYear()} V J Desai & Co. LLP. All Rights Reserved.</div>
            <div className="sft-blinks">
              <Link to="/terms">Terms & Conditions</Link>
              <span className="sft-dot" aria-hidden="true"></span>
              <Link to="/privacy">Privacy Policy</Link>
              <span className="sft-dot" aria-hidden="true"></span>
              <Link to="/sitemap">Sitemap</Link>
              <span className="sft-dot" aria-hidden="true"></span>
              <Link to="/disclaimer">Disclaimer</Link>
            </div>
            <div className="sft-credit">Designed & Developed by <span>vjdesai.com</span></div>
          </div>
        </div>
      </footer>
    </>
  );
}
