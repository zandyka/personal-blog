import Experience from '../components/Experience';
import Certifications from '../components/Certifications';
import { motion } from 'framer-motion';

export default function ExperiencePage() {
  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <Experience />
        <Certifications />
      </motion.div>
    </div>
  );
}