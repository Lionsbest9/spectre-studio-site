import "./style.css";
import { heroChapters, statement, gallery, aboutCard, principles, capabilities, faq, ticker, tickerPromises } from "./content.js";
import { readyReveal, revealOnEnter, headerAutoHide, kigaliClock, pointerGlow, anchorScroll, marquee, scrollRail } from "./polish.js";

readyReveal();
import { mountChrome, waLink, WA_ICON, imgSrc, tilt } from "./ui.js";
import { scroll, startScrollTracking } from "./stage/scroll.js";
import { webglAvailable } from "./stage/gl.js";

mountChrome("index.html");
const $ = (id) => document.getElementById(id);
// title arrays alternate plain / italic: ["Clear by ", "design", "."] -> Clear by <em>design</em>.
const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-5-6 6 6-6 6"/></svg>';
const rich = (parts) => parts.map((t, i) => (i % 2 ? `<em>${t}</em>` : t)).join("");

// ----- hero chapters -----
$("chapters").innerHTML = heroChapters
  .map((c, i) => {
    const Tag = i === 0 ? "h1" : "h2";
    const actions =
      i === 0
        ? `<div class="actions"><a class="btn btn-wa btn-lg" href="${waLink()}" target="_blank" rel="noopener">${WA_ICON}Message on WhatsApp</a><a class="text-link on-dark" href="#work">See the work${ARROW}</a></div>`
        : "";
    // the opening chapter splits like a title card: headline left, promise and buttons right
    const body = `<p class="lede">${c.text}</p>${actions}`;
    return `<article class="chap${i === 0 ? " is-on chap-open" : ""}" data-i="${i}" aria-hidden="${i === 0 ? "false" : "true"}">
      <p class="kicker">${c.kicker}</p>
      <${Tag} class="display chap-title">${rich(c.title)}</${Tag}>
      ${i === 0 ? `<div class="chap-side">${body}</div>` : body}
    </article>`;
  })
  .join("");
$("ticks").innerHTML = heroChapters.map((_, i) => `<i data-t="${i}"${i === 0 ? ' class="is-on"' : ""}></i>`).join("");
$("intro").style.setProperty("--chapters", heroChapters.length);

// ----- marquee: two rows, two voices, opposite directions -----
const row = (items) => items.map((t) => `<span>${t}</span><i></i>`).join("");
$("mq-a").innerHTML = row(ticker).repeat(3);
$("mq-b").innerHTML = row(tickerPromises).repeat(3);

// ----- statement -----
$("statement-text").innerHTML = rich(statement.lead);
$("statement-sub").textContent = statement.text;

// ----- work gallery -----
$("work-track").innerHTML =
  gallery
    .map(
      (g, i) => `
      <a class="work-card" href="${g.href}">
        <figure><img src="${imgSrc(g.screen)}" srcset="${imgSrc(g.screen, true)} 640w, ${imgSrc(g.screen)} 1280w" sizes="(max-width: 860px) 88vw, 820px" alt="${g.title} screen" width="1280" height="800" loading="lazy" decoding="async"></figure>
        <div class="work-cap"><span class="n">${String(i + 1).padStart(2, "0")}</span><strong>${g.title}</strong><span>${g.kind}</span></div>
      </a>`
    )
    .join("") +
  `<div class="work-card work-next">
     <div class="next-inner">
       <p class="n">${String(gallery.length + 1).padStart(2, "0")}</p>
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
$("principles").innerHTML = principles
  .map((p, i) => `<li style="--i:${i}"><span class="n" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span><h3>${p.title}</h3><p>${p.text}</p></li>`)
  .join("");
tilt(document.querySelector(".about-grid"), ".tile");

// ----- capabilities: numbered rows, outlined tags, a drawn rule between them -----
$("capabilities").innerHTML = capabilities
  .map(
    (c, i) => `<li style="--i:${i}"><a class="svc-row" href="services.html">
      <span class="n" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
      <h3>${c.title}</h3>
      <div class="svc-body"><p>${c.text}</p><ul class="tags" aria-label="Includes">${c.tags.map((t, k) => `<li${k === 0 ? ' class="is-key"' : ""}>${t}</li>`).join("")}</ul></div>
      <span class="svc-go" aria-hidden="true">${ARROW}</span>
    </a></li>`
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
const counter = $("counter");
const header = $("site-header");
const work = $("work");
const track = $("work-track");
const darkLayer = document.querySelector(".bd-dark");
const workIndex = $("work-index");
const hud = document.querySelector(".intro-hud");
let current = 0;
const spectrumStyle = $("spectrum").style;
const rail = scrollRail($("rail-ticks"), $("rail-dot"), ["#intro", ".statement", "#work", "#about", "#build", "#faq", ".finale"]);

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
    counter.innerHTML = `<b>${String(c + 1).padStart(2, "0")}</b> / ${String(chaps.length).padStart(2, "0")}`;
    current = c;
  }
  rail.set(s.pageP);
  darkLayer.style.opacity = s.dark;
  spectrumStyle.setProperty("--hero-open", (s.dark * (1 - Math.min(1, s.chapter))).toFixed(3));
  document.body.classList.toggle("is-light", s.dark < 0.5);
  header.classList.toggle("on-dark", s.dark >= 0.5);
  if (work.classList.contains("is-pinned")) {
    const extra = parseFloat(work.style.getPropertyValue("--extra")) || 0;
    track.style.transform = `translate3d(${-s.galleryP * extra}px, 0, 0)`;
    const cards = track.children.length;
    const idx = Math.min(cards, Math.floor(s.galleryP * cards) + 1);
    workIndex.innerHTML = `<b>${String(idx).padStart(2, "0")}</b> / ${String(cards).padStart(2, "0")}`;
  }
  hud.style.opacity = s.dark;
}

const relayout = () => {
  sizeGallery();
  rail.layout();
};
relayout();
addEventListener("resize", relayout);
addEventListener("load", relayout);
startScrollTracking({ heroId: "intro", galleryId: "work", chapters: heroChapters.length, onChange: render });
render(scroll);

revealOnEnter();
// the page ends on ink: the rail and replay button switch to their dark-ground colours there
{
  const inked = new Set();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => (e.isIntersecting ? inked.add(e.target) : inked.delete(e.target)));
      document.body.classList.toggle("at-ink", inked.size > 0);
    },
    { rootMargin: "0px 0px -60% 0px" }
  );
  [document.querySelector(".finale"), document.getElementById("site-footer")].forEach((el) => el && io.observe(el));
}
marquee($("mq-a"), -1);
marquee($("mq-b"), 1);
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

// ----- the 3D scene, loaded after the copy is on screen, and only where a GPU will draw it -----
if (webglAvailable()) import("./stage/mount.jsx").then((m) => m.mount($("spectrum")));
else $("spectrum").innerHTML = '<div class="spectrum-still"><span>Spectre</span></div>';
