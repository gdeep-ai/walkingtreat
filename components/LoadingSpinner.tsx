import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="w-16 h-16 border-8 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    <p className="mt-4 text-lg text-indigo-800 font-semibold">
      Curating your recommendations...
    </p>
    <p className="text-sm text-indigo-600">Finding the most delectable destinations.</p>
  </div>
);

export default LoadingSpinner;