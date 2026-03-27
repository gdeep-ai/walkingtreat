import React from 'react';
import { Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center p-12 mt-auto bg-transparent border-t border-slate-100">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-[#E87A5D]" />
        <span className="text-sm font-bold tracking-tighter text-[#2D2422]">Dessert (De)Tour</span>
      </div>
      <p className="text-xs font-medium text-slate-400">
        Studio GDP. Artisanal, hand-crafted in Saint Panch, 2025
      </p>
    </footer>
  );
};

export default Footer;