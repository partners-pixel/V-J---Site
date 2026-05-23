import { Link, useNavigate } from 'react-router-dom';

const AUDIT_SVCS = [
  ['⚖️', 'Statutory Audit', 'Legally mandated audit under Companies Act, 2013. Risk-based planning, internal control review, CARO 2020 reporting, and management letter with actionable recommendations.'],
  ['📋', 'Tax Audit', 'Section 44AB tax audit certification. Form 3CA/3CB/3CD preparation, turnover verification, disallowance review, and capital gains verification.'],
  ['🔍', 'Internal Audit', 'Risk-based review of internal controls and operational processes, PSU and government audits, compliance verification, and detailed management reporting with prioritised findings.'],
  ['✅', 'Compliance Audit', 'Multi-law compliance review across Companies Act, GST, Income Tax, Labour Laws, and FEMA. Secretarial audit, compliance calendar setup, and gap identification before regulators.'],
];

const CORP_SVCS = [
  ['🏢', 'Business Setup Services', 'End-to-end incorporation for Pvt Ltd companies, LLPs, and foreign entity offices (liaison/branch/project). DPIIT startup recognition and compliance framework setup.', '/biz-setup'],
  ['📈', 'Business Valuation & Restructuring', 'Independent business valuations, transaction advisory, corporate restructuring, joint ventures, cross-border structuring, and change management consulting.', '/biz-val'],
  ['⚖️', 'Company Law', 'MCA/ROC filings, board and shareholder meeting secretarial support, entity conversion, restructuring advisory, and representation before RoC and NCLT.', '/company-law'],
  ['🚢', 'Exim Policy', 'Export-import policy advisory, DGFT licensing, advance authorisation, EPCG scheme, and compliance support for international trade operations.', '/exim'],
  ['🌐', 'FEMA & RBI Compliance', 'FDI approvals, ECB applications, remittance documentation, cross-border compliance advisory, and RBI reporting for businesses and NRIs.', '/fema'],
  ['💼', 'Management Consultancy & CFO Services', 'Virtual CFO services, financial planning and analysis, MIS reporting, board advisory, and strategic management consulting for growing businesses.', '/mgmt-cfo'],
];

const STEPS = [
  ['01', 'Planning & Risk Assessment', 'Understanding your business, industry risks, and control environment to design a targeted, risk-based audit strategy.'],
  ['02', 'Internal Control Evaluation', 'Testing the design and operating effectiveness of financial and operational controls to determine extent of substantive procedures.'],
  ['03', 'Substantive Testing', 'Detailed vouching, verification, analytical procedures, and third-party confirmations for all material account balances.'],
  ['04', 'CARO & Annexures', 'Preparation of CARO 2020 report covering all 21 prescribed matters and related annexures for applicable companies.'],
  ['05', 'Completion & Reporting', "Auditor's Report issuance with opinion, unqualified, qualified, adverse, or disclaimer as the evidence supports."],
  ['06', 'Post-Audit Advisory', 'Management letter with observations, root cause analysis, and prioritised recommendations to strengthen controls.'],
];

const ENGAGEMENT = [
  ['Annual Audit Engagement', 'Defined-scope statutory, tax, or compliance audit, complete with planning, fieldwork, reporting, and management letter. Suitable for all company sizes.'],
  ['Ongoing Advisory Retainer', 'Continuous internal audit cycles, management consulting, CFO services, or regulatory advisory, with regular reporting and direct access to our senior team.'],
  ['Project-Based Engagement', 'Specific assignments such as due diligence, business valuation, FEMA compounding, company law filings, or one-time restructuring advisory with defined deliverables.'],
];

