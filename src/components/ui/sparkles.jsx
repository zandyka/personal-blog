import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const SparklesCore = ({
  id,
  className,
  background = 'transparent',
  minSize = 0.4,
  maxSize = 1,
  speed = 1,
  particleColor = '#FFFFFF',
  particleDensity = 120,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = canvas.offsetWidth || 300;
    let height = canvas.offsetHeight || 100;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      if (!canvas) return;
      width = canvas.offsetWidth || 300;
      height = canvas.offsetHeight || 100;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const count = Math.min(250, Math.max(30, Math.floor((width * height / 10000) * (particleDensity / 100) * 12)));

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: minSize + Math.random() * (maxSize - minSize),
      opacity: Math.random() * 0.8 + 0.2,
      opacitySpeed: (Math.random() * 0.02 + 0.008) * speed,
      vx: (Math.random() - 0.5) * 0.3 * speed,
      vy: (Math.random() - 0.5) * 0.3 * speed,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (background && background !== 'transparent') {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.fillStyle = particleColor;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.opacity += p.opacitySpeed;
        if (p.opacity > 1 || p.opacity < 0.15) {
          p.opacitySpeed = -p.opacitySpeed;
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [background, minSize, maxSize, speed, particleColor, particleDensity]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn('h-full w-full pointer-events-none', className)}
      style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <canvas
        ref={canvasRef}
        id={id}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  );
};

export default SparklesCore;
