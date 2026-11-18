import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Layers } from 'lucide-react';
import { CAMPAIGN_MEDIA, PRODUCTS } from '../data/products';
import { SafeImage } from './SafeImage';

interface DeckCard {
  id: string;
  image: string;
  caption: string;
  detail: string;
  to: string;
}

const DECK_CARDS: DeckCard[] = [
  {
    id: 'textile',
    image: CAMPAIGN_MEDIA.textileDetail,
    caption: 'Ichinomiya & Biella',
    detail: 'Heavyweight raw wool, brushed cashmere & mineral silk',
    to: '/about#materials',
  },
  {
    id: 'atelier',
    image: CAMPAIGN_MEDIA.aboutPortrait,
    caption: 'Antwerp Studio',
    detail: 'Draped directly on linen tailor forms before digitization',
    to: '/about#ateliers',
  },
  {
    id: 'cocoon',
    image: PRODUCTS[9].image,
    caption: 'Study 10 — Cocoon',
    detail: 'Sculptural down-filled ripstop volume',
    to: `/product/${PRODUCTS[9].id}`,
  },
  {
    id: 'tote',
    image: PRODUCTS[7].image,
    caption: 'Study 08 — Gusset Tote',
    detail: 'Vegetable-tanned Italian box calfskin',
    to: `/product/${PRODUCTS[7].id}`,
  },
];

export const LookbookDeck: React.FC = () => {
  const [index, setIndex] = useState(0);

  const cycleNext = () => {
    setIndex((i) => (i + 1) % DECK_CARDS.length);
  };

  const current = DECK_CARDS[index];
  const next = DECK_CARDS[(index + 1) % DECK_CARDS.length];

  return (
    <div className="space-y-3">
      <div className="relative h-[300px] sm:h-[320px] select-none">
        {/* Stacked Background Card */}
        <div
          aria-hidden="true"
          className="absolute inset-0 translate-x-2.5 translate-y-2.5 bg-[#D4CFC4] border border-[#171717]/15 overflow-hidden"
        >
          <SafeImage
            src={next.image}
            alt=""
            className="w-full h-full object-cover opacity-50"
          />
        </div>

        {/* Active Top Interactive Card */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 24, rotate: 1.5 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -30, rotate: -2 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full h-full bg-[#171717] text-[#E9E6DF] overflow-hidden border border-[#171717]/20 shadow-lg"
          >
            <SafeImage
              src={current.image}
              alt={current.caption}
              className="w-full h-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#171717]/85 via-[#171717]/15 to-transparent"
            />
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#B8C7A6]">
                  {String(index + 1).padStart(2, '0')} / {String(DECK_CARDS.length).padStart(2, '0')} · {current.caption}
                </p>
                <p className="text-xs text-[#E9E6DF] truncate mt-0.5">
                  {current.detail}
                </p>
              </div>
              <Link
                to={current.to}
                aria-label={`Open ${current.caption}`}
                className="w-9 h-9 bg-[#E9E6DF] text-[#171717] hover:bg-[#B8C7A6] flex items-center justify-center shrink-0 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={cycleNext}
          className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.16em] uppercase text-[#171717] hover:text-[#4A4843] cursor-pointer py-1"
        >
          <Layers className="w-3.5 h-3.5" strokeWidth={1.5} />
          Next Archive Plate ({index + 1}/{DECK_CARDS.length})
        </button>
        <div className="flex items-center gap-1.5">
          {DECK_CARDS.map((card, i) => (
            <button
              key={card.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View plate ${i + 1}: ${card.caption}`}
              className={`h-1.5 transition-all cursor-pointer ${
                i === index ? 'w-5 bg-[#171717]' : 'w-1.5 bg-[#171717]/25'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
