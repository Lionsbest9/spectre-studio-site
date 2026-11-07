// One scroll reader for the whole home page. Everything that reacts to scroll reads this
// object (the 3D scene in its frame loop, the DOM in onChange) instead of measuring itself.

export const scroll = {
  heroP: 0, // 0..1 progress through the pinned hero
  chapter: 0, // continuous chapter position, 0..chapters-1
  dark: 1, // 1 while the hero owns the screen, fades to 0 as the light sections arrive
  pageP: 0, // 0..1 through the whole page
  galleryP: 0, // 0..1 through the pinned work gallery
};

export function startScrollTracking({ heroId, galleryId, chapters, onChange }) {
  const hero = document.getElementById(heroId);
  const gallery = document.getElementById(galleryId);
  let raf = 0;
  const clamp = (v) => Math.min(1, Math.max(0, v));

  const read = () => {
    raf = 0;
    const vh = innerHeight;
    if (hero) {
      const r = hero.getBoundingClientRect();
      const span = r.height - vh;
      scroll.heroP = span > 0 ? clamp(-r.top / span) : 0;
      scroll.chapter = scroll.heroP * (chapters - 1);
      // the light world fades in over the last 0.6 screens of the hero leaving
      const past = -r.top - span;
      scroll.dark = 1 - clamp(past / (vh * 0.6));
    }
    if (gallery) {
      const g = gallery.getBoundingClientRect();
      const gspan = g.height - vh;
      scroll.galleryP = gspan > 0 ? clamp(-g.top / gspan) : 0;
    }
    const doc = document.documentElement;
    scroll.pageP = clamp(scrollY / Math.max(1, doc.scrollHeight - vh));
    onChange?.(scroll);
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(read);
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  read();
  return () => {
    removeEventListener("scroll", onScroll);
    removeEventListener("resize", onScroll);
  };
}
