import "./style.css";
import { createRoot } from "react-dom/client";
import { Suspense, lazy } from "react";
import { studio, hero, facts, plans, care, steps, featured, stageScreens } from "./content.js";
import { mountChrome, waLink, WA_ICON, tilt, imgSrc } from "./ui.js";

mountChrome("index.html");

// ----- hero copy -----
document.getElementById("hero-title").textContent = hero.headline;
document.getElementById("hero-lead").textContent = hero.lead;
const primary = document.getElementById("hero-primary");
primary.href = waLink();
primary.innerHTML = `${WA_ICON}${hero.primary}`;
document.getElementById("hero-secondary").textContent = hero.secondary;
document.getElementById("facts").innerHTML = facts.map((f) => `<li><b>${f.big}</b><span>${f.small}</span></li>`).join("");

// ----- featured work -----
const fw = document.getElementById("featured");
fw.innerHTML = `
  <a class="feature-shot tile" href="work.html">
    <figure><img src="${imgSrc(featured.screens[0].file)}" srcset="${imgSrc(featured.screens[0].file, true)} 640w, ${imgSrc(featured.screens[0].file)} 1280w" sizes="(max-width: 860px) 92vw, 640px" alt="${featured.screens[0].alt}" width="1280" height="800" loading="lazy"></figure>
  </a>
  <div class="feature-copy">
    <p class="kind">${featured.kind}</p>
    <h3>${featured.title}</h3>
    <p class="summary">${featured.summary}</p>
    <ul class="numbers">${featured.numbers.map((n) => `<li><b>${n.big}</b><span>${n.small}</span></li>`).join("")}</ul>
    <div class="actions">
      <a class="btn btn-ghost" href="work.html">Read the case study</a>
      <a class="link" href="${featured.link}" target="_blank" rel="noopener">Open the live product</a>
    </div>
  </div>`;
tilt(fw, ".tile");

// ----- price sheet -----
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

// ----- steps -----
document.getElementById("steps").innerHTML = steps.map((s) => `<li><h3>${s.title}</h3><p>${s.text}</p></li>`).join("");

// ----- closing -----
const closing = document.getElementById("closing-wa");
closing.href = waLink();
closing.innerHTML = `${WA_ICON}Message on WhatsApp`;

// ----- 3D stage, loaded after the copy is on screen -----
const Stage = lazy(() => import("./stage/Stage.jsx"));
const mount = document.getElementById("stage-root");
createRoot(mount).render(
  <Suspense fallback={<div className="stage stage-loading" aria-hidden="true" />}>
    <Stage urls={stageScreens.map((s) => imgSrc(s))} caption={hero.stageCaption} still={imgSrc(stageScreens[0])} />
  </Suspense>
);
