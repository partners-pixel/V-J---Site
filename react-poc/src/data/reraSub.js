// RERA sub-pages, rendered by <GstTemplate/>. Hero + services are real JSX
// (data below); each page's bespoke process/engagement/contact sections are
// pulled from the source markup via `sections`.

const heroSize = 'clamp(2rem,3.4vw,3rem)';
const bc = (current) => [{ label: 'Home', to: 'home' }, { label: 'RERA', to: 'rera' }, { label: current }];

const reraReg = {
  breadcrumb: bc('Project Registration Compliance'),
  eyebrow: 'Project Registration Compliance Service', heroTitleSize: heroSize,
  heroTitle: { first: 'Streamline Your RERA', em: 'Project Registration' },
  heroLead: 'Launching a real estate project? Our Chartered Accountant-led team guides you through mandatory RERA registration and compliance.',
  heroParas: [
    'We simplify project registration and compliance under RERA so you can focus on development. Our experts handle every detail: from preparing project documents and filling RERA Forms to liaising with authorities, setting up escrow accounts, and ensuring ongoing reporting.',
    'We assist with documentation, filing Forms, and securing approvals under state RERA rules. From escrow account setup to quarterly updates, we cover every compliance step.',
    'With our guidance, promoters meet all state RERA regulations smoothly, avoiding delays and penalties. Partner with V J Desai and Co. to register your project efficiently and maintain full regulatory compliance.',
  ],
  heroBtn: { label: 'Book a Consultation', to: 'contact' },
  ids: { services: 'rreg-services' },
  subnav: [
    { label: 'Our Services', href: '#rreg-services' }, { label: 'How It Works', href: '#rreg-process' },
    { label: 'Engagement', href: '#rreg-engagement' }, { label: 'Contact', href: '#rreg-contact' },
  ],
  servicesTag: 'Our Services', servicesTitle: { pre: 'Project Registration ', em: 'Services We Provide' }, servicesCols: 3,
  servicesSub: "Each service is tailored to your project's scale and location. Whether it is one new project or a portfolio under RERA, we apply practical solutions reducing compliance burden and keeping your project on schedule.",
  services: [
    { icon: '📋', h3: 'Project Registration Services', p: 'We handle end-to-end RERA registration: creating promoter profiles, filling Form A with project details (land title, layouts, approvals, etc.), and obtaining the RERA registration number. We liaise with RERA authorities to secure approvals and fulfil any clarifications quickly.' },
    { icon: '📂', h3: 'Document Management and Escrow Setup', p: 'We organise all required documents (title deeds, approvals, architectural plans, financial statements, etc.) in the prescribed format. We also guide escrow account setup, ensuring 70% of buyer funds are deposited in a designated project account and withdrawals are certified per RERA rules.' },
    { icon: '🔄', h3: 'Compliance and Reporting', p: 'After registration, we manage ongoing compliance including quarterly progress reports, updates on approvals and changes, and annual filings. We ensure you meet RERA disclosure norms and prepare the periodic returns and handle communications with the RERA regulator.' },
    { icon: '🔍', h3: 'Due Diligence and Risk Management', p: 'We conduct thorough title and document audits before registration to pre-empt issues. Our CA review minimises legal or financial risks such as encumbrances and funding shortfalls. We advise on governance matters so your project remains RERA-compliant in structure and finance.' },
    { icon: '🎓', h3: 'Advisory and Training', p: 'We counsel you on RERA mandates including cap on advance payments, carpet-area calculations, and quality warranty obligations. We also train your team on compliance processes so everyone follows best practices.' },
  ],
  sections: [
    { fromSlug: 'rera-reg', selector: '#rreg-process' },
    { fromSlug: 'rera-reg', selector: '#rreg-engagement' },
    { fromSlug: 'rera-reg', selector: '#rreg-contact' },
  ],
};

