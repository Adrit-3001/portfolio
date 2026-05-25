const TECH = ['Python', 'PyTorch', 'C / C++', 'Next.js', 'Docker'];

export default function BottomBar() {
  return (
    <div className="bottom-bar">
      <div className="bottom-label">
        Computer Science Specialist<br />University of Toronto
      </div>
      <div className="tech-row">
        {TECH.map((t) => (
          <span key={t} className="tech-item">{t}</span>
        ))}
        <span className="tech-more">+ many more</span>
      </div>
    </div>
  );
}
