import AsciiCanvas from './AsciiCanvas';

export default function Hero() {
  return (
    <section className="hero" id="hero-sentinel">
      <div className="hero-left">
        <h1>Adrit Panday.</h1>
        <p className="hero-subtitle">Computer Science Engineer.</p>
        <p className="hero-desc">
          CS Specialist at the University of Toronto Scarborough with a minor in
          Astrophysics &amp; Astronomy. I build at the intersection of machine
          learning, systems programming, and scientific computing — from neural
          networks in raw C to AI-assisted clinical imaging pipelines.
        </p>
        <div className="ctas">
          <a href="mailto:adrit.panday@mail.utoronto.ca" className="btn-orange">
            Get in touch<span className="plus">+</span>
          </a>
          <a href="mailto:adrit.panday@mail.utoronto.ca" className="btn-link">
            adrit.panday@mail.utoronto.ca
          </a>
        </div>
      </div>

      <div className="hero-right">
        <AsciiCanvas />
      </div>
    </section>
  );
}
