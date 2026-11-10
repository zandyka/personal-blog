import { motion } from 'framer-motion';
import HomeHero from '../components/home/HomeHero';
import FactTicker from '../components/home/FactTicker';
import Statement from '../components/home/Statement';
import WorkReel from '../components/home/WorkReel';
import ExperienceIndex from '../components/home/ExperienceIndex';
import PhotoRing from '../components/home/PhotoRing';
import '../components/home/home.css';

const HomePage = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="page-container h-page"
    style={{ paddingTop: 0 }}
  >
    <HomeHero />
    <FactTicker />
    <Statement />
    <WorkReel />
    <ExperienceIndex />
    <PhotoRing />
  </motion.div>
);

export default HomePage;
