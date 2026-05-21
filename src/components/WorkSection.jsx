import GlitchText from './GlitchText';
import ScrollReveal from './ScrollReveal';
import PolaroidStack from './PolaroidStack';

const PROJECTS = [
  {
    id: '01',
    name: 'GLOW',
    year: '2025',
    type: 'Full-Stack · Geospatial',
    stack: 'Node.js · Next.js · MongoDB · Docker',
    desc: 'Architected a full-stack geospatial platform enabling real-time visualization and analysis of Great Lakes nearshore water temperature data. Containerized with Docker, CI/CD via GitHub Actions with ~90% automated test coverage, and RESTful APIs backed by MongoDB with JWT authentication.',
    images: [
      {
        src: '/projects/GLOW_home_page.png',
        alt: 'GLOW dashboard with interactive map showing beach water temperatures across Toronto',
        label: 'Live Dashboard',
        objectPosition: 'center',
      },
    ],
  },
  {
    id: '02',
    name: 'Neural Network Engine',
    year: '2026',
    type: 'Systems · Machine Learning',
    stack: 'C',
    desc: 'Built a complete neural network training engine in C with no external ML libraries — implementing forward propagation, backpropagation, and explicit weight updates from first principles. Achieved 80%+ classification accuracy on MNIST and analyzed architectural tradeoffs between shallow and multi-layer networks on CIFAR-10.',
    images: [
      {
        src: '/projects/MINST_data.png',
        alt: 'MNIST handwritten digit dataset samples used for training and evaluation',
        label: 'MNIST Training Data',
        objectPosition: 'center top',
      },
      {
        src: '/projects/CIFAR-10_classification.png',
        alt: 'CIFAR-10 image classification samples across 10 categories',
        label: 'CIFAR-10 Samples',
        objectPosition: 'center',
      },
    ],
  },
  {
    id: '03',
    name: 'Multi-Agent Navigation',
    year: '2026',
    type: 'AI · Algorithms',
    stack: 'C',
    desc: 'Engineered an adversarial multi-agent decision system combining A* pathfinding (Manhattan heuristic, priority-queue optimized) with MiniMax alpha-beta pruning for real-time grid navigation. Alpha-beta pruning reduces evaluated states by ~60% at search depth ≥ 10, enabling real-time decisions in large constrained environments.',
    images: [
      {
        src: '/projects/search_MinMax.png',
        alt: 'MiniMax adversarial search visualization showing agent and opponent search areas in a maze',
        label: 'MiniMax Search',
        objectPosition: 'center',
      },
      {
        src: '/projects/search_order_Astar.png',
        alt: 'A* search order visualization showing explored nodes in a maze environment',
        label: 'A* Search Order',
        objectPosition: 'top center',
      },
    ],
  },
  {
    id: '04',
    name: 'F1 Fantasy Optimizer',
    year: '2024',
    type: 'ML · Data Science',
    stack: 'Python',
    desc: '1st place at MTA Datathon among 50+ participants. Applied ML-driven trend forecasting, risk evaluation, and budget optimization across 15+ race data points — including track history, race results, and car malfunction data — to identify the highest-performing F1 fantasy team within a $1M budget.',
    images: [
      {
        src: '/projects/Most_optimal_team.png',
        alt: 'Optimal F1 fantasy team selection showing 193 total points within $1M budget',
        label: 'Optimal Team',
        objectPosition: 'top center',
      },
      {
        src: '/projects/F1_points_driver.png',
        alt: 'F1 driver points and points-per-cost analysis bar chart',
        label: 'Driver Analysis',
        objectPosition: 'top center',
      },
    ],
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

      {PROJECTS.map((project) => (
        <div key={project.id} className="project-block">
          <div className="exp-content-grid" style={{ '--exp-image-gap': '170px' }}>
            <ScrollReveal className="proj-text-col">
              <div className="proj-header-row">
                <span className="proj-id">{project.id}</span>
                <span className="proj-year">{project.year}</span>
              </div>
              <GlitchText tag="h3" className="proj-name" delay={40}>
                {project.name}
              </GlitchText>
              <div className="proj-type">{project.type}</div>
              <div className="proj-stack-label">{project.stack}</div>
              <p className="proj-desc">{project.desc}</p>
            </ScrollReveal>

            <ScrollReveal className="polaroid-col" delay={200}>
              <PolaroidStack
                images={project.images}
                ariaLabel={`View ${project.name} screenshots`}
              />
            </ScrollReveal>
          </div>
        </div>
      ))}
    </section>
  );
}
