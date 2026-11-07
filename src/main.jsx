import "./style.css";
import { createRoot } from "react-dom/client";
import { Suspense, lazy } from "react";
import { hero, facts, featured, chapters, capabilities } from "./content.js";
import { mountChrome, waLink, WA_ICON, imgSrc } from "./ui.js";

mountChrome("index.html");

// ----- hero copy -----
document.getElementById("hero-title").textContent = hero.headline;
document.getElementById("hero-lead").textContent = hero.lead;
const primary = document.getElementById("hero-primary");
primary.href = waLink();
primary.innerHTML = `${WA_ICON}${hero.primary}`;
document.getElementById("hero-secondary").textContent = hero.secondary;
document.getElementById("facts").innerHTML = facts.map((f) => `<li><b>${f.big}</b><span>${f.small}</span></li>`).join("");

// ----- case study chapters -----
document.getElementById("chapters").innerHTML = chapters
  .map((c, i) => `<li data-chapter="${i}" data-n="${i + 1}"${i === 0 ? ' class="is-current"' : ""}><h3>${c.title}</h3><p>${c.text}</p></li>`)
  .join("");
document.getElementById("dots").innerHTML = chapters.map((_, i) => `<span data-dot="${i}"${i === 0 ? ' class="is-current"' : ""}></span>`).join("");
document.getElementById("live-link").href = featured.link;

// ----- capabilities -----
const ICONS = {
  site: '<path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5z"/><path d="M3 8.5h18M6.5 5.8h.01M9 5.8h.01"/>',
  app: '<rect x="3" y="3" width="7.5" height="7.5" rx="1.8"/><rect x="13.5" y="3" width="7.5" height="11" rx="1.8"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.8"/><rect x="13.5" y="17" width="7.5" height="4" rx="1.8"/>',
  cart: '<path d="M3 4h2.2l2.3 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.3"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/>',
  cube: '<path d="m12 2.8 8.5 4.6v9.2L12 21.2l-8.5-4.6V7.4z"/><path d="m3.6 7.4 8.4 4.6 8.4-4.6M12 12v9.2"/>',
};
document.getElementById("capabilities").innerHTML = capabilities
  .map(
    (c) => `
    <a class="cap" href="services.html">
      <span class="cap-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[c.icon]}</svg></span>
      <h3>${c.title}</h3>
      <p>${c.text}</p>
    </a>`
  )
  .join("");

// ----- closing -----
const closing = document.getElementById("closing-wa");
closing.href = waLink();
closing.innerHTML = `${WA_ICON}Message on WhatsApp`;

// ----- 3D scenes, loaded after the copy is on screen -----
const HeroDevices = lazy(() => import("./stage/HeroDevices.jsx"));
const CaseScene = lazy(() => import("./stage/CaseScene.jsx"));
const heroScreens = ["auditpro-dashboard", "auditpro-features", "auditpro-modules", "auditpro-workflow", "auditpro-login"].map((s) => imgSrc(s));

createRoot(document.getElementById("hero-stage")).render(
  <Suspense fallback={<div className="devices devices-loading" aria-hidden="true" />}>
    <HeroDevices screens={heroScreens} phone={imgSrc("auditpro-phone")} caption={hero.stageCaption} still={heroScreens[0]} />
  </Suspense>
);

createRoot(document.getElementById("case-stage-root")).render(
  <Suspense fallback={<div className="case-canvas" aria-hidden="true" />}>
    <CaseScene
      sectionId="work"
      screens={chapters.map((c) => imgSrc(c.screen))}
      still={chapters.map((c) => imgSrc(c.screen))}
      chapters={chapters}
      caption="AuditPro on a laptop that turns as you scroll through planning, fieldwork and reporting."
    />
  </Suspense>
);
