import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import SkillsTypography from '../components/SkillsTypography';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';
import InfiniteMarquee from '../components/ui/InfiniteMarquee';

const TECH_ITEMS = [
  'React', 'JavaScript', 'Flutter', 'Node.js', 'Python',
  'Firebase', 'PHP', 'Laravel', 'MySQL', 'Figma',
  'Java', 'C++', 'Git', 'REST API', 'Mobile Dev',
];

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="page-container"
      style={{ paddingTop: 0 }}
    >
      <Hero />

      {/* Tech marquee - only one */}
      <InfiniteMarquee items={TECH_ITEMS} speed={30} />

      {/* Skills typography section */}
      <SkillsTypography />

      {/* Gallery */}
      <Gallery />

      {/* Contact */}
      <div style={{ borderTop: '1px solid var(--border)' }}>
        <Contact />
      </div>
    </motion.div>
  );
};

export default HomePage;