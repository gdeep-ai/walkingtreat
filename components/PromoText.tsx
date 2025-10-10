import React from 'react';

const PromoText: React.FC = () => {
  return (
    <div className="text-center bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/50 my-8">
      <h2 className="text-2xl font-bold text-indigo-900 mb-4 tracking-wide">
        You, hey you. Hey you! I love desserts — and desserts L-O-V-E me.
      </h2>
      <p className="text-slate-800 max-w-3xl mx-auto text-lg leading-relaxed">
        <span className="font-semibold text-indigo-800">¡Órale, vato!</span> You’ve just stumbled into the sweetest corner of the internet. 
        <br />
        Time to unleash your inner pastry explorer; the Indiana Jones of gelato, the Marco Polo of macarons, maybe even the Sherlock Holmes of sprinkles.
      </p>
    </div>
  );
};

export default PromoText;