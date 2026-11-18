import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Heart, Package, X } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { SafeImage } from './SafeImage';

export const AtelierDrawer: React.FC = () => {
  const {
    isAtelierOpen,
    setIsAtelierOpen,
    wishlist,
    toggleWishlist,
    orders,
    addToCart,
  } = useStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAtelierOpen) setIsAtelierOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isAtelierOpen, setIsAtelierOpen]);

  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <AnimatePresence>
      {isAtelierOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAtelierOpen(false)}
            className="fixed inset-0 z-50 bg-[#0E0E0E]/65 backdrop-blur-xs"
            aria-hidden="true"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Client Atelier Archive"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#E9E6DF] text-[#171717] border-l border-[#171717]/15 flex flex-col shadow-2xl"
          >
            <div className="px-6 py-5 border-b border-[#171717]/12 flex items-center justify-between">
              <h2 className="font-mono text-xs tracking-[0.2em] uppercase">
                Client Atelier
              </h2>
              <button
                type="button"
                onClick={() => setIsAtelierOpen(false)}
                aria-label="Close Client Atelier"
                className="p-2 -mr-2 hover:opacity-60 transition-opacity cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-10">
              {/* Saved Pieces */}
              <section>
                <div className="flex items-center justify-between pb-3 border-b border-[#171717]/12 mb-4">
                  <h3 className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#5C5A54]">
                    Saved Pieces ({savedProducts.length})
                  </h3>
                </div>

                {savedProducts.length === 0 ? (
                  <div className="py-6 text-sm text-[#5C5A54]">
                    <p>No pieces archived yet. Select the heart icon on any garment to curate your private selection.</p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {savedProducts.map((product) => (
                      <li
                        key={product.id}
                        className="flex gap-3.5 pb-4 border-b border-[#171717]/10"
                      >
                        <Link
                          to={`/product/${product.id}`}
                          onClick={() => setIsAtelierOpen(false)}
                          className="w-16 aspect-[3/4] bg-[#DCD8CF] shrink-0 overflow-hidden"
                        >
                          <SafeImage
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <Link
                              to={`/product/${product.id}`}
                              onClick={() => setIsAtelierOpen(false)}
                              className="text-sm font-medium hover:underline block truncate"
                            >
                              {product.name}
                            </Link>
                            <p className="font-mono text-xs tabular-nums text-[#5C5A54] mt-0.5">
                              ${product.price.toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                addToCart(
                                  product,
                                  product.sizes[0],
                                  product.colors[0].name,
                                  1
                                );
                                setIsAtelierOpen(false);
                              }}
                              className="font-mono text-[10px] tracking-[0.14em] uppercase underline underline-offset-4 hover:text-[#5C5A54] cursor-pointer"
                            >
                              Add to Bag
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleWishlist(product.id)}
                              className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#6D6A63] hover:text-[#171717] cursor-pointer flex items-center gap-1"
                            >
                              <Heart className="w-3 h-3" fill="currentColor" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Recent Demo Orders */}
              <section>
                <div className="flex items-center justify-between pb-3 border-b border-[#171717]/12 mb-4">
                  <h3 className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#5C5A54]">
                    Archival Orders ({orders.length})
                  </h3>
                </div>

                {orders.length === 0 ? (
                  <div className="py-4 text-sm text-[#5C5A54] flex items-start gap-3">
                    <Package className="w-4 h-4 shrink-0 mt-0.5 text-[#A6A39A]" />
                    <p>
                      Orders placed through the Checkout Demonstration appear here for
                      your session reference.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {orders.map((order) => (
                      <li
                        key={order.id}
                        className="p-4 bg-[#F2EFE9] border border-[#171717]/12 space-y-2"
                      >
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span className="font-medium">{order.id}</span>
                          <span className="text-[#5C5A54]">{order.date}</span>
                        </div>
                        <p className="text-xs text-[#5C5A54]">
                          {order.items.reduce((s, i) => s + i.quantity, 0)} pieces ·{' '}
                          {order.city}
                        </p>
                        <div className="flex items-center justify-between pt-1 border-t border-[#171717]/10 font-mono text-xs">
                          <span>Total</span>
                          <span className="tabular-nums font-medium">
                            ${order.total.toLocaleString()}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
