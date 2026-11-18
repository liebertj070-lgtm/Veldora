import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Eye, Heart } from 'lucide-react';
import { Product } from '../data/products';
import { useStore } from '../context/StoreContext';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
  darkSurface?: boolean;
  parallaxOffset?: number;
}

interface ParallaxMediaProps {
  frameRef: React.RefObject<HTMLDivElement | null>;
  parallaxOffset: number;
  children: React.ReactNode;
}

const ParallaxProductMedia: React.FC<ParallaxMediaProps> = ({
  frameRef,
  parallaxOffset,
  children,
}) => {
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${parallaxOffset}%`, `${parallaxOffset}%`]
  );

  return (
    <motion.div
      style={{ y, scale: 1.09 }}
      className="relative w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  darkSurface = false,
  parallaxOffset = 6,
}) => {
  const { setQuickViewProduct, toggleWishlist, isWishlisted } = useStore();
  const [hovered, setHovered] = useState(false);
  const [mountSecondary, setMountSecondary] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const saved = isWishlisted(product.id);

  const enableParallax = !prefersReduced && parallaxOffset > 0;

  const handleEnter = () => {
    setHovered(true);
    if (!mountSecondary) setMountSecondary(true);
  };

  const mediaContent = (
    <>
      <SafeImage
        src={product.image}
        alt={product.name}
        fallbackTitle={product.name}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
          hovered ? 'opacity-0 scale-[1.03]' : 'opacity-100 scale-100'
        }`}
      />
      {mountSecondary && (
        <SafeImage
          src={product.secondaryImage}
          alt={`${product.name} editorial view`}
          fallbackTitle={product.name}
          loading="eager"
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
            hovered ? 'opacity-100 scale-[1.03]' : 'opacity-0 scale-100'
          }`}
        />
      )}
    </>
  );

  return (
    <article
      className="group flex flex-col"
      onMouseEnter={handleEnter}
      onFocus={() => {
        if (!mountSecondary) setMountSecondary(true);
      }}
      onMouseLeave={() => setHovered(false)}
      data-cursor="VIEW"
    >
      {/* Image Container: 3:4 Editorial Ratio — Outer frame stays stationary on hover */}
      <div
        ref={frameRef}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#DCD8CF]"
      >
        <Link
          to={`/product/${product.id}`}
          aria-label={`View ${product.name}`}
          className="block w-full h-full"
        >
          {enableParallax ? (
            <ParallaxProductMedia frameRef={frameRef} parallaxOffset={parallaxOffset}>
              {mediaContent}
            </ParallaxProductMedia>
          ) : (
            <div className="relative w-full h-full">{mediaContent}</div>
          )}
        </Link>

        {/* Top-Right Wishlist Toggle (>= 44x44px touch target) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
          aria-pressed={saved}
          className="absolute top-2.5 right-2.5 z-10 w-11 h-11 flex items-center justify-center bg-[#E9E6DF]/90 text-[#171717] hover:bg-[#171717] hover:text-[#E9E6DF] transition-colors cursor-pointer"
        >
          <Heart
            className="w-4 h-4"
            strokeWidth={1.5}
            fill={saved ? 'currentColor' : 'none'}
          />
        </button>

        {/* Hover / Focus-Within Quick-View Action Bar */}
        <div className="hover-reveal-bar absolute inset-x-3 bottom-3 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setQuickViewProduct(product);
            }}
            className="w-full min-h-[44px] px-3 bg-[#171717]/95 text-[#E9E6DF] hover:bg-[#B8C7A6] hover:text-[#171717] font-mono text-[10px] tracking-[0.16em] uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
            Quick View
          </button>
        </div>
      </div>

      {/* Unboxed Clean Product Metadata with WCAG AA Contrast */}
      <div className="pt-3.5 flex flex-col gap-1.5">
        <div
          className={`flex items-center justify-between gap-2 text-[11px] font-mono tracking-[0.08em] ${
            darkSurface ? 'text-[#B5B2A8]' : 'text-[#4A4843]'
          }`}
        >
          <span>
            {product.category} · {product.collection}
          </span>
          {product.tag && (
            <span className={darkSurface ? 'text-[#B8C7A6]' : 'text-[#171717]'}>
              {product.tag}
            </span>
          )}
        </div>

        <div className="flex items-baseline justify-between gap-3">
          <Link
            to={`/product/${product.id}`}
            className={`text-[15px] font-medium leading-snug hover:underline ${
              darkSurface ? 'text-[#E9E6DF]' : 'text-[#171717]'
            }`}
          >
            {product.name}
          </Link>
          <span
            className={`font-mono text-[14px] tabular-nums shrink-0 ${
              darkSurface ? 'text-[#E9E6DF]' : 'text-[#171717]'
            }`}
          >
            ${product.price.toLocaleString()}
          </span>
        </div>

        {/* Minimal Colour Swatches */}
        <div className="flex items-center gap-1.5 pt-0.5">
          {product.colors.map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="w-3 h-3 rounded-full border border-[#171717]/25"
              style={{ backgroundColor: c.hex }}
            />
          ))}
          <span
            className={`ml-1 text-[11px] font-mono ${
              darkSurface ? 'text-[#B5B2A8]' : 'text-[#4A4843]'
            }`}
          >
            {product.sizes.length > 1
              ? `${product.sizes[0]}–${product.sizes[product.sizes.length - 1]}`
              : product.sizes[0]}
          </span>
        </div>
      </div>
    </article>
  );
};
