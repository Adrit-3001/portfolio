'use client';

import { useRef, useEffect } from 'react';

const CHARS =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  '0123456789@#$%&*!?+=~^:;.,<>[]{}()|/-\\`\'';

export const PARTICLE_CONFIG = {
  count: 255,            // number of particles on desktop
  mobileCount: 60,       // number of particles on mobile (≤ mobileBreakpoint)
  mobileBreakpoint: 640, // px — matches the CSS mobile breakpoint
  charSize: 16,          // font size in px
  floatAmplitude: 18,    // max vertical float distance in px
  floatSpeed: 0.25,      // how fast particles oscillate (radians/sec)
  driftSpeed: 0.012,     // slow horizontal drift (px/frame at 60fps equivalent)
  flickerRate: 0.012,    // probability per frame that a char changes
  minBrightness: 0.28,   // dimmest particle (0–1)
  maxBrightness: 0.85,   // brightest particle (0–1)
  dimColor: [79, 11, 11],
  fullColor: [255, 20, 20],
  fadeInDuration: 900,   // ms to fade in after scroll trigger
};

function lerp(a, b, t) { return a + (b - a) * t; }

function makeParticle(W, H, cfg) {
  const bri = lerp(cfg.minBrightness, cfg.maxBrightness, Math.random());
  return {
    x: Math.random() * W,
    baseY: Math.random() * H,
    y: 0,
    phase: Math.random() * Math.PI * 2,
    driftDir: Math.random() < 0.5 ? 1 : -1,
    char: CHARS[Math.floor(Math.random() * CHARS.length)],
    bri,
    r: Math.round(lerp(cfg.dimColor[0], cfg.fullColor[0], bri)),
    g: Math.round(lerp(cfg.dimColor[1], cfg.fullColor[1], bri)),
    b: Math.round(lerp(cfg.dimColor[2], cfg.fullColor[2], bri)),
  };
}

function targetCount(cfg) {
  return window.innerWidth <= cfg.mobileBreakpoint ? cfg.mobileCount : cfg.count;
}

export default function FloatingParticles({ config = PARTICLE_CONFIG }) {
  const cfg = { ...PARTICLE_CONFIG, ...config };
  const canvasRef = useRef(null);
  const stateRef = useRef({ particles: [], alpha: 0, targetAlpha: 0, rafId: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    function initParticles() {
      const count = targetCount(cfg);
      state.particles = Array.from({ length: count }, () =>
        makeParticle(canvas.width, canvas.height, cfg)
      );
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const count = targetCount(cfg);

      if (state.particles.length !== count) {
        // screen crossed the mobile breakpoint — rebuild the whole array
        state.particles = Array.from({ length: count }, () =>
          makeParticle(canvas.width, canvas.height, cfg)
        );
      } else {
        // same count — just scatter positions across the new canvas size
        state.particles.forEach((p) => {
          p.x = Math.random() * canvas.width;
          p.baseY = Math.random() * canvas.height;
        });
      }
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();

    let last = performance.now();
    const fadeSpeed = 1 / (cfg.fadeInDuration / 1000);

    function draw(now) {
      state.rafId = requestAnimationFrame(draw);

      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      if (state.alpha < state.targetAlpha) {
        state.alpha = Math.min(state.targetAlpha, state.alpha + fadeSpeed * dt);
      } else if (state.alpha > state.targetAlpha) {
        state.alpha = Math.max(state.targetAlpha, state.alpha - fadeSpeed * dt);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (state.alpha <= 0) return;

      ctx.font = `${cfg.charSize}px monospace`;
      ctx.textBaseline = 'top';

      for (const p of state.particles) {
        p.y = p.baseY + Math.sin(now * 0.001 * cfg.floatSpeed * Math.PI * 2 + p.phase) * cfg.floatAmplitude;

        p.x += p.driftDir * cfg.driftSpeed * 60 * dt;
        if (p.x < -20) p.x = canvas.width + 10;
        if (p.x > canvas.width + 20) p.x = -10;

        if (Math.random() < cfg.flickerRate) {
          p.char = CHARS[Math.floor(Math.random() * CHARS.length)];
        }

        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${(p.bri * state.alpha).toFixed(3)})`;
        ctx.fillText(p.char, p.x, p.y);
      }
    }

    state.rafId = requestAnimationFrame(draw);

    const heroEl = document.getElementById('hero-sentinel');
    const io = new IntersectionObserver(
      ([entry]) => {
        state.targetAlpha = entry.isIntersecting ? 0 : 1;
      },
      { threshold: 0.05 }
    );
    if (heroEl) io.observe(heroEl);

    // debounce resize so rapid dragging doesn't hammer the reinit
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(state.rafId);
      clearTimeout(resizeTimer);
      io.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
