import "./style.css";
import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
import { plans, care, faq, featured, about, studio, steps } from "./content.js";
import { mountChrome, waLink, WA_ICON, imgSrc, tilt } from "./ui.js";
import { readyReveal, revealOnEnter, headerAutoHide, countUp, kigaliClock, pointerGlow, anchorScroll } from "./polish.js";

readyReveal();

const page = document.body.dataset.page;
mountChrome(`${page}.html`);

for (const b of document.querySelectorAll("[data-wa]")) {
  b.href = waLink();
  b.innerHTML = `${WA_ICON}${b.dataset.wa}`;
}

if (page === "work") {
  const f = featured;
  document.getElementById("case-kind").textContent = f.kind;
  document.getElementById("case-title").textContent = f.title;
  document.getElementById("case-summary").textContent = f.summary;
  document.getElementById("case-client").textContent = f.client;
  document.getElementById("case-link").href = f.link;
  document.getElementById("case-numbers").innerHTML = f.numbers.map((n) => /^\d+$/.test(n.big) ? `<li><b data-count="${n.big}">0</b><span>${n.small}</span></li>` : `<li><b>${n.big}</b><span>${n.small}</span></li>`).join("");
  const HeroDevices = lazy(() => import("./stage/HeroDevices.jsx"));
  const screens = f.screens.map((sc) => imgSrc(sc.file));
  createRoot(document.getElementById("case-stage")).render(
    <Suspense fallback={<div className="devices devices-loading" aria-hidden="true" />}>
      <HeroDevices
        screens={screens}
        phone={imgSrc(f.phone.file)}
        still={screens[0]}
        caption="A 3D laptop and phone showing AuditPro. Drag to turn them; tap the laptop screen for the next screen."
      />
    </Suspense>
  );
  document.getElementById("case-modules").innerHTML = f.modules
    .map((m) => `<div class="module"><h3>${m.group}</h3><ul>${m.items.map((i) => `<li>${i}</li>`).join("")}</ul></div>`)
    .join("");
  const gallery = document.getElementById("case-gallery");
  gallery.innerHTML =
    f.screens
      .slice(1)
      .map((s) => `<div class="tile shot"><figure><img src="${imgSrc(s.file)}" alt="${s.alt}" width="1280" height="800" loading="lazy"></figure></div>`)
      .join("") + `<div class="tile shot phone"><figure><img src="${imgSrc(f.phone.file)}" alt="${f.phone.alt}" width="640" height="1386" loading="lazy"></figure></div>`;
  tilt(gallery, ".tile");
  document.getElementById("case-stack").innerHTML = f.stack.map((t) => `<li>${t}</li>`).join("");
}

if (page === "services") {
  document.getElementById("plans").innerHTML =
    plans
      .map(
        (p) => `
        <article class="plan${p.featured ? " featured" : ""}">
          <header><h3>${p.name}</h3><div class="price">${p.price}</div></header>
          <p class="for">${p.for}</p>
          <ul>${p.includes.map((i) => `<li>${i}</li>`).join("")}</ul>
          <a class="btn ${p.featured ? "btn-wa" : "btn-ghost"}" href="${waLink(`Hello Spectre Studio, I am interested in the ${p.name} (${p.price}).`)}" target="_blank" rel="noopener">${p.featured ? WA_ICON : ""}Ask about this</a>
        </article>`
      )
      .join("") + `<div class="care"><div><h3>${care.name}</h3><p>${care.text}</p></div><div class="price">${care.price}</div></div>`;
  document.getElementById("steps").innerHTML = steps.map((st) => `<li><h3>${st.title}</h3><p>${st.text}</p></li>`).join("");
  document.getElementById("faq").innerHTML = faq.map((f) => `<li><details><summary>${f.q}</summary><p>${f.a}</p></details></li>`).join("");
}

if (page === "about") {
  document.getElementById("about-title").textContent = about.title;
  document.getElementById("about-prose").innerHTML = about.paragraphs.map((p) => `<p>${p}</p>`).join("");
  document.getElementById("tools").innerHTML = about.tools.map((t) => `<li>${t}</li>`).join("");
  document.getElementById("about-who").textContent = studio.owner ? `${studio.owner}, ${studio.city}` : studio.city;
}

revealOnEnter();
countUp();
headerAutoHide(document.getElementById("site-header"));
kigaliClock(document.getElementById("local-time"));
pointerGlow();
anchorScroll();
