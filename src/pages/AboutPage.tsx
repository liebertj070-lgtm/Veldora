import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CAMPAIGN_MEDIA, FLOW_MEDIA } from '../data/products';
import { SafeImage } from '../components/SafeImage';
import { ParallaxBackdrop, ParallaxFrame, ParallaxLayer } from '../components/Parallax';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#E9E6DF] text-[#171717]">
      {/* Opening Manifesto Hero with Parallax Backdrop */}
      <section className="relative overflow-hidden bg-[#171717] text-[#E9E6DF] py-20 lg:py-28 border-b border-[#2A2A28]">
        <ParallaxBackdrop variant="obsidian" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#B8C7A6] mb-4">
                About VELORA · Est. Antwerp
              </p>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight leading-[0.95]">
                Quiet architecture for the human silhouette.
              </h1>
            </div>
            <p className="lg:col-span-4 text-[15px] text-[#B5B2A8] dark-prose">
              Founded as an independent pattern laboratory in Antwerp, VELORA approaches
              garment construction through structural restraint, mineral colouration,
              and tactile longevity.
            </p>
          </div>

          <ParallaxFrame className="aspect-[21/8] w-full bg-[#0E0E0E] border border-[#2A2A28]" range={6} scale={1.09}>
            <SafeImage
              priority
              src={FLOW_MEDIA.macroEyesCollar}
              alt="Monochrome editorial portrait focusing on tailored collar architecture"
              className="w-full h-full object-cover object-[center_35%] grayscale contrast-110"
            />
          </ParallaxFrame>
        </div>
      </section>

      {/* Studio Portrait & Story */}
      <section id="ateliers" className="relative overflow-hidden py-20 lg:py-28 border-b border-[#171717]/12">
        <ParallaxBackdrop variant="bone" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <ParallaxFrame className="aspect-[3/4] bg-[#DCD8CF]" range={8} scale={1.12}>
              <SafeImage
                src={CAMPAIGN_MEDIA.aboutPortrait}
                alt="VELORA Antwerp patternmaker draping raw linen on form"
                className="w-full h-full object-cover"
              />
            </ParallaxFrame>
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#4A4843] mt-3">
              Antwerp Pattern Studio — Kloosterstraat 48
            </p>
          </div>

          <ParallaxLayer offsetY={[18, -18]} className="lg:col-span-6 lg:col-start-7 space-y-6">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#4A4843]">
              01 · Methodology
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-normal leading-[1.05]">
              Draped directly on the form before a pattern is digitized.
            </h2>
            <p className="text-[15px] leading-relaxed text-[#4A4843]">
              Rather than sketching silhouettes on paper first, every VELORA coat,
              trouser, and bias-cut gown begins in raw muslin and unbleached linen.
              By listening to the natural gravity of heavyweight wool gabardine and
              sand-washed mulberry silk, we eliminate superfluous seams and rigid
              interlinings.
            </p>
            <p className="text-[15px] leading-relaxed text-[#4A4843]">
              Our tailoring partners in Milan and knitwear workshops in Biella produce
              small, numbered runs designed to soften and patina across decades of
              wear—never discarded at the close of a calendar quarter.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#171717]/12">
              <div>
                <p className="font-mono text-2xl tabular-nums">12</p>
                <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#4A4843] mt-1">
                  Archive Silhouettes
                </p>
              </div>
              <div>
                <p className="font-mono text-2xl tabular-nums">100%</p>
                <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#4A4843] mt-1">
                  Natural &amp; Deadstock Fibres
                </p>
              </div>
              <div>
                <p className="font-mono text-2xl tabular-nums">3</p>
                <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#4A4843] mt-1">
                  Partner Ateliers
                </p>
              </div>
            </div>
          </ParallaxLayer>
        </div>
      </section>

      {/* Textile Provenance */}
      <section id="materials" className="relative overflow-hidden py-20 lg:py-28">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <ParallaxLayer offsetY={[14, -14]} className="lg:col-span-5 space-y-6">
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#4A4843]">
              02 · Material Provenance
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-normal leading-[1.05]">
              Mineral pigments &amp; unbleached weights.
            </h2>
            <p className="text-[15px] leading-relaxed text-[#4A4843]">
              VELORA’s palette is anchored in four enduring tones: Obsidian charcoal,
              raw Bone parchment, weathered Stone, and muted Sage. Fabrics are sourced
              from family-owned mills in Ichinomiya, Como, and Dundee, prioritizing
              traceable RWS wool and vegetable-tanned leathers.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="min-h-[44px] inline-flex items-center gap-3 px-7 py-3.5 bg-[#171717] text-[#E9E6DF] hover:bg-[#2B2B29] font-mono text-[11px] tracking-[0.18em] uppercase transition-colors"
              >
                Explore the Archive
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </ParallaxLayer>

          <div className="lg:col-span-7">
            <ParallaxFrame className="aspect-[4/3] bg-[#DCD8CF]" range={8} scale={1.12}>
              <SafeImage
                src={CAMPAIGN_MEDIA.textileDetail}
                alt="Japanese wool, brushed cashmere, and sage technical silk"
                className="w-full h-full object-cover"
              />
            </ParallaxFrame>
          </div>
        </div>
      </section>
    </div>
  );
};
