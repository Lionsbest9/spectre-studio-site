import "./style.css";
import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
import { heroChapters, statement, gallery, aboutCard, principles, capabilities, faq, ticker } from "./content.js";
import { readyReveal, revealOnEnter, headerAutoHide, kigaliClock, pointerGlow, anchorScroll } from "./polish.js";

readyReveal();
import { mountChrome, waLink, WA_ICON, imgSrc, tilt } from "./ui.js";
import { scroll, startScrollTracking } from "./stage/scroll.js";

mountChrome("index.html");
const $ = (id) => document.getElementById(id);
// title arrays alternate plain / italic: ["Clear by ", "design", "."] -> Clear by <em>design</em>.
const rich = (parts) => parts.map((t, i) => (i % 2 ? `<em>${t}</em>` : t)).join("");

// ----- hero chapters -----
$("chapters").innerHTML = heroChapters
  .map((c, i) => {
    const Tag = i === 0 ? "h1" : "h2";
    const actions =
      i === 0
        ? `<div class="actions"><a class="btn btn-wa btn-lg" href="${waLink()}" target="_blank" rel="noopener">${WA_ICON}Message on WhatsApp</a><a class="btn btn-ghost on-dark btn-lg" href="#work">See the work</a></div>`
        : "";
    return `<article class="chap${i === 0 ? " is-on" : ""}" data-i="${i}" aria-hidden="${i === 0 ? "false" : "true"}">
      <p class="kicker">${c.kicker}</p>
      <${Tag} class="display chap-title">${rich(c.title)}</${Tag}>
      <p class="lede">${c.text}</p>${actions}
    </article>`;
  })
  .join("");
$("ticks").innerHTML = heroChapters.map((_, i) => `<i data-t="${i}"${i === 0 ? ' class="is-on"' : ""}></i>`).join("");
$("intro").style.setProperty("--chapters", heroChapters.length);

// ----- ticker -----
const tickerItems = ticker.map((t) => `<span>${t}</span><i></i>`).join("");
$("ticker").innerHTML = tickerItems + tickerItems;

// ----- statement -----
$("statement-text").innerHTML = rich(statement.lead);
$("statement-sub").textContent = statement.text;

// ----- work gallery -----
$("work-track").innerHTML =
  gallery
    .map(
      (g, i) => `
      <a class="work-card" href="${g.href}">
        <figure><img src="${imgSrc(g.screen)}" alt="${g.title} screen" width="1280" height="800" loading="${i < 2 ? "eager" : "lazy"}"></figure>
        <div class="work-cap"><span class="num">${String(i + 1).padStart(2, "0")}</span><strong>${g.title}</strong><span>${g.kind}</span></div>
      </a>`
    )
    .join("") +
  `<div class="work-card work-next">
     <div class="next-inner">
       <p class="kicker">${String(gallery.length + 1).padStart(2, "0")}</p>
       <h3 class="display">Your project, <em>next.</em></h3>
       <p>Send one message. A demo link arrives within 48 hours.</p>
       <a class="btn btn-wa" href="${waLink()}" target="_blank" rel="noopener">${WA_ICON}Start on WhatsApp</a>
     </div>
   </div>`;

// ----- about: code card + copy -----
const jsonLines = aboutCard.json
  .map(([k, v], i, arr) => `<span class="ln">${i + 2}</span>  <span class="k">"${k}"</span>: <span class="v">${v}</span>${i < arr.length - 1 ? "," : ""}`)
  .join("\n");
$("code-card").innerHTML = `
  <figure>
    <div class="cc-bar"><i></i><i></i><i></i><span>${aboutCard.file}</span></div>
    <pre><code><span class="ln">1</span>{\n${jsonLines}\n<span class="ln">${aboutCard.json.length + 2}</span>}</code></pre>
  </figure>`;
$("about-heading").innerHTML = aboutCard.title.slice(0, 2).map((t) => `<span>${t}</span>`).join("") + `<span>${rich(aboutCard.title.slice(2))}</span>`;
$("about-text").textContent = aboutCard.text;
const PICONS = [
  '<path d="M4 6h16M4 12h10M4 18h7"/><circle cx="18" cy="16" r="3"/>',
  '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
  '<path d="M12 3c4 2.5 6 6 6 10l-3 3H9l-3-3c0-4 2-7.5 6-10z"/><circle cx="12" cy="10" r="1.6"/><path d="M9.5 19.5 12 22l2.5-2.5"/>',
];
$("principles").innerHTML = principles
  .map(
    (p, i) => `<li><span class="p-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PICONS[i]}</svg></span><h3>${p.title}</h3><p>${p.text}</p></li>`
  )
  .join("");
