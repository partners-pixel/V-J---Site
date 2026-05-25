// Content for the flagship GST page, rendered by <GstTemplate/>.

const processSvg = `
<svg viewBox="0 0 1300 860" style="width:100%;min-width:640px;display:block;" xmlns="http://www.w3.org/2000/svg">
  <circle cx="650" cy="158" r="106" fill="#1A5276" opacity="0.09"/>
  <circle cx="868" cy="284" r="106" fill="#6C3483" opacity="0.09"/>
  <circle cx="868" cy="536" r="106" fill="#1E8449" opacity="0.09"/>
  <circle cx="650" cy="662" r="106" fill="#B7770D" opacity="0.09"/>
  <circle cx="432" cy="536" r="106" fill="#7B241C" opacity="0.09"/>
  <circle cx="432" cy="284" r="106" fill="#0E6655" opacity="0.09"/>
  <line x1="650" y1="318" x2="650" y2="258" stroke="#1A5276" stroke-width="2.8" stroke-linecap="round"/>
  <circle cx="650" cy="318" r="5.5" fill="#1A5276"/><circle cx="650" cy="258" r="5.5" fill="#1A5276"/>
  <line x1="728" y1="364" x2="782" y2="334" stroke="#6C3483" stroke-width="2.8" stroke-linecap="round"/>
  <circle cx="728" cy="364" r="5.5" fill="#6C3483"/><circle cx="782" cy="334" r="5.5" fill="#6C3483"/>
  <line x1="728" y1="456" x2="782" y2="486" stroke="#1E8449" stroke-width="2.8" stroke-linecap="round"/>
  <circle cx="728" cy="456" r="5.5" fill="#1E8449"/><circle cx="782" cy="486" r="5.5" fill="#1E8449"/>
  <line x1="650" y1="502" x2="650" y2="562" stroke="#B7770D" stroke-width="2.8" stroke-linecap="round"/>
  <circle cx="650" cy="502" r="5.5" fill="#B7770D"/><circle cx="650" cy="562" r="5.5" fill="#B7770D"/>
  <line x1="572" y1="456" x2="518" y2="486" stroke="#7B241C" stroke-width="2.8" stroke-linecap="round"/>
  <circle cx="572" cy="456" r="5.5" fill="#7B241C"/><circle cx="518" cy="486" r="5.5" fill="#7B241C"/>
  <line x1="572" y1="364" x2="518" y2="334" stroke="#0E6655" stroke-width="2.8" stroke-linecap="round"/>
  <circle cx="572" cy="364" r="5.5" fill="#0E6655"/><circle cx="518" cy="334" r="5.5" fill="#0E6655"/>
  <circle cx="650" cy="410" r="94" fill="#E8EDF4" stroke="#C9A84C" stroke-width="2"/>
  <circle cx="650" cy="410" r="87" fill="#F4F6FA"/>
  <text text-anchor="middle" font-family="EB Garamond,serif" font-size="14.5" font-weight="600" fill="#0D1B35">
    <tspan x="650" y="394">Our</tspan><tspan x="650" dy="18">Engagement</tspan><tspan x="650" dy="18">Process</tspan></text>
  <circle cx="650" cy="158" r="96" fill="#1A5276"/><circle cx="650" cy="158" r="90" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="1.5"/>
  <text text-anchor="middle" font-family="Inter,sans-serif" font-size="13" font-weight="600" fill="white"><tspan x="650" y="150">Initial</tspan><tspan x="650" dy="18">Consultation</tspan></text>
  <circle cx="868" cy="284" r="96" fill="#6C3483"/><circle cx="868" cy="284" r="90" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="1.5"/>
  <text text-anchor="middle" font-family="Inter,sans-serif" font-size="13" font-weight="600" fill="white"><tspan x="868" y="276">Data and</tspan><tspan x="868" dy="18">System Review</tspan></text>
  <circle cx="868" cy="536" r="96" fill="#1E8449"/><circle cx="868" cy="536" r="90" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="1.5"/>
  <text text-anchor="middle" font-family="Inter,sans-serif" font-size="13" font-weight="600" fill="white"><tspan x="868" y="528">Compliance</tspan><tspan x="868" dy="18">Assessment</tspan></text>
  <circle cx="650" cy="662" r="96" fill="#B7770D"/><circle cx="650" cy="662" r="90" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="1.5"/>
  <text text-anchor="middle" font-family="Inter,sans-serif" font-size="13" font-weight="600" fill="white"><tspan x="650" y="654">Strategy and</tspan><tspan x="650" dy="18">Structuring</tspan></text>
  <circle cx="432" cy="536" r="96" fill="#7B241C"/><circle cx="432" cy="536" r="90" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="1.5"/>
  <text text-anchor="middle" font-family="Inter,sans-serif" font-size="13" font-weight="600" fill="white"><tspan x="432" y="528">Implementation</tspan><tspan x="432" dy="18">Support</tspan></text>
  <circle cx="432" cy="284" r="96" fill="#0E6655"/><circle cx="432" cy="284" r="90" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="1.5"/>
  <text text-anchor="middle" font-family="Inter,sans-serif" font-size="13" font-weight="600" fill="white"><tspan x="432" y="276">Ongoing</tspan><tspan x="432" dy="18">Monitoring</tspan></text>
  <text text-anchor="middle" font-family="Inter,sans-serif" font-size="11.5" fill="#5A6478"><tspan x="650" y="28">Understanding your business model,</tspan><tspan x="650" dy="16">transaction flow and existing GST practices.</tspan></text>
  <text text-anchor="start" font-family="Inter,sans-serif" font-size="11.5" fill="#5A6478"><tspan x="977" y="248">Reviewing accounting records,</tspan><tspan x="977" dy="16">returns and compliance history</tspan><tspan x="977" dy="16">to identify gaps.</tspan></text>
  <text text-anchor="start" font-family="Inter,sans-serif" font-size="11.5" fill="#5A6478"><tspan x="977" y="500">Evaluating registration structure,</tspan><tspan x="977" dy="16">credit utilisation and</tspan><tspan x="977" dy="16">filing accuracy.</tspan></text>
  <text text-anchor="middle" font-family="Inter,sans-serif" font-size="11.5" fill="#5A6478"><tspan x="650" y="782">Designing a GST framework covering filings,</tspan><tspan x="650" dy="16">documentation and process controls.</tspan></text>
  <text text-anchor="end" font-family="Inter,sans-serif" font-size="11.5" fill="#5A6478"><tspan x="318" y="500">Assisting in executing changes</tspan><tspan x="318" dy="16">across accounting systems</tspan><tspan x="318" dy="16">and internal workflows.</tspan></text>
  <text text-anchor="end" font-family="Inter,sans-serif" font-size="11.5" fill="#5A6478"><tspan x="318" y="248">Continuous review of filings,</tspan><tspan x="318" dy="16">reconciliations and regulatory</tspan><tspan x="318" dy="16">developments.</tspan></text>
</svg>`;

