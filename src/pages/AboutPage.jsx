import { motion } from 'framer-motion';
import About from '../components/About';
import SkillsTechStack from '../components/SkillsTechStack';
import JourneyMap from '../components/JourneyMap';

export default function AboutPage() {
  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        {/* 1. About Me & GitHub Contributions */}
        <About />

        {/* 2. Skills & Technology Stack */}
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <SkillsTechStack />
        </div>

        {/* 3. My Journey Map */}
        <JourneyMap />
      </motion.div>
    </div>
  );
}