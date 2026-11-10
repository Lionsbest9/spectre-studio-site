// Everything a visitor reads lives here. Edit, run `npm run build`, push.
// Prices are in Rwandan francs. `whatsapp` is your number in international format
// without "+", spaces or the leading 0 (example: 250781234567).

export const studio = {
  name: "Spectre Studio",
  tagline: "Websites for Kigali businesses, built in days.",
  city: "Gikondo, Kigali",
  owner: "", // your name, shown in the footer and on About when set
  whatsapp: "250787660135",
  email: "",
  instagram: "",
  waMessage: "Hello Spectre Studio, I saw your portfolio and I want a website for my business.",
};

export const hero = {
  headline: "Websites and web apps, built properly in Kigali.",
  lead: "Spectre Studio designs and codes business websites, dashboards and full platforms by hand. Turn the laptop to look around a real one.",
  primary: "Message on WhatsApp",
  secondary: "See the work",
  stageCaption: "A 3D laptop and phone showing AuditPro, a platform built by Spectre Studio. Drag to turn them; tap the laptop screen for the next screen.",
};

export const facts = [
  { big: "31 screens", small: "in the AuditPro platform" },
  { big: "5 days", small: "to a first page live" },
  { big: "Free demo", small: "before you pay anything" },
];

// The scroll-driven case study on the home page: one chapter per screen of scrolling.
export const chapters = [
  {
    screen: "auditpro-workflow",
    title: "Plan the audit year",
    text: "Build the audit universe, score risk for every entity and turn it into an annual plan mapped to the fiscal year.",
  },
  {
    screen: "auditpro-features",
    title: "Record findings as they happen",
    text: "Fieldwork, working papers and findings in one place, each with a risk rating, a responsible officer and a due date.",
  },
  {
    screen: "auditpro-report",
    title: "Report to the committee",
    text: "Thirteen connected modules end in committee-ready reports, with every change kept in the audit trail.",
  },
];

export const capabilities = [
  { title: "Business websites", text: "One page or five, with your photos, prices, map and a WhatsApp button. Found on Google.", icon: "site", tags: ["Google Maps", "WhatsApp", "Live in 5 days"] },
  { title: "Web apps and dashboards", text: "Logins, roles, approvals, reports and data your team works in every day.", icon: "app", tags: ["Logins and roles", "Approvals", "Reports"] },
  { title: "Bookings and online orders", text: "Customers book a room, a table or a visit, or order and pay, without calling.", icon: "cart", tags: ["Bookings", "Orders", "Payments"] },
  { title: "3D and interactive pages", text: "Product showcases and launch pages that people stop to play with.", icon: "cube", tags: ["Three.js", "Showcases", "Launch pages"] },
];

export const plans = [
  {
    name: "Starter page",
    price: "150,000 RWF",
    for: "A shop, salon, pharmacy or guest house that needs to be found.",
    includes: ["One page with your photos, services and prices", "WhatsApp button, map and opening hours", "Listed on Google Search and Maps", "Live in 5 days"],
  },
  {
    name: "Business site",
    price: "350,000 RWF",
    for: "A clinic, school, restaurant or company with more to show.",
    includes: ["Up to 5 pages: services, gallery, team, prices, contact", "Contact form and Google Business profile", "Your own domain name (.rw or .com)", "Live in 2 weeks"],
    featured: true,
  },
  {
    name: "Custom build",
    price: "from 700,000 RWF",
    for: "Bookings, online ordering, member areas, internal tools.",
    includes: ["Designed around how your business works", "Logins, roles, dashboards and reports", "Admin area so you manage it yourself", "Timeline agreed before we start"],
  },
];

export const care = {
  name: "Care plan",
  price: "25,000 RWF / month",
  text: "Hosting, backups, security updates and small text or photo changes whenever you need them. Domain renewals billed at cost.",
};

