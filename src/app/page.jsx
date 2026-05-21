import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ExperienceSection from '@/components/ExperienceSection';
import WorkSection from '@/components/WorkSection';
import BottomBar from '@/components/BottomBar';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <ExperienceSection />
      <WorkSection />
      <BottomBar />
    </>
  );
}
