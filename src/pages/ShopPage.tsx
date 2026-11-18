import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { PRODUCTS, ProductCategory } from '../data/products';
import { ProductCard } from '../components/ProductCard';

const CATEGORIES: ('All' | ProductCategory)[] = [
  'All',
  'Outerwear',
  'Tailoring',
  'Knitwear',
  'Dresses',
  'Objects',
];

type PriceRange = 'all' | 'under-500' | '500-1000' | 'over-1000';
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

export const ShopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory =
    (searchParams.get('category') as 'All' | ProductCategory) || 'All';
  const initialQuery = searchParams.get('q') || '';
  const initialCollection = searchParams.get('collection') || 'All';

  const [category, setCategory] = useState<'All' | ProductCategory>(
    CATEGORIES.includes(initialCategory) ? initialCategory : 'All'
  );
  const [collectionFilter, setCollectionFilter] = useState<string>(initialCollection);
  const [priceRange, setPriceRange] = useState<PriceRange>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const paramCat = searchParams.get('category') as 'All' | ProductCategory | null;
    const paramQ = searchParams.get('q');
    const paramCol = searchParams.get('collection');
    if (paramCat && CATEGORIES.includes(paramCat)) {
      setCategory(paramCat);
    } else if (!paramCat) {
      setCategory('All');
    }
    setSearchQuery(paramQ ?? '');
    setCollectionFilter(paramCol || 'All');
  }, [searchParams]);

  const handleCategoryChange = (cat: 'All' | ProductCategory) => {
    setCategory(cat);
    const next = new URLSearchParams(searchParams);
    if (cat === 'All') {
      next.delete('category');
    } else {
      next.set('category', cat);
    }
    setSearchParams(next, { replace: true });
  };

  const resetAllFilters = () => {
    setCategory('All');
    setCollectionFilter('All');
    setPriceRange('all');
    setSortBy('featured');
    setSearchQuery('');
    setSearchParams({}, { replace: true });
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = PRODUCTS.filter((p) => {
      if (category !== 'All' && p.category !== category) return false;
      if (collectionFilter !== 'All' && p.collection !== collectionFilter) return false;

      if (priceRange === 'under-500' && p.price >= 500) return false;
      if (priceRange === '500-1000' && (p.price < 500 || p.price > 1000)) return false;
      if (priceRange === 'over-1000' && p.price <= 1000) return false;

      if (q) {
        const match =
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'newest') {
      return [...list].sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)));
    }
    return list;
  }, [category, collectionFilter, priceRange, sortBy, searchQuery]);

  const hasActiveFilters =
    category !== 'All' ||
    collectionFilter !== 'All' ||
    priceRange !== 'all' ||
    searchQuery.trim() !== '';

  return (
    <div className="bg-[#E9E6DF] text-[#171717] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-16">
        {/* Editorial Shop Header */}
        <div className="pb-10 border-b border-[#171717]/15 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#5C5A54] mb-3">
              Archive &amp; Current Season
            </p>
            <h1 className="font-display text-5xl sm:text-6xl font-normal tracking-tight leading-none">
              {category === 'All' ? 'Complete Catalog' : category}
            </h1>
          </div>
          <p className="font-mono text-xs tracking-[0.14em] uppercase text-[#5C5A54] tabular-nums">
            Showing {filteredProducts.length} of {PRODUCTS.length} pieces
          </p>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="py-6 border-b border-[#171717]/15 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  aria-pressed={category === cat}
                  className={`min-h-[44px] px-3.5 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors cursor-pointer whitespace-nowrap ${
                    category === cat
                      ? 'bg-[#171717] text-[#E9E6DF]'
                      : 'text-[#4A4843] hover:bg-[#171717]/8 hover:text-[#171717]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search, Price, Sort Controls */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-56">
                <Search className="w-3.5 h-3.5 text-[#4A4843] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by keyword..."
                  aria-label="Filter catalog by keyword"
                  className="w-full min-h-[44px] pl-9 pr-9 py-2 bg-[#F2EFE9] border border-[#171717]/15 text-xs focus:border-[#171717] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-[#4A4843] hover:text-[#171717] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen((o) => !o)}
                aria-expanded={mobileFiltersOpen}
                className="lg:hidden min-h-[44px] px-3.5 py-2 border border-[#171717]/20 font-mono text-[11px] tracking-[0.14em] uppercase flex items-center gap-2 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                Refine
              </button>

              <div className="hidden lg:flex items-center gap-3">
                <select
                  aria-label="Filter by price range"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value as PriceRange)}
                  className="min-h-[44px] px-3 py-2 bg-[#F2EFE9] border border-[#171717]/15 font-mono text-[11px] tracking-[0.1em] uppercase focus:border-[#171717] focus:outline-none cursor-pointer"
                >
                  <option value="all">All Prices</option>
                  <option value="under-500">Under $500</option>
                  <option value="500-1000">$500 – $1,000</option>
                  <option value="over-1000">$1,000+</option>
                </select>

                <select
                  aria-label="Sort products"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="min-h-[44px] px-3 py-2 bg-[#F2EFE9] border border-[#171717]/15 font-mono text-[11px] tracking-[0.1em] uppercase focus:border-[#171717] focus:outline-none cursor-pointer"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="newest">Sort: Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Refine Controls */}
          {mobileFiltersOpen && (
            <div className="lg:hidden grid grid-cols-2 gap-3 pt-2">
              <select
                aria-label="Filter by price range"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value as PriceRange)}
                className="px-3 py-2.5 bg-[#F2EFE9] border border-[#171717]/15 font-mono text-[11px] uppercase"
              >
                <option value="all">All Prices</option>
                <option value="under-500">Under $500</option>
                <option value="500-1000">$500 – $1,000</option>
                <option value="over-1000">$1,000+</option>
              </select>

              <select
                aria-label="Sort products"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2.5 bg-[#F2EFE9] border border-[#171717]/15 font-mono text-[11px] uppercase"
              >
                <option value="featured">Sort: Featured</option>
                <option value="newest">Sort: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          )}

          {/* Active Capsule or Reset Strip */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              {collectionFilter !== 'All' && (
                <span className="font-mono text-[11px] text-[#5C5A54]">
                  Capsule: <strong className="text-[#171717]">{collectionFilter}</strong>
                </span>
              )}
              <button
                type="button"
                onClick={resetAllFilters}
                className="font-mono text-[11px] tracking-[0.14em] uppercase underline underline-offset-4 text-[#171717] hover:text-[#5C5A54] cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center border-b border-[#171717]/15">
            <h2 className="font-display text-3xl">No matching pieces found.</h2>
            <p className="text-sm text-[#5C5A54] mt-2">
              Adjust your category, price threshold, or search keyword to view the archive.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-6 px-6 py-3 bg-[#171717] text-[#E9E6DF] font-mono text-[11px] tracking-[0.18em] uppercase cursor-pointer"
            >
              Show All Pieces
            </button>
          </div>
        ) : (
          <div className="pt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-12">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={product} parallaxOffset={5} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
