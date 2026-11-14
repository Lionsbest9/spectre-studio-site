const $ = (s) => document.querySelector(s);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const EMAIL = "vhabimana2@yahoo.fr";
let lang = "en";

// ---- language: English and French ----------------------------------------------------------
const tr = [...document.querySelectorAll("[data-fr]")].map((el) => ({ el, en: el.innerHTML, fr: el.dataset.fr }));
function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  for (const t of tr) t.el.innerHTML = l === "fr" ? t.fr : t.en;
  document.querySelectorAll(".lang button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === l)));
  try { localStorage.setItem("secaf-lang", l); } catch {}
  renderNeeds(); render();
}
document.querySelectorAll(".lang button").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));

// ---- hero: the five letters unfold into the five trades -------------------------------------
const word = $("#word");
setTimeout(() => word.classList.add("open"), reduced ? 0 : 1100);

// ---- 06 the message writer -----------------------------------------------------------------
const NEEDS = {
  tender: { en: "Invitation to tender for an audit", fr: "Invitation à soumissionner pour un audit" },
  audit: { en: "Audit quote", fr: "Devis d'audit" },
  accounting: { en: "Accounting help", fr: "Aide comptable" },
  tax: { en: "Tax assistance", fr: "Assistance fiscale" },
  other: { en: "Another question", fr: "Autre question" },
};
const state = { need: "tender", org: "", due: "", who: "" };
function renderNeeds() {
  $("#need").innerHTML = Object.entries(NEEDS).map(([id, n]) => `<label class="chip"><input type="radio" name="need" value="${id}"${id === state.need ? " checked" : ""} /><span>${n[lang]}</span></label>`).join("");
}
function fmtDate(d) {
  if (!d) return "";
  return new Date(d + "T12:00").toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
}
function render() {
  const n = NEEDS[state.need][lang], org = state.org, due = state.due;
  let subject, body;
  if (lang === "fr") {
    subject = `${n}${org ? ` : ${org}` : ""}`;
    body = ["Bonjour Monsieur Habimana,", "",
      state.need === "tender" ? `${org || "Notre organisation"} souhaite inviter SECAF Ltd à soumissionner pour un audit.` : `${org || "Notre organisation"} vous contacte au sujet de : ${n.toLowerCase()}.`,
      due ? `Date limite : ${due}.` : "", "Pourriez-vous nous indiquer la suite ?", "",
      state.who ? `Cordialement,\n${state.who}` : "Cordialement,"].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");
  } else {
    subject = `${n}${org ? `: ${org}` : ""}`;
    body = ["Dear Mr Habimana,", "",
      state.need === "tender" ? `${org || "Our organisation"} would like to invite SECAF Ltd to tender for an audit.` : `${org || "Our organisation"} is writing about: ${n.toLowerCase()}.`,
      due ? `Deadline: ${due}.` : "", "Could you tell us the next step?", "",
      state.who ? `Kind regards,\n${state.who}` : "Kind regards,"].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");
  }
  $("#msub").textContent = subject;
  $("#mbody").textContent = body;
  $("#send").href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
$("#ask").addEventListener("input", (e) => { const t = e.target; if (t.name in state) state[t.name] = t.value.trim(); render(); });
$("#ask").addEventListener("submit", (e) => e.preventDefault());
$("#copy").addEventListener("click", async () => {
  const label = $("#copy span");
  try { await navigator.clipboard.writeText(`${EMAIL}\n${$("#msub").textContent}\n\n${$("#mbody").textContent}`); label.textContent = lang === "fr" ? "Copié" : "Copied"; }
  catch { label.textContent = lang === "fr" ? "Sélectionnez le texte" : "Select the text to copy"; }
  setTimeout(() => { label.textContent = lang === "fr" ? "Copier le texte" : "Copy the text"; }, 2500);
});
$("#print").addEventListener("click", () => print());

// ---- reveals, trades, chapters, progress ----------------------------------------------------
const rise = [...document.querySelectorAll("[data-rise]")];
if (reduced || !("IntersectionObserver" in window)) rise.forEach((el) => el.classList.add("in"));
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  rise.forEach((el) => io.observe(el));
}
const trades = [...document.querySelectorAll(".trade")];
const tio = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("on", e.isIntersecting)), { rootMargin: "-35% 0px -35% 0px" });
trades.forEach((t) => tio.observe(t));

const navLinks = [...document.querySelectorAll(".nav a")];
const chap = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  $("#chap").textContent = e.target.dataset.num;
  navLinks.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === `#${e.target.id}`));
}), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll(".chapter").forEach((s) => chap.observe(s));

let queued = false;
function tick() {
  queued = false;
  const max = document.documentElement.scrollHeight - innerHeight;
  document.documentElement.style.setProperty("--page-p", max > 0 ? (scrollY / max).toFixed(4) : "0");
}
const onScroll = () => queued || ((queued = true), requestAnimationFrame(tick));
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);
tick();

// ---- depth that answers the pointer (fine pointers only) -------------------------------------
if (!reduced && matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const lean = (el, max, base = [0, 0], area = el) => {
    let raf = 0, x = 0, y = 0;
    area.addEventListener("pointermove", (e) => {
      const r = area.getBoundingClientRect(); x = (e.clientX - r.left) / r.width - 0.5; y = (e.clientY - r.top) / r.height - 0.5;
      raf ||= requestAnimationFrame(() => { raf = 0; el.style.setProperty("--ry", `${(base[1] + x * max).toFixed(2)}deg`); el.style.setProperty("--rx", `${(base[0] - y * max).toFixed(2)}deg`); });
    });
    area.addEventListener("pointerleave", () => { el.style.setProperty("--ry", `${base[1]}deg`); el.style.setProperty("--rx", `${base[0]}deg`); });
  };
  lean($(".doc-page"), 14, [4, -10], $(".doc"));
  lean($(".sheet-card"), 8);
  // the hero letters lean away from the pointer
  const hero = $(".hero");
  let raf = 0;
  hero.addEventListener("pointermove", (e) => {
    const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
    raf ||= requestAnimationFrame(() => { raf = 0; word.style.transform = `perspective(900px) rotateY(${(x * 8).toFixed(2)}deg) rotateX(${(-y * 6).toFixed(2)}deg)`; });
  });
  hero.addEventListener("pointerleave", () => { word.style.transform = ""; });
  word.style.transition = "transform .8s cubic-bezier(.16,1,.3,1)";
}

document.querySelectorAll(".menu nav a").forEach((a) => a.addEventListener("click", () => a.closest("details").removeAttribute("open")));

// ---- Kigali time -----------------------------------------------------------------------------
const clock = $("#clock");
const showTime = () => { clock.textContent = new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", { timeZone: "Africa/Kigali", hour: "2-digit", minute: "2-digit", weekday: "short" }).format(new Date()); };
showTime(); setInterval(showTime, 30000);

let saved = "en";
try { saved = localStorage.getItem("secaf-lang") || "en"; } catch {}
renderNeeds();
if (saved === "fr") setLang("fr"); else render();
