import { useEffect, useRef } from 'react';

export default function ClickSpark() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const sizeRef = useRef({ width: 0, height: 0 });
  const dprRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle canvas sizing with devicePixelRatio for sharp rendering
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      dprRef.current = dpr;
      sizeRef.current = { width, height };

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    // Animation frame loop
    const animate = (currentTime) => {
      const cvs = canvasRef.current;
      if (!cvs) {
        isAnimatingRef.current = false;
        return;
      }

      const ctx = cvs.getContext('2d');
      if (!ctx) {
        isAnimatingRef.current = false;
        return;
      }

      const dpr = dprRef.current;
      const { width, height } = sizeRef.current;

      // Delta time normalized to 60fps (16.67ms)
      const dt = lastTimeRef.current
        ? Math.min((currentTime - lastTimeRef.current) / 16.667, 2.5)
        : 1;
      lastTimeRef.current = currentTime;

      // Reset transform and clear
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const remaining = [];
      const gravity = 0.18; // Downward gravity pull

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const elapsed = currentTime - p.startTime;
        const progress = elapsed / p.duration;

        if (progress < 1) {
          // Physics step
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += gravity * dt;

          // Spark tail line calculations
          const currentSpeed = Math.hypot(p.vx, p.vy);
          const dirX = currentSpeed > 0.001 ? p.vx / currentSpeed : Math.cos(p.angle);
          const dirY = currentSpeed > 0.001 ? p.vy / currentSpeed : Math.sin(p.angle);
          const lineLength = p.length * Math.max(0.2, 1 - progress * 0.4);

          const tailX = p.x - dirX * lineLength;
          const tailY = p.y - dirY * lineLength;

          // Draw spark line
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.lineWidth;
          ctx.lineCap = 'round';
          ctx.globalAlpha = Math.max(0, 1 - progress);
          ctx.stroke();
          ctx.restore();

          remaining.push(p);
        }
      }

      particlesRef.current = remaining;

      if (remaining.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        isAnimatingRef.current = false;
        ctx.clearRect(0, 0, width, height);
      }
    };

    // Spawn 8-12 particles radiating outward from click position
    const handleClick = (e) => {
      if (typeof e.clientX !== 'number' || typeof e.clientY !== 'number') return;

      const x = e.clientX;
      const y = e.clientY;

      const style = getComputedStyle(document.documentElement);
      const accent = style.getPropertyValue('--accent').trim() || '#818cf8';
      const accentHover = style.getPropertyValue('--accent-hover').trim() || '#a5b4fc';
      const colors = [accent, accent, accentHover];

      const count = Math.floor(Math.random() * 5) + 8; // 8-12 particles
      const now = performance.now();
      const newSparks = [];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4; // 2-6
        const length = 6 + Math.random() * 9; // 6-15px
        const duration = 380 + Math.random() * 50; // ~400ms fade out

        newSparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          length,
          angle,
          color: colors[Math.floor(Math.random() * colors.length)],
          lineWidth: 1.5,
          startTime: now,
          duration,
        });
      }

      particlesRef.current.push(...newSparks);

      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        lastTimeRef.current = performance.now();
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9998,
      }}
      aria-hidden="true"
    />
  );
}