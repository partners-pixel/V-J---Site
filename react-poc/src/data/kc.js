// Content for the Knowledge Center overview, rendered by <KcTemplate/>.
// Knowledge Center has just two pages: Blog and Checklist.
const kcData = {
  hero: {
    current: 'Knowledge Center',
    badge: '📚 Knowledge Center',
    title: { pre: 'Knowledge ', em: 'Center' },
    lead: 'Practical insights and ready-to-use compliance resources from our expert CA team, in plain, actionable language.',
    tags: ['Blog', 'Checklists', 'Compliance'],
    ctas: [{ label: 'Read the Blog →', to: 'kc-blog' }, { label: 'Compliance Checklist', to: 'kc-checklist', outline: true }],
    stats: [{ n: 'CA', l: 'Expert Authored' }, { n: 'Free', l: 'Access' }, { n: 'Live', l: 'Regular Updates' }, { n: '2', l: 'Resource Types' }],
    highlight: { quote: '"Knowledge is the first line of compliance. We share what we know so our clients, and the broader community, can make informed decisions."', cite: 'Knowledge Center · V J Desai & Co. LLP' },
  },
  subnav: [],
  topics: {
    tag: 'Browse', title: { pre: 'Insights & ', em: 'Resources' },
    cards: [
      { icon: '📝', h3: 'Blog', to: 'kc-blog', p: 'Articles and updates on GST, direct tax, RERA, FEMA, and audit, explained in clear, practical terms by our CA team.' },
      { icon: '✅', h3: 'Checklist', to: 'kc-checklist', p: 'Ready-to-use compliance checklists for GST, income tax, audit, RERA, and year-end closing.' },
    ],
  },
};
export default kcData;
