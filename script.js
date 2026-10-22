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
    if (loader) loader.classList.add('is-done');
    setTimeout(() => { if (loader) loader.style.display = 'none'; }, 900);
    measure();
    readTargets();
    reelP = reelTarget;
    scenes.forEach(s => { s.p = s.target; paintScene(s); });
    paintReel(reelP, true);
    kick();
  }

  //  2. CANVAS — cover-fit draw

    const sticky = document.querySelector('.reel__sticky');
  const cv = document.getElementById('stage');
  const ctx = cv ? cv.getContext('2d', { alpha: false }) : null;
  const frameEl = document.querySelector('[data-frame]');
  const hint = document.querySelector('[data-hint]');
  let lastDrawn = -1, needResize = true;

    function resizeCanvas() {
    if (!cv || !sticky) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = sticky.clientWidth, h = sticky.clientHeight;
    if (!w || !h) return;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    needResize = true;
  }

    function drawFrame(idx) {
    if (!ctx) return;
    const img = frames[idx];
    if (!img || !img.complete || !img.naturalWidth) return;
    const cw = cv.width, ch = cv.height;
    if (!cw || !ch) return;
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;
    let dw, dh;
    if (cr > ir) { dw = cw; dh = cw / ir; } else { dh = ch; dw = ch * ir; }
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    lastDrawn = idx;
    if (frameEl) frameEl.textContent = String(idx).padStart(3, '0');
  }

  // 3. OVERLAYS — fade/slide tied to reel progress

  const BLOCKS = [
    { el: qs('[data-ov="intro"]'), a: -0.047, in: [-0.001, 0],      out: [0.055, 0.095], noY: true, grow: 0.05 },
    { el: qs('[data-ov="1"]'),     a: 0.130,  in: [0.130, 0.175],  out: [0.255, 0.300] },
    { el: qs('[data-ov="2"]'),     a: 0.335,  in: [0.335, 0.380],  out: [0.460, 0.505] },
    { el: qs('[data-ov="3"]'),     a: 0.540,  in: [0.540, 0.585],  out: [0.665, 0.710] },
    { el: qs('[data-ov="4"]'),     a: 0.745,  in: [0.745, 0.790],  out: [0.820, 0.865] },
    { el: qs('[data-ov="outro"]'), a: 0.905,  in: [0.905, 0.950],  out: null, grow: 0.06 }
  ];
