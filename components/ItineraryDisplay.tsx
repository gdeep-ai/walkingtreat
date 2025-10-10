
import React from 'react';
import type { ItineraryResponse, Stop } from '../types';
import ItineraryCard from './ItineraryCard';
import MapComponent from './MapComponent';
import { IconShare, IconSource } from './IconComponents';

interface ItineraryDisplayProps {
  itineraryData: ItineraryResponse;
  onReset: () => void;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itineraryData, onReset }) => {
  const allStops: Stop[] = itineraryData.itineraries.flatMap(it => it.stops);
  const groundingChunks = itineraryData.groundingMetadata?.groundingChunks?.filter(
    (chunk) => chunk.web && chunk.web.uri && chunk.web.title
  ) || [];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <div className="text-center bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/50">
        <h2 className="text-3xl font-bold text-indigo-900 mb-2">
          Your Bespoke Dessert Tour for {itineraryData.city}
        </h2>
        <p className="text-slate-700 max-w-3xl mx-auto text-lg leading-relaxed">
          {itineraryData.suggested_schedule}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {itineraryData.itineraries.map((itinerary, index) => (
            <ItineraryCard key={`${itinerary.theme}-${index}`} itinerary={itinerary} />
          ))}
        </div>
        <div className="lg:col-span-1 space-y-8">
           {allStops.length > 0 && <MapComponent stops={allStops} />}
           {groundingChunks.length > 0 && (
             <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50">
               <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center">
                 <IconSource className="w-5 h-5 mr-2" />
                 Sources
               </h3>
               <p className="text-sm text-slate-600 mb-4">
                 Information for this itinerary was compiled using Google Search.
               </p>
               <ul className="space-y-2">
                 {groundingChunks.map((chunk, index) => (
                   <li key={index}>
                     <a
                       href={chunk.web.uri}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="text-sky-700 hover:text-sky-900 hover:underline text-sm truncate block"
                       title={chunk.web.title}
                     >
                       {chunk.web.title}
                     </a>
                   </li>
                 ))}
               </ul>
             </div>
           )}
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={onReset}
          className="w-full max-w-sm inline-flex justify-center items-center gap-2 py-3 px-6 border border-transparent shadow-md text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
        >
          <IconShare className="w-5 h-5 transform rotate-180" />
          Create Another Itinerary
        </button>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