export default function Audit() {
  const navigate = useNavigate();
  return (
    <div id="page-audit">
      <div className="ph"><div className="phi">
        <div className="ph-grid">
          <div className="ph-left">
            <div className="bc"><Link to="/">Home</Link><span>/</span><span>Audit &amp; Advisory</span></div>
            <div className="pgbadge">⚖️ Audit &amp; Advisory Services</div>
            <h1>Audit &amp; <em>Advisory Services</em></h1>
            <p>Independent, objective, and thorough audit engagements, statutory audit, tax audit, internal audit, and compliance audit, combined with expert corporate advisory across business setup, valuation, FEMA, and CFO services.</p>
            <div className="ph-tags">
              {['Statutory Audit', 'Tax Audit', 'Internal Audit', 'Business Setup', 'FEMA', 'CFO Services'].map((t) => (
                <span className="ph-tag" key={t}>{t}</span>
              ))}
            </div>
            <div className="ph-ctas">
              <button className="ph-cta" onClick={() => navigate('/contact')}>Discuss Your Audit →</button>
              <button className="ph-cta-outline" onClick={() => navigate('/stat-audit')}>Statutory Audit</button>
            </div>
          </div>
          <div className="ph-right">
            <div className="ph-stat-grid">
              {[['4+', 'Audit Types'], ['33+', 'Years Experience'], ['35+', 'Industry Sectors'], ['ICAI', 'Registered Firm']].map(([n, l]) => (
                <div className="ph-stat" key={l}><div className="ph-stat-n">{n}</div><div className="ph-stat-l">{l}</div></div>
              ))}
            </div>
            <div className="ph-hl">
              <p>"An audit is not just a regulatory requirement, it is a powerful business tool that reveals risks, strengthens controls, and builds stakeholder trust."</p>
              <cite>Audit &amp; Assurance · V J Desai &amp; Co. LLP</cite>
            </div>
          </div>
        </div>
      </div></div>

      <div className="subnav"><div className="subnav-inner">
        <a className="sn active" href="#audit-services">Our Services</a>
        <a className="sn" href="#audit-how">How It Works</a>
        <a className="sn" href="#audit-engagement">Engagement</a>
        <a className="sn" href="#audit-contact">Contact</a>
      </div></div>

      <section id="audit-services" className="svc-sec scroll-sec">
        <div className="svc-sec-inner">
          <div className="stag">Audit Services</div>
          <h2 className="ht">Audit &amp; <em>Assurance</em></h2>
          <p className="ssub">Independent, risk-based audit engagements delivering assurance, compliance, and actionable insights across all major audit disciplines.</p>
          <div className="svc-cards-grid">
            {AUDIT_SVCS.map(([ico, h, p]) => (
              <div className="svc-mini-card" key={h}><div className="smc-icon">{ico}</div><h3>{h}</h3><p>{p}</p></div>
            ))}
          </div>

          <div className="stag" style={{ marginTop: '2.2rem' }}>Corporate Services</div>
          <h2 className="ht">Corporate <em>Advisory Services</em></h2>
          <p className="ssub" style={{ marginBottom: 0 }}>Strategic advisory across entity formation, restructuring, FEMA, EXIM, and CFO services, guiding businesses at every stage of growth.</p>
          <div className="svc-cards-grid">
            {CORP_SVCS.map(([ico, h, p, to]) => (
              <div className="svc-mini-card" key={h}>
                <div className="smc-icon">{ico}</div>
                <h3 style={{ cursor: 'pointer' }} onClick={() => navigate(to)}>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="audit-how" className="hiw-sec scroll-sec">
        <div className="hiw-inner">
          <div className="stag">How It Works</div>
          <h2 className="ht">Our Audit <em>Methodology</em></h2>
          <p className="ssub">A structured six-step audit approach, from risk assessment and planning through to reporting and post-engagement advisory.</p>
          <div className="steps-grid">
            {STEPS.map(([num, h, p]) => (
              <div className="step-card" key={num}><div className="step-num">{num}</div><h4>{h}</h4><p>{p}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section id="audit-engagement" className="eng-sec scroll-sec">
        <div className="eng-inner">
          <div className="stag">Engagement</div>
          <h2 className="ht">Flexible <em>Engagement Models</em></h2>
          <p className="ssub">We tailor our audit and advisory engagement to your organisation's size, complexity, and compliance requirements.</p>
          <div className="eng-grid">
            {ENGAGEMENT.map(([h, p]) => (
              <div className="eng-card" key={h}><h3>{h}</h3><p>{p}</p></div>
            ))}
          </div>
        </div>
      </section>

      <div id="audit-contact" className="ctab scroll-sec"><div className="ctabi">
        <div><h2>Need an audit or advisory <em>engagement?</em></h2><p>Our team will design a bespoke approach for your organisation.</p></div>
        <button className="bgs" onClick={() => navigate('/contact')}>Request Proposal →</button>
      </div></div>
    </div>
  );
}
