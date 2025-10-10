import React, { useState } from 'react';
import type { Itinerary, ItineraryResponse } from '../types';
import ItineraryCard from './ItineraryCard';
import MapComponent from './MapComponent';

interface ItineraryDisplayProps {
  data: ItineraryResponse;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ data }) => {
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary>(data.itineraries[0]);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-900">
        Your Dessert Itinerary for {data.city}
      </h2>

      <div className="flex justify-center flex-wrap gap-2 md:gap-4 p-2 bg-white/50 backdrop-blur-sm rounded-full">
        {data.itineraries.map((itinerary) => (
          <button
            key={itinerary.theme}
            onClick={() => setSelectedItinerary(itinerary)}
            className={`px-4 py-2 text-sm md:text-base font-semibold rounded-full transition-all duration-300 ${
              selectedItinerary.theme === itinerary.theme
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-transparent text-indigo-800 hover:bg-white/70'
            }`}
          >
            {itinerary.theme}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            {selectedItinerary && <ItineraryCard itinerary={selectedItinerary} />}
        </div>
        <div className="lg:col-span-1">
            {selectedItinerary && <MapComponent stops={selectedItinerary.stops} />}
        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;