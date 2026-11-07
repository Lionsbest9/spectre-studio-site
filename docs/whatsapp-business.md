# WhatsApp Business setup for Spectre Studio

Everything to paste into the WhatsApp Business app so the profile matches the portfolio.
Takes about 20 minutes. Do it on the phone that will carry the business number.

## Before you start

- Use a number you can keep for years. Clients save it. A second SIM dedicated to the studio is
  ideal; your personal number can stay on normal WhatsApp.
- The business name cannot be changed after it is verified, so type it exactly: `Spectre Studio`.
- Put the same number in `src/content.js` (`studio.whatsapp`) so every button on the site opens
  this chat. Format: `2507XXXXXXXX`, no plus sign, no spaces.

## 1. Install and register

1. Install **WhatsApp Business** from the Play Store (a separate app, free).
2. Register with the business number and verify it by SMS.
3. If the number already used normal WhatsApp, choose to move the chats over or start clean.

## 2. Business profile

Settings → Business tools → Business profile.

| Field | Enter |
|---|---|
| Name | Spectre Studio |
| Category | Web Designer (if missing, "Information Technology Company") |
| Description (max 256) | Websites for Kigali businesses, built in days. Starter sites from 150,000 RWF. Free demo before you pay. Found on Google, one tap to your WhatsApp. |
| Address | Gikondo, Kicukiro, Kigali |
| Hours | Mon–Sat 09:00–19:00 (set what you can keep) |
| Email | your studio email, if you have one |
| Website | the site URL (see the README for the Pages link) |
| Profile photo | the studio mark: a square version of `public/favicon.svg`, exported at 640×640 |

## 3. Catalog

Settings → Business tools → Catalog → Add item. One item per plan, same prices as the site.

**Starter page – RWF 150,000**
One page with your photos, services and prices. WhatsApp button, map and opening hours.
Listed on Google Search and Maps. Live in 5 days. Half on approval of the free demo, half when live.

**Business site – RWF 350,000**
Up to 5 pages: services, gallery, team, prices, contact. Contact form and Google Business profile.
Your own domain name (.rw or .com). Live in 2 weeks.

**Custom build – from RWF 700,000**
Bookings, online ordering, member areas, internal tools. Logins, roles, dashboards and reports.
Admin area so you manage it yourself. Timeline agreed before we start.

**Care plan – RWF 25,000 / month**
Hosting, backups, security updates and small text or photo changes whenever you need them.
Domain renewals billed at cost.

Use a screenshot from `public/work/` as each item's photo (the AuditPro dashboard reads well).
Link the catalog in the profile so it shows at the top of every chat.

## 4. Greeting message

Settings → Business tools → Greeting message → On. Send to everyone not in the address book.

> Hello, this is Spectre Studio. Thanks for writing. Tell me the name of your business and what it
> does, and I will reply with a free demo plan within 48 hours. Portfolio and prices: [site URL]

## 5. Away message

Settings → Business tools → Away message → Outside business hours.

> Thanks for your message. Spectre Studio replies Mon–Sat, 09:00–19:00. In the meantime you can see
> the work and prices here: [site URL]

## 6. Quick replies

Settings → Business tools → Quick replies. Type the shortcut, then `/` in any chat to use it.

| Shortcut | Message |
|---|---|
| `/prices` | Three options: Starter page 150,000 RWF (one page, live in 5 days), Business site 350,000 RWF (up to 5 pages, your own domain, 2 weeks), Custom build from 700,000 RWF. Care plan 25,000 RWF a month for hosting and updates. Half on approval of the demo, half when live. Full details: [site URL]/services.html |
| `/demo` | Free demo: send me your business name, what you sell, your opening hours, your location and 5 to 10 photos. Within 48 hours you get a link to a first version. Nothing to pay until you approve it. |
| `/work` | Here is a system I built for professional audit teams, 13 modules, 9 user roles: [site URL]/work.html. Live product: https://audit-pro-delta.vercel.app |
| `/next` | Next steps: 1) you approve the demo and pay half, 2) I finish and connect your domain, 3) you check it on your phone and pay the rest. |
| `/pay` | Payment by MoMo or bank transfer. Half when you approve the demo, the rest when the site is live. I send a receipt for each payment. |
| `/domain` | A .rw domain costs about 15,000 to 20,000 RWF a year and a .com about 20,000 RWF a year, registered in your name. I handle the setup. |

## 7. Labels

Create these labels and tag every chat: `New lead`, `Demo sent`, `Replied`, `Won`, `Lost`, `Care plan`.
Same words as the Status column in the lead-finder spreadsheet, so both stay in step.

## 8. Link everywhere

- Your short link: Settings → Business tools → Short link. Use it on Instagram, flyers and the
  Google Business profile.
- The site's buttons already open this chat with a pre-written first message, so you see at once
  that a lead came from the portfolio.
