import React from 'react';
import { Sparkles, Trophy, Map, Cake } from 'lucide-react';

const Header: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative z-20">
      <div className="container mx-auto flex items-center justify-between p-6">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.location.reload()}>
            <div className="relative w-10 h-10 bg-gradient-to-br from-[#E87A5D] to-[#D97757] rounded-xl flex items-center justify-center shadow-lg shadow-[#E87A5D]/20 transition-transform group-hover:scale-110">
                <Cake className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                </div>
            </div>
            <span className="text-xl font-bold tracking-tighter text-[#2D2422]">Dessert (De)Tour</span>
        </div>
        
        <nav className="hidden sm:flex items-center gap-8">
            <button 
                onClick={() => scrollToSection('quest-form')} 
                className="flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-[#E87A5D] transition-colors"
            >
                <Map className="w-4 h-4" />
                The Quest
            </button>
            <button 
                onClick={() => scrollToSection('hall-of-fame')} 
                className="flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-[#E87A5D] transition-colors"
            >
                <Trophy className="w-4 h-4" />
                Hall of Fame
            </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;