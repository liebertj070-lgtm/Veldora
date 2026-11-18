import React from 'react';
import { X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AnnouncementBar: React.FC = () => {
  const { announcementVisible, dismissAnnouncement } = useStore();

  if (!announcementVisible) return null;

  return (
    <div className="relative bg-[#171717] text-[#E9E6DF] border-b border-[#2A2A28] h-9 flex items-center justify-center px-10 text-center">
      <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase truncate">
        AW26 Monolith Archive — Complimentary global courier on orders over $450
      </p>
      <button
        type="button"
        onClick={dismissAnnouncement}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#A6A39A] hover:text-[#E9E6DF] transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
};
