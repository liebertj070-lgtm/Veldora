import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SafeImage } from './SafeImage';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useStore();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedSize(quickViewProduct.sizes[0]);
      setSelectedColor(quickViewProduct.colors[0].name);
    }
  }, [quickViewProduct]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && quickViewProduct) setQuickViewProduct(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [quickViewProduct, setQuickViewProduct]);

  return (
    <AnimatePresence>
      {quickViewProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Quick view ${quickViewProduct.name}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickViewProduct(null)}
            className="fixed inset-0 bg-[#0E0E0E]/75 backdrop-blur-xs"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 w-full max-w-4xl bg-[#E9E6DF] text-[#171717] grid grid-cols-1 md:grid-cols-12 overflow-hidden shadow-2xl max-h-[90vh]"
          >
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close quick view"
              className="absolute top-4 right-4 z-20 w-9 h-9 bg-[#E9E6DF]/90 flex items-center justify-center hover:bg-[#171717] hover:text-[#E9E6DF] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>

            <div className="md:col-span-6 aspect-[3/4] md:aspect-auto md:h-full bg-[#DCD8CF] overflow-hidden">
              <SafeImage
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto gap-6">
              <div>
                <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#5C5A54]">
                  {quickViewProduct.category} · {quickViewProduct.sku}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl mt-2 leading-tight">
                  {quickViewProduct.name}
                </h2>
                <p className="font-mono text-lg tabular-nums mt-2">
                  ${quickViewProduct.price.toLocaleString()}
                </p>
                <p className="text-sm text-[#4E4C46] leading-relaxed mt-4">
                  {quickViewProduct.description}
                </p>

                {/* Color Selection */}
                <div className="mt-6">
                  <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#5C5A54] mb-2">
                    Colour — <span className="text-[#171717]">{selectedColor}</span>
                  </p>
                  <div className="flex items-center gap-2.5">
                    {quickViewProduct.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        aria-label={`Select colour ${c.name}`}
                        className={`w-7 h-7 rounded-full border p-0.5 cursor-pointer transition-transform ${
                          selectedColor === c.name
                            ? 'border-[#171717] scale-110'
                            : 'border-[#171717]/20'
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

                {/* Size Selection */}
                <div className="mt-5">
                  <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#5C5A54] mb-2">
                    Size
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[44px] h-10 px-3 font-mono text-xs border transition-colors cursor-pointer ${
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
              </div>

              <div className="space-y-3 pt-4 border-t border-[#171717]/12">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(quickViewProduct, selectedSize, selectedColor, 1);
                    setQuickViewProduct(null);
                  }}
                  className="w-full py-3.5 bg-[#171717] text-[#E9E6DF] hover:bg-[#2B2B29] font-mono text-[11px] tracking-[0.18em] uppercase transition-colors cursor-pointer"
                >
                  Add to Bag — ${quickViewProduct.price.toLocaleString()}
                </button>
                <Link
                  to={`/product/${quickViewProduct.id}`}
                  onClick={() => setQuickViewProduct(null)}
                  className="w-full py-2.5 flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase text-[#4E4C46] hover:text-[#171717] transition-colors"
                >
                  View Full Monograph
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
