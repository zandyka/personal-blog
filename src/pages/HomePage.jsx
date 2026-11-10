import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import FactTicker from '../components/home/FactTicker';
import FlipSides from '../components/home/FlipSides';
import StatsBand from '../components/home/StatsBand';
import TechSphere from '../components/home/TechSphere';
import StackCards from '../components/home/StackCards';
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
    <Hero />
    <FactTicker />
    <FlipSides />
    <StatsBand />
    <TechSphere />
    <StackCards />
    <ExperienceIndex />
    <PhotoRing />
  </motion.div>
);

export default HomePage;
