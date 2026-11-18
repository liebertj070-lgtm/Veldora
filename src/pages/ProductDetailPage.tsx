import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, Heart, Minus, Plus, Ruler, X } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { SafeImage } from '../components/SafeImage';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();

  const product = useMemo(
    () => PRODUCTS.find((p) => p.id === id) || PRODUCTS[0],
    [id]
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>('composition');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const zoomImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setActiveImageIndex(0);
    setSelectedSize(product.sizes[0]);
    setSelectedColor(product.colors[0].name);
    setQuantity(1);
    setJustAdded(false);
  }, [product]);

  useEffect(() => {
    if (!sizeGuideOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSizeGuideOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sizeGuideOpen]);

  const handleAddToBag = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const handleGalleryKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveImageIndex((i) => (i + 1) % product.gallery.length);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveImageIndex((i) => (i - 1 + product.gallery.length) % product.gallery.length);
    }
  };

  const relatedProducts = useMemo(() => {
    const sameCat = PRODUCTS.filter(
      (p) => p.id !== product.id && p.category === product.category
    );
    const others = PRODUCTS.filter(
      (p) => p.id !== product.id && p.category !== product.category
    );
    return [...sameCat, ...others].slice(0, 4);
  }, [product]);

  const saved = isWishlisted(product.id);
  const activeImage = product.gallery[activeImageIndex] || product.image;

  return (
    <div className="bg-[#E9E6DF] text-[#171717] min-h-screen pb-24 lg:pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase text-[#4A4843] pb-8"
        >
          <Link to="/" className="hover:text-[#171717] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#171717] transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link
            to={`/shop?category=${encodeURIComponent(product.category)}`}
            className="hover:text-[#171717] transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#171717] truncate">{product.name}</span>
        </nav>

        {/* Main Split Layout: Gallery Left, Contiguous Purchase Module Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Product Gallery with keyboard Left/Right support */}
          <div
            className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4"
            onKeyDown={handleGalleryKeyDown}
          >
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 sm:w-20 shrink-0 overflow-x-auto sm:overflow-visible">
              {product.gallery.map((imgUrl, index) => (
                <button
                  key={`${product.id}-thumb-${index}`}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                  className={`w-16 sm:w-20 aspect-[3/4] shrink-0 overflow-hidden border transition-all cursor-pointer ${
                    activeImageIndex === index
                      ? 'border-[#171717] opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <SafeImage
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Primary Feature Image with Zero-Rerender Textile Macro-Zoom */}
            <div
              className="flex-1 aspect-[3/4] bg-[#DCD8CF] overflow-hidden relative cursor-zoom-in"
              onMouseMove={(e) => {
                if (!zoomImgRef.current) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                zoomImgRef.current.style.transformOrigin = `${x}% ${y}%`;
                if (!isZooming) setIsZooming(true);
              }}
              onMouseLeave={() => setIsZooming(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.7 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full"
                >
                  <SafeImage
                    ref={zoomImgRef}
                    priority
                    src={activeImage}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ease-out ${
                      isZooming ? 'scale-[1.65]' : 'scale-100'
                    }`}
                  />
                </motion.div>
              </AnimatePresence>
              <span
                aria-hidden="true"
                className="hidden sm:inline-block pointer-events-none absolute bottom-3 right-3 px-2.5 py-1 bg-[#171717]/75 text-[#E9E6DF] font-mono text-[9px] tracking-[0.16em] uppercase"
              >
                {isZooming ? '1.65× Textile Detail' : 'Hover to Inspect Weave'}
              </span>
            </div>
          </div>

          {/* Sticky Purchase Module */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="pb-6 border-b border-[#171717]/15">
              <div className="flex items-center justify-between gap-4 font-mono text-[11px] tracking-[0.16em] uppercase text-[#5C5A54]">
                <span>
                  {product.collection} · {product.sku}
                </span>
                {product.tag && (
                  <span className="text-[#171717] font-medium">{product.tag}</span>
                )}
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight leading-[1.05] mt-3">
                {product.name}
              </h1>

              <p className="font-mono text-2xl tabular-nums mt-4">
                ${product.price.toLocaleString()}
              </p>
            </div>

            <p className="text-[15px] leading-relaxed text-[#3B3A35]">
              {product.description}
            </p>

            {/* Colour Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.16em] uppercase">
                <span className="text-[#5C5A54]">
                  Colour — <strong className="text-[#171717] font-medium">{selectedColor}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    aria-label={`Select colour ${c.name}`}
                    className={`w-8 h-8 rounded-full border p-0.5 transition-transform cursor-pointer ${
                      selectedColor === c.name
                        ? 'border-[#171717] scale-110'
                        : 'border-[#171717]/20 hover:border-[#171717]/60'
                    }`}
                  >
                    <span
                      className="block w-full h-full rounded-full"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#5C5A54]">
                  Select Size
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] uppercase text-[#5C5A54] hover:text-[#171717] underline underline-offset-4 cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`h-11 font-mono text-xs border transition-colors cursor-pointer ${
                      selectedSize === size
                        ? 'bg-[#171717] text-[#E9E6DF] border-[#171717]'
                        : 'border-[#171717]/20 hover:border-[#171717]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Primary Add-to-Bag */}
            <div className="flex items-stretch gap-3 pt-2">
              <div className="inline-flex items-center border border-[#171717]/25 bg-[#F2EFE9]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="w-11 h-12 flex items-center justify-center hover:bg-[#171717]/5 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-mono text-sm tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="w-11 h-12 flex items-center justify-center hover:bg-[#171717]/5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToBag}
                className={`flex-1 h-12 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors cursor-pointer inline-flex items-center justify-center gap-2 ${
                  justAdded
                    ? 'bg-[#B8C7A6] text-[#171717]'
                    : 'bg-[#171717] text-[#E9E6DF] hover:bg-[#2B2B29]'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
                    Added to Bag
                  </>
                ) : (
                  <>Add to Bag — ${(product.price * quantity).toLocaleString()}</>
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label={saved ? 'Remove from saved pieces' : 'Save piece'}
                aria-pressed={saved}
                className={`w-12 h-12 border flex items-center justify-center transition-colors cursor-pointer ${
                  saved
                    ? 'bg-[#171717] text-[#E9E6DF] border-[#171717]'
                    : 'border-[#171717]/25 hover:border-[#171717]'
                }`}
              >
                <Heart
                  className="w-4 h-4"
                  strokeWidth={1.5}
                  fill={saved ? 'currentColor' : 'none'}
                />
              </button>
            </div>

            {/* Accordion Technical Specs */}
            <div className="pt-4 border-t border-[#171717]/15 divide-y divide-[#171717]/15">
              {[
                {
                  key: 'composition',
                  title: 'Composition & Origin',
                  body: `${product.composition}. ${product.origin}.`,
                },
                {
                  key: 'fit',
                  title: 'Silhouette & Fit Notes',
                  body: product.fitNotes,
                },
                {
                  key: 'courier',
                  title: 'Courier & Archive Packaging',
                  body: 'Complimentary tracked global courier on orders above $450. Dispatched in unbleached cotton archival garment covers with numbered care card.',
                },
              ].map((item) => {
                const isOpen = openAccordion === item.key;
                return (
                  <div key={item.key}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenAccordion(isOpen ? null : item.key)}
                      className="w-full min-h-[48px] py-3.5 flex items-center justify-between text-left font-mono text-[11px] tracking-[0.16em] uppercase cursor-pointer"
                    >
                      <span>{item.title}</span>
                      <ChevronDown
                        aria-hidden="true"
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="pb-4 text-sm text-[#4A4843] leading-relaxed max-w-[60ch]">
                        {item.body}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-24 pt-16 border-t border-[#171717]/15">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-normal">
                Complementary Silhouettes
              </h2>
            </div>
            <Link
              to="/shop"
              className="font-mono text-[11px] tracking-[0.16em] uppercase underline underline-offset-4 hover:text-[#5C5A54]"
            >
              All Pieces
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      </div>

      {/* Mobile Sticky Quick Buy Bar (Compact <= 64px) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#E9E6DF]/95 backdrop-blur-md border-t border-[#171717]/15 px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium truncate">{product.name}</p>
          <p className="font-mono text-xs tabular-nums text-[#4A4843]">
            ${product.price.toLocaleString()} · Size {selectedSize}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddToBag}
          className={`min-h-[44px] px-5 py-2.5 font-mono text-[11px] tracking-[0.16em] uppercase whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
            justAdded
              ? 'bg-[#B8C7A6] text-[#171717]'
              : 'bg-[#171717] text-[#E9E6DF]'
          }`}
        >
          {justAdded ? 'Added' : 'Add to Bag'}
        </button>
      </div>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="VELORA Size Guide"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E0E0E]/75 backdrop-blur-xs"
          onClick={() => setSizeGuideOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#E9E6DF] text-[#171717] p-6 sm:p-8 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#171717]/15">
              <h3 className="font-mono text-xs tracking-[0.18em] uppercase">
                Architectural Fit Matrix (cm)
              </h3>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                aria-label="Close size guide"
                className="p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <table className="w-full text-left font-mono text-xs tabular-nums">
              <thead>
                <tr className="border-b border-[#171717]/15 text-[#5C5A54]">
                  <th className="py-2">Size</th>
                  <th className="py-2">Chest</th>
                  <th className="py-2">Shoulder</th>
                  <th className="py-2">Waist</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171717]/10">
                {[
                  ['XS', '84–88', '42', '66–70'],
                  ['S', '89–94', '44', '71–76'],
                  ['M', '95–100', '46', '77–82'],
                  ['L', '101–106', '48', '83–88'],
                  ['XL', '107–112', '50', '89–94'],
                ].map((row) => (
                  <tr key={row[0]}>
                    <td className="py-2.5 font-medium">{row[0]}</td>
                    <td className="py-2.5">{row[1]}</td>
                    <td className="py-2.5">{row[2]}</td>
                    <td className="py-2.5">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-[#5C5A54] leading-relaxed">
              VELORA tailoring utilizes intentional shoulder extension and unpressed
              volume. Take your standard measurement unless a closer silhouette is
              desired.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
