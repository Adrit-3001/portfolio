'use client';

import { useState, useEffect, useRef } from 'react';
import AsciiCanvas from './AsciiCanvas';

const CONTACTS = [
  {
    label: 'Email',
    href: 'mailto:adrit.panday@mail.utoronto.ca',
    display: 'adrit.panday@mail.utoronto.ca',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Adrit-3001',
    display: 'GitHub',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/adrit-panday-016193216/' ,
    display: 'LinkedIn',
  },
];

export default function Hero() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <section className="hero" id="hero-sentinel">
      <div className="hero-left">
        <h1>Adrit Panday.</h1>
        <p className="hero-subtitle">Computer Science Engineer.</p>
        <p className="hero-desc">
          CS Specialist at the University of Toronto Scarborough with a minor in
          Astrophysics &amp; Astronomy. I build at the intersection of machine
          learning, systems programming, and full-stack engineering — from neural
          networks in raw C to AI-assisted clinical imaging pipelines and
          real-time geospatial platforms. On the full-stack side I architect
          end-to-end products with Node.js, Next.js, and MongoDB, containerized
          with Docker and shipped with automated CI/CD. Outside of engineering,
          I&apos;m usually deep in a video game or out in the park playing with friends.
        </p>
        <div className="ctas">
          <div className="cta-wrap" ref={wrapRef}>
            <button
              className="btn-orange"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
            >
              Get in touch<span className="plus">{open ? '−' : '+'}</span>
            </button>
            {open && (
              <div className="contact-dropdown">
                {CONTACTS.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    className="contact-item"
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <span className="contact-label">{c.label}</span>
                    <span className="contact-value">{c.display}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hero-right">
        <AsciiCanvas />
      </div>
    </section>
  );
}
