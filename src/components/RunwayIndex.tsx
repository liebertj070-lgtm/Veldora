import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { FLOW_MEDIA, PRODUCTS, ProductCategory } from '../data/products';
import { SafeImage } from './SafeImage';
import { ViewportVideo } from './ViewportVideo';
import { ParallaxBackdrop, ParallaxFrame, ParallaxLayer } from './Parallax';

interface IndexRow {
  index: string;
  category: ProductCategory;
  title: string;
  subtitle: string;
  count: number;
  previewImage: string;
  previewVideo?: string;
  secondaryCaption: string;
}

const INDEX_ROWS: IndexRow[] = [
  {
    index: '01',
    category: 'Outerwear',
    title: 'Monolith Outerwear',
    subtitle: 'Gabardine trenches, waxed cotton field cuts & down cocoons',
    count: PRODUCTS.filter((p) => p.category === 'Outerwear').length,
    previewImage: PRODUCTS[0].image,
    previewVideo: FLOW_MEDIA.coatMotionPortrait,
    secondaryCaption: 'Water-repellent Japanese gabardine · 320gsm dry wax',
  },
  {
    index: '02',
    category: 'Tailoring',
    title: 'Collarless Tailoring',
    subtitle: 'Raw-silk blazers, double-pleated wool & elongated poplin',
    count: PRODUCTS.filter((p) => p.category === 'Tailoring').length,
    previewImage: PRODUCTS[1].image,
    previewVideo: FLOW_MEDIA.silkBlazerFilm,
    secondaryCaption: 'Milanese canvas-free construction · French seams',
  },
  {
    index: '03',
    category: 'Knitwear',
    title: 'Mineral Knitwear',
    subtitle: 'Asymmetric 5-gauge merino & brushed Scottish cashmere',
    count: PRODUCTS.filter((p) => p.category === 'Knitwear').length,
    previewImage: PRODUCTS[2].image,
    secondaryCaption: 'Undyed Grade-A cashmere · RWS merino yarn',
  },
  {
    index: '04',
    category: 'Dresses',
    title: 'Bias-Cut Fluidity',
    subtitle: 'Single-panel draped evening crepe & sand-washed silk',
    count: PRODUCTS.filter((p) => p.category === 'Dresses').length,
    previewImage: FLOW_MEDIA.cutoutWoolDress,
    secondaryCaption: '45-degree true bias engineering · Zero darts',
  },
  {
    index: '05',
    category: 'Objects',
    title: 'Architectural Objects',
    subtitle: 'Geometric box calfskin totes & Goodyear-welted horsehide',
    count: PRODUCTS.filter((p) => p.category === 'Objects').length,
    previewImage: PRODUCTS[7].image,
    secondaryCaption: 'Vegetable-tanned leather · Hand-lasted in Italy',
  },
];

export const RunwayIndex: React.FC = () => {
  const [activeRow, setActiveRow] = useState<IndexRow>(INDEX_ROWS[0]);

  return (
    <section className="relative overflow-hidden bg-[#171717] text-[#E9E6DF] py-20 lg:py-28 border-b border-[#2A2A28]">
      <ParallaxBackdrop variant="obsidian" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-10 border-b border-[#2A2A28]">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight">
            Silhouette Taxonomy
          </h2>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#B5B2A8]">
            Hover or select a discipline to preview
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pt-10 items-center">
          {/* Interactive Hover-Driven List */}
          <div className="lg:col-span-7 divide-y divide-[#2A2A28]">
            {INDEX_ROWS.map((row) => {
              const isActive = activeRow.index === row.index;
              return (
                <Link
                  key={row.category}
                  to={`/shop?category=${encodeURIComponent(row.category)}`}
                  onMouseEnter={() => setActiveRow(row)}
                  onFocus={() => setActiveRow(row)}
                  data-cursor="SHOP"
                  className="group py-5 sm:py-6 flex items-center justify-between gap-6 transition-colors"
                >
                  <div className="flex items-baseline gap-4 sm:gap-6 min-w-0">
                    <span
                      className={`font-mono text-xs tabular-nums transition-colors ${
                        isActive ? 'text-[#B8C7A6]' : 'text-[#A6A39A]'
                      }`}
                    >
                      {row.index}
                    </span>
                    <div className="min-w-0">
                      <h3
                        className={`font-display text-3xl sm:text-4xl lg:text-[2.75rem] leading-none transition-all duration-300 ${
                          isActive
                            ? 'translate-x-2 italic text-[#E9E6DF]'
                            : 'text-[#E9E6DF]/80 group-hover:text-[#E9E6DF]'
                        }`}
                      >
                        {row.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#B5B2A8] mt-2 truncate">
                        {row.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-mono text-xs tabular-nums text-[#A6A39A] hidden sm:inline">
                      ({row.count})
                    </span>
                    <span
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'border-[#B8C7A6] bg-[#B8C7A6] text-[#171717] rotate-45'
                          : 'border-[#2A2A28] text-[#E9E6DF]'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Morphing Lookbook Preview Frame with Live Motion Video & Scroll Parallax */}
          <ParallaxLayer offsetY={[22, -22]} className="lg:col-span-5">
            <div className="relative bg-[#0E0E0E] p-3 border border-[#2A2A28]">
              <ParallaxFrame className="aspect-[3/4] w-full bg-[#242422]" range={6} scale={1.1}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeRow.category}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full"
                  >
                    {activeRow.previewVideo ? (
                      <ViewportVideo
                        src={activeRow.previewVideo}
                        poster={activeRow.previewImage}
                        ariaLabel={`${activeRow.title} runway motion preview`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <SafeImage
                        src={activeRow.previewImage}
                        alt={activeRow.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </ParallaxFrame>
              <div className="pt-3 flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.14em] uppercase text-[#B5B2A8]">
                <span className="truncate">{activeRow.secondaryCaption}</span>
                <span className="text-[#B8C7A6] shrink-0">
                  {activeRow.count} Pieces
                </span>
              </div>
            </div>
          </ParallaxLayer>
        </div>
      </div>
    </section>
  );
};
