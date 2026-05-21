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
  followProximity: 360,
  followMaxOffset: 32,
  followLag: 0.16,
  followJiggle: 2.5,
  rippleSpeed: 260,
  rippleDuration: 1600,
  rippleThickness: 22,
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
    let imageBounds = null;
    let activeRipples = [];
    let followOffsetX = 0;
    let followOffsetY = 0;
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

    function rebuildImageBounds() {
      if (!visibleCells.length) {
        imageBounds = null;
        return;
      }

      let minRow = ROWS;
      let minCol = COLS;
      let maxRow = 0;
      let maxCol = 0;

      for (let i = 0; i < visibleCells.length; i++) {
        const cellIndex = visibleCells[i];
        const row = Math.floor(cellIndex / COLS);
        const col = cellIndex % COLS;

        if (row < minRow) minRow = row;
        if (col < minCol) minCol = col;
        if (row > maxRow) maxRow = row;
        if (col > maxCol) maxCol = col;
      }

      imageBounds = {
        left: minCol * PORTRAIT.cellW,
        top: minRow * PORTRAIT.cellH,
        right: (maxCol + 1) * PORTRAIT.cellW,
        bottom: (maxRow + 1) * PORTRAIT.cellH,
      };
      imageBounds.width = imageBounds.right - imageBounds.left;
      imageBounds.height = imageBounds.bottom - imageBounds.top;
      imageBounds.centerX = imageBounds.left + imageBounds.width * 0.5;
      imageBounds.centerY = imageBounds.top + imageBounds.height * 0.5;
    }

    function isNearImage(mx, my) {
      if (!imageBounds) return false;

      const pad = PORTRAIT.followProximity;
      return (
        mx >= imageBounds.left - pad &&
        mx <= imageBounds.right + pad &&
        my >= imageBounds.top - pad &&
        my <= imageBounds.bottom + pad
      );
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
      activeRipples = [];
      followOffsetX = 0;
      followOffsetY = 0;
      rebuildImageBounds();
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

      activeRipples = activeRipples.filter((ripple) => now - ripple.startedAt < PORTRAIT.rippleDuration);

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const mx = (mouseX - rect.left) * scaleX;
      const my = (mouseY - rect.top) * scaleY;

      const nearImage = isNearImage(mx, my);
      let targetFollowX = 0;
      let targetFollowY = 0;

      if (nearImage && imageBounds) {
        const distX = mx - imageBounds.centerX;
        const distY = my - imageBounds.centerY;
        const maxDist = Math.max(imageBounds.width, imageBounds.height) * 0.5 + PORTRAIT.followProximity;
        const proximity = Math.max(0, 1 - Math.sqrt(distX * distX + distY * distY) / maxDist);
        const dirScale = Math.max(imageBounds.width, imageBounds.height) || 1;
        targetFollowX = (distX / dirScale) * PORTRAIT.followMaxOffset * proximity;
        targetFollowY = (distY / dirScale) * PORTRAIT.followMaxOffset * proximity;
      }

      followOffsetX = lerp(followOffsetX, targetFollowX, PORTRAIT.followLag);
      followOffsetY = lerp(followOffsetY, targetFollowY, PORTRAIT.followLag);

      const followJiggleX = nearImage ? Math.sin(now * 0.0075 + followOffsetY * 0.18) * PORTRAIT.followJiggle * 0.35 : 0;
      const followJiggleY = nearImage ? Math.cos(now * 0.0085 + followOffsetX * 0.18) * PORTRAIT.followJiggle * 0.35 : 0;
      const drawOffsetX = followOffsetX + followJiggleX;
      const drawOffsetY = followOffsetY + followJiggleY;

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const bri = brightMap[r * COLS + c];
          if (bri < PORTRAIT.minBri) continue;

          const cellIndex = r * COLS + c;
          const x = c * PORTRAIT.cellW;
          const y = r * PORTRAIT.cellH;
          const drawX = x + drawOffsetX + ((c / Math.max(1, COLS - 1)) - 0.5) * drawOffsetX * 0.18;
          const drawY = y + drawOffsetY + ((r / Math.max(1, ROWS - 1)) - 0.5) * drawOffsetY * 0.18;

          const norm = Math.min(1, (bri - PORTRAIT.minBri) / (briMax - PORTRAIT.minBri));
          const t = Math.pow(norm, 0.70);

          let cr = lerp(PORTRAIT.dimColor[0], PORTRAIT.fullColor[0], t);
          let cg = lerp(PORTRAIT.dimColor[1], PORTRAIT.fullColor[1], t);
          let cb = lerp(PORTRAIT.dimColor[2], PORTRAIT.fullColor[2], t);

          const dx = drawX + PORTRAIT.cellW * 0.5 - mx;
          const dy = drawY + PORTRAIT.cellH * 0.5 - my;
          const ht = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / PORTRAIT.hoverRadius);
          if (ht > 0) {
            const ht2 = ht * ht;
            cr = lerp(cr, PORTRAIT.glowColor[0], ht2);
            cg = lerp(cg, PORTRAIT.glowColor[1], ht2);
            cb = lerp(cb, PORTRAIT.glowColor[2], ht2);
          }

          // for (let i = 0; i < activeRipples.length; i++) {
          //   const ripple = activeRipples[i];
          //   const age = now - ripple.startedAt;
          //   const radius = age * PORTRAIT.rippleSpeed;
          //   const dist = Math.sqrt((drawX + PORTRAIT.cellW * 0.5 - ripple.x) ** 2 + (drawY + PORTRAIT.cellH * 0.5 - ripple.y) ** 2);
          //   const ring = 1 - Math.abs(dist - radius) / PORTRAIT.rippleThickness;
          //   const flash = 1 - age / 240;
          //   const pulse = Math.max(0, Math.min(1, Math.max(ring, flash)));
          //   if (pulse > 0) {
          //     cr = lerp(cr, PORTRAIT.glowColor[0], pulse * 0.95);
          //     cg = lerp(cg, PORTRAIT.glowColor[1], pulse * 0.8);
          //     cb = lerp(cb, PORTRAIT.glowColor[2], pulse * 0.65);
          //   }
          // }

          ctx.fillStyle = `rgb(${cr | 0},${cg | 0},${cb | 0})`;
          const flicker = flickers.get(cellIndex);
          const charIndex = flicker ? flicker.charIndex : charMap[cellIndex];
          ctx.fillText(CHARS[charIndex], drawX, drawY);
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

    const handleClick = (e) => {
      if (!imageBounds) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);

      if (!isNearImage(x, y)) return;

      activeRipples.push({
        x,
        y,
        startedAt: performance.now(),
      });
    };
    document.addEventListener('click', handleClick);

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
      document.removeEventListener('click', handleClick);
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
