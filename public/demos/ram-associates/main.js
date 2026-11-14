const $ = (s) => document.querySelector(s);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const EMAIL = "jain.canupur@gmail.com";

// ---- the firm's own service list, word for word from its services page -----------------------
const PRACTICES = [
  { id: "accounts", name: "Accounts", items: ["Maintenance of statutory records under various laws", "Finalisation of accounts", "Preparation of MIS reports", "Compliance with accounting standards and ICPAR guidance notes"] },
  { id: "audit", name: "Audit", items: ["Statutory and internal audit", "Listed, limited and private limited companies", "Club and sports associations", "NGOs and charitable trust audits", "Inventory and stock audit", "Fraud and forensic audit"] },
  { id: "tax", name: "Taxation", items: ["RRA and income tax assessments", "RRA appeals", "Regular income tax matters", "VAT consultancy and e-return filing", "VAT audit", "Customs audit and consultancy", "RRA and RSSB tax compliance"] },
  { id: "law", name: "Company law", items: ["Company formation and management as per RDB guidelines", "Merger and amalgamation", "Listed company compliance", "Liaison with RDB, Kigali SEZ and RSB", "Legal deeds and documentation"] },
  { id: "finance", name: "Corporate & project finance", items: ["Techno-economic feasibility reports", "Appraisal of the project", "Arrangement of finance", "Syndication of equity and term loans", "Liaison with banks and financial institutions"] },
];
const total = PRACTICES.reduce((n, p) => n + p.items.length, 0);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

$("#practices").innerHTML = PRACTICES.map((p) => `<div class="pr" data-p="${p.id}"><h3>${p.name}<small>${p.items.length}</small></h3><ul>${p.items.map((i) => `<li data-t="${esc(i.toLowerCase())}">${esc(i)}</li>`).join("")}</ul></div>`).join("");
const QUICK = ["VAT", "RDB", "Audit", "NGO", "Forensic", "Feasibility", "RSSB"];
$(".quick").innerHTML = QUICK.map((q) => `<button type="button" aria-pressed="false">${q}</button>`).join("");

const finder = $(".finder"), input = $("#q");
function search(q) {
  q = q.trim().toLowerCase();
  finder.classList.toggle("searching", !!q);
  let hits = 0;
  document.querySelectorAll(".pr").forEach((pr) => {
    let n = 0;
    pr.querySelectorAll("li").forEach((li) => {
      const text = li.textContent, hit = !!q && li.dataset.t.includes(q);
      li.classList.toggle("hit", hit);
      if (hit) { n++; const i = text.toLowerCase().indexOf(q); li.innerHTML = `${esc(text.slice(0, i))}<mark>${esc(text.slice(i, i + q.length))}</mark>${esc(text.slice(i + q.length))}`; }
      else li.textContent = text;
    });
    pr.classList.toggle("none", !!q && n === 0);
    hits += n;
  });
  $("#hits").textContent = !q ? `${total} services in five practices.` : hits ? `${hits} matching ${hits === 1 ? "service" : "services"}. Ask about ${hits === 1 ? "it" : "them"} under “Book a consultation”.` : `Nothing on the list matches “${q}”. Ask the firm: it may still help.`;
  document.querySelectorAll(".quick button").forEach((b) => b.setAttribute("aria-pressed", String(b.textContent.toLowerCase() === q)));
}
input.addEventListener("input", () => search(input.value));
$(".quick").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  const on = b.getAttribute("aria-pressed") === "true";
  input.value = on ? "" : b.textContent; search(input.value);
});
search("");
// phone: each practice folds to its heading; a search opens every list
document.querySelectorAll(".pr").forEach((pr, i) => {
  const h = pr.querySelector("h3"), ul = pr.querySelector("ul");
  ul.id = `pr-${pr.dataset.p}`;
  const b = document.createElement("button");
  b.type = "button"; b.className = "pr-t"; b.setAttribute("aria-controls", ul.id); b.setAttribute("aria-expanded", String(i === 0));
  b.innerHTML = h.innerHTML; h.textContent = ""; h.append(b);
  if (i === 0) pr.classList.add("open");
  b.addEventListener("click", () => { const o = pr.classList.toggle("open"); b.setAttribute("aria-expanded", String(o)); });
});

