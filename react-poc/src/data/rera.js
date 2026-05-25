// Content for the RERA Compliance page, rendered by <ServiceTemplate/>.
const reraData = {
  hero: {
    current: 'RERA Compliance',
    badge: '🏗️ RERA Compliance Services',
    title: { pre: 'RERA ', em: 'Compliance Services' },
    lead: 'End-to-end RERA compliance for real estate promoters and developers across Gujarat, project registration, quarterly disclosures, extension filings, and dispute resolution support under the Real Estate (Regulation and Development) Act.',
    tags: ['Project Registration', 'QPR Disclosures', 'Project Extension', 'Dispute Support', 'Gujarat RERA'],
    ctas: [{ label: 'Get RERA Help →', to: 'contact' }, { label: 'Project Registration', to: 'rera-reg', outline: true }],
    stats: [{ n: '4+', l: 'RERA Services' }, { n: 'GJ', l: 'Gujarat RERA' }, { n: '33+', l: 'Years Experience' }, { n: '100+', l: 'Projects Supported' }],
    highlight: { quote: '"RERA compliance protects developers from regulatory risk and builds buyer confidence. Our team ensures every disclosure is accurate, timely, and complete."', cite: 'RERA Advisory · V J Desai & Co. LLP' },
  },
  ids: { services: 'rera-services', how: 'rera-how', engagement: 'rera-engagement', contact: 'rera-contact' },
  subnav: [
    { label: 'Our Services', href: '#rera-services' },
    { label: 'How It Works', href: '#rera-how' },
    { label: 'Engagement', href: '#rera-engagement' },
    { label: 'Contact', href: '#rera-contact' },
  ],
  serviceGroups: [
    {
      tag: 'Our Services', title: { pre: 'RERA Compliance ', em: 'Services' },
      sub: 'End-to-end RERA compliance for real estate developers in Gujarat, from initial project registration through to dispute response support.',
      cards: [
        { icon: '📝', h3: 'Project Registration Compliance', p: 'Complete documentation, application preparation, and GujRERA submission. Document checklist review, project detail verification, and ongoing registration management.' },
        { icon: '📅', h3: 'Quarterly Updates & Disclosure', p: 'Preparation and filing of quarterly progress reports with physical and financial completion status, fund utilisation disclosures, and booking status updates within the 15-day deadline.' },
        { icon: '⏳', h3: 'Project Extension Regulations', p: 'Extension application drafting and filing, force majeure advisory, revised completion schedule preparation, and direct liaison with GujRERA authority for approval and follow-up.' },
        { icon: '🛡️', h3: 'RERA Dispute Response Support', p: 'Comprehensive replies to buyer complaints, representation before the Adjudicating Officer, RERA Appellate Tribunal appeals, and settlement advisory to avoid prolonged litigation.' },
      ],
    },
  ],
  how: {
    tag: 'How It Works', title: { pre: 'Our RERA ', em: 'Engagement Process' },
    sub: 'A structured approach to RERA compliance, ensuring every deadline is met, every disclosure is accurate, and every dispute is managed with procedural discipline.',
    steps: [
      { num: '01', h4: 'Project Intake & Assessment', p: 'Understanding your project structure, approvals, land title documents, and current RERA registration status.' },
      { num: '02', h4: 'Document Checklist & Review', p: 'Preparing and reviewing all required documents for registration or quarterly filings before submission to avoid deficiency notices.' },
      { num: '03', h4: 'Application Preparation & Filing', p: 'Accurate preparation and submission of registration applications, quarterly reports, or extension requests through the GujRERA portal.' },
      { num: '04', h4: 'Authority Liaison & Follow-Up', p: 'Direct communication with GujRERA authorities for query resolution, approval follow-up, and any required clarifications or corrections.' },
      { num: '05', h4: 'Compliance Calendar Management', p: 'Setting up and maintaining a project-specific compliance calendar ensuring no quarterly deadline or disclosure obligation is missed.' },
      { num: '06', h4: 'Dispute & Escalation Support', p: 'If complaints are filed, we prepare structured responses and represent your position before the Adjudicating Officer and Appellate Tribunal.' },
    ],
  },
  engagement: {
    tag: 'Engagement', title: { pre: 'Flexible ', em: 'Engagement Models' },
    sub: 'We offer RERA engagement structures suited to developers with single projects, multiple projects, or specific compliance challenges.',
    cards: [
      { h3: 'Project Registration Engagement', p: 'One-time support for new project registration with GujRERA, complete documentation review, application preparation, portal submission, and follow-up until registration is confirmed.' },
      { h3: 'Ongoing Compliance Retainer', p: 'Continuous RERA compliance covering quarterly updates, disclosure management, compliance calendar, and regulatory liaison, ideal for developers with active registered projects.' },
      { h3: 'Dispute & Matter-Specific Support', p: 'Targeted assistance for specific RERA matters, extension applications, buyer complaint responses, adjudication proceedings, or Appellate Tribunal representation.' },
    ],
  },
  cta: { title: { pre: 'RERA compliance made ', em: 'simple' }, p: 'We manage your complete RERA compliance calendar so you can focus on construction.', btn: { label: 'Book a Consultation →', to: 'contact' } },
};
export default reraData;
