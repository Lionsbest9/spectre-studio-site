// Everything a visitor reads lives here. Edit, run `npm run build`, push.
// Prices are in Rwandan francs. `whatsapp` is your number in international format
// without "+", spaces or the leading 0 (example: 250781234567).

export const studio = {
  name: "Spectre Studio",
  tagline: "Websites for Kigali businesses, built in days.",
  city: "Gikondo, Kigali",
  owner: "", // your name, shown in the footer and on About when set
  whatsapp: "250700000000", // <-- replace with your number
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
    screen: "auditpro-modules",
    title: "Report to the committee",
    text: "Thirteen connected modules end in committee-ready reports, with every change kept in the audit trail.",
  },
];

export const capabilities = [
  { title: "Business websites", text: "One page or five, with your photos, prices, map and a WhatsApp button. Found on Google.", icon: "site" },
  { title: "Web apps and dashboards", text: "Logins, roles, approvals, reports and data your team works in every day.", icon: "app" },
  { title: "Bookings and online orders", text: "Customers book a room, a table or a visit, or order and pay, without calling.", icon: "cart" },
  { title: "3D and interactive pages", text: "Product showcases and launch pages that people stop to play with.", icon: "cube" },
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
    { file: "auditpro-dashboard", alt: "AuditPro landing page with the dashboard preview" },
    { file: "auditpro-features", alt: "AuditPro findings and analytics features" },
    { file: "auditpro-modules", alt: "AuditPro's 13 modules grouped by planning, execution, reporting and governance" },
    { file: "auditpro-workflow", alt: "AuditPro three-step workflow from plan to report" },
    { file: "auditpro-login", alt: "AuditPro secure sign-in screen" },
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
    title: ["Websites that work. With a little ", "magic", "."],
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
  { screen: "auditpro-dashboard", title: "AuditPro", kind: "Platform, landing and dashboard", href: "work.html" },
  { screen: "auditpro-features", title: "Findings and risk", kind: "AuditPro, product screens", href: "work.html" },
  { screen: "auditpro-modules", title: "Thirteen modules", kind: "AuditPro, information design", href: "work.html" },
  { screen: "auditpro-workflow", title: "Plan to report", kind: "AuditPro, workflow", href: "work.html" },
  { screen: "auditpro-login", title: "Secure sign-in", kind: "AuditPro, accounts and approvals", href: "work.html" },
];

export const aboutCard = {
  title: ["An engineer's rigour.", "A designer's eye.", "A ", "Kigali", " address."],
  text: "Spectre Studio is an independent web developer in Gikondo, Kigali. Clients deal with the person who writes the code, from the first message to the last fix.",
  file: "about.json",
  json: [
    ["studio", '"Spectre Studio"'],
    ["based", '"Gikondo, Kigali"'],
    ["builds", '["websites", "web apps", "dashboards", "3D pages"]'],
    ["stack", '["React", "Next.js", "Three.js", "Supabase"]'],
    ["firstDemo", '"within 48 hours"'],
    ["available", "true"],
  ],
};

export const principles = [
  { title: "Plan it properly", text: "What the page must do, who uses it and on which phone, written down before any code." },
  { title: "Build it by hand", text: "No page builders. Clean code that is fast, accessible and easy to change later." },
  { title: "Ship and stay", text: "Live on your domain, set up on Google, and looked after on the care plan." },
];
