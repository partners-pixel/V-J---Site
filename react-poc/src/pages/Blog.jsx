import PageHero from '../templates/PageHero.jsx';
import useDocTitle from '../lib/useDocTitle.js';

const POSTS = [
  { tag: 'GST', date: '2025', h3: 'GST Council Updates, Rate Changes & Compliance Decisions', p: 'Summary of rate changes, exemptions, and compliance relaxations from recent GST Council meetings.' },
  { tag: 'Direct Tax', date: '2025', h3: 'Budget 2025-26, Tax Highlights for Individuals & Corporates', p: 'Key changes in income tax slabs, deductions, and compliance requirements for FY 2025-26.' },
  { tag: 'RERA', date: '2025', h3: 'Gujarat RERA, Latest Circulars & Developer Compliance Updates', p: 'Latest circulars and compliance requirements for real estate developers under Gujarat RERA.' },
  { tag: 'TDS', date: '2025', h3: 'TDS Rate Chart FY 2025-26, Complete Section-wise Reference', p: 'Complete TDS rate chart for FY 2025-26 covering all sections with applicability guidance.' },
  { tag: 'FEMA', date: '2025', h3: 'RBI Circular, Updated FC-GPR & FC-TRS Filing Guidelines', p: 'Updated guidelines on FC-GPR and FC-TRS filings for foreign direct investment transactions in India.' },
  { tag: 'Audit', date: '2025', h3: 'ICAI Updates, Revised Standards on Auditing & CARO 2020', p: 'Key updates on revised auditing standards and CARO 2020 reporting requirements for statutory auditors.' },
];

export default function Blog() {
  useDocTitle('Blog');
  return (
    <div id="page-kc-blog">
      <PageHero
        current="Blog"
        badge="📝 Blog"
        title={{ pre: 'Insights & ', em: 'Updates' }}
        lead="Articles and regulatory updates across GST, direct tax, RERA, FEMA, and audit, explained in clear, practical terms by our Chartered Accountant team."
        tags={['GST', 'Direct Tax', 'RERA', 'FEMA', 'Audit']}
        ctas={[{ label: 'Talk to an Expert →', to: 'contact' }, { label: 'Compliance Checklist', to: 'kc-checklist', outline: true }]}
        stats={[{ n: 'CA', l: 'Expert Authored' }, { n: 'Free', l: 'Access' }, { n: 'Weekly', l: 'Updates' }, { n: '5+', l: 'Topics' }]}
        highlight={{ quote: '"We share what we learn from the field, so you can stay ahead of compliance changes, not chase them."', cite: 'Editorial · V J Desai & Co. LLP' }}
      />

      <section className="s scroll-sec" style={{ background: 'var(--white)' }}><div className="si">
        <div className="stag">Latest</div>
        <h2 className="ht" style={{ marginBottom: '1.4rem' }}>Recent <em>Articles</em></h2>
        <div className="kcg">
          {POSTS.map((c, i) => (
            <div className="kcc" key={i}>
              <div className="kctr"><span className="kctag">{c.tag}</span><span className="kcdt">{c.date}</span></div>
              <div className="kcb"><h3>{c.h3}</h3><p>{c.p}</p></div>
            </div>
          ))}
        </div>
      </div></section>
    </div>
  );
}
