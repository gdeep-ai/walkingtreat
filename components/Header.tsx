
import React from 'react';

const Header: React.FC = () => (
  <header className="bg-amber-100/50 border-b border-amber-200/80 backdrop-blur-sm sticky top-0 z-10">
    <div className="container mx-auto px-4 py-4 flex items-center justify-center">
      <h1 className="text-3xl md:text-4xl font-bold text-stone-800 tracking-tight">
        Dessert Detour
      </h1>
    </div>
  </header>
);

export default Header;
