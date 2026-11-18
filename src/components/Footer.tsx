import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowUpRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Enter a valid email address (for example, name@domain.com).');
      return;
    }
    setError('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#171717] text-[#E9E6DF] border-t border-[#2A2A28]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-[#2A2A28]">
          {/* Newsletter Column */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-tight leading-[1.1] max-w-md">
                Private previews, archival releases, and seasonal monographs.
              </h2>
            </div>

            {subscribed ? (
              <div
                role="status"
                aria-live="polite"
                className="flex items-center gap-3 py-3 px-4 border border-[#B8C7A6]/50 bg-[#B8C7A6]/10 max-w-md"
              >
                <Check className="w-4 h-4 text-[#B8C7A6] shrink-0" aria-hidden="true" />
                <p className="text-sm text-[#E9E6DF]">
                  Subscribed to VELORA Atelier Dispatch.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="max-w-md">
                <div className="flex items-stretch border-b border-[#A6A39A]/50 focus-within:border-[#B8C7A6] transition-colors">
                  <label htmlFor="footer-newsletter" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="footer-newsletter"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? 'footer-newsletter-error' : undefined}
                    placeholder="Enter your email address"
                    className="w-full bg-transparent py-3 text-sm text-[#E9E6DF] placeholder:text-[#A6A39A] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="min-h-[44px] px-4 py-3 font-mono text-[11px] tracking-[0.16em] uppercase text-[#B8C7A6] hover:text-[#E9E6DF] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1"
                  >
                    Subscribe
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
                {error && (
                  <p
                    id="footer-newsletter-error"
                    role="alert"
                    className="flex items-center gap-1.5 text-xs text-[#F2A6A6] mt-2"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#A6A39A] mb-4">
                Catalog
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/shop" className="hover:text-[#B8C7A6] transition-colors">
                    All Pieces
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop?category=Outerwear"
                    className="hover:text-[#B8C7A6] transition-colors"
                  >
                    Outerwear
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop?category=Tailoring"
                    className="hover:text-[#B8C7A6] transition-colors"
                  >
                    Tailoring
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop?category=Knitwear"
                    className="hover:text-[#B8C7A6] transition-colors"
                  >
                    Knitwear
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop?category=Objects"
                    className="hover:text-[#B8C7A6] transition-colors"
                  >
                    Leather Objects
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#A6A39A] mb-4">
                House
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/collections" className="hover:text-[#B8C7A6] transition-colors">
                    Collections
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#B8C7A6] transition-colors">
                    Brand Philosophy
                  </Link>
                </li>
                <li>
                  <Link to="/about#ateliers" className="hover:text-[#B8C7A6] transition-colors">
                    Antwerp & Milan
                  </Link>
                </li>
                <li>
                  <Link to="/about#materials" className="hover:text-[#B8C7A6] transition-colors">
                    Textile Provenance
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#A6A39A] mb-4">
                Flagship Ateliers
              </h3>
              <div className="space-y-4 text-sm text-[#A6A39A]">
                <div>
                  <p className="text-[#E9E6DF]">Antwerp</p>
                  <p className="text-xs mt-0.5">Kloosterstraat 48, 2000</p>
                </div>
                <div>
                  <p className="text-[#E9E6DF]">Milan</p>
                  <p className="text-xs mt-0.5">Via Solferino 19, 20121</p>
                </div>
                <div>
                  <p className="text-[#E9E6DF]">Tokyo</p>
                  <p className="text-xs mt-0.5">Minami-Aoyama 5-7-21</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Architectural Wordmark & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div className="font-sans text-4xl sm:text-6xl font-semibold tracking-[0.26em] uppercase leading-none text-[#E9E6DF]/90">
            VELORA
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs text-[#A6A39A]">
            <span>© {new Date().getFullYear()} VELORA Studio</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
