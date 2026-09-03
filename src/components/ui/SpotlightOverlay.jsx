export default function SpotlightOverlay() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Left beam */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
      }}>
        <div style={{
          transform: 'translateY(-300px) rotate(-45deg)',
          background: 'radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(0,0%,100%,0.08) 0, hsla(0,0%,100%,0.03) 50%, transparent 80%)',
          width: '500px', height: '1200px',
          position: 'absolute', top: 0, left: 0,
        }} />
        <div style={{
          transform: 'rotate(-45deg) translate(5%, -50%)',
          background: 'radial-gradient(50% 50% at 50% 50%, hsla(0,0%,100%,0.06) 0, hsla(0,0%,100%,0.01) 80%, transparent 100%)',
          width: '200px', height: '1200px',
          position: 'absolute', top: 0, left: 0, transformOrigin: 'top left',
        }} />
      </div>
      {/* Right beam */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '100vw', height: '100vh',
      }}>
        <div style={{
          transform: 'translateY(-300px) rotate(45deg)',
          background: 'radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(0,0%,100%,0.08) 0, hsla(0,0%,100%,0.03) 50%, transparent 80%)',
          width: '500px', height: '1200px',
          position: 'absolute', top: 0, right: 0,
        }} />
        <div style={{
          transform: 'rotate(45deg) translate(-5%, -50%)',
          background: 'radial-gradient(50% 50% at 50% 50%, hsla(0,0%,100%,0.06) 0, hsla(0,0%,100%,0.01) 80%, transparent 100%)',
          width: '200px', height: '1200px',
          position: 'absolute', top: 0, right: 0, transformOrigin: 'top right',
        }} />
      </div>
    </div>
  );
}