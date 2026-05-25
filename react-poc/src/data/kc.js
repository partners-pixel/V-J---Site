// Content for the Knowledge Center overview, rendered by <KcTemplate/>.
const kcData = {
  hero: {
    current: 'Knowledge Center',
    badge: '📚 Knowledge Center',
    title: { pre: 'Knowledge ', em: 'Center' },
    lead: 'Stay current with the latest GST notifications, income tax updates, RERA circulars, FEMA guidelines, and audit regulations, curated and explained by our expert CA team in plain, actionable language.',
    tags: ['GST Updates', 'Direct Tax', 'RERA', 'FEMA', 'Audit', 'Compliance'],
    ctas: [{ label: 'GST Resources →', to: 'kc-gst' }, { label: 'Compliance Checklist', to: 'kc-checklist', outline: true }],
    stats: [{ n: '7+', l: 'Resource Categories' }, { n: 'CA', l: 'Expert Authored' }, { n: 'Free', l: 'Access' }, { n: 'Live', l: 'Regulatory Updates' }],
    highlight: { quote: '"Knowledge is the first line of compliance. We share what we know so our clients, and the broader community, can make informed decisions."', cite: 'Knowledge Center · V J Desai & Co. LLP' },
  },
  subnav: [
    { label: 'Topics', href: '#kc-topics' },
    { label: 'Latest Updates', href: '#kc-updates' },
    { label: 'Compliance Tools', href: '#kc-tools' },
  ],
  topics: {
    tag: 'Browse by Topic', title: { pre: 'Insights & ', em: 'Guides' },
    cards: [
      { icon: '🧾', h3: '7.1 GST', to: 'kc-gst', p: 'Return filing guides, ITC rules, GST council updates, e-invoicing compliance, and common error resolutions.' },
      { icon: '🏘️', h3: '7.2 RERA', to: 'kc-rera', p: 'Project registration, quarterly disclosures, promoter obligations, and Gujarat RERA compliance updates.' },
      { icon: '📋', h3: '7.3 Direct Tax', to: 'kc-dtax', p: 'Income tax slabs, TDS rate charts, advance tax, capital gains, and Budget 2025-26 highlights.' },
      { icon: '🌏', h3: '7.4 International Tax', to: 'kc-intl', p: 'DTAA benefits, transfer pricing, FEMA/RBI, NRI taxation, and cross-border transaction guidance.' },
      { icon: '🚢', h3: '7.5 FEMA & EXIM', to: 'kc-fema', p: 'FDI reporting, ECB guidelines, DGFT licensing, export-import policy, and RBI compliance updates.' },
      { icon: '⚖️', h3: '7.6 Audit', to: 'kc-audit', p: 'Audit standards, CARO 2020, internal control frameworks, tax audit requirements, and ICAI updates.' },
      { icon: '📖', h3: '7.7 Glossary', to: 'kc-glossary', p: 'Plain-language definitions of key tax, audit, company law, RERA, and FEMA terminology.' },
      { icon: '✅', h3: '7.8 Checklists', to: 'kc-checklist', p: 'Ready-to-use compliance checklists for GST, income tax, audit, RERA, and year-end closing.' },
    ],
  },
  updates: {
    tag: 'Latest Updates', title: { pre: 'Recent ', em: 'Insights' },
    cards: [
      { tag: 'GST', date: '2025', to: 'kc-gst', h3: 'GST Council Updates, Rate Changes & Compliance Decisions', p: 'Summary of rate changes, exemptions, and compliance relaxations from recent GST Council meetings.' },
      { tag: 'Direct Tax', date: '2025', to: 'kc-dtax', h3: 'Budget 2025-26, Tax Highlights for Individuals & Corporates', p: 'Key changes in income tax slabs, deductions, and compliance requirements for FY 2025-26.' },
      { tag: 'RERA', date: '2025', to: 'kc-rera', h3: 'Gujarat RERA, Latest Circulars & Developer Compliance Updates', p: 'Latest circulars and compliance requirements for real estate developers under Gujarat RERA.' },
      { tag: 'TDS', date: '2025', to: 'kc-dtax', h3: 'TDS Rate Chart FY 2025-26, Complete Section-wise Reference', p: 'Complete TDS rate chart for FY 2025-26 covering all sections with applicability guidance.' },
      { tag: 'FEMA', date: '2025', to: 'kc-fema', h3: 'RBI Circular, Updated FC-GPR & FC-TRS Filing Guidelines', p: 'Updated guidelines on FC-GPR and FC-TRS filings for foreign direct investment transactions in India.' },
      { tag: 'Audit', date: '2025', to: 'kc-audit', h3: 'ICAI Updates, Revised Standards on Auditing & CARO 2020', p: 'Key updates on revised auditing standards and CARO 2020 reporting requirements for statutory auditors.' },
    ],
  },
  tools: {
    tag: 'Compliance Tools', title: { pre: 'Tax ', em: 'Compliance Calendar 2025-26' },
    lead: 'Our comprehensive compliance calendar covering all GST, income tax, TDS, ROC, and RERA due dates for FY 2025-26. Never miss a deadline again.',
    btns: [{ label: 'View Checklists →', to: 'kc-checklist' }, { label: 'Browse Glossary', to: 'kc-glossary', outline: true }],
  },
};
export default kcData;
