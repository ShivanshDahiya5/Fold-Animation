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
