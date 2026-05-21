'use client';

import { useRef, useEffect } from 'react';

const PORTRAIT = {
  cellW: 9,
  cellH: 13,
  fontPx: 11,
  faceCx: 0.50,
  faceCy: 0.38,
  zoom: 0.70,
  stretchX: 1.3,
  stretchY: 1.0,
  minBri: 0.09,
  hoverRadius: 120,
  dimColor: [65, 14, 0],
  fullColor: [232, 68, 10],
  glowColor: [255, 245, 170],
  flickerMaxActive: 572,
  flickerBurstMin: 100,
  flickerBurstMax: 570,
  flickerDelayMin: 35,
  flickerDelayMax: 140,
  flickerDurationMin: 700,
  flickerDurationMax: 2000,
};

const CHARS =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  '0123456789@#$%&*!?+=~^:;.,<>[]{}()|/-\\`\'';

function lerp(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }

export default function AsciiCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let brightMap = null;
    let charMap = null;
    let visibleCells = [];
    let flickers = new Map();
    let ROWS = 0, COLS = 0;
    let briMax = 0.70;
    let mouseX = -9999, mouseY = -9999;
    let rafId;
    let resizeTimer;
    let nextDropAt = 0;

    function randomCharIndex(excludeIndex) {
      let next = excludeIndex;
      while (next === excludeIndex) {
        next = Math.floor(Math.random() * CHARS.length);
      }
      return next;
    }

    function spawnFlicker(now) {
      if (!visibleCells.length || flickers.size >= PORTRAIT.flickerMaxActive) return;

      const burstCount = Math.min(
        PORTRAIT.flickerMaxActive - flickers.size,
        PORTRAIT.flickerBurstMin + ((Math.random() * (PORTRAIT.flickerBurstMax - PORTRAIT.flickerBurstMin + 1)) | 0),
      );

      for (let i = 0; i < burstCount; i++) {
        const cellIndex = visibleCells[(Math.random() * visibleCells.length) | 0];
        const baseIndex = charMap[cellIndex];
        flickers.set(cellIndex, {
          charIndex: randomCharIndex(baseIndex),
          until: now + PORTRAIT.flickerDurationMin + Math.random() * (PORTRAIT.flickerDurationMax - PORTRAIT.flickerDurationMin),
        });
      }
    }

    function buildMap(img) {
      const W = canvas.parentElement.clientWidth;
      const H = canvas.parentElement.clientHeight;

      COLS = Math.floor(W / PORTRAIT.cellW);
      ROWS = Math.floor(H / PORTRAIT.cellH);
      canvas.width = W;
      canvas.height = H;

      const off = document.createElement('canvas');
      off.width = COLS;
      off.height = ROWS;
      const offCtx = off.getContext('2d');

      const canvasAR = COLS / ROWS;
      const imgAR = img.naturalWidth / img.naturalHeight;
      let cropW, cropH;
      if (canvasAR <= imgAR) {
        cropH = img.naturalHeight * PORTRAIT.zoom;
        cropW = cropH * canvasAR;
      } else {
        cropW = img.naturalWidth * PORTRAIT.zoom;
        cropH = cropW / canvasAR;
      }
      cropW /= PORTRAIT.stretchX;
      cropH /= PORTRAIT.stretchY;

      let sx = img.naturalWidth * PORTRAIT.faceCx - cropW / 2;
      let sy = img.naturalHeight * PORTRAIT.faceCy - cropH / 2;
      sx = Math.max(0, Math.min(img.naturalWidth - cropW, sx));
      sy = Math.max(0, Math.min(img.naturalHeight - cropH, sy));
      offCtx.drawImage(img, sx, sy, cropW, cropH, 0, 0, COLS, ROWS);

      const px = offCtx.getImageData(0, 0, COLS, ROWS).data;
      brightMap = new Float32Array(ROWS * COLS);
      charMap = new Uint8Array(ROWS * COLS);
      visibleCells = [];

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const i = (r * COLS + c) * 4;
          const bri = (px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114) / 255;
          brightMap[r * COLS + c] = bri;
          charMap[r * COLS + c] = (r * 17 + c * 13 + (r ^ c) * 5) % CHARS.length;
          if (bri >= PORTRAIT.minBri) visibleCells.push(r * COLS + c);
        }
      }

      flickers.clear();
      nextDropAt = performance.now() + PORTRAIT.flickerDelayMin;

      const allBri = Array.from(brightMap).sort((a, b) => a - b);
      const p97 = allBri[Math.floor(allBri.length * 0.97)];
      briMax = Math.max(p97, PORTRAIT.minBri + 0.05);

      ctx.font = `${PORTRAIT.fontPx}px 'Courier New', Courier, monospace`;
      ctx.textBaseline = 'top';
    }

    function renderFrame() {
      ctx.font = `${PORTRAIT.fontPx}px 'Courier New', Courier, monospace`;
      ctx.textBaseline = 'top';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = performance.now();
      while (now >= nextDropAt) {
        spawnFlicker(now);
        nextDropAt = now + PORTRAIT.flickerDelayMin + Math.random() * (PORTRAIT.flickerDelayMax - PORTRAIT.flickerDelayMin);
      }

      for (const [cellIndex, flicker] of flickers) {
        if (flicker.until <= now) flickers.delete(cellIndex);
      }

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mx = (mouseX - rect.left) * scaleX;
      const my = (mouseY - rect.top) * scaleY;

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const bri = brightMap[r * COLS + c];
          if (bri < PORTRAIT.minBri) continue;

          const cellIndex = r * COLS + c;
          const x = c * PORTRAIT.cellW;
          const y = r * PORTRAIT.cellH;

          const norm = Math.min(1, (bri - PORTRAIT.minBri) / (briMax - PORTRAIT.minBri));
          const t = Math.pow(norm, 0.70);

          let cr = lerp(PORTRAIT.dimColor[0], PORTRAIT.fullColor[0], t);
          let cg = lerp(PORTRAIT.dimColor[1], PORTRAIT.fullColor[1], t);
          let cb = lerp(PORTRAIT.dimColor[2], PORTRAIT.fullColor[2], t);

          const dx = x + PORTRAIT.cellW * 0.5 - mx;
          const dy = y + PORTRAIT.cellH * 0.5 - my;
          const ht = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / PORTRAIT.hoverRadius);
          if (ht > 0) {
            const ht2 = ht * ht;
            cr = lerp(cr, PORTRAIT.glowColor[0], ht2);
            cg = lerp(cg, PORTRAIT.glowColor[1], ht2);
            cb = lerp(cb, PORTRAIT.glowColor[2], ht2);
          }

          ctx.fillStyle = `rgb(${cr | 0},${cg | 0},${cb | 0})`;
          const flicker = flickers.get(cellIndex);
          const charIndex = flicker ? flicker.charIndex : charMap[cellIndex];
          ctx.fillText(CHARS[charIndex], x, y);
        }
      }
    }

    function loop() {
      if (brightMap) renderFrame();
      rafId = requestAnimationFrame(loop);
    }

    const img = new Image();
    img.onload = function () { buildMap(this); };
    img.onerror = () => console.error('Portrait failed to load');
    img.src = '/portrait/image.png';

    rafId = requestAnimationFrame(loop);

    const handleMouseMove = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (img.complete && img.naturalWidth > 0) buildMap(img);
      }, 150);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
