/* Pages — a WordPress-style listing of every page on the site, grouped like
   the nav. "Type" notes how each page is built (React component, data-driven
   template, or the legacy-markup renderer). View opens the live page. */

const GROUPS = [
  { group: 'Main', pages: [
    ['Home', '/', 'React'],
    ['About Us', '/why-choose-us', 'Legacy'],
    ['Team', '/team', 'Legacy'],
    ['Why Choose Us', '/why-choose-us', 'Legacy'],
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

export default function Pages() {
  return (
    <div>
      <h2 style={{ fontFamily: "'EB Garamond',serif", fontSize: '1.5rem', color: 'var(--tdark)', marginBottom: '.3rem' }}>Pages ({PAGE_COUNT})</h2>
      <p style={{ color: 'var(--tmute)', fontSize: '.9rem', marginBottom: '1.4rem' }}>All pages on the website. “View” opens the live page in a new tab.</p>

      {GROUPS.map((g) => (
        <div key={g.group} style={{ marginBottom: '1.6rem' }}>
          <div style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold-dim)', marginBottom: '.5rem' }}>{g.group}</div>
          <div style={{ background: 'var(--white)', border: '1px solid rgba(0,0,0,.08)', borderRadius: 10, overflow: 'hidden' }}>
            {g.pages.map(([title, path, type], i) => (
              <div key={path + i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '.7rem 1.1rem', borderTop: i ? '1px solid var(--light)' : 'none' }}>
                <div style={{ flex: 1, minWidth: 0, fontSize: '.88rem', fontWeight: 600, color: 'var(--tdark)' }}>{title}</div>
                <code style={{ fontSize: '.76rem', color: 'var(--tmute)', flexShrink: 0 }}>{path}</code>
                <span style={{ fontSize: '.64rem', fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: TYPE_COLOR[type], border: `1px solid ${TYPE_COLOR[type]}40`, borderRadius: 4, padding: '.12rem .5rem', flexShrink: 0 }}>{type}</span>
                <a href={path} target="_blank" rel="noopener" style={{ fontSize: '.78rem', fontWeight: 600, color: 'var(--gold-dim)', flexShrink: 0 }}>View ↗</a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
