'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

const DEFAULT_STACK_WIDTH = '450px';

export default function PolaroidStack({ images, ariaLabel = 'View images', stackWidth = DEFAULT_STACK_WIDTH }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);

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
                src={images[index].src}
                alt={images[index].alt}
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
              <div className="lightbox-title">{images[index].label}</div>
              <div className="lightbox-alt">{images[index].alt}</div>
            </div>

            <div className="lightbox-counter">
              {index + 1} / {images.length}
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  const hasMultiple = images.length > 1;

  return (
    <>
      <div
        className="polaroid-stack"
        style={{ '--polaroid-stack-width': stackWidth }}
        onClick={() => { setIndex(0); setOpen(true); }}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
      >
        {hasMultiple && (
          <div className="polaroid polaroid-back">
            <div className="polaroid-photo">
              <img
                src={images[images.length - 1].src}
                alt={images[images.length - 1].alt}
                style={{ objectPosition: images[images.length - 1].objectPosition ?? 'center' }}
              />
            </div>
            <span className="polaroid-label">{images[images.length - 1].label}</span>
          </div>
        )}

        <div className="polaroid polaroid-front">
          <div className="polaroid-photo">
            <img
              src={images[0].src}
              alt={images[0].alt}
              style={{ objectPosition: images[0].objectPosition ?? 'center' }}
            />
          </div>
          <span className="polaroid-label">{images[0].label}</span>
        </div>

        <span className="polaroid-hint">click to view</span>
      </div>

      {lightbox}
    </>
  );
}
