import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/* Top-level menu, ported 1:1 from components/nav.html.
   `to` is the route path; children render the dropdown (.dd). */
const MENU = [
  { key: 'index', label: 'Home', to: '/' },
  {
    key: 'about', label: 'About Us', to: '/why-choose-us',
    groups: [[
      { label: 'Why Choose Us', to: '/why-choose-us' },
      { label: 'Team', to: '/team' },
    ]],
  },
  {
    key: 'gst', label: 'GST / Indirect Tax', to: '/gst',
    groups: [[
      { label: 'GST', to: '/gst' },
      { label: 'GST Classification', to: '/gst-class' },
      { label: 'GST Audit', to: '/gst-audit' },
      { label: 'GST Due Diligence', to: '/gst-dd' },
      { label: 'GST Litigation', to: '/gst-lit' },
      { label: 'GST Opinion', to: '/gst-opinion' },
      { label: 'GST – Refund', to: '/gst-refund' },
      { label: 'GST – Search Inquiry Support', to: '/gst-search' },
      { label: 'GST E-Bill – Consultancy', to: '/gst-ebill' },
    ]],
  },
  {
    key: 'dtax', label: 'Direct Tax', to: '/corp-tax',
    groups: [[
      { label: 'Corporate Tax', to: '/corp-tax' },
      { label: 'Income Tax – Advisory', to: '/income-tax-adv' },
      { label: 'Income Tax', to: '/income-tax' },
      { label: 'NRI – Taxation', to: '/nri-tax' },
    ]],
  },
  {
    key: 'audit', label: 'Audit & Advisory', to: '/audit',
    groups: [
      { title: 'Audit', items: [
        { label: 'Statutory Audit', to: '/stat-audit' },
        { label: 'Tax Audit', to: '/tax-audit' },
        { label: 'Internal Audit', to: '/int-audit' },
        { label: 'Compliance Audit', to: '/comp-audit' },
      ] },
      { title: 'Corporate Services', items: [
        { label: 'Business Setup Services', to: '/biz-setup' },
        { label: 'Business Valuation & Restructuring', to: '/biz-val' },
        { label: 'Company Law', to: '/company-law' },
        { label: 'Exim Policy', to: '/exim' },
        { label: 'FEMA', to: '/fema' },
        { label: 'Management Consultancy & CFO Services', to: '/mgmt-cfo' },
      ] },
    ],
  },
  {
    key: 'rera', label: 'RERA', to: '/rera-reg',
    groups: [[
      { label: 'Project Registration Compliance', to: '/rera-reg' },
      { label: 'Quarterly Updates Disclosure', to: '/rera-qud' },
      { label: 'Project Extension Regulations', to: '/rera-ext' },
      { label: 'RERA Dispute Response Support', to: '/rera-disp' },
    ]],
  },
  {
    key: 'kc', label: 'Knowledge Center', to: '/kc',
    groups: [[
      { label: 'GST', to: '/kc-gst' },
      { label: 'RERA', to: '/kc-rera' },
      { label: 'Direct Tax', to: '/kc-dtax' },
      { label: 'International Tax', to: '/kc-intl' },
      { label: 'FEMA & EXIM', to: '/kc-fema' },
      { label: 'Audit', to: '/kc-audit' },
      { label: 'Glossary', to: '/kc-glossary' },
      { label: 'Checklists', to: '/kc-checklist' },
    ]],
  },
  { key: 'career', label: 'Career', to: '/career' },
  { key: 'contact', label: 'Contact Us', to: '/contact' },
];

const Arrow = () => (
  <svg className="ar" viewBox="0 0 10 6" fill="currentColor"><path d="M0 0l5 6 5-6z" /></svg>
);

// Is this top-level item the active one for the current path?
function isActive(item, slug) {
  if (item.key === 'index') return slug === '' || slug === 'index';
  if (item.to === `/${slug}`) return true;
  if (!item.groups) return false;
  return item.groups.some((g) =>
    (g.items || g).some((c) => c.to === `/${slug}`)
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '');
  const close = () => setOpen(false);

  return (
    <nav>
      <div className="navi">
        <Link className="logo" to="/" aria-label="V J Desai & Co. LLP, Home" style={{ lineHeight: 0 }} onClick={close}>
          <img src="/assets/img/logo.jpg" alt="V J Desai & Co. LLP, Chartered Accountants"
               style={{ height: '100px', width: 'auto', display: 'block', objectFit: 'contain' }} />
        </Link>

        <ul className={`navl${open ? ' open' : ''}`} id="navl">
          {MENU.map((item) => (
            <li className="ni" data-page={item.key} key={item.key}>
              <Link className={`nl${isActive(item, slug) ? ' active' : ''}`} to={item.to} onClick={close}>
                {item.label}{item.groups && <Arrow />}
              </Link>
              {item.groups && (
                <div className="dd">
                  {item.groups.map((g, gi) => (
                    <div className="dds" key={gi}>
                      {g.title && <div className="ddl">{g.title}</div>}
                      {(g.items || g).map((c) => (
                        <Link className="dda" to={c.to} key={c.to} onClick={close}>{c.label}</Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '.85rem' }}>
          <Link className="ncta" to="/contact" onClick={close}>Book a Consultant</Link>
          <button className="ntog" id="ntog" type="button" aria-label="Open menu"
                  aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