export const steps = [
  { title: "Tell me about your business", text: "A WhatsApp chat or a short visit. I ask what customers look for and what you want them to do." },
  { title: "See a free demo", text: "Within 48 hours you get a link to a first version with your name, photos and services. Nothing to pay yet." },
  { title: "Go live", text: "We fix the details together, you pay half, it goes live. The rest when you are happy." },
];

export const featured = {
  slug: "auditpro",
  title: "AuditPro",
  kind: "Audit management platform",
  client: "Government and public-sector audit teams, Rwanda",
  link: "https://audit-pro-delta.vercel.app",
  summary:
    "A complete system for internal audit units: plan the audit year, run engagements, record findings, track recommendations and produce committee-ready reports. Aligned to ISSAI standards and Office of the Auditor General requirements.",
  numbers: [
    { big: "13", small: "modules" },
    { big: "9", small: "user roles" },
    { big: "31", small: "screens" },
    { big: "WCAG 2.1 AA", small: "accessibility" },
  ],
  modules: [
    { group: "Planning", items: ["Audit universe", "Risk assessment", "Annual planning", "Materiality"] },
    { group: "Execution", items: ["Engagements", "Working papers", "Audit programs", "Trial balance", "Evidence"] },
    { group: "Reporting", items: ["Findings", "Recommendations", "Reports", "Analytics", "Review notes"] },
    { group: "Governance", items: ["Committee reports", "Compliance", "Audit trail", "User and role approval"] },
  ],
  stack: ["Next.js 16", "React 19", "TypeScript", "Supabase Postgres", "Row-level security, multi-tenant", "Tailwind CSS 4", "Installable desktop app"],
  screens: [
    { file: "auditpro-landing", alt: "AuditPro landing page: audit management for the public sector, with the 3D audit universe" },
    { file: "auditpro-dashboard", alt: "AuditPro dashboard showing plan coverage, open findings and overdue actions (demo data)" },
    { file: "auditpro-workflow", alt: "AuditPro chapter 02: score every entity, then plan the quarters" },
    { file: "auditpro-features", alt: "AuditPro chapter 03: working papers, evidence and review in one file" },
    { file: "auditpro-risk", alt: "AuditPro chapter 04: the 5 by 5 likelihood and impact risk matrix" },
    { file: "auditpro-report", alt: "AuditPro chapter 05: committee reports, then every action closed" },
    { file: "auditpro-modules", alt: "AuditPro's 13 modules grouped by planning, execution, reporting and governance" },
    { file: "auditpro-login", alt: "AuditPro sign-in screen with the live risk matrix" },
  ],
  phone: { file: "auditpro-phone", alt: "AuditPro on a phone" },
};


export const about = {
  title: "Who builds your site",
  paragraphs: [
    "Spectre Studio is an independent web developer in Gikondo, Kigali. The featured work is a full audit management platform used by professional audit teams, with logins, roles, approvals, dashboards and reports, all designed and coded by hand.",
    "Small businesses get the same standard: a site that loads fast on a cheap phone, shows up on Google, and sends customers straight to your WhatsApp. You see a demo before you pay anything.",
  ],
  tools: ["Next.js", "React", "TypeScript", "Supabase", "Three.js", "Tailwind CSS", "Google Business", "WhatsApp Business"],
};

export const faq = [
  { q: "Do I need to pay before I see anything?", a: "No. You get a free demo link first. Pay half when you approve it and the rest when it is live." },
  { q: "Who owns the website?", a: "You do. The domain is registered in your name and you get all the files." },
  { q: "Can I change prices or photos later?", a: "Yes. Send them on WhatsApp and they are updated within a day on the care plan, or I show you how to do it yourself." },
  { q: "Does it work on phones?", a: "Every site is designed on a phone first, because that is where your customers are." },
  { q: "How do customers find it?", a: "Each site is set up on Google Search and Google Maps so that searching your business name or 'pharmacy Gikondo' shows you." },
];

// ===================== Home page (spectral redesign) =====================

