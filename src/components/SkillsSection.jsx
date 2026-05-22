import GlitchText from './GlitchText';
import ScrollReveal from './ScrollReveal';

const SKILLS = [
  {
    category: 'Languages',
    items: ['Python', 'C', 'C++', 'JavaScript', 'Java', 'SQL'],
  },
  {
    category: 'Machine Learning & AI',
    items: ['PyTorch', 'TensorFlow', 'NumPy', 'pandas', 'Scikit-learn', 'LLM APIs'],
  },
  {
    category: 'Robotics & Vision',
    items: ['OpenCV', 'Sensor Fusion', 'Localization', 'State Machines', 'Motion Planning', 'Real-Time Control'],
  },
  {
    category: 'Frameworks',
    items: ['Node.js', 'Express', 'Next.js', 'React'],
  },
  {
    category: 'Tools & Infrastructure',
    items: ['Git', 'GitHub Actions', 'Docker', 'Linux (Ubuntu)', 'MongoDB', 'Jira', 'VS Code'],
  },
  {
    category: 'Familiar',
    items: ['Haskell', 'Assembly', 'Shell', 'QuPath', 'OME-XML', 'HTML/CSS'],
  },
];

export default function SkillsSection() {
  return (
    <section className="section section-skills" id="skills">
      <div className="section-label">
        <GlitchText tag="h2" className="section-title">
          Technical Skills
        </GlitchText>
        <span className="section-num">04 / 04</span>
      </div>

      <div className="skills-grid">
        {SKILLS.map((group, i) => (
          <ScrollReveal key={group.category} className="skill-group" delay={i * 90}>
            <div className="skill-category">{group.category}</div>
            <div className="skill-tags">
              {group.items.map((item) => (
                <span key={item} className="skill-tag">{item}</span>
              ))}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
