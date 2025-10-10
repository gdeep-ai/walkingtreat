
import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center p-8">
    <div className="w-12 h-12 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin mb-4"></div>
    <h3 className="text-xl font-semibold text-stone-700">Crafting your custom dessert tour...</h3>
    <p className="text-stone-500 mt-2">This can take a moment. Good taste is worth the wait!</p>
  </div>
);

export default LoadingSpinner;
