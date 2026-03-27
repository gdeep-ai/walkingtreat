import React from 'react';

const Welcome: React.FC = () => {
  return (
    <div className="text-center bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100 my-12 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-[#2D2422] mb-4 tracking-tight">
        Ready for a <span className="text-[#E87A5D]">Dessert (De)Tour</span>?
      </h2>
      <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
        Your next unforgettable dessert is just a few clicks away. Fill out the form above to get started, and our <em>AI Curator</em> will design a personalized tour of the most delectable spots in your chosen city.
      </p>
    </div>
  );
};

export default Welcome;
