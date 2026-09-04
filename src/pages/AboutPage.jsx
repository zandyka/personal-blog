import About from '../components/About';
import SkillsTechStack from '../components/SkillsTechStack';
import Gallery from '../components/Gallery';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <About />
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <SkillsTechStack />
        </div>
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <Gallery />
        </div>
      </motion.div>
    </div>
  );
}