const reraQud = {
  breadcrumb: bc('Quarterly Updates Disclosure'),
  eyebrow: 'Quarterly Updates Disclosure Service', heroTitleSize: heroSize,
  heroTitle: { first: 'Stay Ahead with', em: 'Quarterly Compliance' },
  heroLead: 'Every registered real estate project must provide quarterly updates under RERA. Our Chartered Accountant-led team takes care of these mandatory disclosures from gathering project details and uploading required data to setting up the escrow account and meeting deadlines.',
  heroParas: [
    'We handle your RERA quarterly compliance end-to-end. Our experts ensure your project updates including progress, approvals, sales, and finances are accurately prepared and submitted on time.',
    "We navigate each state's RERA portal and reporting formats, ensuring your filings are correct and timely. By managing documentation, portal filings, and updates, we keep your project compliant and help you avoid penalties, letting you focus on development. Partner with V J Desai and Co. to streamline your RERA updates and stay fully compliant, without the stress of missed deadlines.",
  ],
  heroBtn: { label: 'Book a Consultation', to: 'contact' },
  ids: { services: 'qud-services' },
  subnav: [
    { label: 'Our Services', href: '#qud-services' }, { label: 'How It Works', href: '#qud-process' },
    { label: 'Engagement', href: '#qud-engagement' }, { label: 'Contact', href: '#qud-contact' },
  ],
  servicesTag: 'Our Services', servicesTitle: { pre: 'Quarterly Disclosure ', em: 'Services We Provide' }, servicesCols: 3,
  servicesSub: "Each service is customised to your project's scale and location. Whether you have one project or many, we provide pragmatic, compliant solutions lightening your compliance burden so you can focus on delivering the project.",
  services: [
    { icon: '📋', h3: 'Quarterly Update Filing', p: 'We prepare and submit your RERA quarterly updates on time. This includes filling Forms with project status, buyer bookings, approvals, and timelines. We handle uploads on the state RERA portal and liaise with regulators to resolve any queries quickly.' },
    { icon: '🏦', h3: 'Escrow and Fund Reporting', p: 'We set up and monitor your escrow account. We ensure 70% of buyer payments go into the escrow as required and track fund withdrawals certified by architects. We include detailed fund utilisation and expense breakdowns in your quarterly reports.' },
    { icon: '🏗️', h3: 'Project Progress Reporting', p: 'We compile up-to-date construction and completion data. This covers the percentage completion of each block or floor, certified work done, and adherence to timelines. We also document any change in project scope or plans as required by RERA.' },
    { icon: '📅', h3: 'Compliance Calendar and Reminders', p: 'We create a custom timeline of all RERA deadlines and requirements for your project. We track upcoming reporting dates and send reminders, helping you prepare early. This proactive scheduling avoids last-minute rushes and penalties for late filing.' },
    { icon: '💡', h3: 'Regulatory Advisory', p: 'We advise on all ongoing RERA compliance matters. Whether it is adjusting disclosures for project changes, interpreting new guidelines, or handling communication with the authority, we keep you informed and compliant.' },
  ],
  sections: [
    { fromSlug: 'rera-qud', selector: '#qud-process' },
    { fromSlug: 'rera-qud', selector: '#qud-engagement' },
    { fromSlug: 'rera-qud', selector: '#qud-contact' },
  ],
};

const reraExt = {
  breadcrumb: bc('Project Extension Regulations'),
  eyebrow: 'Project Extension Regulations under RERA', heroTitleSize: heroSize,
  heroTitle: { first: 'Navigate RERA Project Extensions', em: 'Smoothly' },
  heroLead: 'Even with the best planning, projects face delays. Our Chartered Accountant team helps you secure RERA extensions under Sections 6 and 7 when setbacks occur.',
  heroParas: [
    'Builders can apply for project deadline extensions under RERA due to genuine delays. We guide you through force majeure and reasonable-circumstances extensions (Sections 6 and 7) and handle necessary documentation.',
    'From force majeure certifications to obtaining allottee consent, we manage every step including application forms, evidence, fees, and follow-ups.',
    'We also advise on engaging allottees or third parties when needed. With our support, you will apply extensions correctly, avoid compliance traps, and keep your project on track. Partner with V J Desai and Co. to extend deadlines responsibly and maintain buyer confidence.',
  ],
  heroBtn: { label: 'Book a Consultation', to: 'contact' },
  ids: { services: 'rext-services' },
  subnav: [
    { label: 'Our Services', href: '#rext-services' }, { label: 'How It Works', href: '#rext-process' },
    { label: 'Engagement', href: '#rext-engagement' }, { label: 'Contact', href: '#rext-contact' },
  ],
  servicesTag: 'Our Services', servicesTitle: { pre: 'Project Extension ', em: 'Services We Provide' }, servicesCols: 3,
  servicesSub: 'Each service is tailored to your projects. Whether it is a single deadline or a multi-stage project, we provide precise, compliance-focused solutions so you avoid costly delays.',
  services: [
    { icon: '🎯', h3: 'Extension Strategy', p: 'We assess your delay causes and recommend the right extension path (Section 6 or 7). We summarise RERA provisions for your scenario, ensuring you understand prerequisites and implications.' },
    { icon: '📂', h3: 'Documentation and Filings', p: 'We prepare detailed applications including drafting the extension request, assembling evidence such as force majeure certificates and government notices, completing prescribed RERA forms, and handling fee payments.' },
    { icon: '👥', h3: 'Allottee Consent Management', p: 'Under Section 7(3), if extension requires allottee approval, we facilitate that process. We help convene allottee meetings, explain their rights, and secure required resolutions or consent forms.' },
    { icon: '🏛️', h3: 'Regulator Liaison', p: 'We track your application status with the RERA authority. If authorities request more information or impose conditions, we coordinate responses and compliance with those terms.' },
    { icon: '🛡️', h3: 'Risk Advisory', p: 'We alert you to the consequences of non-extension such as no sales registration and home loan disbursement halts, and advise on minimising disputes while maintaining transparency with buyers and regulators.' },
  ],
  sections: [
    { fromSlug: 'rera-ext', selector: '#rext-process' },
    { fromSlug: 'rera-ext', selector: '#rext-engagement' },
    { fromSlug: 'rera-ext', selector: '#rext-contact' },
  ],
};

