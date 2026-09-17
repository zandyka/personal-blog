import React, { useEffect, useId, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SparklesCore } from '@/components/ui/sparkles';

export const Cover = ({
  children,
  className,
}) => {
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [beamPositions, setBeamPositions] = useState([]);

  useEffect(() => {
    const updateDimensions = () => {
      if (ref.current) {
        const width = ref.current.offsetWidth || 300;
        const height = ref.current.offsetHeight || 60;
        setContainerWidth(width);

        const numberOfBeams = Math.min(6, Math.max(3, Math.floor(height / 14)));
        const positions = Array.from(
          { length: numberOfBeams },
          (_, i) => (i + 1) * (height / (numberOfBeams + 1))
        );
        setBeamPositions(positions);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={ref}
      className={cn('cover-badge-container', className)}
    >
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: {
                duration: 0.2,
              },
            }}
            className="cover-sparkles-wrapper"
          >
            <motion.span
              animate={{
                translateX: ['-50%', '0%'],
              }}
              transition={{
                translateX: {
                  duration: 8,
                  ease: 'linear',
                  repeat: Infinity,
                },
              }}
              className="cover-sparkles-inner"
            >
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={500}
                className="w-full h-full"
                particleColor="#FFFFFF"
              />
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={500}
                className="w-full h-full"
                particleColor="#FFFFFF"
              />
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>

      {beamPositions.map((position, index) => (
        <Beam
          key={index}
          hovered={hovered}
          duration={Math.random() * 2 + 1}
          delay={Math.random() * 2 + 1}
          width={containerWidth || 400}
          style={{
            top: `${position}px`,
          }}
        />
      ))}

      <motion.span
        animate={{
          scale: hovered ? 0.94 : 1,
          x: hovered ? [0, -8, 8, -8, 8, 0] : 0,
          y: hovered ? [0, 6, -6, 6, -6, 0] : 0,
        }}
        transition={{
          duration: 0.2,
          x: {
            duration: 0.22,
            repeat: Infinity,
            repeatType: 'loop',
          },
          y: {
            duration: 0.22,
            repeat: Infinity,
            repeatType: 'loop',
          },
          scale: {
            duration: 0.2,
          },
        }}
        className={cn('cover-badge-text', className)}
      >
        {children}
      </motion.span>

      <CircleIcon className="cover-dot-tr" style={{ right: '-3px', top: '-3px' }} />
      <CircleIcon className="cover-dot-br" style={{ right: '-3px', bottom: '-3px' }} delay={0.4} />
      <CircleIcon className="cover-dot-tl" style={{ left: '-3px', top: '-3px' }} delay={0.8} />
      <CircleIcon className="cover-dot-bl" style={{ left: '-3px', bottom: '-3px' }} delay={1.6} />
    </span>
  );
};

export const Beam = ({
  className,
  delay,
  duration,
  hovered,
  width = 600,
  style = {},
  ...svgProps
}) => {
  const rawId = useId();
  const id = rawId.replace(/:/g, '');

  return (
    <motion.svg
      width={width ?? '600'}
      height="1"
      viewBox={`0 0 ${width ?? '600'} 1`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('cover-beam', className)}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        width: '100%',
        height: '1px',
        pointerEvents: 'none',
        zIndex: 15,
        ...style,
      }}
      {...svgProps}
    >
      <motion.path
        d={`M0 0.5H${width ?? '600'}`}
        stroke={`url(#svgGradient-${id})`}
        strokeWidth="1.5"
      />

      <defs>
        <motion.linearGradient
          id={`svgGradient-${id}`}
          key={String(hovered)}
          gradientUnits="userSpaceOnUse"
          initial={{
            x1: '0%',
            x2: hovered ? '-10%' : '-5%',
            y1: 0,
            y2: 0,
          }}
          animate={{
            x1: '110%',
            x2: hovered ? '100%' : '105%',
            y1: 0,
            y2: 0,
          }}
          transition={{
            duration: hovered ? 0.5 : duration ?? 2,
            ease: 'linear',
            repeat: Infinity,
            delay: hovered ? Math.random() * (1 - 0.2) + 0.2 : 0,
            repeatDelay: hovered ? Math.random() * (2 - 1) + 1 : delay ?? 1,
          }}
        >
          <stop stopColor="#2EB9DF" stopOpacity="0" />
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </motion.svg>
  );
};

export const CircleIcon = ({
  className,
  delay = 0,
  style = {},
  ...props
}) => {
  return (
    <div
      className={cn('cover-dot-icon', className)}
      style={{
        position: 'absolute',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 25,
        animationDelay: `${delay}s`,
        ...style,
      }}
      {...props}
    />
  );
};

export default Cover;
