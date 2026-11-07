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
  headline: "Your business, online within a week.",
  lead: "Websites for shops, clinics, guest houses, schools and companies in Kigali. Built fast, found on Google, one tap to your WhatsApp.",
  primary: "Message on WhatsApp",
  secondary: "See the work",
  stageCaption: "Screens from AuditPro, an audit management platform built by Spectre Studio. Drag a screen to move it, tap one to bring it forward.",
};

export const facts = [
  { big: "150,000 RWF", small: "starter sites from" },
  { big: "5 days", small: "to your first page live" },
  { big: "Free demo", small: "see it before you pay" },
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

// Screens shown in the floating stack on the home page, front first.
export const stageScreens = ["auditpro-dashboard", "auditpro-features", "auditpro-modules", "auditpro-login"];

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