const reraDisp = {
  breadcrumb: bc('RERA Dispute Response Support'),
  eyebrow: 'RERA Dispute Response Support', heroTitleSize: heroSize,
  heroTitle: { first: 'Resolve Your RERA Disputes', em: 'with Confidence' },
  heroLead: 'Whether you are a homebuyer seeking compensation or a developer responding to a complaint, we guide you through the RERA process.',
  heroParas: [
    'Facing a RERA complaint or dispute? We provide end-to-end RERA dispute response support for homebuyers and developers. Our Chartered Accountant-led team drafts complaint and response filings, represents you in hearings, and manages documentation.',
    'Our experts help you prepare and file RERA forms (A/M for buyers, N/B for claims), represent you in hearings, and pursue execution of orders. We handle appeals (Form L) and even facilitate conciliation for quicker settlements.',
    'We handle every step from Form A/M filing and appeals to execution of orders, ensuring your RERA case is managed professionally. Partner with V J Desai and Co. to resolve delays, refund claims, or defect issues swiftly and compliantly.',
  ],
  heroBtn: { label: 'Book a Consultation', to: 'contact' },
  ids: { services: 'rdisp-services' },
  subnav: [
    { label: 'Our Services', href: '#rdisp-services' }, { label: 'How It Works', href: '#rdisp-process' },
    { label: 'Engagement', href: '#rdisp-engagement' }, { label: 'Contact', href: '#rdisp-contact' },
  ],
  servicesTag: 'Our Services', servicesTitle: { pre: 'RERA Dispute ', em: 'Services We Provide' }, servicesCols: 3,
  servicesSub: 'Each service is customised to your situation. Whether it is one complaint or multiple projects, we provide a strategic, end-to-end solution so you can focus on your core concerns, not legal technicalities.',
  services: [
    { icon: '📋', h3: 'Complaints Filing and Drafting', p: 'We assist in drafting and filing RERA complaints (Form A/M) for buyers claiming delays, non-refunds, or defects. For developers, we prepare legal responses (Form N/B) to buyer claims, aiming to avert penalties. Our drafts address all relevant facts and reliefs.' },
    { icon: '🏛️', h3: 'Legal Representation', p: 'Our advocates appear before the RERA Regulatory Authority or Adjudicating Officer on your behalf. We present your case clearly, whether you are seeking compensation or defending a claim. We handle hearings and cross-examinations.' },
    { icon: '📂', h3: 'Documentation Support', p: 'We help organise crucial documents: sale agreements, payment receipts, bank statements, buyer-builder correspondence, and any project brochures for misrepresentation claims. This ensures your case is supported by complete evidence during the hearing.' },
    { icon: '⚖️', h3: 'Execution of Orders', p: 'If a RERA order is not complied with, we initiate execution proceedings under Section 40. We work with the Authority and banks to enforce payment of fines or refunds ordered by RERA, recovering funds on your behalf.' },
    { icon: '📜', h3: 'Appeals and Tribunals', p: 'We manage appeals (Form L) against RERA orders within the 60-day window. Our team prepares and argues cases before the Appellate Tribunal to challenge or uphold RERA decisions.' },
    { icon: '🤝', h3: 'Conciliation Support', p: "We guide parties through RERA's Conciliation Forum for disputes. By facilitating amicable settlements, we often resolve cases faster than formal hearings, saving time and cost." },
  ],
  sections: [
    { fromSlug: 'rera-disp', selector: '#rdisp-process' },
    { fromSlug: 'rera-disp', selector: '#rdisp-engagement' },
    { fromSlug: 'rera-disp', selector: '#rdisp-contact' },
  ],
};

export default { 'rera-reg': reraReg, 'rera-qud': reraQud, 'rera-ext': reraExt, 'rera-disp': reraDisp };
