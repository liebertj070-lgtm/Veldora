import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Search, X } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { SafeImage } from './SafeImage';

const SUGGESTED_QUERIES = [
  'Trench',
  'Cashmere',
  'Silk',
  'Tailoring',
  'Merino',
  'Leather',
];

export const SearchOverlay: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) setIsSearchOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS.slice(0, 4);
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.colors.some((c) => c.name.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search VELORA catalog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 bg-[#171717]/97 text-[#E9E6DF] backdrop-blur-md overflow-y-auto"
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
            {/* Top Search Bar */}
            <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#2A2A28]">
              <div className="flex items-center gap-4 flex-1">
                <Search className="w-5 h-5 text-[#A6A39A] shrink-0" strokeWidth={1.5} />
                <label htmlFor="velora-search-input" className="sr-only">
                  Search garments and objects
                </label>
                <input
                  id="velora-search-input"
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search silhouettes, textiles, or collections..."
                  className="w-full bg-transparent text-xl sm:text-3xl font-display tracking-tight text-[#E9E6DF] placeholder:text-[#A6A39A]/60 focus:outline-none"
                />
              </div>

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#A6A39A] hover:text-[#E9E6DF] px-2 cursor-pointer"
                >
                  Clear
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
                className="p-2 text-[#E9E6DF] hover:text-[#B8C7A6] transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>

            {/* Suggested Search Terms */}
            <div className="py-5 flex flex-wrap items-center gap-3 border-b border-[#2A2A28]">
              <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#A6A39A] mr-2">
                Suggestions
              </span>
              {SUGGESTED_QUERIES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className={`px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] uppercase border transition-colors cursor-pointer ${
                    query.toLowerCase() === term.toLowerCase()
                      ? 'border-[#B8C7A6] bg-[#B8C7A6] text-[#171717]'
                      : 'border-[#2A2A28] text-[#E9E6DF] hover:border-[#A6A39A]'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Results Section */}
            <div className="pt-8">
              <div className="flex items-center justify-between mb-6">
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#A6A39A] tabular-nums">
                  {query
                    ? `${results.length} ${results.length === 1 ? 'Result' : 'Results'} for "${query}"`
                    : 'Featured Archive Selections'}
                </p>
                <Link
                  to={query ? `/shop?q=${encodeURIComponent(query)}` : '/shop'}
                  onClick={() => setIsSearchOpen(false)}
                  className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase text-[#B8C7A6] hover:text-[#E9E6DF] transition-colors"
                >
                  Open in Catalog
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {results.length === 0 ? (
                <div className="py-16 text-center border border-[#2A2A28] px-6">
                  <h3 className="font-display text-3xl text-[#E9E6DF]">
                    No garments match "{query}".
                  </h3>
                  <p className="text-sm text-[#A6A39A] mt-2">
                    Try searching by material (silk, merino, calfskin) or category
                    (outerwear, tailoring).
                  </p>
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="mt-6 px-6 py-2.5 border border-[#E9E6DF]/30 hover:border-[#B8C7A6] hover:text-[#B8C7A6] font-mono text-[11px] tracking-[0.16em] uppercase transition-colors cursor-pointer"
                  >
                    Reset Search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="group block"
                    >
                      <div className="aspect-[3/4] bg-[#242422] overflow-hidden mb-3">
                        <SafeImage
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      </div>
                      <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#A6A39A]">
                        {product.category}
                      </p>
                      <div className="flex items-baseline justify-between gap-2 mt-1">
                        <span className="text-sm font-medium group-hover:text-[#B8C7A6] transition-colors">
                          {product.name}
                        </span>
                        <span className="font-mono text-xs tabular-nums shrink-0">
                          ${product.price.toLocaleString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
