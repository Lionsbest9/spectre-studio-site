// Shared finishing touches for every page: the font-ready reveal, one rise per section as it
// enters, the header that hides on the way down and returns on the way up, count-ups, the
// Kigali clock and the pointer glow. All of it rests under prefers-reduced-motion.

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// 1. Hold the page for a beat until the fonts are in, then reveal (never longer than 900 ms).
export function readyReveal() {
  const show = () => document.documentElement.classList.add("is-ready");
  const t = setTimeout(show, 900);
  document.fonts?.ready.then(() => {
    clearTimeout(t);
    requestAnimationFrame(show);
  });
}

// 2. Sections and marked blocks rise once as they enter the viewport.
export function revealOnEnter(selector = "[data-reveal]") {
  const els = [...document.querySelectorAll(selector)];
  if (!els.length) return;
  if (reduced()) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
  );
  els.forEach((el) => io.observe(el));
}

// 3. Header slides away when scrolling down past the first screen, comes back on the way up.
export function headerAutoHide(header) {
  let last = scrollY;
  let raf = 0;
  const update = () => {
    raf = 0;
    const y = scrollY;
    const down = y > last + 4;
    const up = y < last - 4;
    if (down && y > innerHeight * 0.8) header.classList.add("is-hidden");
    else if (up || y < 80) header.classList.remove("is-hidden");
    last = y;
  };
  addEventListener(
    "scroll",
    () => {
      if (!raf) raf = requestAnimationFrame(update);
    },
    { passive: true }
  );
}

// 4. Numbers count up the first time they are seen. Markup: <b data-count="31">31</b>
export function countUp(selector = "[data-count]") {
  const els = [...document.querySelectorAll(selector)];
  if (!els.length) return;
  const run = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (reduced() || Number.isNaN(target)) {
      el.textContent = el.dataset.count + suffix;
      return;
    }
    const t0 = performance.now();
    const dur = 900;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(target * e) + suffix;
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        run(e.target);
        io.unobserve(e.target);
      }
    }
  });
  els.forEach((el) => io.observe(el));
}

// 5. Local time in Kigali, refreshed every 20 s.
export function kigaliClock(el) {
  if (!el) return;
  // the formatter is costly to build on a slow phone and the footer is far below: wait for idle
  const start = () => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Kigali" });
    const draw = () => (el.textContent = fmt.format(new Date()));
    draw();
    setInterval(draw, 20000);
  };
  window.requestIdleCallback ? requestIdleCallback(start, { timeout: 4000 }) : setTimeout(start, 1500);
}

// 6. A soft light that follows the mouse over dark surfaces.
export function pointerGlow() {
  if (reduced() || !matchMedia("(pointer: fine)").matches) return;
  const root = document.documentElement;
  addEventListener(
    "pointermove",
    (e) => {
      root.style.setProperty("--mx", `${e.clientX}px`);
      root.style.setProperty("--my", `${e.clientY}px`);
    },
    { passive: true }
  );
  root.classList.add("has-glow");
}

// 7. Smooth in-page anchor scrolling that respects the fixed header.
export function anchorScroll() {
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
  });
}

// 8. A marquee row that drifts on its own and leans into the scroll: scroll speed adds to its
// pace and eases back out. The track holds its items three times; it wraps every third.
// Runs only while on screen, and stands still under reduced motion.
export function marquee(track, dir = -1, pace = 38) {
  if (!track) return;
  if (reduced()) return;
  let x = 0;
  let boost = 0;
  let lastY = scrollY;
  let lastT = 0;
  let span = 0;
  let raf = 0;
  const measure = () => (span = track.scrollWidth / 3);
  const frame = (t) => {
    const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0;
    lastT = t;
    const dy = scrollY - lastY;
    lastY = scrollY;
    // scroll velocity in px/s, eased so a flick swells and then settles
    const v = dt ? Math.abs(dy) / dt : 0;
    boost += (Math.min(v * 0.35, 900) - boost) * (1 - Math.exp(-8 * dt));
    x += dir * (pace + boost) * dt;
    if (span) x = ((x % span) - span) % span;
    track.style.transform = `translate3d(${x}px,0,0)`;
    raf = requestAnimationFrame(frame);
  };
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !raf) {
      measure();
      lastT = 0;
      lastY = scrollY;
      raf = requestAnimationFrame(frame);
    } else if (!e.isIntersecting && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });
  io.observe(track.parentElement);
  addEventListener("resize", measure);
  document.fonts?.ready.then(measure);
}

// 9. The ruler on the right edge: one tick per section, a marker that rides the page.
export function scrollRail(ticksEl, dot, selectors) {
  if (!ticksEl || !dot) return { set() {} };
  let marks = [];
  let height = 0;
  let last = -1;
  const layout = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    marks = selectors
      .map((s) => document.querySelector(s))
      .filter(Boolean)
      .map((el) => Math.min(1, Math.max(0, (el.getBoundingClientRect().top + scrollY) / max)));
    ticksEl.innerHTML = marks.map((m) => `<i style="top:${(m * 100).toFixed(2)}%"></i>`).join("");
    height = Math.max(0, ticksEl.clientHeight - dot.offsetHeight);
    last = -1;
  };
  const set = (p) => {
    dot.style.transform = `translate3d(0,${(p * height).toFixed(1)}px,0)`;
    let on = 0;
    marks.forEach((m, i) => {
      if (p + 0.002 >= m) on = i;
    });
    if (on !== last) {
      [...ticksEl.children].forEach((t, i) => t.classList.toggle("is-on", i === on));
      last = on;
    }
  };
  // measuring every section forces a full layout: do it once the page is idle, then only when
  // asked (the caller re-runs it after resizes that change section heights)
  let pending = 0;
  const schedule = () => {
    if (pending) return;
    const run = () => {
      pending = 0;
      layout();
    };
    pending = window.requestIdleCallback ? requestIdleCallback(run, { timeout: 1500 }) : setTimeout(run, 300);
  };
  schedule();
  document.fonts?.ready.then(schedule);
  return { set, layout: schedule };
}
