import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-12">
    <div className="w-16 h-16 border-4 border-slate-100 border-t-[#E87A5D] rounded-full animate-spin"></div>
    <p className="mt-6 text-lg text-[#2D2422] font-bold">
      Curating your recommendations...
    </p>
    <p className="text-sm text-slate-500 mt-2">Finding the most delectable destinations.</p>
  </div>
);

export default LoadingSpinner;