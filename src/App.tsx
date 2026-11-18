import React, { Suspense, lazy, useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchOverlay } from './components/SearchOverlay';
import { QuickViewModal } from './components/QuickViewModal';
import { AtelierDrawer } from './components/AtelierDrawer';
import { CustomCursor } from './components/CustomCursor';
import { IntroCurtain } from './components/IntroCurtain';
import { HomePage } from './pages/HomePage';

const ShopPage = lazy(() =>
  import('./pages/ShopPage').then((m) => ({ default: m.ShopPage }))
);
const CollectionsPage = lazy(() =>
  import('./pages/CollectionsPage').then((m) => ({ default: m.CollectionsPage }))
);
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }

    let attempts = 0;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    const tryScroll = () => {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (attempts < 12) {
        attempts += 1;
        timerId = setTimeout(tryScroll, 50);
      }
    };

    tryScroll();
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [pathname, hash]);

  return null;
};

const OverlayCoordinator: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    isCartOpen,
    isAtelierOpen,
    quickViewProduct,
  } = useStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
        return;
      }

      if (!isInput && e.key === '/' && !isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Prevent background document scrolling when any full-screen overlay or drawer is open
  useEffect(() => {
    const anyOpen =
      isCartOpen || isSearchOpen || isAtelierOpen || Boolean(quickViewProduct);
    if (!anyOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isCartOpen, isSearchOpen, isAtelierOpen, quickViewProduct]);

  return null;
};

const RouteFallback: React.FC = () => (
  <div className="min-h-[60vh] bg-[#E9E6DF] flex items-center justify-center">
    <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#4A4843]">
      Loading Archive…
    </span>
  </div>
);

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        id="main-content"
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 focus:outline-none"
        tabIndex={-1}
      >
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </motion.main>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <ScrollToTop />
        <OverlayCoordinator />
        <CustomCursor />
        <IntroCurtain />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-[#171717] focus:text-[#E9E6DF] focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest"
        >
          Skip to content
        </a>
        <div className="min-h-screen flex flex-col bg-[#E9E6DF] text-[#171717]">
          <AnnouncementBar />
          <Navbar />
          <AnimatedRoutes />
          <Footer />
        </div>
        <CartDrawer />
        <SearchOverlay />
        <QuickViewModal />
        <AtelierDrawer />
      </BrowserRouter>
    </StoreProvider>
  );
}
