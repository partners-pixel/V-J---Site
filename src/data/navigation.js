export const navItems = [
  { key: 'index', label: 'Home', to: '/' },
  {
    key: 'about',
    label: 'About Us',
    to: '/why-choose-us',
    groups: [[
      { label: 'Why Choose Us', to: '/why-choose-us' },
      { label: 'Team', to: '/team' },
    ]],
  },
  {
    key: 'gst',
    label: 'GST / Indirect Tax',
    to: '/gst',
    groups: [[
      { label: 'GST', to: '/gst' },
      { label: 'GST Classification', to: '/gst-class' },
      { label: 'GST Audit', to: '/gst-audit' },
      { label: 'GST Due Diligence', to: '/gst-dd' },
      { label: 'GST Litigation', to: '/gst-lit' },
      { label: 'GST Opinion', to: '/gst-opinion' },
      { label: 'GST - Refund', to: '/gst-refund' },
      { label: 'GST - Search Inquiry Support', to: '/gst-search' },
      { label: 'GST E-Bill - Consultancy', to: '/gst-ebill' },
    ]],
  },
  {
    key: 'dtax',
    label: 'Direct Tax',
    to: '/corp-tax',
    groups: [[
      { label: 'Corporate Tax', to: '/corp-tax' },
      { label: 'Income Tax - Advisory', to: '/income-tax-adv' },
      { label: 'Income Tax', to: '/income-tax' },
      { label: 'NRI - Taxation', to: '/nri-tax' },
    ]],
  },
  {
    key: 'audit',
    label: 'Audit & Advisory',
    to: '/audit',
    groups: [
      {
        title: 'Audit',
        items: [
          { label: 'Statutory Audit', to: '/stat-audit' },
          { label: 'Tax Audit', to: '/tax-audit' },
          { label: 'Internal Audit', to: '/int-audit' },
          { label: 'Compliance Audit', to: '/comp-audit' },
        ],
      },
      {
        title: 'Corporate Services',
        items: [
          { label: 'Business Setup Services', to: '/biz-setup' },
          { label: 'Business Valuation & Restructuring', to: '/biz-val' },
          { label: 'Company Law', to: '/company-law' },
          { label: 'Exim Policy', to: '/exim' },
          { label: 'FEMA', to: '/fema' },
          { label: 'Management Consultancy & CFO Services', to: '/mgmt-cfo' },
        ],
      },
    ],
  },
  {
    key: 'rera',
    label: 'RERA',
    to: '/rera-reg',
    groups: [[
      { label: 'Project Registration Compliance', to: '/rera-reg' },
      { label: 'Quarterly Updates Disclosure', to: '/rera-qud' },
      { label: 'Project Extension Regulations', to: '/rera-ext' },
      { label: 'RERA Dispute Response Support', to: '/rera-disp' },
    ]],
  },
  {
    key: 'kc',
    label: 'Knowledge Center',
    to: '/kc-blog',
    groups: [[
      { label: 'Blog', to: '/kc-blog' },
      { label: 'Checklist', to: '/kc-checklist' },
    ]],
  },
  { key: 'career', label: 'Career', to: '/career' },
  { key: 'contact', label: 'Contact Us', to: '/contact' },
];