tilt(document.querySelector(".about-grid"), ".tile");

// ----- capabilities -----
const ICONS = {
  site: '<path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5z"/><path d="M3 8.5h18M6.5 5.8h.01M9 5.8h.01"/>',
  app: '<rect x="3" y="3" width="7.5" height="7.5" rx="1.8"/><rect x="13.5" y="3" width="7.5" height="11" rx="1.8"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.8"/><rect x="13.5" y="17" width="7.5" height="4" rx="1.8"/>',
  cart: '<path d="M3 4h2.2l2.3 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.3"/><circle cx="10" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/>',
  cube: '<path d="m12 2.8 8.5 4.6v9.2L12 21.2l-8.5-4.6V7.4z"/><path d="m3.6 7.4 8.4 4.6 8.4-4.6M12 12v9.2"/>',
};
$("capabilities").innerHTML = capabilities
  .map(
    (c) => `<a class="cap" href="services.html"><span class="cap-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[c.icon]}</svg></span><h3>${c.title}</h3><p>${c.text}</p></a>`
  )
  .join("");

// ----- faq -----
$("faq-list").innerHTML = faq.map((f) => `<li><details><summary>${f.q}</summary><p>${f.a}</p></details></li>`).join("");

// ----- finale -----
const fin = $("finale-wa");
fin.href = waLink();
fin.innerHTML = `${WA_ICON}Message on WhatsApp`;

// ----- scroll-driven page state -----
const chaps = [...document.querySelectorAll(".chap")];
const ticks = [...document.querySelectorAll("#ticks i")];
const bar = $("progress-bar");
const counter = $("counter");
const header = $("site-header");
const work = $("work");
const track = $("work-track");
const darkLayer = document.querySelector(".bd-dark");
const workIndex = $("work-index");
const hud = document.querySelector(".intro-hud");
let current = 0;

function sizeGallery() {
  const pinned = matchMedia("(min-width: 861px)").matches;
  work.classList.toggle("is-pinned", pinned);
  if (!pinned) {
    work.style.height = "";
    track.style.transform = "";
    return;
  }
  const extra = Math.max(0, track.scrollWidth - innerWidth + 48);
  work.style.setProperty("--extra", `${extra}px`);
  work.style.height = `calc(100svh + ${extra}px)`;
}

function render(s) {
  const c = Math.min(chaps.length - 1, Math.round(s.chapter));
  if (c !== current) {
    chaps[current].classList.remove("is-on");
    chaps[current].setAttribute("aria-hidden", "true");
    chaps[c].classList.add("is-on");
    chaps[c].setAttribute("aria-hidden", "false");
    ticks.forEach((t, i) => t.classList.toggle("is-on", i <= c));
    counter.textContent = `${String(c + 1).padStart(2, "0")} / ${String(chaps.length).padStart(2, "0")}`;
    current = c;
  }
  bar.style.transform = `scaleX(${s.pageP})`;
  darkLayer.style.opacity = s.dark;
  document.body.classList.toggle("is-light", s.dark < 0.5);
  header.classList.toggle("on-dark", s.dark >= 0.5);
  if (work.classList.contains("is-pinned")) {
    const extra = parseFloat(work.style.getPropertyValue("--extra")) || 0;
    track.style.transform = `translate3d(${-s.galleryP * extra}px, 0, 0)`;
    const cards = track.children.length;
    const idx = Math.min(cards, Math.floor(s.galleryP * cards) + 1);
    workIndex.textContent = `${String(idx).padStart(2, "0")} / ${String(cards).padStart(2, "0")}`;
  }
  hud.style.opacity = s.dark;
}

sizeGallery();
addEventListener("resize", sizeGallery);
addEventListener("load", sizeGallery);
startScrollTracking({ heroId: "intro", galleryId: "work", chapters: heroChapters.length, onChange: render });
render(scroll);

revealOnEnter();
headerAutoHide(header);
kigaliClock($("local-time"));
pointerGlow();
anchorScroll();

$("replay").addEventListener("click", () => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  chaps[0].classList.remove("is-on");
  requestAnimationFrame(() => requestAnimationFrame(() => chaps[0].classList.add("is-on")));
});

// ----- the 3D scene, loaded after the copy is on screen -----
const Spectrum = lazy(() => import("./stage/Spectrum.jsx"));
createRoot($("spectrum")).render(
  <Suspense fallback={null}>
    <Spectrum />
  </Suspense>
);
