# Spectre Studio portfolio

The site you show a business owner on their phone. Four pages: home (with the 3D screen stack),
work (AuditPro case study), services and prices, about. Static, no backend, hosted on GitHub Pages.

## Edit the content

Everything a visitor reads is in one file: [`src/content.js`](src/content.js).

- `studio.whatsapp` – your number in international format, no `+`, no spaces, no leading 0.
- `studio.name`, `studio.owner`, `studio.city`, `studio.email`, `studio.instagram`.
- `hero`, `facts` – the first screen.
- `plans`, `care` – the price sheet. Shown on home and on the services page.
- `featured` – the AuditPro case study: summary, numbers, modules, screens, stack.
- `stageScreens` – which screenshots float in the 3D stack, front first.
- `about`, `faq`.

Screenshots live in `public/work/`. Add a `name.jpg` at 1280×800 (and `name-sm.jpg` at 640×400 for
the small cards), then reference `name` in `content.js`.

Push to `main` and the GitHub Pages workflow rebuilds the site in about a minute.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/
npm run preview    # serve dist/ on http://localhost:4173
```

## How the 3D stage works

`src/stage/Stage.jsx` is a small React Three Fiber island mounted into the home page only.
Four screenshots are textured planes in a fanned stack with a dark bezel and a soft shadow each.
The group tilts toward the pointer, a screen can be dragged 1:1 and springs home carrying the
release velocity, and a tap brings a screen to the front. The pixel ratio is capped at 1.5 and drops
to 1 when frames get slow; the loop stops when the stage is off screen or the tab is hidden; with
`prefers-reduced-motion` it renders on demand with no parallax or float.

Budget: about 13 draw calls, no shadow maps, no post-processing.

## Deploy somewhere else

The build is plain static files in `dist/`. Set `BASE_PATH` when the site is not served from the
domain root (the Pages workflow sets it to `/<repo>/`). With a custom domain, leave it unset.
