import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

interface ViewportVideoProps {
  src: string;
  poster?: string;
  className?: string;
  priority?: boolean;
  ariaLabel?: string;
}

/**
 * Memory- & decoder-conscious editorial video player.
 * Delays stream allocation for below-the-fold clips until within 240px of viewport,
 * plays only while visible, and pauses cleanly when offscreen or reduced-motion is set.
 */
export const ViewportVideo: React.FC<ViewportVideoProps> = ({
  src,
  poster,
  className = '',
  priority = false,
  ariaLabel,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReduced = useReducedMotion();
  const [nearViewport, setNearViewport] = useState(priority);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (prefersReduced) {
      el.pause();
      return;
    }

    const proximityObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setNearViewport(true);
          proximityObserver.disconnect();
        }
      },
      { rootMargin: '240px 0px' }
    );

    if (!nearViewport) {
      proximityObserver.observe(el);
    }

    const playObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          const playPromise = el.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Autoplay blocked fallback: stays paused on poster/frame 0
            });
          }
        } else {
          el.pause();
        }
      },
      { threshold: 0.1 }
    );

    playObserver.observe(el);

    return () => {
      proximityObserver.disconnect();
      playObserver.disconnect();
    };
  }, [prefersReduced, nearViewport, src]);

  return (
    <video
      ref={videoRef}
      src={nearViewport ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay={!prefersReduced && priority}
      preload={priority ? 'auto' : nearViewport ? 'metadata' : 'none'}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
      className={className}
    />
  );
};
