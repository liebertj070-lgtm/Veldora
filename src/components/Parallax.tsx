import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

interface ParallaxFrameProps {
  children: React.ReactNode;
  className?: string;
  /** Vertical travel in percentage (e.g. 7 moves from -7% to +7%) */
  range?: number;
  /** Base overscale to prevent edge exposure during travel */
  scale?: number;
}

/**
 * Masked scroll-parallax image container powered by Framer Motion useScroll + useTransform.
 * Animates exclusively transform properties and disables spatial shift
 * when prefers-reduced-motion is active.
 */
export const ParallaxFrame: React.FC<ParallaxFrameProps> = ({
  children,
  className = '',
  range = 6,
  scale = 1.1,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? ['0%', '0%'] : [`-${range}%`, `${range}%`]
  );

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{
          y,
          scale: prefersReduced ? 1 : scale,
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};

interface ParallaxLayerProps {
  children: React.ReactNode;
  className?: string;
  /** Pixel offset from start to end of viewport traversal */
  offsetY?: [number, number];
}

/**
 * Multi-plane editorial depth layer driven by Framer Motion scroll progress.
 */
export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  className = '',
  offsetY = [-20, 20],
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? [0, 0] : offsetY
  );

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
};

interface ParallaxBackdropProps {
  variant?: 'obsidian' | 'bone';
  className?: string;
}

/**
 * Subtle architectural grid backdrop layer that glides behind section content
 * at a slower scroll speed to create depth without excess GPU layer memory.
 */
export const ParallaxBackdrop: React.FC<ParallaxBackdropProps> = ({
  variant = 'bone',
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? ['0%', '0%'] : ['-6%', '6%']
  );

  const lineColor =
    variant === 'obsidian'
      ? 'rgba(233, 230, 223, 0.045)'
      : 'rgba(23, 23, 23, 0.045)';

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <motion.div
        style={{
          y,
          backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 1px), linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
          backgroundSize: '120px 120px',
        }}
        className="absolute -inset-y-12 inset-x-0"
      />
    </div>
  );
};
