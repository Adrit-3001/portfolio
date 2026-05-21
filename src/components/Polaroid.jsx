'use client';

import { useState, useEffect } from 'react';

export default function Polaroid({ src, alt, label, rotation = 0, objectPosition = 'center' }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <div
        className="polaroid"
        style={{ '--rot': `${rotation}deg` }}
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
        aria-label={`View ${label}`}
      >
        <div className="polaroid-photo">
          <img src={src} alt={alt} style={{ objectPosition }} />
        </div>
        <span className="polaroid-label">{label}</span>
      </div>

      {open && (
        <div className="lightbox" onClick={() => setOpen(false)}>
          <button className="lightbox-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
          <img
            src={src}
            alt={alt}
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
