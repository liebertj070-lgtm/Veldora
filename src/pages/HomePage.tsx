import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import { CAMPAIGN_MEDIA, FLOW_MEDIA, PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { SafeImage } from '../components/SafeImage';
import { ViewportVideo } from '../components/ViewportVideo';
import { Magnetic } from '../components/Magnetic';
import { RunwayIndex } from '../components/RunwayIndex';
import { CampaignHotspots } from '../components/CampaignHotspots';
import { LookbookDeck } from '../components/LookbookDeck';
import { FusionCutoutSection } from '../components/FusionCutoutSection';
import { ParallaxBackdrop, ParallaxLayer } from '../components/Parallax';

export const HomePage: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const [isDraggingRail, setIsDraggingRail] = useState(false);
  const dragState = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const railHoveredRef = useRef(false);
  const railFocusedRef = useRef(false);
  const manualPauseUntilRef = useRef(0);
  const scrollPosRef = useRef(0);

  const featuredProducts = PRODUCTS.filter((p) => p.featured);
  const showcaseProducts = PRODUCTS.slice(3, 11);

  // Zero-re-render mouse tilt using Framer Motion MotionValues + Spring
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const smoothMouseX = useSpring(rawMouseX, { stiffness: 120, damping: 20, mass: 0.4 });
  const smoothMouseY = useSpring(rawMouseY, { stiffness: 120, damping: 20, mass: 0.4 });

  const glassX = useTransform(smoothMouseX, (v) => (prefersReduced ? 0 : v * -8));
  const glassY = useTransform(smoothMouseY, (v) => (prefersReduced ? 0 : v * -6));
  const portraitMouseX = useTransform(smoothMouseX, (v) => (prefersReduced ? 0 : v * 11));
  const portraitMouseY = useTransform(smoothMouseY, (v) => (prefersReduced ? 0 : v * 8));
  const insetMouseX = useTransform(smoothMouseX, (v) => (prefersReduced ? 0 : v * -14));

  // Framer Motion scroll-driven parallax across hero layers
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroBgY = useTransform(
    heroScroll,
    [0, 1],
    prefersReduced ? ['0%', '0%'] : ['0%', '12%']
  );
  const heroPortraitY = useTransform(
    heroScroll,
    [0, 1],
    prefersReduced ? ['0%', '0%'] : ['-3%', '9%']
  );
  const heroInsetY = useTransform(
    heroScroll,
    [0, 1],
    prefersReduced ? [0, 0] : [0, -56]
  );
  const heroTypeY = useTransform(
    heroScroll,
    [0, 1],
    prefersReduced ? [0, 0] : [0, 28]
  );

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    rawMouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawMouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleHeroMouseLeave = () => {
    rawMouseX.set(0);
    rawMouseY.set(0);
  };

  // Continuous calm editorial auto-scroll while Objects & Silhouettes is in viewport
  useEffect(() => {
    const el = railRef.current;
    if (!el || prefersReduced) return;

    let inView = false;
    let rafId = 0;
    let lastTime = 0;
    const SPEED_PX_PER_SEC = 34;

    const tick = (now: number) => {
      if (!lastTime) lastTime = now;
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const paused =
        !inView ||
        document.hidden ||
        railHoveredRef.current ||
        railFocusedRef.current ||
        dragState.current.active ||
        now < manualPauseUntilRef.current;

      if (paused) {
        scrollPosRef.current = el.scrollLeft;
      } else {
        const halfWidth = el.scrollWidth / 2;
        if (halfWidth > 0) {
          scrollPosRef.current += SPEED_PX_PER_SEC * dt;
          if (scrollPosRef.current >= halfWidth) {
            scrollPosRef.current -= halfWidth;
          }
          el.scrollLeft = scrollPosRef.current;
        }
      }

      if (inView) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = Boolean(entries[0]?.isIntersecting);
        inView = visible;
        if (visible) {
          scrollPosRef.current = el.scrollLeft;
          lastTime = 0;
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(tick);
        } else {
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [prefersReduced]);

  const scrollRail = (direction: 'left' | 'right') => {
    const el = railRef.current;
    if (!el) return;
    manualPauseUntilRef.current = performance.now() + 1400;
    const halfWidth = el.scrollWidth / 2;
    if (direction === 'left' && el.scrollLeft < 380 && halfWidth > 0) {
      el.scrollLeft += halfWidth;
    } else if (direction === 'right' && halfWidth > 0 && el.scrollLeft >= halfWidth) {
      el.scrollLeft -= halfWidth;
    }
    const delta = direction === 'left' ? -380 : 380;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const handleRailKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollRail('right');
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollRail('left');
    }
  };

  const onRailMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!railRef.current) return;
    dragState.current = {
      active: true,
      startX: e.pageX - railRef.current.offsetLeft,
      scrollLeft: railRef.current.scrollLeft,
    };
    setIsDraggingRail(true);
  };

  const onRailMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragState.current.active || !railRef.current) return;
    const x = e.pageX - railRef.current.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.25;
    const next = dragState.current.scrollLeft - walk;
    railRef.current.scrollLeft = next;
    scrollPosRef.current = next;
  };

  const stopRailDrag = () => {
    if (railRef.current) {
      scrollPosRef.current = railRef.current.scrollLeft;
    }
    dragState.current.active = false;
    setIsDraggingRail(false);
  };

  return (
    <div className="overflow-x-clip">
      {/* A. AVANT-GARDE EDITORIAL CINEMA HERO WITH AMBIENT FLOW FILM & OVERLAPPING TYPE */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="hero-section relative bg-[#0E0E0E] text-[#E9E6DF] film-grain border-b border-[#2A2A28] overflow-hidden"
      >
        {/* Ambient Brutalist Concrete Gallery Film Backdrop */}
        <motion.div
          aria-hidden="true"
          style={{ y: heroBgY, scale: prefersReduced ? 1 : 1.06 }}
          className="pointer-events-none absolute -inset-y-12 inset-x-0"
        >
          <ViewportVideo
            src={FLOW_MEDIA.heroConcreteFilm}
            poster={CAMPAIGN_MEDIA.heroMonolith}
            priority
            className="w-full h-full object-cover opacity-35 saturate-[0.75]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E0E0E]/75 via-[#0E0E0E]/45 to-[#0E0E0E]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E0E0E]/85 via-transparent to-[#0E0E0E]/70" />
        </motion.div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-7 pb-16 sm:pt-10 sm:pb-24 lg:py-14">
          {/* Top Editorial Index Line */}
          <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#E9E6DF]/15 font-mono text-[11px] tracking-[0.18em] uppercase text-[#B5B2A8]">
            <span>Autumn / Winter 2026</span>
            <span className="hidden sm:inline">Antwerp · Milan · Tokyo</span>
            <span className="text-[#B8C7A6]">Archive Collection 01</span>
          </div>

          {/* Layered Brutalist Collage Composition */}
          <div className="relative pt-8 sm:pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0 items-center">
            {/* Left / Overlapping Monumental Typography + Frosted Obsidian Glass Block */}
            <motion.div
              style={{ y: heroTypeY }}
              className="lg:col-span-7 relative z-30 lg:pr-6"
            >
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="flex items-center gap-3 mb-3 font-mono text-[10px] tracking-[0.22em] uppercase text-[#B8C7A6]">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current">
                    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
                  </svg>
                  <span>VELORA MONOLITH FILM · 01</span>
                </div>

                <h1 className="font-sans font-semibold tracking-[-0.045em] leading-[0.84] text-[clamp(3.35rem,9vw,6.85rem)] uppercase text-[#E9E6DF]">
                  FORM IN
                  <span className="block font-display italic font-normal tracking-[-0.025em] lowercase text-[clamp(4rem,10vw,7.75rem)] text-[#E9E6DF] lg:translate-x-10">
                    absence
                  </span>
                </h1>
              </motion.div>

              {/* Frosted Glass Experimental Monograph Card */}
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{ x: glassX, y: glassY }}
                className="mt-8 lg:mt-10 p-5 sm:p-6 bg-[#171717]/70 backdrop-blur-sm border border-[#E9E6DF]/20 max-w-md space-y-5 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-[#E9E6DF]/15 pb-3">
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#B8C7A6]">
                    Sculptural Discipline
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="w-5 h-5 text-[#E9E6DF] animate-slow-spin"
                  >
                    <path
                      d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                <p className="text-[15px] text-[#E9E6DF]/90 dark-prose">
                  VELORA investigates tension between rigid architectural tailoring and
                  fluid, unbleached textiles. Engineered for quiet permanence outside
                  seasonal speed.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <Magnetic>
                    <Link
                      to="/shop"
                      data-cursor="SHOP"
                      className="min-h-[44px] inline-flex items-center gap-3 px-7 py-3.5 bg-[#E9E6DF] text-[#171717] hover:bg-[#B8C7A6] font-mono text-[11px] tracking-[0.18em] uppercase transition-colors"
                    >
                      Explore Collection
                      <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                    </Link>
                  </Magnetic>
                  <Link
                    to="/collections"
                    className="min-h-[44px] inline-flex items-center gap-2 px-3 py-3 font-mono text-[11px] tracking-[0.18em] uppercase text-[#E9E6DF] hover:text-[#B8C7A6] transition-colors"
                  >
                    Lookbook
                    <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Vertical Flow Portrait Film Card Overlapping Display Headlines */}
            <div className="lg:col-span-5 relative z-20 lg:-ml-16">
              <motion.div
                initial={
                  prefersReduced
                    ? false
                    : { clipPath: 'inset(10% 0% 0% 0%)', opacity: 0.85 }
                }
                animate={{
                  clipPath: 'inset(0% 0% 0% 0%)',
                  opacity: 1,
                }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                style={{ x: portraitMouseX, y: portraitMouseY }}
                className="relative bg-[#E9E6DF] p-2.5 sm:p-3.5 shadow-2xl"
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-[#171717]">
                  <motion.div
                    style={{
                      y: heroPortraitY,
                      scale: prefersReduced ? 1 : 1.09,
                    }}
                    className="w-full h-full"
                  >
                    <ViewportVideo
                      src={FLOW_MEDIA.coatMotionPortrait}
                      poster={CAMPAIGN_MEDIA.heroMonolith}
                      priority
                      ariaLabel="VELORA AW26 Monolith Campaign portrait in motion"
                      className="w-full h-full object-cover object-top"
                    />
                  </motion.div>
                </div>
                <div className="pt-2.5 flex items-center justify-between font-mono text-[10px] tracking-[0.14em] uppercase text-[#171717]">
                  <span>Look 01 — Monolith Coat</span>
                  <span>100% Virgin Wool</span>
                </div>
              </motion.div>

              {/* Floating Secondary Sculptural Detail Card */}
              <motion.div
                style={{ x: insetMouseX, y: heroInsetY }}
                className="hidden sm:block absolute -right-4 -top-6 w-36 lg:w-44 bg-[#171717] p-1.5 border border-[#E9E6DF]/30 shadow-2xl z-30"
              >
                <Link to="/product/vlr-02-bone-blazer" className="block group">
                  <div className="aspect-[3/4] overflow-hidden bg-[#242422]">
                    <SafeImage
                      priority
                      src={PRODUCTS[1].image}
                      alt="Collarless Raw Silk Blazer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="pt-1.5 font-mono text-[9px] tracking-[0.14em] uppercase text-[#B8C7A6] truncate">
                    Study 02 · Raw Silk
                  </p>
                </Link>
              </motion.div>

              {/* Four-Point Sparkle Accent */}
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="hidden lg:block absolute -right-8 bottom-10 w-8 h-8 text-[#E9E6DF]/80"
              >
                <path
                  d="M12 1L13.8 10.2L23 12L13.8 13.8L12 23L10.2 13.8L1 12L10.2 10.2L12 1Z"
                  fill="currentColor"
                />
              </svg>

              {/* Magnetic Rotating Circular Stamp CTA */}
              <div className="hidden sm:block absolute -left-12 -bottom-8 z-30">
                <Magnetic strength={0.4}>
                  <Link
                    to="/shop"
                    aria-label="Explore AW26 Archive"
                    className="w-28 h-28 rounded-full bg-[#171717] border border-[#E9E6DF]/40 flex items-center justify-center group hover:border-[#B8C7A6] transition-colors shadow-xl"
                  >
                    <svg
                      viewBox="0 0 100 100"
                      aria-hidden="true"
                      className="w-24 h-24 animate-slow-spin text-[#E9E6DF] group-hover:text-[#B8C7A6] transition-colors"
                    >
                      <defs>
                        <path
                          id="veloraCircle"
                          d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                        />
                      </defs>
                      <text className="font-mono text-[8.5px] uppercase tracking-[0.22em] fill-current">
                        <textPath href="#veloraCircle">
                          DISCOVER ARCHIVE · VELORA AW26 ·
                        </textPath>
                      </text>
                    </svg>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="absolute w-4 h-4 text-[#E9E6DF] group-hover:text-[#B8C7A6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      strokeWidth={1.5}
                    />
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>

          {/* Registration Crosshair Bar */}
          <div className="hidden lg:flex items-center justify-between pt-14 text-[#A6A39A]/40">
            <Plus className="w-4 h-4" strokeWidth={1} aria-hidden="true" />
            <div className="h-px flex-1 mx-6 bg-[#E9E6DF]/15" />
            <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#B5B2A8]">
              Edition 01 — 12 Silhouettes
            </span>
            <div className="h-px flex-1 mx-6 bg-[#E9E6DF]/15" />
            <Plus className="w-4 h-4" strokeWidth={1} aria-hidden="true" />
          </div>
        </div>

        {/* Continuous Kinetic Editorial Marquee Strip */}
        <div
          aria-hidden="true"
          className="marquee-wrap relative z-20 border-t border-[#2A2A28] bg-[#B8C7A6] text-[#171717] py-3 overflow-hidden select-none"
        >
          <div className="animate-marquee font-mono text-[11px] tracking-[0.22em] uppercase font-medium">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center gap-8 pr-8 whitespace-nowrap">
                <span>Monolith AW26</span>
                <span>·</span>
                <span>Antwerp Pattern Studio</span>
                <span>·</span>
                <span>Japanese Gabardine</span>
                <span>·</span>
                <span>Raw Mineral Silk</span>
                <span>·</span>
                <span>Numbered Editions</span>
                <span>·</span>
                <span>Goodyear Horsehide</span>
                <span>·</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B. FEATURED COLLECTION — PARALLAX BACKDROP + STAGGERED MULTI-SPEED COLUMNS */}
      <section className="relative overflow-hidden bg-[#E9E6DF] text-[#171717] py-20 lg:py-28 border-b border-[#171717]/12">
        <ParallaxBackdrop variant="bone" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              <h2 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-normal leading-[1.02] tracking-tight">
                Architectural Tailoring &amp; Raw Knit
              </h2>

              <p className="text-[15px] leading-relaxed text-[#4A4843] max-w-[42ch]">
                Three foundational silhouettes from the Autumn/Winter 2026 release.
                Constructed in water-repellent gabardine, raw mulberry silk, and
                extrafine mineral-dyed merino.
              </p>

              <div className="pt-2">
                <Magnetic strength={0.2}>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-3 pb-1.5 border-b border-[#171717] font-mono text-[11px] tracking-[0.18em] uppercase hover:text-[#4A4843] hover:border-[#4A4843] transition-colors"
                  >
                    Shop All 12 Pieces
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </Magnetic>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {featuredProducts.map((product, idx) => (
                <ParallaxLayer
                  key={product.id}
                  offsetY={idx === 1 ? [28, -28] : idx === 2 ? [-16, 16] : [12, -12]}
                  className={idx === 1 ? 'lg:mt-14' : idx === 2 ? 'lg:mt-4' : ''}
                >
                  <ProductCard product={product} parallaxOffset={7} />
                </ParallaxLayer>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* C. FUSION CUTOUT EDITORIAL SPREAD + EXTREME MACRO BAND */}
      <FusionCutoutSection />

      {/* D. INTERACTIVE HOVER-PREVIEW SILHOUETTE TAXONOMY WITH LIVE FLOW VIDEO */}
      <RunwayIndex />

      {/* E. DRAG-ENABLED HORIZONTAL ARCHIVE GALLERY */}
      <section className="relative overflow-hidden bg-[#0E0E0E] text-[#E9E6DF] py-20 lg:py-28 border-b border-[#2A2A28]">
        <ParallaxBackdrop variant="obsidian" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10 border-b border-[#2A2A28]">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight">
                Objects &amp; Silhouettes
              </h2>
              <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#B5B2A8] mt-2">
                Hover to pause · Drag horizontally or use controls to inspect archive pieces
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollRail('left')}
                aria-label="Scroll gallery left"
                className="w-11 h-11 border border-[#2A2A28] hover:border-[#B8C7A6] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollRail('right')}
                aria-label="Scroll gallery right"
                className="w-11 h-11 border border-[#2A2A28] hover:border-[#B8C7A6] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <Link
                to="/shop"
                className="min-h-[44px] inline-flex items-center ml-2 px-5 py-3 border border-[#2A2A28] hover:border-[#E9E6DF] font-mono text-[11px] tracking-[0.16em] uppercase whitespace-nowrap transition-colors"
              >
                View Catalog
              </Link>
            </div>
          </div>

          <div
            ref={railRef}
            tabIndex={0}
            role="region"
            aria-label="Objects and Silhouettes auto-scrolling gallery — hover to pause, drag or use arrow keys to scroll"
            onKeyDown={handleRailKeyDown}
            onMouseEnter={() => {
              railHoveredRef.current = true;
            }}
            onMouseLeave={() => {
              railHoveredRef.current = false;
              stopRailDrag();
            }}
            onFocusCapture={() => {
              railFocusedRef.current = true;
            }}
            onBlurCapture={() => {
              railFocusedRef.current = false;
            }}
            onMouseDown={onRailMouseDown}
            onMouseMove={onRailMouseMove}
            onMouseUp={stopRailDrag}
            className={`flex gap-6 overflow-x-auto no-scrollbar pt-10 focus:outline-none ${
              isDraggingRail ? 'cursor-grabbing select-none' : 'cursor-grab'
            }`}
          >
            {[...showcaseProducts, ...showcaseProducts].map((product, idx) => (
              <div
                key={`${product.id}-${idx < showcaseProducts.length ? 'a' : 'b'}`}
                className="w-[78vw] sm:w-[44vw] lg:w-[290px] shrink-0"
              >
                <ProductCard product={product} darkSurface parallaxOffset={0} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* F. SHOPPABLE CAMPAIGN HOTSPOTS & INTERACTIVE ATELIER CARD DECK */}
      <section className="relative overflow-hidden bg-[#E9E6DF] text-[#171717] py-20 lg:py-28">
        <ParallaxBackdrop variant="bone" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Shoppable Campaign Frame with Crosshair Pins */}
            <div className="lg:col-span-8">
              <CampaignHotspots />
            </div>

            {/* Philosophy + Interactive Layered Lookbook Deck */}
            <ParallaxLayer offsetY={[16, -16]} className="lg:col-span-4 flex flex-col justify-between gap-8">
              <div className="space-y-4">
                <h2 className="font-display text-3xl sm:text-4xl font-normal leading-[1.08] tracking-tight">
                  Reduction as a structural discipline.
                </h2>
                <p className="text-[15px] leading-relaxed text-[#4A4843] max-w-[44ch]">
                  Every VELORA garment begins with unbleached pattern paper and deadstock
                  bolts from heritage mills in Ichinomiya and Biella. We remove decorative
                  closures until only silhouette, drape, and tactile weight remain.
                </p>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 pt-1 font-mono text-[11px] tracking-[0.18em] uppercase border-b border-[#171717] pb-1 hover:text-[#4A4843] transition-colors"
                >
                  Read House Manifesto
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>

              <LookbookDeck />
            </ParallaxLayer>
          </div>
        </div>
      </section>
    </div>
  );
};
