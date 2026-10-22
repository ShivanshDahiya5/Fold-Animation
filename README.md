# Galaxy Z Fold8 — scroll-driven landing page

A single-page, mobile-friendly demo built with plain **HTML, CSS and JavaScript** — no
build step, no frameworks, no server, no dependencies. The centrepiece is a full-screen
sticky canvas that scrubs a 720-frame image sequence of the phone folding, driven by scroll.

## Run it

Open **`index.html`** in a browser (double-click it). That's it.

Everything is loaded with relative paths, so the page works straight from disk
(`file://`). First load takes a few seconds while the 720-frame sequence (63 MB)
downloads into the loader's progress bar; after that the browser caches it.

## Structure

| File | Purpose |
|---|---|
| `index.html` | Loader → sticky reel (6 text overlays) → photo gallery → specs → CTA → footer |
| `styles.css` | Black / champagne-gold system (`#F8E29F → #B48645`), responsive at 960 / 768 / 640 px |
| `script.js` | Frame preloader with progress bar, canvas cover-fit renderer, scroll engine, overlay timeline |
| `frames/` | `frame_000000.jpg` … `frame_000719.jpg` (1600×900) |
| `images/` | Galaxy Z Fold8 product photography (gallery + CTA) |

## Behaviour notes

- Scroll progress maps to frame index 0–719 with a light lerp (`EASE 0.16`) so fast
  scrolls stay smooth; `prefers-reduced-motion` disables the smoothing.
- If `frames/` can't be reached the page still works: the canvas is hidden and a
  gradient backdrop (`body.no-frames`) takes over.
- Photography credits are listed in the page footer (Wikimedia Commons, CC BY-SA 4.0).
