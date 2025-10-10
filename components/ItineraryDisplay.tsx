
import React from 'react';
import type { Itinerary } from '../types';
import ItineraryCard from './ItineraryCard';

interface ItineraryDisplayProps {
  itineraries: Itinerary[];
  city: string;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itineraries, city }) => {
  return (
    <div className="space-y-12">
      <h2 className="text-center text-3xl md:text-4xl font-bold text-stone-800 font-serif">
        Your Sweet Itineraries for <span className="text-amber-600">{city}</span>
      </h2>
      {itineraries.map((itinerary, index) => (
        <ItineraryCard key={index} itinerary={itinerary} />
      ))}
    </div>
  );
};

export default ItineraryDisplay;