// ---- consultation email -------------------------------------------------------------------------
const TOPICS = { setup: "Setting up a company", audit: "Audit", tax: "Tax and VAT", accounts: "Accounts", finance: "Project finance", other: "Something else" };
const COUNTRIES = { rw: "Rwanda", bi: "Burundi", both: "Both" };
const st = { topic: "setup", country: "rw", co: "", nm: "", rp: "" };
const chips = (id, map, name, cur) => { $(id).innerHTML = Object.entries(map).map(([k, v]) => `<label class="chip"><input type="radio" name="${name}" value="${k}"${k === cur ? " checked" : ""} /><span>${v}</span></label>`).join(""); };
chips("#topic", TOPICS, "topic", st.topic); chips("#country", COUNTRIES, "country", st.country);
function render() {
  const where = st.country === "both" ? "Rwanda and Burundi" : COUNTRIES[st.country];
  const subject = `Consultation: ${TOPICS[st.topic]}${st.co ? `, ${st.co}` : ""} (${where})`;
  const body = [
    "Hello RAM Associates,", "",
    `${st.co || "Our company"} would like a consultation about ${TOPICS[st.topic].toLowerCase()} in ${where}.`,
    "Could you suggest a time to meet or call?",
    st.rp ? `You can reach me on ${st.rp}.` : "", "",
    st.nm ? `Kind regards,\n${st.nm}` : "Kind regards,",
  ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");
  $("#msub").textContent = subject; $("#mbody").textContent = body;
  $("#send").href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
$("#cf").addEventListener("input", (e) => { const t = e.target; if (t.name in st) st[t.name] = t.value.trim(); render(); });
$("#cf").addEventListener("submit", (e) => e.preventDefault());
$("#copy").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(`To: ${EMAIL}\nSubject: ${$("#msub").textContent}\n\n${$("#mbody").textContent}`); $("#copy").textContent = "Copied"; }
  catch { $("#copy").textContent = "Select the text to copy"; }
  setTimeout(() => { $("#copy").textContent = "Copy the text"; }, 2500);
});
render();

// ---- reveals, nav state, progress -------------------------------------------------------------
const rise = [...document.querySelectorAll("[data-rise]")];
if (reduced || !("IntersectionObserver" in window)) rise.forEach((el) => el.classList.add("in"));
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -6% 0px", threshold: 0 });
  rise.forEach((el) => io.observe(el));
}
const navLinks = [...document.querySelectorAll(".nav a")];
const secIO = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === `#${e.target.id}`)); }), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll(".sec").forEach((s) => secIO.observe(s));
let queued = false;
const fan = $("#fan");
function tick() {
  queued = false;
  const max = document.documentElement.scrollHeight - innerHeight;
  document.documentElement.style.setProperty("--pg", max > 0 ? (scrollY / max).toFixed(4) : "0");
  if (!reduced && !fan.dataset.hover) fan.style.setProperty("--rx", `${Math.min(10, scrollY / 50).toFixed(2)}deg`);
}
const onScroll = () => queued || ((queued = true), requestAnimationFrame(tick));
addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); tick();
document.querySelectorAll(".menu nav a").forEach((a) => a.addEventListener("click", () => a.closest("details").removeAttribute("open")));

// ---- depth that answers the pointer (fine pointers only) ---------------------------------------
if (!reduced && matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const lean = (el, max, area = el) => {
    let raf = 0, x = 0, y = 0;
    area.addEventListener("pointermove", (e) => {
      const r = area.getBoundingClientRect(); x = (e.clientX - r.left) / r.width - 0.5; y = (e.clientY - r.top) / r.height - 0.5;
      el.dataset.hover = "1";
      raf ||= requestAnimationFrame(() => { raf = 0; el.style.setProperty("--ry", `${(x * max).toFixed(2)}deg`); el.style.setProperty("--rx", `${(-y * max).toFixed(2)}deg`); });
    });
    area.addEventListener("pointerleave", () => { delete el.dataset.hover; el.style.setProperty("--ry", "0deg"); el.style.setProperty("--rx", "0deg"); onScroll(); });
  };
  lean(fan, 14, $(".hero"));
  document.querySelectorAll(".card").forEach((c) => lean(c, 6));
}

// ---- Central Africa Time, shared by both offices ------------------------------------------------
const clock = $("#clock");
const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Kigali", hour: "2-digit", minute: "2-digit", weekday: "short" });
const hclock = $("#hclock"), hfmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Kigali", hour: "2-digit", minute: "2-digit" });
const show = () => { clock.textContent = fmt.format(new Date()); hclock.textContent = hfmt.format(new Date()); };
show(); setInterval(show, 30000);
