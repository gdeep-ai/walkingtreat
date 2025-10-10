import React from 'react';
import type { Itinerary } from '../types';
import StopCard from './StopCard';
import { IconMoney, IconRoute, IconTheme } from './IconComponents';

interface ItineraryCardProps {
  itinerary: Itinerary;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ itinerary }) => {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden">
      <div className="p-6 border-b border-white/30">
        <div className="flex items-center">
            <IconTheme className="w-8 h-8 mr-3 text-indigo-500 flex-shrink-0" />
            <h3 className="text-2xl font-bold text-indigo-900">{itinerary.theme}</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm mb-6">
              <div className="flex items-center bg-sky-200/50 text-sky-900 font-medium px-2.5 py-1 rounded-lg">
                  <IconMoney className="w-4 h-4 mr-1.5 text-sky-700" />
                  <span>{itinerary.total_estimated_cost}</span>
              </div>
              <div className="flex items-center bg-sky-200/50 text-sky-900 font-medium px-2.5 py-1 rounded-lg">
                  <IconRoute className="w-4 h-4 mr-1.5 text-sky-700" />
                  <span>{itinerary.stops.length} Stops</span>
              </div>
        </div>
        <div className="space-y-6">
          {itinerary.stops.map((stop, index) => (
            <StopCard key={`${stop.name}-${index}`} stop={stop} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ItineraryCard;