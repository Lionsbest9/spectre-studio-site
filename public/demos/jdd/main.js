const $ = (s) => document.querySelector(s);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const EMAIL = "jddassociatesltd@gmail.com";
const DOCS = {
  icpar: { label: "Open ICPAR's List of Firms 2026 (PDF) ↗", url: "https://icparwanda.com/wp-content/uploads/2025/12/List-of-Firms-2026.pdf" },
  bnr: { label: "Open the BNR accredited-auditor list (PDF) ↗", url: "https://www.bnr.rw/documents/List_of_Accredited_External_Auditors_for_Financial_Institutions_as_of_January_2025.pdf" },
  rra: { label: "Open the RRA list of approved accountants (PDF) ↗", url: "https://www.rra.gov.rw/fileadmin/Folder_for_2025/Updated_list_of_Professional_Accountants_March_12__2026.pdf" },
};

// ---- 01 what do you need signed? each job maps to the public listing that covers it -------------
const JOBS = {
  tax: { k: "RRA", title: "Certify a tax declaration", sub: "For the Rwanda Revenue Authority",
    cover: "RRA approval to certify tax declarations", line: "Two of the firm's accountants, Jean Damascene Dusengimana and Valentine Nyiramisago, are on the RRA's list of professional accountants approved to certify tax declarations and financial statements (2025).", doc: "rra", ask: "certification of our tax declaration" },
  fs: { k: "RRA", title: "Certify financial statements", sub: "Signed by an approved accountant",
    cover: "RRA approval to certify financial statements", line: "The same RRA list covers certifying financial statements. Both of the firm's listed accountants are approved.", doc: "rra", ask: "certification of our financial statements" },
  audit: { k: "ICPAR", title: "Audit our financial statements", sub: "Annual financial statements",
    cover: "ICPAR licence to practise as an audit firm", line: "JDD & Associates Ltd is on ICPAR's List of Firms, the register of firms licensed to practise audit in Rwanda, in 2023, 2024 and 2026.", doc: "icpar", ask: "an audit of our financial statements" },
  fi: { k: "BNR", title: "Audit a financial institution", sub: "Institutions supervised by BNR",
    cover: "BNR accreditation as an external auditor", line: "The National Bank of Rwanda lists JDD & Associates Ltd among the external auditors accredited for the financial institutions it supervises (January 2025).", doc: "bnr", ask: "the external audit of our financial institution" },
};
const st = { job: "tax", org: "", year: "", who: "" };
$("#jobs").innerHTML = Object.entries(JOBS).map(([id, j]) => `<button type="button" class="job" role="radio" aria-checked="${id === st.job}" data-job="${id}"><span class="jk">${j.k}</span><span><b>${j.title}</b><small>${j.sub}</small></span></button>`).join("");
function render() {
  const j = JOBS[st.job];
  $("#aKey").textContent = `Covered by · ${j.k}`;
  $("#aTitle").textContent = j.cover;
  $("#aLine").textContent = j.line;
  $("#aDoc").textContent = DOCS[j.doc].label; $("#aDoc").href = DOCS[j.doc].url;
  const subject = `Request: ${j.title.toLowerCase()}${st.org ? `, ${st.org}` : ""}${st.year ? ` (${st.year})` : ""}`;
  const body = [
    "Hello JDD & Associates,", "",
    `${st.org || "[Your organisation]"} would like ${j.ask} for ${st.year || "[year or period]"}.`,
    "Could you tell us what you need from us, and your timing?",
    `You can reach me: ${st.who || "[your name and phone]"}.`, "",
    "Kind regards,",
  ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");
  $("#msub").textContent = subject; $("#mbody").textContent = body;
  $("#send").href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.querySelectorAll(".job").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.job === st.job)));
}
$("#jobs").addEventListener("click", (e) => { const b = e.target.closest(".job"); if (!b) return; st.job = b.dataset.job; render(); });
$("#jobs").addEventListener("keydown", (e) => {
  if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(e.key)) return;
  e.preventDefault();
  const ids = Object.keys(JOBS), i = ids.indexOf(st.job), n = ids[(i + (e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : ids.length - 1)) % ids.length];
  st.job = n; render(); document.querySelector(`.job[data-job="${n}"]`).focus();
});
document.querySelector(".mail").addEventListener("input", (e) => { const t = e.target; if (t.name in st) st[t.name] = t.value.trim(); render(); });
$("#copy").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(`To: ${EMAIL}\nSubject: ${$("#msub").textContent}\n\n${$("#mbody").textContent}`); $("#copy").textContent = "Copied"; }
  catch { $("#copy").textContent = "Select the text to copy"; }
  setTimeout(() => { $("#copy").textContent = "Copy the text"; }, 2500);
});
render();

// ---- reveals, nav state, progress ---------------------------------------------------------------
const rise = [...document.querySelectorAll("[data-rise]")];
if (reduced || !("IntersectionObserver" in window)) rise.forEach((el) => el.classList.add("in"));
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -6% 0px", threshold: 0 });
  rise.forEach((el) => io.observe(el));
}
const navLinks = [...document.querySelectorAll(".nav a")];
const secIO = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === `#${e.target.id}`)); }), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll(".sec, .hero").forEach((s) => secIO.observe(s));
let queued = false;
function tick() {
  queued = false;
  const max = document.documentElement.scrollHeight - innerHeight;
  document.documentElement.style.setProperty("--pg", max > 0 ? (scrollY / max).toFixed(4) : "0");
}
const onScroll = () => queued || ((queued = true), requestAnimationFrame(tick));
addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll); tick();
document.querySelectorAll(".menu nav a").forEach((a) => a.addEventListener("click", () => a.closest("details").removeAttribute("open")));

// ---- depth that answers the pointer (fine pointers only) ------------------------------------------
if (!reduced && matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const tri = $("#tri");
  let raf = 0;
  $(".lists").addEventListener("pointermove", (e) => {
    const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
    raf ||= requestAnimationFrame(() => { raf = 0; tri.style.transform = `perspective(1200px) rotateY(${(x * 10).toFixed(2)}deg) rotateX(${(-y * 6).toFixed(2)}deg)`; });
  });
  $(".lists").addEventListener("pointerleave", () => { tri.style.transform = ""; });
  tri.style.transition = "transform .9s cubic-bezier(.16,1,.3,1)";
  document.querySelectorAll(".card").forEach((c) => {
    let r2 = 0;
    c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      r2 ||= requestAnimationFrame(() => { r2 = 0; c.style.setProperty("--ry", `${(x * 6).toFixed(2)}deg`); c.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`); });
    });
    c.addEventListener("pointerleave", () => { c.style.setProperty("--ry", "0deg"); c.style.setProperty("--rx", "0deg"); });
  });
}

// ---- Kigali time ----------------------------------------------------------------------------------
const clock = $("#clock");
const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Kigali", hour: "2-digit", minute: "2-digit", weekday: "short" });
const show = () => { clock.textContent = fmt.format(new Date()); };
show(); setInterval(show, 30000);
