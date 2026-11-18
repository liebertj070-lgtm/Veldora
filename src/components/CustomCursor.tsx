import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const visibleRef = useRef(false);
  const labelRef = useRef<string | null>(null);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const x = useSpring(rawX, { stiffness: 520, damping: 38, mass: 0.25 });
  const y = useSpring(rawY, { stiffness: 520, damping: 38, mass: 0.25 });

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    setEnabled(true);

    const onMouseMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }

      const target = e.target as HTMLElement | null;
      const cursorEl = target?.closest('[data-cursor]') as HTMLElement | null;
      const nextLabel = cursorEl?.dataset.cursor || null;

      if (nextLabel !== labelRef.current) {
        labelRef.current = nextLabel;
        setLabel(nextLabel);
      }
    };

    const onMouseLeave = () => {
      if (visibleRef.current) {
        visibleRef.current = false;
        setVisible(false);
      }
      if (labelRef.current !== null) {
        labelRef.current = null;
        setLabel(null);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [rawX, rawY]);

  if (!enabled || !visible) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[120] mix-blend-difference"
      style={{ x, y }}
    >
      <div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full border border-[#E9E6DF] flex items-center justify-center transition-[width,height,background-color,color] duration-200 ease-out ${
          label
            ? 'w-16 h-16 bg-[#E9E6DF] text-[#171717]'
            : 'w-4 h-4 bg-transparent'
        }`}
      >
        {label && (
          <span className="font-mono text-[9px] tracking-[0.18em] font-medium uppercase">
            {label}
          </span>
        )}
      </div>
    </motion.div>
  );
};
