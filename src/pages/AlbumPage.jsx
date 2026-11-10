import { useEffect } from 'react';
import Hero8 from '../components/ui/Hero8';
import Gallery from '../components/Gallery';

export default function AlbumPage() {
  useEffect(() => {
    const previous = document.title;
    document.title = 'Visual Album - Portofolio Zack';
    window.scrollTo(0, 0);
    // kembalikan judul tab saat meninggalkan halaman album
    return () => {
      document.title = previous;
    };
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