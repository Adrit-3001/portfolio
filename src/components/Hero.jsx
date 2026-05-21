import AsciiCanvas from './AsciiCanvas';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <h1>Computer<br />Science<br />Engineer.</h1>
        <p className="hero-desc">
          Adrit Panday is a CS Specialist at the University of Toronto Scarborough,
          building at the intersection of machine learning, systems programming, and robotics.
        </p>
        <div className="ctas">
          <a href="#" className="btn-orange">View my work<span className="plus">+</span></a>
          <a href="mailto:adrit.panday@mail.utoronto.ca" className="btn-link">Get in touch</a>
        </div>
      </div>

      <div className="hero-right">
        <AsciiCanvas />
      </div>
    </section>
  );
}
