'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

const IMAGES = [
  {
    src: '/work_experience/wsi-annotated.png',
    alt: 'Annotated whole-slide histopathology image with labeled tissue regions',
    label: 'Annotated WSI',
    objectPosition: 'top left',
  },
  {
    src: '/work_experience/inference-pipeline.png',
    alt: 'Directed inference pipeline: tile selection, neoplastic probability, cluster map',
    label: 'Inference Output',
    objectPosition: 'center',
  },
];

const POLAROID_STACK_WIDTH = '450px';

export default function PolaroidStack() {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const prev = useCallback(() => setIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length), []);
  const next = useCallback(() => setIndex((i) => (i + 1) % IMAGES.length), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, prev, next]);

  const lightbox = open && typeof document !== 'undefined'
    ? createPortal(
        <div className="lightbox" onClick={() => setOpen(false)}>
          <div className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="lightbox-viewer">
              <button
                className="lightbox-arrow lightbox-prev"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous image"
              >
                ←
              </button>

              <img
                key={index}
                src={IMAGES[index].src}
                alt={IMAGES[index].alt}
                className="lightbox-img"
              />

              <button
                className="lightbox-arrow lightbox-next"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next image"
              >
                →
              </button>
            </div>

            <div className="lightbox-caption">
              <div className="lightbox-title">{IMAGES[index].label}</div>
              <div className="lightbox-alt">{IMAGES[index].alt}</div>
            </div>

            <div className="lightbox-counter">
              {index + 1} / {IMAGES.length}
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <div
        className="polaroid-stack"
        style={{ '--polaroid-stack-width': POLAROID_STACK_WIDTH }}
        onClick={() => { setIndex(0); setOpen(true); }}
        role="button"
        tabIndex={0}
        aria-label="View research images"
        onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
      >
        {/* Bottom card — peeking out behind */}
        <div className="polaroid polaroid-back">
          <div className="polaroid-photo">
            <img
              src={IMAGES[1].src}
              alt={IMAGES[1].alt}
              style={{ objectPosition: IMAGES[1].objectPosition }}
            />
          </div>
          <span className="polaroid-label">{IMAGES[1].label}</span>
        </div>

        {/* Top card — front of stack */}
        <div className="polaroid polaroid-front">
          <div className="polaroid-photo">
            <img
              src={IMAGES[0].src}
              alt={IMAGES[0].alt}
              style={{ objectPosition: IMAGES[0].objectPosition }}
            />
          </div>
          <span className="polaroid-label">{IMAGES[0].label}</span>
        </div>

        <span className="polaroid-hint">click to view</span>
      </div>

      {lightbox}
    </>
  );
}
