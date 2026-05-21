'use client';

import { useRef, useEffect, useState } from 'react';

const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?+=~^:;';

function scramble(text) {
  return text
    .split('')
    .map((c) => (c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]))
    .join('');
}

export default function GlitchText({
  children,
  tag: Tag = 'span',
  duration = 700,
  delay = 0,
  className,
}) {
  const ref = useRef(null);
  const [displayed, setDisplayed] = useState(() => scramble(children));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let rafId;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        let startTime = null;

        function animate(now) {
          if (startTime === null) startTime = now;
          const elapsed = now - startTime - delay;

          if (elapsed < 0) {
            setDisplayed(scramble(children));
            rafId = requestAnimationFrame(animate);
            return;
          }

          const progress = Math.min(1, elapsed / duration);
          const locked = Math.floor(progress * children.length);

          const result = children
            .split('')
            .map((c, i) => {
              if (c === ' ') return ' ';
              if (i < locked) return c;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('');

          setDisplayed(result);

          if (progress < 1) {
            rafId = requestAnimationFrame(animate);
          } else {
            setDisplayed(children);
          }
        }

        rafId = requestAnimationFrame(animate);
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [children, duration, delay]);

  return (
    <Tag ref={ref} className={className}>
      {displayed}
    </Tag>
  );
}
