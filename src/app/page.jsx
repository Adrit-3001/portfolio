import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ExperienceSection from '@/components/ExperienceSection';
import WorkSection from '@/components/WorkSection';
import BottomBar from '@/components/BottomBar';
import FloatingParticles from '@/components/FloatingParticles';

export default function Home() {
  return (
    <>
      <FloatingParticles />
      <Nav />
      <Hero />
      <ExperienceSection />
      <WorkSection />
      <BottomBar />
    </>
  );
}