// The pinned hero: one chapter per screen of scrolling. `shape` picks what the point field
// inside the ring becomes: 0 sphere, 1 browser window, 2 data grid, 3 lattice.
export const heroChapters = [
  {
    kicker: "Spectre Studio, Kigali",
    title: ["Websites that work. ", "With a little magic."],
    text: "I design and code websites, web apps and dashboards for businesses in Kigali, by hand, from the first sketch to the live link.",
    shape: 0,
  },
  {
    kicker: "01, the plan",
    title: ["Clear by ", "design", "."],
    text: "Every project starts with what your customers need to do: book, buy, call or find you. The layout follows from that, never from a template.",
    shape: 1,
  },
  {
    kicker: "02, the build",
    title: ["Solid by ", "code", "."],
    text: "Hand-written code that loads fast on a cheap phone and shows up on Google. AuditPro runs 31 screens for audit teams on the same foundations.",
    shape: 2,
  },
  {
    kicker: "03, the launch",
    title: ["Shipped, ", "not shelved", "."],
    text: "A demo link within 48 hours, a live site within a week, and changes whenever your business changes.",
    shape: 3,
  },
];

export const statement = {
  lead: ["Half engineering, half ", "craft", ", and nothing left to chance."],
  text: "Code reviews, real devices and real users before anything goes live.",
};

export const gallery = [
  { screen: "auditpro-landing", title: "AuditPro", kind: "Platform, public landing", href: "work.html" },
  { screen: "auditpro-dashboard", title: "AuditPro dashboard", kind: "AuditPro, workspace (demo data)", href: "work.html" },
  { screen: "auditpro-risk", title: "Risk in 3D", kind: "AuditPro, likelihood by impact", href: "work.html" },
  { screen: "clinic-hero", title: "Polyclinique du Carrefour", kind: "Clinic website preview, awaiting the clinic's approval", href: "demos/clinique-carrefour/" },
  { screen: "clinic-services", title: "What we treat and test", kind: "Clinic preview, services", href: "demos/clinique-carrefour/" },
  { screen: "thread-waterline", title: "The Thread", kind: "Spectre Studio, 3D scroll story", href: "thread/" },
];

export const aboutCard = {
  title: ["An engineer's rigour.", "A designer's eye.", "A ", "Kigali", " address."],
  text: "Spectre Studio is an independent web developer in Gikondo, Kigali. Clients deal with the person who writes the code, from the first message to the last fix.",
  // a live readout of this page, not a costume: values marked live are measured in the browser
  file: "this-page.json · live",
  json: [
    ["studio", '"Spectre Studio, Gikondo, Kigali"'],
    ["wordmark", '"4,800 points, one draw call"'],
    ["framesPerSecond", '<span data-live="fps">60</span>'],
    ["kigaliTime", '"<span data-live="time">--:--</span>"'],
    ["firstDemo", '"within 48 hours"'],
    ["builtBy", '"hand, not a template"'],
  ],
};

export const principles = [
  { title: "Plan it properly", text: "What the page must do, who uses it and on which phone, written down before any code." },
  { title: "Build it by hand", text: "No page builders. Clean code that is fast, accessible and easy to change later." },
  { title: "Ship and stay", text: "Live on your domain, set up on Google, and looked after on the care plan." },
];

export const ticker = ["Websites", "Web apps", "Dashboards", "Online bookings", "3D pages", "Google setup", "WhatsApp first", "Kigali"];

// The second marquee row, set in italic and running the other way: promises the site already makes.
export const tickerPromises = ["Free demo before you pay", "Designed on a phone first", "Found on Google", "Built by hand", "Your domain, your files", "Looked after on the care plan"];

export const footerCols = [
  { title: "Pages", links: [["./", "Home"], ["work.html", "Work"], ["services.html", "Services"], ["about.html", "About"]] },
  { title: "Start", links: [["services.html#how", "How it works"], ["services.html#faq", "Questions"], ["work.html", "AuditPro case study"]] },
];
