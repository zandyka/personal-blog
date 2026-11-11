import Projects from '../components/Projects.jsx';
import { motion } from 'framer-motion';

export default function ProjectsPage() {
  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <Projects />
      </motion.div>
    </div>
  );
}