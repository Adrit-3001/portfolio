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
    desc: 'Architected a full-stack geospatial platform enabling real-time visualization and analysis of Great Lakes nearshore water temperature data.',
    bullets: [
      'Built interactive Leaflet maps and Chart.js dashboards for real-time water temperature visualization across Great Lakes beaches.',
      'Designed RESTful APIs with JWT-based authentication and MongoDB data models supporting high-volume geospatial data ingestion.',
      'Containerized with Docker and implemented CI/CD via GitHub Actions with ~90% automated test coverage and production deployment readiness.',
    ],
    images: [
      {
        src: '/projects/GLOW_home_page.png',
        alt: 'GLOW Home Page with interactive map showing beach water temperatures across Toronto',
        label: 'Live Map',
        objectPosition: 'center top',
      },
      {
        src: '/projects/GLOW_user_dashboard.png',
        alt: 'GLOW user dashboard where users can view and manage their saved beach locations and edit temperature logs',
        label: 'User Dashboard',
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
    desc: 'Built a complete neural network training engine in C with no external ML libraries — implementing forward propagation, backpropagation, and explicit weight updates from first principles.',
    bullets: [
      'Derived and implemented full error backpropagation from scratch, carefully managing gradient flow and weight update sequencing across layers.',
      'Achieved 80%+ classification accuracy on MNIST; analyzed performance gaps between shallow and multi-layer architectures on CIFAR-10.',
      'Experimented with activation functions, hidden layer sizes, and input scaling to mitigate saturation and optimize convergence.',
    ],
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
    name: '1st Place MTA F1 Datathon',
    year: '2024',
    type: 'ML · Data Science',
    stack: 'Python',
    desc: '1st place at MTA Datathon among 50+ participants. Applied ML-driven forecasting and budget optimization to build the highest-scoring F1 fantasy team within a $1M cap.',
    bullets: [
      'Analyzed 15+ race data points — track history, driver form, results, and car malfunction rates — to build performance forecast models.',
      'Applied budget optimization within the $1M cap to identify the team scoring 193 points, securing 1st place among 50+ participants.',
      'Collaborated in a 4-person team using agile workflows across data acquisition, model building, and final presentation.',
    ],
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
  {
    id: '04',
    name: 'Robotics & Localization',
    year: '2024',
    type: 'Robotics · Computer Vision · AI',
    stack: 'C/C++ · OpenCV · Linux · LEGO EV3',
    desc: 'Built two autonomous robot systems from scratch — an adversarial soccer-playing robot and a probabilistic self-localizing navigator — both deployed on LEGO EV3 hardware under real-world noise conditions.',
    bullets: [
      'Developed autonomous soccer robot with webcam blob tracking, finite-state decision logic (ball intercept, goal pursuit, opponent avoidance), and Bluetooth actuation — placed Top 8 at RoboSoccer competition.',
      'Built perspective-correction and heading-estimation calibration pipeline for a 170 cm × 115 cm playfield under noisy vision input.',
      'Implemented Markov/histogram localization maintaining belief states across grid intersections × 4 orientations with probabilistic sensor fusion for robust recovery from ambiguous states.',
    ],
    images: [
      {
        src: '/projects/robosoccer_robot.jpg',
        alt: 'LEGO EV3 robot built for the RoboSoccer competition',
        label: 'EV3 Robot',
        objectPosition: 'center',
      },
      {
        src: '/projects/Robo.png',
        alt: 'RoboSoccer competition field with autonomous robots competing',
        label: 'RoboSoccer Match',
        objectPosition: 'center',
      },
      {
        src: '/projects/localization_robot.png',
        alt: 'Probabilistic localization grid showing robot belief states across orientations',
        label: 'Localization Grid',
        objectPosition: 'center',
      },
    ],
  },
  {
    id: '05',
    name: 'Multi-Agent Navigation',
    year: '2026',
    type: 'AI · Algorithms',
    stack: 'C',
    desc: 'Engineered an adversarial multi-agent decision system combining A* pathfinding with MiniMax alpha-beta pruning for real-time grid navigation.',
    bullets: [
      'Built A* pathfinding with Manhattan heuristic and priority-queue optimization for optimal, real-time path planning in constrained grids.',
      'Developed MiniMax with alpha-beta pruning, reducing evaluated states by ~60% at search depth ≥ 10 for sub-second adversarial decisions.',
      'Designed the system to handle dynamic opponent behaviour, enabling robust navigation across large, unpredictable environments.',
    ],
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
];

export default function WorkSection() {
  return (
    <section className="section" id="projects">
      <div className="section-label">
        <GlitchText tag="h2" className="section-title">
          Selected Projects
        </GlitchText>
        <span className="section-num">03 / 04</span>
      </div>

      {PROJECTS.map((project, index) => (
        <div key={project.id} className={`project-block${index === 0 ? ' project-block-first' : ''}`}>
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
              <ul className="proj-bullets">
                {project.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
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
