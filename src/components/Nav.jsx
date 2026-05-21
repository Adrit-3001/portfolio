export default function Nav() {
  return (
    <nav>
      <div><div className="logo">AP</div></div>
      <button className="menu-btn">
        MENU
        <div className="hamburger">
          <span /><span />
        </div>
      </button>
      <div className="nav-right">
        <a href="mailto:adrit.panday@mail.utoronto.ca" className="nav-cta">
          Let&apos;s work together<span className="plus">+</span>
        </a>
      </div>
    </nav>
  );
}
