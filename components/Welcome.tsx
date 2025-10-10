
import React from 'react';

const Welcome: React.FC = () => (
  <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-stone-200/50">
    <img src="https://picsum.photos/seed/dessert/400/200" alt="Delicious dessert" className="mx-auto rounded-lg mb-6"/>
    <h2 className="text-2xl font-bold text-stone-800 font-serif mb-2">Discover Desserts Worth the Detour</h2>
    <p className="max-w-prose mx-auto text-stone-600">
      Ready for a culinary adventure? Fill out the form above to generate personalized dessert itineraries curated by our AI connoisseur. From legendary classics to hidden gems, your next favorite treat is just a click away.
    </p>
  </div>
);

export default Welcome;
