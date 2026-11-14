import { Fragment } from 'react';
import GlitchText from './GlitchText';
import ScrollReveal from './ScrollReveal';
import PolaroidStack from './PolaroidStack';

const EXPERIENCES = [
  {
    company: 'TD Bank',
    location: 'Toronto, ON',
    date: 'Sep 2026 — Dec 2026',
    role: 'Software Engineer Intern',
    stack: 'Python · Cobol · DB2',
    bullets: [
      'Co-developed a Python-based application-mapping and impact analysis platform that consolidates Cobol source code, job schedules, and documentation across 12 mainframe applications into a searchable web interface.',
      'Enabled engineers to assess change impacts, troubleshoot failures, and trace cross-system data flows, reducing impact analysis and troubleshooting time by an estimated 70%.',
      'Developed DB2 unit tests for Cobol mainframe programs, resolved severe errors ahead of PAT deployment, and authored deployment documentation for the Mainframe team, ensuring stable, production-ready releases.',
      'Co-hosted hands-on Builder’s Club sessions as part of a 6-person organizing team, introducing colleagues to emerging technologies such as fruit fly brain simulation, website hacking, and reverse engineering and merging games into new ones.',
    ],
    images: [
      {
        src: '/work_experience/job_flow.png',
        alt: 'Job Flow mainframe scheduling atlas: searchable map of jobs, programs, and copybooks across 12 repositories',
        label: 'Job Flow Atlas',
        objectPosition: 'top left',
      },
      {
        src: '/work_experience/job_flow_dia.png',
        alt: 'Job dependency graph tracing a mainframe batch job to the jobs that run after it',
        label: 'Dependency Graph',
        objectPosition: 'left center',
      },
    ],
    imagesAriaLabel: 'View TD Bank images',
  },
  {
    company: 'Sunnybrook Hospital',
    location: 'Toronto, ON',
    date: 'Oct 2024 — May 2025',
    role: 'ML Software Developer',
    stack: 'Python · PyTorch · QuPath · OME-XML',
    bullets: [
      'Engineered automated Python preprocessing pipelines for histopathology tumor imaging, cutting data preparation time by ~85% — replacing multi-day manual processing with unattended 2–3 hour automated runs requiring only result verification.',
      'Developed a multi-format image parsing framework supporting .svs and .tif whole-slide scans with QuPath and OME-XML integration, increasing the number of usable scans across multiple research pipelines by 40%.',
      'Built deep learning training pipelines by implementing custom PyTorch preprocessing classes for flow recomputation, geometric augmentation, and resolution normalization, reducing training and evaluation time per run by 35%.',
      'Enhanced AI-assisted tumor segmentation workflows within Paracell’s research platform while optimizing GPU-based preprocessing throughput and memory usage to support large-scale model training on high-resolution whole-slide images.',
    ],
    images: [
      {
        src: '/work_experience/wsi-annotated.png',
        alt: 'Annotated whole-slide histopathology image with labeled tissue regions',
        label: 'Annotated WSI',
        objectPosition: 'top left',
      },
      {
        src: '/work_experience/inference-pipeline.png',
        alt: 'Directed inference pipeline: tile selection, neoplastic probability, cluster map',
        label: 'Inference Output',
        objectPosition: 'center',
      },
    ],
    imagesAriaLabel: 'View research images',
  },
];

const EXPERIENCE_IMAGE_GAP = '170px';

export default function ExperienceSection() {
  return (
    <section className="section section-exp" id="experience" style={{ '--exp-image-gap': EXPERIENCE_IMAGE_GAP }}>
      <div className="section-label">
        <GlitchText tag="h2" className="section-title">
          Work Experience
        </GlitchText>
        <span className="section-num">02 / 04</span>
      </div>

      <div className="exp-content-grid">
        {EXPERIENCES.map((exp) => (
          <Fragment key={exp.company}>
            <ScrollReveal className="exp-text-col">
              <div className="exp-header-row">
                <div className="exp-company">{exp.company} &mdash; {exp.location}</div>
                <div className="exp-date-right">{exp.date}</div>
              </div>
              <GlitchText tag="h3" className="exp-role" delay={80}>
                {exp.role}
              </GlitchText>
              <div className="exp-stack">{exp.stack}</div>
              <ul className="exp-bullets">
                {exp.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </ScrollReveal>

            {exp.images.length > 0 ? (
              <ScrollReveal className="polaroid-col" delay={200}>
                <PolaroidStack images={exp.images} ariaLabel={exp.imagesAriaLabel} />
              </ScrollReveal>
            ) : (
              <div className="polaroid-col-empty" aria-hidden="true" />
            )}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
