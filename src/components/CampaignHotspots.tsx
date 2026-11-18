import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { ArrowRight, Plus, ShoppingBag } from 'lucide-react';
import { CAMPAIGN_MEDIA, PRODUCTS, Product } from '../data/products';
import { useStore } from '../context/StoreContext';
import { SafeImage } from './SafeImage';

interface Hotspot {
  id: string;
  xPercent: number;
  yPercent: number;
  label: string;
  productId: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'look-obsidian',
    xPercent: 43,
    yPercent: 42,
    label: 'Look 01 · Tailoring',
    productId: 'vlr-01-obsidian-trench',
  },
  {
    id: 'look-bone',
    xPercent: 59,
    yPercent: 46,
    label: 'Look 02 · Raw Silk',
    productId: 'vlr-02-bone-blazer',
  },
  {
    id: 'look-trouser',
    xPercent: 44,
    yPercent: 68,
    label: 'Look 03 · Column Wool',
    productId: 'vlr-06-pleated-trouser',
  },
];

export const CampaignHotspots: React.FC = () => {
  const { setQuickViewProduct, addToCart } = useStore();
  const [activeId, setActiveId] = useState<string>(HOTSPOTS[0].id);
  const frameRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? ['0%', '0%'] : ['-6%', '6%']
  );

  const activeHotspot = HOTSPOTS.find((h) => h.id === activeId) || HOTSPOTS[0];
  const activeProduct: Product =
    PRODUCTS.find((p) => p.id === activeHotspot.productId) || PRODUCTS[0];

  return (
    <div className="space-y-4">
      <div
        ref={frameRef}
        className="relative aspect-[16/9] w-full overflow-hidden bg-[#DCD8CF] group"
      >
        {/* Synchronized Parallax Wrapper keeps pins anatomically aligned with image */}
        <motion.div
          style={{ y, scale: prefersReduced ? 1 : 1.09 }}
          className="relative w-full h-full"
        >
          <SafeImage
            src={CAMPAIGN_MEDIA.atelierSpread}
            alt="VELORA Brutalist Gallery Campaign with shoppable look hotspots"
            className="w-full h-full object-cover"
          />

          {/* Interactive Architectural Crosshair Pins */}
          {HOTSPOTS.map((spot) => {
            const isActive = spot.id === activeId;
            return (
              <button
                key={spot.id}
                type="button"
                onClick={() => setActiveId(spot.id)}
                aria-label={`Inspect ${spot.label}`}
                aria-pressed={isActive}
                style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-[#B8C7A6] text-[#171717] scale-110 shadow-lg'
                    : 'bg-[#171717]/80 text-[#E9E6DF] border border-[#E9E6DF]/50 hover:scale-110 hover:bg-[#E9E6DF] hover:text-[#171717]'
                }`}
              >
                <Plus
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isActive ? 'rotate-45' : ''
                  }`}
                  strokeWidth={1.75}
                />
              </button>
            );
          })}
        </motion.div>

        {/* Subtle Dark Scrim at bottom for legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#171717]/75 via-[#171717]/25 to-transparent pointer-events-none"
        />

        {/* Floating Glass Garment Inspector Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:flex absolute left-4 bottom-4 z-20 bg-[#171717]/92 backdrop-blur-md text-[#E9E6DF] border border-[#E9E6DF]/20 p-3.5 gap-3.5 items-center max-w-sm shadow-2xl"
          >
            <Link
              to={`/product/${activeProduct.id}`}
              className="w-14 aspect-[3/4] bg-[#242422] shrink-0 overflow-hidden"
            >
              <SafeImage
                src={activeProduct.image}
                alt={activeProduct.name}
                className="w-full h-full object-cover"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#B8C7A6]">
                {activeHotspot.label}
              </p>
              <Link
                to={`/product/${activeProduct.id}`}
                className="text-sm font-medium block truncate hover:underline mt-0.5"
              >
                {activeProduct.name}
              </Link>
              <div className="flex items-center gap-3 mt-2">
                <span className="font-mono text-xs tabular-nums">
                  ${activeProduct.price.toLocaleString()}
                </span>
                <button
                  type="button"
                  onClick={() => setQuickViewProduct(activeProduct)}
                  className="font-mono text-[10px] tracking-[0.14em] uppercase underline text-[#E9E6DF]/90 hover:text-[#B8C7A6] cursor-pointer"
                >
                  Quick View
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addToCart(
                      activeProduct,
                      activeProduct.sizes[0],
                      activeProduct.colors[0].name,
                      1
                    )
                  }
                  aria-label={`Add ${activeProduct.name} to bag`}
                  className="ml-auto p-1.5 bg-[#E9E6DF] text-[#171717] hover:bg-[#B8C7A6] transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Active Hotspot Card (visible below image on small screens) */}
      <div className="sm:hidden flex items-center justify-between gap-3 p-3.5 bg-[#171717] text-[#E9E6DF]">
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#B8C7A6]">
            {activeHotspot.label}
          </p>
          <Link
            to={`/product/${activeProduct.id}`}
            className="text-sm font-medium block truncate"
          >
            {activeProduct.name}
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setQuickViewProduct(activeProduct)}
          className="px-3.5 py-2 bg-[#E9E6DF] text-[#171717] font-mono text-[10px] tracking-[0.14em] uppercase shrink-0 cursor-pointer flex items-center gap-1"
        >
          Inspect
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.12em] uppercase text-[#4A4843]">
        <span>Interactive Campaign Study — Select Pins to Shop Looks</span>
        <span className="hidden sm:inline">Brutalist Pavilion, Antwerp</span>
      </div>
    </div>
  );
};