const gstData = {
  breadcrumb: [{ label: 'Home', to: 'home' }, { label: 'GST Compliance and Advisory' }],
  eyebrow: 'GST Compliance and Advisory',
  heroTitle: { first: 'Expert GST Compliance', em: 'and Advisory' },
  heroLead: 'GST compliance is not just about filing returns. It directly impacts working capital, vendor relationships, and operational efficiency.',
  heroParas: [
    'We start by mapping your business model, transaction flow, and documentation practices. Based on this, we design a GST compliance and advisory framework tailored to your operations. This includes registration structuring, classification validation, credit optimisation, and process alignment with filing requirements.',
    'Our team integrates GST into your accounting and operational systems, ensuring that invoicing, e-way bills, and returns are handled seamlessly. The objective is to create a system where compliance is controlled and predictable.',
  ],
  heroBtn: { label: 'Book a GST Consultation', to: 'contact' },
  ids: { services: 'gst31-services', process: 'gst31-process', engagement: 'gst31-engagement', contact: 'gst31-contact' },
  subnav: [
    { label: 'Core Services', href: '#gst31-services' },
    { label: 'Process', href: '#gst31-process' },
    { label: 'Engagement Models', href: '#gst31-engagement' },
    { label: 'Contact', href: '#gst31-contact' },
  ],
  servicesTitle: { pre: 'GST Compliance ', em: 'Services' },
  services: [
    { icon: '📋', h3: 'GST Registration and Structuring', p: 'We handle end-to-end GST registration, including structuring across multiple locations, business verticals, and transaction models. This ensures correct setup from the outset, avoiding future complications.' },
    { icon: '🔄', h3: 'Return Filing and Reconciliation', p: 'We prepare and review GST returns with a focus on data consistency between books, returns, and vendor filings. Regular reconciliation helps identify mismatches early and ensures accurate reporting.' },
    { icon: '💰', h3: 'Input Tax Credit Optimisation', p: 'We analyse your purchase and expense structure to ensure that eligible credits are fully captured and ineligible claims are avoided. This directly impacts working capital efficiency.' },
    { icon: '🔠', h3: 'Classification and Transaction Review', p: 'We review the classification of goods and services and evaluate transaction structures to ensure consistency in tax treatment across your operations.' },
    { icon: '📦', h3: 'E-Invoicing and E-Way Bill Support', p: 'We assist in implementing compliant invoicing systems and e-way bill processes that align with your logistics and dispatch workflows.' },
    { icon: '💼', h3: 'GST Refund Advisory', p: 'We identify eligible refund positions and manage documentation, filing, and follow-ups to ensure timely processing and minimal rejection risk.' },
    { icon: '⚖️', h3: 'Litigation and Representation', p: 'We handle notices, audits, and departmental queries by preparing structured responses and representing your position before authorities.' },
    { icon: '📡', h3: 'Ongoing GST Advisory', p: 'We provide continuous advisory on operational decisions, new transactions, and regulatory developments to ensure your GST position remains aligned with business changes.' },
  ],
  process: {
    title: { pre: 'How We ', em: 'Engage With You' },
    sub: 'A structured six-step process that maps your business model, identifies compliance gaps, and builds a framework for controlled and predictable GST management.',
    svg: processSvg,
  },
  engagement: [
    { letter: 'A', badge: 'Project-Based', h3: 'Project-Based Engagement', p: 'Suitable for specific requirements such as registration setup, reconciliation review, or refund advisory.', features: ['Registration setup and structuring', 'Reconciliation review and correction', 'Refund advisory and filing', 'Defined scope and clear deliverables'], btn: { label: 'Get a Proposal', to: 'contact' } },
    { letter: 'B', badge: 'Retainer', featured: true, h3: 'Retainer Model', p: 'Ongoing support covering return filings, advisory, reconciliations, and compliance monitoring.', features: ['Monthly return filing and reconciliation', 'Ongoing advisory and monitoring', 'Compliance updates and alerts', 'Continuous access to our CA team'], btn: { label: 'Start a Retainer', to: 'contact' } },
    { letter: 'C', badge: 'Integrated', h3: 'Integrated Advisory', p: 'GST services combined with direct tax, audit, and regulatory advisory to ensure consistency across all compliance areas.', features: ['GST with direct tax and audit', 'Consistent cross-compliance approach', 'Single advisory team for all areas', 'Full regulatory alignment'], btn: { label: 'Discuss Integration', to: 'contact' } },
  ],
  cta: {
    title: { first: 'Work with a structured', em: 'GST advisory team' },
    lead: 'Work with a structured GST advisory team that brings clarity and control to your compliance process.',
    list: ['GST registration and structuring', 'Accurate return filing and reconciliation', 'Input tax credit optimisation', 'GST process alignment with operations', 'Representation in notices and audits'],
    rightTitle: 'Book a Consultation',
    rightLead: 'Contact us to schedule a GST consultation. Our team will assess your requirements and design the right compliance framework for your business.',
    btns: [
      { label: 'Contact Us to Schedule a GST Consultation', to: 'contact' },
      { label: 'Download: GST Compliance Checklist', kind: 'outline', to: 'contact' },
    ],
    related: [
      { label: 'GST Audit and Notice Response', to: 'gst-audit' },
      { label: 'Corporate Audit and Assurance Services', to: 'audit' },
      { label: 'Compliance Solutions', to: 'audit' },
    ],
  },
};

export default gstData;
