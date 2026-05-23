export default function Nav() {
  return (
    <nav>
      <div><div className="logo">AP</div></div>

      <div className="nav-links">
        <a href="#experience" className="nav-link">Work</a>
        <a href="#projects" className="nav-link">Projects</a>
        <a href="#skills" className="nav-link">Skills</a>
        <a href="mailto:adrit.panday@mail.utoronto.ca" className="nav-link">Contact</a>
      </div>

      {/* <div className="nav-right">
        <a href="mailto:adrit.panday@mail.utoronto.ca" className="nav-cta">
          Let&apos;s work together<span className="plus">+</span>
        </a>
      </div> */}
    </nav>
  );
}
