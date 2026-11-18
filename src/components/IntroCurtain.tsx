import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

const INTRO_SEEN_KEY = 'velora_intro_seen';

export const IntroCurtain: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(INTRO_SEEN_KEY) !== 'true';
    } catch {
      return false;
    }
  });
  const [progress, setProgress] = useState(0);

  const dismissNow = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, 'true');
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!visible || prefersReduced) {
      setVisible(false);
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismissNow();
    };
    window.addEventListener('keydown', onKeyDown);

    const start = performance.now();
    const duration = 900;
    let dismissTimer: ReturnType<typeof setTimeout> | undefined;

    // Update counter at ~12fps to avoid competing with initial page asset decoding
    const intervalId = setInterval(() => {
      const elapsed = performance.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(intervalId);
        dismissTimer = setTimeout(() => {
          dismissNow();
        }, 160);
      }
    }, 75);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      clearInterval(intervalId);
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, [visible, prefersReduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="velora-curtain"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{
            clipPath: 'inset(0% 0% 100% 0%)',
            transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[110] bg-[#171717] text-[#E9E6DF] flex flex-col justify-between p-6 sm:p-10 select-none"
        >
          <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.2em] uppercase text-[#A6A39A]">
            <span>Antwerp · Milan · Tokyo</span>
            <button
              type="button"
              onClick={dismissNow}
              className="hover:text-[#B8C7A6] transition-colors cursor-pointer"
            >
              Skip [ESC]
            </button>
          </div>

          <div className="my-auto flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-[0.28em] uppercase"
            >
              VELORA
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.4 }}
              className="font-display italic text-xl sm:text-2xl text-[#B8C7A6] mt-3"
            >
              Form in Absence — AW26
            </motion.p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono text-xs tabular-nums">
              <span className="text-[#A6A39A] tracking-[0.16em] uppercase">
                Loading Archive
              </span>
              <span>{String(progress).padStart(3, '0')}%</span>
            </div>
            <div className="w-full h-px bg-[#2A2A28] overflow-hidden">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, ease: 'linear' }}
                className="h-full bg-[#B8C7A6] origin-left"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
