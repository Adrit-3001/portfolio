import GlitchText from './GlitchText';
import ScrollReveal from './ScrollReveal';

const PROJECTS = [
  {
    id: '01',
    name: 'GLOW',
    year: '2025',
    type: 'Full-Stack · Geospatial',
    stack: 'Node.js · Next.js · MongoDB · Docker',
    desc: 'Architected a full-stack geospatial platform enabling real-time visualization and analysis of Great Lakes nearshore water temperature data. Containerized with Docker, CI/CD via GitHub Actions with ~90% automated test coverage, and RESTful APIs backed by MongoDB with JWT authentication.',
  },
  {
    id: '02',
    name: 'Neural Network Engine',
    year: '2026',
    type: 'Systems · Machine Learning',
    stack: 'C',
    desc: 'Built a complete neural network training engine in C with no external ML libraries — implementing forward propagation, backpropagation, and explicit weight updates from first principles. Achieved 80%+ classification accuracy on MNIST and analyzed architectural tradeoffs between shallow and multi-layer networks on CIFAR-10.',
  },
  {
    id: '03',
    name: 'Multi-Agent Navigation',
    year: '2026',
    type: 'AI · Algorithms',
    stack: 'C',
    desc: 'Engineered an adversarial multi-agent decision system combining A* pathfinding (Manhattan heuristic, priority-queue optimized) with MiniMax alpha-beta pruning for real-time grid navigation. Alpha-beta pruning reduces evaluated states by ~60% at search depth ≥ 10, enabling real-time decision-making in constrained environments.',
  },
  {
    id: '04',
    name: 'F1 Fantasy Optimizer',
    year: '2024',
    type: 'ML · Data Science',
    stack: 'Python',
    desc: '1st place at MTA Datathon among 50+ participants. Applied ML-driven trend forecasting, risk evaluation, and budget optimization across 15+ race data points — including track history, race results, and car malfunction data — to identify the highest-performing team within budget constraints.',
  },
];

export default function WorkSection() {
  return (
    <section className="section">
      <div className="section-label">
        <GlitchText tag="h2" className="section-title">
          Selected Projects
        </GlitchText>
        <span className="section-num">03 / 03</span>
      </div>

      {PROJECTS.map((project, i) => (
        <ScrollReveal key={project.id} className="project-row" delay={i * 90}>
          <span className="project-num">{project.id}</span>
          <div className="project-body">
            <div className="project-meta">
              <GlitchText tag="h3" className="project-name" delay={i * 60}>
                {project.name}
              </GlitchText>
              <div className="project-meta-right">
                <span className="project-type">{project.type}</span>
                <span className="project-year">{project.year}</span>
              </div>
            </div>
            <div className="project-stack">{project.stack}</div>
            <p className="project-desc">{project.desc}</p>
          </div>
        </ScrollReveal>
      ))}
    </section>
  );
}
