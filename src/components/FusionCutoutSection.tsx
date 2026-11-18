import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react';
import { FLOW_MEDIA, PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { SafeImage } from './SafeImage';
import { ParallaxLayer } from './Parallax';

export const FusionCutoutSection: React.FC = () => {
  const { setQuickViewProduct } = useStore();

  const trenchProduct = PRODUCTS[0];
  const pufferProduct = PRODUCTS[9];
  const dressProduct = PRODUCTS[3];

  return (
    <section className="relative bg-[#0E0E0E] py-16 lg:py-24 border-b border-[#2A2A28] overflow-hidden">
      {/* Brutalist Dark Column Bars inspired by high-editorial zine spreads */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-6 sm:left-16 right-6 sm:right-16 h-24 grid grid-cols-6 gap-4 sm:gap-8 opacity-15"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-[#E9E6DF] h-full" />
        ))}
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Crisp Editorial White Sheet Framed Over Dark Obsidian Stage */}
        <div className="relative bg-[#FFFFFF] text-[#171717] px-5 sm:px-10 lg:px-14 pt-8 pb-12 sm:py-14 shadow-2xl overflow-hidden">
          {/* Top Index Strip */}
          <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#171717]/12 font-mono text-[10px] tracking-[0.2em] uppercase text-[#4A4843]">
            <span>VELORA · STUDY 02</span>
            <span className="hidden sm:inline">Silhouette &amp; Volume Study</span>
            <span>Antwerp — AW26</span>
          </div>

          {/* Colossal Full-Bleed Editorial Header (Models overlap right over & under letters) */}
          <div className="relative pt-6 sm:pt-8 select-none">
            <h2 className="font-sans font-semibold tracking-[-0.045em] leading-[0.86] text-[clamp(3.1rem,11vw,8.75rem)] uppercase text-[#171717] text-center">
              FUSION FORM
            </h2>
          </div>

          {/* 3 Isolated Studio Cutouts Blended Seamlessly via mix-blend-multiply */}
          <div className="relative -mt-6 sm:-mt-12 lg:-mt-16 pt-2 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-12 items-end gap-4 md:gap-0 relative">
              {/* Left Look: Linen Trench & Pleated Trousers */}
              <ParallaxLayer
                offsetY={[18, -18]}
                className="md:col-span-4 relative z-10 flex flex-col items-center group"
              >
                <button
                  type="button"
                  onClick={() => setQuickViewProduct(trenchProduct)}
                  data-cursor="INSPECT"
                  className="w-full max-w-[290px] sm:max-w-[320px] cursor-pointer text-left focus:outline-none"
                >
                  <div className="relative aspect-[3/4] overflow-visible">
                    <SafeImage
                      src={FLOW_MEDIA.cutoutTrench}
                      alt="Belted stone linen trench over double-pleated charcoal wool trousers"
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between font-mono text-[10px] tracking-[0.14em] uppercase text-[#4A4843] border-t border-[#171717]/12 pt-2">
                    <span>01 · Trench Silhouette</span>
                    <span className="text-[#171717] group-hover:underline">Inspect →</span>
                  </div>
                </button>
              </ParallaxLayer>

              {/* Center Monumental Look: Sculptural Down Cocoon overlapping Typography */}
              <ParallaxLayer
                offsetY={[-22, 22]}
                className="md:col-span-4 relative z-20 flex flex-col items-center group md:-mx-8"
              >
                <button
                  type="button"
                  onClick={() => setQuickViewProduct(pufferProduct)}
                  data-cursor="STUDY 10"
                  className="w-full max-w-[340px] sm:max-w-[390px] cursor-pointer text-left focus:outline-none"
                >
                  <div className="relative aspect-[3/4]">
                    <SafeImage
                      src={FLOW_MEDIA.cutoutPuffer}
                      alt="Oversized sculptural matte obsidian down cocoon cape"
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    {/* Subtle Soft Mist Fade at Base matching editorial collage print */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/75 to-transparent"
                    />
                  </div>
                  <div className="relative z-10 mt-1 flex items-center justify-between font-mono text-[10px] tracking-[0.14em] uppercase text-[#171717] border-t border-[#171717]/20 pt-2">
                    <span>Study 10 · Down Cocoon</span>
                    <span className="inline-flex items-center gap-1 font-medium">
                      Quick View <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </button>
              </ParallaxLayer>

              {/* Right Look: Draped Sage Wool Dress */}
              <ParallaxLayer
                offsetY={[14, -14]}
                className="md:col-span-4 relative z-10 flex flex-col items-center group"
              >
                <button
                  type="button"
                  onClick={() => setQuickViewProduct(dressProduct)}
                  data-cursor="INSPECT"
                  className="w-full max-w-[290px] sm:max-w-[320px] cursor-pointer text-left focus:outline-none"
                >
                  <div className="relative aspect-[3/4]">
                    <SafeImage
                      src={FLOW_MEDIA.cutoutWoolDress}
                      alt="Asymmetric draped sage virgin wool column dress"
                      className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between font-mono text-[10px] tracking-[0.14em] uppercase text-[#4A4843] border-t border-[#171717]/12 pt-2">
                    <span>04 · Draped Column</span>
                    <span className="text-[#171717] group-hover:underline">Inspect →</span>
                  </div>
                </button>
              </ParallaxLayer>
            </div>

            {/* Editorial Side Micro-Manifesto + Registration Plus Axis */}
            <div className="mt-10 pt-6 border-t border-[#171717]/12 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 flex items-center gap-3 text-[#171717]/40">
                <Plus className="w-3.5 h-3.5" strokeWidth={1.25} aria-hidden="true" />
                <Plus className="w-3.5 h-3.5" strokeWidth={1.25} aria-hidden="true" />
                <Plus className="w-3.5 h-3.5" strokeWidth={1.25} aria-hidden="true" />
                <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#4A4843] ml-2">
                  Beyond Seasonality
                </span>
              </div>

              <div className="md:col-span-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#171717] font-medium mb-1">
                  Volume Without Decoration
                </p>
                <p className="text-xs sm:text-[13px] text-[#4A4843] leading-relaxed">
                  Unstructured volume draped around the clavicle and shoulder—isolated on raw white paper so proportion reads before ornament.
                </p>
              </div>

              <div className="md:col-span-3 md:text-right">
                <Link
                  to="/shop"
                  className="min-h-[44px] inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.16em] uppercase border-b border-[#171717] pb-1 hover:text-[#4A4843] transition-colors"
                >
                  Shop Silhouettes
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Extreme Cropped Macro Eye Band (Juun.J reference lower strip) */}
          <div className="mt-8 pt-8 border-t border-[#171717]/15 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            <div className="md:col-span-6 relative aspect-[16/7] overflow-hidden bg-[#171717]">
              <SafeImage
                src={FLOW_MEDIA.macroEyesCollar}
                alt="Monochrome macro study of eyes partially veiled by heavyweight wool coat collar"
                className="w-full h-full object-cover object-[center_35%] grayscale contrast-110"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#171717]/55 via-transparent to-transparent"
              />
              <span className="absolute left-4 bottom-3 font-sans text-xl sm:text-2xl font-semibold tracking-tight uppercase text-[#E9E6DF]">
                ABOUT VELORA
              </span>
            </div>

            <div className="md:col-span-4 relative aspect-[16/7] md:aspect-auto overflow-hidden bg-[#171717]">
              <SafeImage
                src={FLOW_MEDIA.macroEyesCollar}
                alt="Heavyweight virgin wool lapel and brow architecture"
                className="w-full h-full object-cover object-[75%_45%] scale-125 grayscale contrast-125"
              />
            </div>

            <Link
              to="/about"
              className="md:col-span-2 bg-[#171717] text-[#E9E6DF] hover:bg-[#B8C7A6] hover:text-[#171717] p-5 flex flex-col justify-between transition-colors group"
            >
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase opacity-75">
                Archive 01
              </span>
              <span className="font-mono text-[11px] tracking-[0.16em] uppercase inline-flex items-center gap-2 mt-6">
                Learn More
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
