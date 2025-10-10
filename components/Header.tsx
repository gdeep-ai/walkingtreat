import React from 'react';

const Header: React.FC = () => {
  return (
    <header>
      <div className="container mx-auto flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-cyan-300 to-pink-300 bg-clip-text text-transparent drop-shadow-sm">
          Itinerary builder: because adventure is just a pastry in disguise
        </h1>
       <p className="max-w-3xl text-center text-base mt-4 text-indigo-200/90">
         Fill out the form, jet-setter, and let our AI dessert guide whisk up a custom tour of treats worth crossing oceans of time for. 
         Don’t worry — all those steps between bakeries totally count as cardio.
       </p>
      </div>
    </header>
  );
};

export default Header;