import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { useStore } from '../context/StoreContext';

export const Navbar: React.FC = () => {
  const { cartCount, wishlist, setIsCartOpen, setIsSearchOpen, setIsAtelierOpen } =
    useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 280, damping: 32, restDelta: 0.001 });

  const isDarkHeroRoute = location.pathname === '/';

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 40;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navTextBase =
    isDarkHeroRoute && !scrolled
      ? 'bg-[#171717]/92 text-[#E9E6DF] border-[#2A2A28]'
      : 'bg-[#E9E6DF]/95 text-[#171717] border-[#171717]/10';

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-[13px] tracking-[0.06em] whitespace-nowrap shrink-0 py-1 transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:origin-left after:transition-transform after:duration-200 ${
      isActive
        ? 'after:scale-x-100 after:bg-current font-medium'
        : 'after:scale-x-0 hover:after:scale-x-100 after:bg-current opacity-80 hover:opacity-100'
    }`;

  return (
    <>
      <header
        className={`sticky top-0 z-40 h-14 backdrop-blur-sm border-b transition-colors duration-300 ${navTextBase}`}
      >
        <motion.div
          aria-hidden="true"
          style={{ scaleX }}
          className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B8C7A6] origin-left z-10 pointer-events-none"
        />
        <div className="max-w-[1440px] mx-auto h-full px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Brand Wordmark + Mobile Menu Trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden p-2 -ml-2 hover:opacity-70 transition-opacity cursor-pointer"
            >
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            </button>
            <Link
              to="/"
              className="font-sans text-lg sm:text-xl font-semibold tracking-[0.26em] uppercase whitespace-nowrap shrink-0"
            >
              VELORA
            </Link>
          </div>

          {/* Zone 2: Primary Navigation Links */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-8 lg:gap-10"
          >
            <NavLink to="/shop" className={linkClass}>
              Shop
            </NavLink>
            <NavLink to="/collections" className={linkClass}>
              Collections
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
            <NavLink to="/shop?category=Outerwear" className={() => `text-[13px] tracking-[0.06em] whitespace-nowrap shrink-0 py-1 opacity-80 hover:opacity-100 transition-opacity`}>
              Archive
            </NavLink>
          </nav>

          {/* Zone 3: Utility & Primary Bag Action */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search catalog (Shortcut: Cmd+K or /)"
              className="min-h-[44px] px-2.5 flex items-center gap-2 text-[12px] tracking-[0.08em] opacity-85 hover:opacity-100 transition-opacity cursor-pointer whitespace-nowrap shrink-0"
            >
              <Search className="w-4 h-4" strokeWidth={1.5} />
              <span className="hidden lg:inline">Search</span>
              <kbd className="hidden xl:inline-block font-mono text-[10px] px-1.5 py-0.5 border border-current/20 opacity-70">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setIsAtelierOpen(true)}
              aria-label="Open Client Atelier and saved items"
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
            >
              <User className="w-4 h-4" strokeWidth={1.5} />
              {wishlist.length > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#B8C7A6]"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open shopping bag, ${cartCount} items`}
              className="min-h-[40px] flex items-center gap-2 pl-3 pr-3.5 py-1.5 border border-current/25 hover:border-current transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="font-mono text-[11px] tracking-[0.12em] uppercase tabular-nums">
                Bag ({cartCount})
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Editorial Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[#171717] text-[#E9E6DF] flex flex-col justify-between p-6 md:hidden"
          >
            <div className="flex items-center justify-between border-b border-[#2A2A28] pb-4">
              <span className="font-sans text-lg font-semibold tracking-[0.26em] uppercase">
                VELORA
              </span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="p-2 text-[#E9E6DF] hover:text-[#B8C7A6] transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <nav aria-label="Mobile Navigation" className="flex flex-col gap-5 my-auto">
              {[
                { label: 'Shop All', to: '/shop', index: '01' },
                { label: 'Collections', to: '/collections', index: '02' },
                { label: 'About Atelier', to: '/about', index: '03' },
                { label: 'Outerwear', to: '/shop?category=Outerwear', index: '04' },
                { label: 'Tailoring', to: '/shop?category=Tailoring', index: '05' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="group flex items-baseline gap-4 border-b border-[#2A2A28] pb-3"
                >
                  <span className="font-mono text-[11px] text-[#A6A39A] tabular-nums">
                    {item.index}
                  </span>
                  <span className="font-display text-4xl font-normal tracking-tight group-hover:text-[#B8C7A6] transition-colors">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center justify-between pt-4 border-t border-[#2A2A28] text-xs text-[#A6A39A]">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="flex items-center gap-2 uppercase tracking-[0.14em] text-[#E9E6DF]"
              >
                <Search className="w-4 h-4" strokeWidth={1.5} />
                Search
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAtelierOpen(true);
                }}
                className="flex items-center gap-2 uppercase tracking-[0.14em] text-[#E9E6DF]"
              >
                <User className="w-4 h-4" strokeWidth={1.5} />
                Client Atelier
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
