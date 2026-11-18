import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { COLLECTIONS, FLOW_MEDIA, PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { SafeImage } from '../components/SafeImage';
import { ViewportVideo } from '../components/ViewportVideo';
import { ParallaxBackdrop, ParallaxFrame, ParallaxLayer } from '../components/Parallax';

export const CollectionsPage: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-[#171717] text-[#E9E6DF] min-h-screen">
      <ParallaxBackdrop variant="obsidian" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14 lg:py-20">
        {/* Editorial Intro */}
        <div className="pb-14 border-b border-[#2A2A28] grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#B8C7A6] mb-3">
              Lookbook &amp; Seasonal Capsules
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight leading-[0.95]">
              Archival Studies
            </h1>
          </div>
          <p className="lg:col-span-4 text-sm text-[#B5B2A8] dark-prose">
            Each VELORA capsule develops a distinct formal inquiry into weight, drape,
            and mineral pigment. Select any lookbook chapter to examine its constituent
            garments.
          </p>
        </div>

        {/* Chapters */}
        <div className="divide-y divide-[#2A2A28]">
          {COLLECTIONS.map((col, idx) => {
            const chapterProducts = PRODUCTS.filter((p) =>
              col.productIds.includes(p.id)
            );
            const reverse = idx % 2 === 1;
            const chapterVideo =
              idx === 0
                ? FLOW_MEDIA.heroConcreteFilm
                : idx === 1
                ? FLOW_MEDIA.silkBlazerFilm
                : undefined;

            return (
              <section key={col.id} className="py-16 lg:py-24 space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  <div
                    className={`lg:col-span-6 ${
                      reverse ? 'lg:order-2' : ''
                    }`}
                  >
                    <ParallaxFrame className="aspect-[4/3] w-full bg-[#242422]" range={8} scale={1.1}>
                      {chapterVideo ? (
                        <ViewportVideo
                          src={chapterVideo}
                          poster={col.image}
                          ariaLabel={`${col.title} campaign film`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <SafeImage
                          src={col.image}
                          alt={col.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </ParallaxFrame>
                  </div>

                  <ParallaxLayer
                    offsetY={[16, -16]}
                    className={`lg:col-span-6 space-y-5 ${
                      reverse ? 'lg:order-1' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase text-[#B8C7A6]">
                      <span>Chapter {col.chapter}</span>
                      <span>·</span>
                      <span className="text-[#B5B2A8]">{col.season}</span>
                    </div>

                    <h2 className="font-display text-4xl sm:text-5xl font-normal tracking-tight">
                      {col.title}
                    </h2>

                    <p className="text-[15px] text-[#B5B2A8] dark-prose max-w-lg">
                      {col.manifesto}
                    </p>

                    <div className="pt-2">
                      <Link
                        to={`/shop?collection=${encodeURIComponent(col.title)}`}
                        className="min-h-[44px] inline-flex items-center gap-3 px-6 py-3 border border-[#E9E6DF]/30 hover:border-[#B8C7A6] hover:text-[#B8C7A6] font-mono text-[11px] tracking-[0.18em] uppercase transition-colors"
                      >
                        Shop {col.title}
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </ParallaxLayer>
                </div>

                {/* Capsule Products Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                  {chapterProducts.map((product) => (
                    <ProductCard key={product.id} product={product} darkSurface />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};
