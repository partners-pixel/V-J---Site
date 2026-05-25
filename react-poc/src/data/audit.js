// Content for the Audit & Advisory page, rendered by <ServiceTemplate/>.
const auditData = {
  hero: {
    current: 'Audit & Advisory',
    badge: '⚖️ Audit & Advisory Services',
    title: { pre: 'Audit & ', em: 'Advisory Services' },
    lead: 'Independent, objective, and thorough audit engagements, statutory audit, tax audit, internal audit, and compliance audit, combined with expert corporate advisory across business setup, valuation, FEMA, and CFO services.',
    tags: ['Statutory Audit', 'Tax Audit', 'Internal Audit', 'Business Setup', 'FEMA', 'CFO Services'],
    ctas: [{ label: 'Discuss Your Audit →', to: 'contact' }, { label: 'Statutory Audit', to: 'stat-audit', outline: true }],
    stats: [{ n: '4+', l: 'Audit Types' }, { n: '33+', l: 'Years Experience' }, { n: '35+', l: 'Industry Sectors' }, { n: 'ICAI', l: 'Registered Firm' }],
    highlight: { quote: '"An audit is not just a regulatory requirement, it is a powerful business tool that reveals risks, strengthens controls, and builds stakeholder trust."', cite: 'Audit & Assurance · V J Desai & Co. LLP' },
  },
  ids: { services: 'audit-services', how: 'audit-how', engagement: 'audit-engagement', contact: 'audit-contact' },
  subnav: [
    { label: 'Our Services', href: '#audit-services' },
    { label: 'How It Works', href: '#audit-how' },
    { label: 'Engagement', href: '#audit-engagement' },
    { label: 'Contact', href: '#audit-contact' },
  ],
  serviceGroups: [
    {
      tag: 'Audit Services', title: { pre: 'Audit & ', em: 'Assurance' },
      sub: 'Independent, risk-based audit engagements delivering assurance, compliance, and actionable insights across all major audit disciplines.',
      cards: [
        { icon: '⚖️', h3: 'Statutory Audit', p: 'Legally mandated audit under Companies Act, 2013. Risk-based planning, internal control review, CARO 2020 reporting, and management letter with actionable recommendations.' },
        { icon: '📋', h3: 'Tax Audit', p: 'Section 44AB tax audit certification. Form 3CA/3CB/3CD preparation, turnover verification, disallowance review, and capital gains verification.' },
        { icon: '🔍', h3: 'Internal Audit', p: 'Risk-based review of internal controls and operational processes, PSU and government audits, compliance verification, and detailed management reporting with prioritised findings.' },
        { icon: '✅', h3: 'Compliance Audit', p: 'Multi-law compliance review across Companies Act, GST, Income Tax, Labour Laws, and FEMA. Secretarial audit, compliance calendar setup, and gap identification before regulators.' },
      ],
    },
    {
      tag: 'Corporate Services', title: { pre: 'Corporate ', em: 'Advisory Services' }, subTight: true,
      sub: 'Strategic advisory across entity formation, restructuring, FEMA, EXIM, and CFO services, guiding businesses at every stage of growth.',
      cards: [
        { icon: '🏢', h3: 'Business Setup Services', to: 'biz-setup', p: 'End-to-end incorporation for Pvt Ltd companies, LLPs, and foreign entity offices (liaison/branch/project). DPIIT startup recognition and compliance framework setup.' },
        { icon: '📈', h3: 'Business Valuation & Restructuring', to: 'biz-val', p: 'Independent business valuations, transaction advisory, corporate restructuring, joint ventures, cross-border structuring, and change management consulting.' },
        { icon: '⚖️', h3: 'Company Law', to: 'company-law', p: 'MCA/ROC filings, board and shareholder meeting secretarial support, entity conversion, restructuring advisory, and representation before RoC and NCLT.' },
        { icon: '🚢', h3: 'Exim Policy', to: 'exim', p: 'Export-import policy advisory, DGFT licensing, advance authorisation, EPCG scheme, and compliance support for international trade operations.' },
        { icon: '🌐', h3: 'FEMA & RBI Compliance', to: 'fema', p: 'FDI approvals, ECB applications, remittance documentation, cross-border compliance advisory, and RBI reporting for businesses and NRIs.' },
        { icon: '💼', h3: 'Management Consultancy & CFO Services', to: 'mgmt-cfo', p: 'Virtual CFO services, financial planning and analysis, MIS reporting, board advisory, and strategic management consulting for growing businesses.' },
      ],
    },
  ],
  how: {
    tag: 'How It Works', title: { pre: 'Our Audit ', em: 'Methodology' },
    sub: 'A structured six-step audit approach, from risk assessment and planning through to reporting and post-engagement advisory.',
    steps: [
      { num: '01', h4: 'Planning & Risk Assessment', p: 'Understanding your business, industry risks, and control environment to design a targeted, risk-based audit strategy.' },
      { num: '02', h4: 'Internal Control Evaluation', p: 'Testing the design and operating effectiveness of financial and operational controls to determine extent of substantive procedures.' },
      { num: '03', h4: 'Substantive Testing', p: 'Detailed vouching, verification, analytical procedures, and third-party confirmations for all material account balances.' },
      { num: '04', h4: 'CARO & Annexures', p: 'Preparation of CARO 2020 report covering all 21 prescribed matters and related annexures for applicable companies.' },
      { num: '05', h4: 'Completion & Reporting', p: "Auditor's Report issuance with opinion, unqualified, qualified, adverse, or disclaimer as the evidence supports." },
      { num: '06', h4: 'Post-Audit Advisory', p: 'Management letter with observations, root cause analysis, and prioritised recommendations to strengthen controls.' },
    ],
  },
  engagement: {
    tag: 'Engagement', title: { pre: 'Flexible ', em: 'Engagement Models' },
    sub: "We tailor our audit and advisory engagement to your organisation's size, complexity, and compliance requirements.",
    cards: [
      { h3: 'Annual Audit Engagement', p: 'Defined-scope statutory, tax, or compliance audit, complete with planning, fieldwork, reporting, and management letter. Suitable for all company sizes.' },
      { h3: 'Ongoing Advisory Retainer', p: 'Continuous internal audit cycles, management consulting, CFO services, or regulatory advisory, with regular reporting and direct access to our senior team.' },
      { h3: 'Project-Based Engagement', p: 'Specific assignments such as due diligence, business valuation, FEMA compounding, company law filings, or one-time restructuring advisory with defined deliverables.' },
    ],
  },
  cta: { title: { pre: 'Need an audit or advisory ', em: 'engagement?' }, p: 'Our team will design a bespoke approach for your organisation.', btn: { label: 'Request Proposal →', to: 'contact' } },
};
export default auditData;
