const $ = (s) => document.querySelector(s);
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const EMAIL = "utcpa.ltd@gmail.com";

// ---- 04 quote request: three answers write the email --------------------------------------
const WHO = {
  mfi: { label: "Microfinance institution", noun: "a microfinance institution" },
  sacco: { label: "SACCO", noun: "a SACCO" },
  fi: { label: "Other BNR-supervised institution", noun: "a BNR-supervised financial institution" },
  company: { label: "Company", noun: "a company" },
  ngo: { label: "NGO or funded project", noun: "an NGO or funded project" },
};
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const state = { who: "company", month: "December", year: "", org: "", name: "", reply: "" };
const thisYear = new Date().getFullYear();

$("#who").innerHTML = Object.entries(WHO).map(([id, w]) => `<label class="chip"><input type="radio" name="who" value="${id}"${id === state.who ? " checked" : ""} /><span>${w.label}</span></label>`).join("");
$("#month").innerHTML = MONTHS.map((m) => `<option${m === state.month ? " selected" : ""}>${m}</option>`).join("");
$("#year").innerHTML = [thisYear - 1, thisYear, thisYear + 1].map((y) => `<option${y === thisYear ? " selected" : ""}>${y}</option>`).join("");
state.year = String(thisYear);

function render() {
  const w = WHO[state.who];
  const who = state.org ? `${state.org}, ${w.noun}` : w.noun;
  const subject = `Audit quote request: ${state.org || w.label}, year ending ${state.month} ${state.year}`;
  const body = [
    "Hello UT CPA,",
    "",
    `I would like a quote for the external audit of ${who}, for the financial year ending ${state.month} ${state.year}.`,
    "Please tell me what you need from us and when you could start.",
    "",
    state.reply ? `You can reach me on ${state.reply}.\n` : "",
    state.name ? `Kind regards,\n${state.name}` : "Kind regards,",
  ].join("\n");
  $("#lsub").textContent = subject;
  $("#lbody").textContent = body;
  $("#send").href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
$("#qform").addEventListener("input", (e) => {
  const t = e.target;
  if (t.name in state) state[t.name] = t.value.trim();
  render();
});
$("#qform").addEventListener("submit", (e) => e.preventDefault());
$("#copy").addEventListener("click", async () => {
  const text = `To: ${EMAIL}\nSubject: ${$("#lsub").textContent}\n\n${$("#lbody").textContent}`;
  try { await navigator.clipboard.writeText(text); $("#copy").textContent = "Copied"; $("#copied").innerHTML = `Copied. Paste it into an email to <b>${EMAIL}</b>.`; }
  catch { $("#copy").textContent = "Select the text above to copy"; }
  setTimeout(() => { $("#copy").textContent = "Copy the text"; }, 2500);
});
render();

// ---- reveals, register stamps, chapter counter, progress -----------------------------------
const rise = [...document.querySelectorAll("[data-rise]")];
if (reduced || !("IntersectionObserver" in window)) rise.forEach((el) => el.classList.add("in"));
else {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
  rise.forEach((el) => io.observe(el));
}
document.querySelectorAll(".reg").forEach((r, i) => r.style.setProperty("--d", `${i * 120}ms`));

const links = [...document.querySelectorAll(".chapters a")];
const chap = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  $("#chap").textContent = e.target.dataset.num;
  links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === `#${e.target.id}`));
}), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll(".chapter").forEach((s) => chap.observe(s));

let queued = false;
const stack = $("#stack");
function tick() {
  queued = false;
  const max = document.documentElement.scrollHeight - innerHeight;
  document.documentElement.style.setProperty("--page", max > 0 ? (scrollY / max).toFixed(4) : "0");
  // the sheets settle flatter as the hero scrolls away
  if (!reduced && stack && !stack.dataset.hover) {
    const k = Math.min(1, scrollY / innerHeight);
    stack.style.setProperty("--rx", `${(6 + k * 10).toFixed(2)}deg`);
    stack.style.setProperty("--ry", `${(-14 + k * 6).toFixed(2)}deg`);
  }
}
const onScroll = () => queued || ((queued = true), requestAnimationFrame(tick));
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);
tick();

// ---- depth that answers the pointer (fine pointers only) ------------------------------------
if (!reduced && matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const lean = (el, max, base = [0, 0], area = el) => {
    let raf = 0, x = 0, y = 0;
    area.addEventListener("pointermove", (e) => {
      const r = area.getBoundingClientRect();
      x = (e.clientX - r.left) / r.width - 0.5; y = (e.clientY - r.top) / r.height - 0.5;
      el.dataset.hover = "1";
      raf ||= requestAnimationFrame(() => { raf = 0; el.style.setProperty("--ry", `${(base[1] + x * max).toFixed(2)}deg`); el.style.setProperty("--rx", `${(base[0] - y * max).toFixed(2)}deg`); });
    });
    area.addEventListener("pointerleave", () => { delete el.dataset.hover; el.style.setProperty("--ry", `${base[1]}deg`); el.style.setProperty("--rx", `${base[0]}deg`); onScroll(); });
  };
  lean(stack, 16, [6, -14], $(".sheets"));
  document.querySelectorAll(".card").forEach((c) => lean(c, 6));
  lean($(".p-photo"), 8);
}

// ---- phone bar: shows once the hero's own buttons have scrolled away ----------------------
const bar = $(".bar"), heroActs = $(".hero .acts");
if (bar && heroActs && "IntersectionObserver" in window) {
  let pastHero = false, inForm = false;
  const sync = () => bar.classList.toggle("show", pastHero && !inForm);
  new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; sync(); }).observe(heroActs);
  new IntersectionObserver(([e]) => { inForm = e.isIntersecting; sync(); }, { rootMargin: "0px 0px -20% 0px" }).observe($("#quote"));
}
else bar?.classList.add("show");

document.querySelectorAll(".menu nav a").forEach((a) => a.addEventListener("click", () => a.closest("details").removeAttribute("open")));

// ---- Kigali time -----------------------------------------------------------------------------
const clock = $("#clock");
const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Kigali", hour: "2-digit", minute: "2-digit", weekday: "short" });
const showTime = () => { clock.textContent = fmt.format(new Date()); };
showTime(); setInterval(showTime, 30000);
