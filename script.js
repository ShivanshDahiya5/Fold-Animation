(() => {
  'use strict';

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE = reduced ? 1 : 0.16;
  const N = 720;                       // frames in frames/frame_000000.jpg … 000719
  const frameURL = i => `frames/frame_${String(i).padStart(6, '0')}.jpg`;
  const smooth = (a, b, v) => {
    const t = clamp((v - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };

const loader = document.getElementById('loader');
  const loadBar = document.querySelector('[data-load-bar]');
  const loadPct = document.querySelector('[data-load-pct]');
  const frames = new Array(N);
  let settled = 0, goodFrames = 0, started = false;

  function onSettled(ok) {
    settled++;
    if (ok) goodFrames++;
    const pct = Math.round((settled / N) * 100);
    if (loadBar) loadBar.style.width = pct + '%';
    if (loadPct) loadPct.textContent = String(pct);
    if (settled === N) reveal();
  }

  for (let i = 0; i < N; i++) {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => onSettled(true);
    img.onerror = () => onSettled(false);
    img.src = frameURL(i);
    frames[i] = img;
  }

    // safety: never trap the user behind the loader
  setTimeout(() => { if (!started && settled < N) { settled = N; reveal(); } }, 45000);

  function reveal() {
    if (started) return;
    started = true;
    if (goodFrames === 0) document.body.classList.add('no-frames');
    document.body.classList.remove('is-loading');
