# Design notes: the "two voices" redesign (2026-11-10)

The home page mixes the existing spectral Spectre Studio site with patterns studied on
https://serhii.website/ (an editorial web-studio portfolio). Patterns and techniques only:
no code, copy, images or fonts were taken from that site.

## Borrowed patterns

| Pattern | Where it lives here |
|---|---|
| Particle wordmark: points gather into the studio name and part around the pointer | `src/stage/Spectrum.jsx` (`wordPoints`, `uAppear`, `uPush`); the ring now arrives after chapter 1 |
| Two-voice headings: heavy grotesk statement, italic serif turn of phrase | `.display` / `.display em` in `src/style.css`, also inner-page `h1`, `.closing h2` |
| Title-card hero: headline bottom left, promise and buttons bottom right | `.chap-open` |
| Eyebrows with an italic numeral, a short rule and a spaced caps label | `.eyebrow` |
| Numbered service rows, outlined tags, hand-drawn rules | `.svc`, `.tags`, `--rule` |
| Twin marquee, two voices, opposite directions, leaning into scroll speed | `.marquee`, `marquee()` in `src/polish.js` |
| Ruler on the right edge with one tick per section and a drawn-wave marker | `.rail`, `scrollRail()` in `src/polish.js` |
| Large italic numerals in counters and captions | `.counter b`, `.count b`, `.work-cap .n`, `.principles .n` |
| Second call to action as an italic text link instead of a box | `.text-link` |
| Page ends on ink | `.finale` |

## Kept from Spectre

Midnight and bone palette with the prism accent, the pearly ring and its chapter shapes, the
ribbon behind the light sections, the real work screenshots, WhatsApp as the first action, and
all of the copy.

## Left out on purpose

The scroll-driven vortex tunnel: too heavy for the target laptop (Intel UHD, 60 fps budget),
and The Thread already covers that ground.

## Background, in one line

Night for the opening because the particle wordmark and the prism only glow on a dark field;
bone for reading; back to ink at the finale so the page ends where it began.

## Tokens added

- `--ease: cubic-bezier(0.16, 1, 0.3, 1)` for every transform transition.
- Fixed spacing snapped to 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 px.

## Jury round 1 (2026-11-10): 7.25, 1st of 4 beside Lusion, Noomo and Aino; creativity 6.5 under the floor

Fixes, creativity first: one idea instead of two. The ribbon is retired; the stipple of the
wordmark carries into the work, where every screenshot resolves from dots into the finished
screen as it enters. One accent on the italic instead of the prism gradient. The stippled
wordmark is on screen from the first frame and hands over to the particles once they gather.
The about card is a live readout of this page (frame rate, Kigali time), not a costume.
Mono labels 12 to 14 px; the WhatsApp buttons lift on hover. The canvas stops after the hero.
