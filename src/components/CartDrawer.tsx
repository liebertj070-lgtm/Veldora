import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, ArrowLeft, CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import {
  DemoOrder,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  useStore,
} from '../context/StoreContext';
import { SafeImage } from './SafeImage';

type DrawerStep = 'bag' | 'checkout' | 'confirmed';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    placeDemoOrder,
  } = useStore();

  const [step, setStep] = useState<DrawerStep>('bag');
  const [confirmedOrder, setConfirmedOrder] = useState<DemoOrder | null>(null);
  const [form, setForm] = useState({
    customerName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!isCartOpen) {
      const timer = setTimeout(() => {
        if (step === 'confirmed') {
          setStep('bag');
          setConfirmedOrder(null);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isCartOpen, step]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) setIsCartOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const shippingCost =
    cartSubtotal === 0 || cartSubtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_FEE;
  const shippingProgress = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.customerName.trim() ||
      !form.email.includes('@') ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.postalCode.trim()
    ) {
      setFormError('Please complete all required courier fields.');
      return;
    }
    setFormError('');
    const order = placeDemoOrder(form);
    setConfirmedOrder(order);
    setStep('confirmed');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-[#0E0E0E]/65 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Slide-Over Panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Bag"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#E9E6DF] text-[#171717] border-l border-[#171717]/15 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#171717]/12 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {step === 'checkout' && (
                  <button
                    type="button"
                    onClick={() => setStep('bag')}
                    aria-label="Return to bag"
                    className="p-1 -ml-1 hover:opacity-60 transition-opacity cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                )}
                <h2 className="font-mono text-xs tracking-[0.2em] uppercase">
                  {step === 'bag' && `Shopping Bag (${cartCount})`}
                  {step === 'checkout' && 'Checkout Demonstration'}
                  {step === 'confirmed' && 'Order Confirmed'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                aria-label="Close shopping bag"
                className="p-2 -mr-2 hover:opacity-60 transition-opacity cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* Complimentary Shipping Progress */}
            {step === 'bag' && cart.length > 0 && (
              <div className="px-6 py-3 bg-[#F2EFE9] border-b border-[#171717]/10">
                <p className="font-mono text-[11px] tracking-[0.06em] text-[#4E4C46] mb-2">
                  {remainingForFreeShipping === 0
                    ? 'Complimentary global courier unlocked.'
                    : `Add $${remainingForFreeShipping.toLocaleString()} more for complimentary courier.`}
                </p>
                <div className="w-full h-0.5 bg-[#171717]/15 overflow-hidden">
                  <div
                    className="h-full bg-[#171717] transition-all duration-300"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Main Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {step === 'confirmed' && confirmedOrder ? (
                <div className="py-6 space-y-6">
                  <div className="flex items-start gap-3 pb-6 border-b border-[#171717]/12">
                    <CheckCircle2
                      className="w-6 h-6 text-[#171717] shrink-0 mt-0.5"
                      strokeWidth={1.5}
                    />
                    <div>
                      <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#5C5A54]">
                        Order {confirmedOrder.id}
                      </p>
                      <h3 className="font-display text-3xl mt-1">
                        Thank you, {confirmedOrder.customerName}.
                      </h3>
                      <p className="text-sm text-[#4E4C46] mt-2 leading-relaxed">
                        This is a frontend demonstration order. No payment has been
                        processed. Your archival receipt has been saved to your Client
                        Atelier history.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-[#5C5A54]">
                      <span>Recipient</span>
                      <span className="text-[#171717]">{confirmedOrder.email}</span>
                    </div>
                    <div className="flex justify-between text-[#5C5A54]">
                      <span>Destination</span>
                      <span className="text-[#171717] text-right">
                        {confirmedOrder.address}, {confirmedOrder.city}{' '}
                        {confirmedOrder.postalCode}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#5C5A54] pt-2 border-t border-[#171717]/10">
                      <span>Total</span>
                      <span className="text-[#171717] font-medium tabular-nums">
                        ${confirmedOrder.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('bag');
                      setIsCartOpen(false);
                    }}
                    className="w-full py-3.5 bg-[#171717] text-[#E9E6DF] hover:bg-[#2B2B29] font-mono text-[11px] tracking-[0.18em] uppercase transition-colors cursor-pointer"
                  >
                    Continue Exploring
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <ShoppingBag className="w-8 h-8 text-[#A6A39A] mb-4" strokeWidth={1.25} />
                  <h3 className="font-display text-2xl">Your bag is empty.</h3>
                  <p className="text-sm text-[#5C5A54] mt-2 max-w-[26ch]">
                    Explore the AW26 Monolith archive and permanent tailoring pieces.
                  </p>
                  <Link
                    to="/shop"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 px-6 py-3 bg-[#171717] text-[#E9E6DF] hover:bg-[#2B2B29] font-mono text-[11px] tracking-[0.18em] uppercase transition-colors"
                  >
                    Enter Catalog
                  </Link>
                </div>
              ) : step === 'bag' ? (
                <ul className="divide-y divide-[#171717]/12">
                  {cart.map((item) => (
                    <li key={item.key} className="py-5 first:pt-0 flex gap-4">
                      <Link
                        to={`/product/${item.product.id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="w-20 aspect-[3/4] bg-[#DCD8CF] shrink-0 overflow-hidden"
                      >
                        <SafeImage
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to={`/product/${item.product.id}`}
                              onClick={() => setIsCartOpen(false)}
                              className="text-sm font-medium leading-snug hover:underline truncate"
                            >
                              {item.product.name}
                            </Link>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.key)}
                              aria-label={`Remove ${item.product.name}`}
                              className="p-1 text-[#6D6A63] hover:text-[#171717] transition-colors cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </button>
                          </div>
                          <p className="font-mono text-[11px] text-[#5C5A54] mt-1">
                            {item.color} · Size {item.size}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3">
                          <div className="inline-flex items-center border border-[#171717]/20">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.key, item.quantity - 1)
                              }
                              aria-label="Decrease quantity"
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#171717]/5 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-mono text-xs tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.key, item.quantity + 1)
                              }
                              aria-label="Increase quantity"
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#171717]/5 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-mono text-sm tabular-nums">
                            ${(item.product.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                /* Checkout Demonstration Form */
                <form id="velora-demo-checkout" onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <p className="text-xs text-[#5C5A54] leading-relaxed pb-2 border-b border-[#171717]/10">
                    Client-side checkout demonstration. Enter shipping details to generate
                    an instant archival order confirmation.
                  </p>

                  <div>
                    <label
                      htmlFor="co-name"
                      className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#5C5A54] mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="co-name"
                      type="text"
                      required
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      placeholder="Clara Lindqvist"
                      className="w-full px-3.5 py-2.5 bg-[#F2EFE9] border border-[#171717]/20 text-sm focus:border-[#171717] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="co-email"
                      className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#5C5A54] mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      id="co-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="clara@studio.com"
                      className="w-full px-3.5 py-2.5 bg-[#F2EFE9] border border-[#171717]/20 text-sm focus:border-[#171717] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="co-address"
                      className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#5C5A54] mb-1.5"
                    >
                      Street Address
                    </label>
                    <input
                      id="co-address"
                      type="text"
                      required
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Kloosterstraat 48"
                      className="w-full px-3.5 py-2.5 bg-[#F2EFE9] border border-[#171717]/20 text-sm focus:border-[#171717] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="co-city"
                        className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#5C5A54] mb-1.5"
                      >
                        City
                      </label>
                      <input
                        id="co-city"
                        type="text"
                        required
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        placeholder="Antwerp"
                        className="w-full px-3.5 py-2.5 bg-[#F2EFE9] border border-[#171717]/20 text-sm focus:border-[#171717] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="co-postal"
                        className="block font-mono text-[10px] tracking-[0.14em] uppercase text-[#5C5A54] mb-1.5"
                      >
                        Postal Code
                      </label>
                      <input
                        id="co-postal"
                        type="text"
                        required
                        value={form.postalCode}
                        onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                        placeholder="2000"
                        className="w-full px-3.5 py-2.5 bg-[#F2EFE9] border border-[#171717]/20 text-sm focus:border-[#171717] focus:outline-none"
                      />
                    </div>
                  </div>

                  {formError && (
                    <p
                      role="alert"
                      className="flex items-center gap-2 text-xs text-[#8C1D18] bg-[#8C1D18]/8 border border-[#8C1D18]/25 px-3 py-2.5 font-medium"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{formError}</span>
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Footer Totals & CTA */}
            {cart.length > 0 && step !== 'confirmed' && (
              <div className="px-6 py-5 border-t border-[#171717]/12 bg-[#F2EFE9] space-y-4">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-[#4A4843]">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums text-[#171717]">
                      ${cartSubtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#4A4843]">
                    <span>Global Courier</span>
                    <span className="font-mono tabular-nums text-[#171717]">
                      {shippingCost === 0 ? 'Complimentary' : `$${shippingCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#171717]/10 font-medium">
                    <span>Estimated Total</span>
                    <span className="font-mono tabular-nums">
                      ${(cartSubtotal + shippingCost).toLocaleString()}
                    </span>
                  </div>
                </div>

                {step === 'bag' ? (
                  <button
                    type="button"
                    onClick={() => setStep('checkout')}
                    className="w-full min-h-[46px] py-3.5 bg-[#171717] text-[#E9E6DF] hover:bg-[#2B2B29] font-mono text-[11px] tracking-[0.18em] uppercase transition-colors cursor-pointer"
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <button
                    type="submit"
                    form="velora-demo-checkout"
                    className="w-full min-h-[46px] py-3.5 bg-[#171717] text-[#E9E6DF] hover:bg-[#B8C7A6] hover:text-[#171717] font-mono text-[11px] tracking-[0.18em] uppercase transition-colors cursor-pointer"
                  >
                    Confirm Order (${(cartSubtotal + shippingCost).toLocaleString()})
                  </button>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
