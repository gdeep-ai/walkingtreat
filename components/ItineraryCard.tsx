import React, { useState } from 'react';
import type { Itinerary } from '../types';
import StopCard from './StopCard';
import { IconMoney, IconTheme, IconRoute } from './IconComponents';
import MapComponent from './MapComponent';

interface ItineraryCardProps {
  itinerary: Itinerary;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ itinerary }) => {
  const [isMapVisible, setIsMapVisible] = useState(false);

  const themeColors: { [key: string]: string } = {
    "Classic Icons": "bg-sky-100 text-sky-800",
    "Hidden Genius": "bg-teal-100 text-teal-800",
    "Modern Artisans": "bg-rose-100 text-rose-800",
  };
  const borderColor: { [key: string]: string } = {
    "Classic Icons": "border-sky-200",
    "Hidden Genius": "border-teal-200",
    "Modern Artisans": "border-rose-200",
  };

  const themeColor = themeColors[itinerary.theme] || "bg-stone-100 text-stone-800";
  const border = borderColor[itinerary.theme] || "border-stone-200";

  return (
    <div className={`bg-white rounded-2xl shadow-md overflow-hidden border ${border}`}>
      <div className={`p-6 ${themeColor}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <IconTheme className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold font-serif">{itinerary.theme}</h3>
              <div className="flex items-center gap-2 text-sm opacity-90 mt-1">
                <IconMoney className="w-4 h-4" />
                <span>{itinerary.total_estimated_cost}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsMapVisible(!isMapVisible)}
            className="flex-shrink-0 flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-full bg-white/20 hover:bg-white/40 transition-all duration-300"
            aria-label={isMapVisible ? "Hide map" : "Show map"}
            aria-expanded={isMapVisible}
          >
            <IconRoute className="w-5 h-5" />
            <span>{isMapVisible ? "Hide Map" : "Show Map"}</span>
          </button>
        </div>
      </div>
      <div className="p-2 sm:p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
        {itinerary.stops.map((stop, index) => (
          <StopCard key={index} stop={stop} />
        ))}
      </div>
      {isMapVisible && (
        <div className="p-2 sm:p-4 pt-0">
          <MapComponent stops={itinerary.stops} />
        </div>
      )}
    </div>
  );
};

export default ItineraryCard;
