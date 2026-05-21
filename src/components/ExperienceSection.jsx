import GlitchText from './GlitchText';
import ScrollReveal from './ScrollReveal';
import PolaroidStack from './PolaroidStack';

const EXP_IMAGES = [
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
];

const EXPERIENCE_IMAGE_GAP = '170px';

export default function ExperienceSection() {
  return (
    <section className="section section-exp" style={{ '--exp-image-gap': EXPERIENCE_IMAGE_GAP }}>
      <div className="section-label">
        <GlitchText tag="h2" className="section-title">
          Work Experience
        </GlitchText>
        <span className="section-num">02 / 03</span>
      </div>

      <div className="exp-content-grid">
        <ScrollReveal className="exp-text-col">
          <div className="exp-header-row">
            <div className="exp-company">Sunnybrook Hospital &mdash; Toronto, ON</div>
            <div className="exp-date-right">Oct 2024 &mdash; May 2025</div>
          </div>
          <GlitchText tag="h3" className="exp-role" delay={80}>
            ML Software Developer
          </GlitchText>
          <div className="exp-stack">Python · PyTorch · QuPath · OME-XML</div>
          <ul className="exp-bullets">
            <li>
              Engineered automated preprocessing pipelines for histopathology tumor
              imaging, reducing manual data preparation time by 64% and enabling
              faster, more scalable model training workflows.
            </li>
            <li>
              Built a multi-format image parsing framework supporting .svs and .tif
              whole-slide scans with QuPath and OME-XML integration, expanding
              dataset compatibility across research pipelines by 40%.
            </li>
            <li>
              Optimized deep learning training pipelines with custom PyTorch classes
              for flow recomputation, geometric augmentation, and resolution
              normalization — improving training efficiency by 35%.
            </li>
            <li>
              Enhanced AI-assisted tumor segmentation workflows, optimizing GPU-based
              preprocessing throughput for large-scale model training on
              high-resolution whole-slide images.
            </li>
          </ul>
        </ScrollReveal>

        <ScrollReveal className="polaroid-col" delay={200}>
          <PolaroidStack
            images={EXP_IMAGES}
            ariaLabel="View research images"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
