import { useEffect } from 'react';
import Hero8 from '../components/ui/Hero8';
import Gallery from '../components/Gallery';

export default function AlbumPage() {
  useEffect(() => {
    document.title = 'Visual Album — Muhammad Daffa Zacky Andyka';
    window.scrollTo(0, 0);
  }, []);

  const handleScrollToAlbum = () => {
    const section = document.getElementById('gallery');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* 1. React Bits Pro Hero 8 Section */}
      <Hero8 onExploreClick={handleScrollToAlbum} />

      {/* 2. Gallery Section — Complete 21-Photo Visual Album */}
      <Gallery showAlbumButton={false} isFullAlbum={true} />
    </div>
  );
}