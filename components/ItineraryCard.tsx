import React from 'react';
import type { Itinerary } from '../types';
import StopCard from './StopCard';
import { IconMoney, IconRoute, IconTheme } from './IconComponents';

interface ItineraryCardProps {
  itinerary: Itinerary;
}

const ImagePlaceholder: React.FC = () => (
    <div className="aspect-video bg-slate-200/80 rounded-t-2xl animate-pulse"></div>
);

const ItineraryCard: React.FC<ItineraryCardProps> = ({ itinerary }) => {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden">
      {itinerary.imageUrl ? (
        <img src={itinerary.imageUrl} alt={itinerary.theme} className="w-full h-48 object-cover" />
      ) : (
        <ImagePlaceholder />
      )}
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 border-b-2 border-indigo-100 pb-4">
          <div className="flex items-center mb-2 md:mb-0">
            <IconTheme className="w-6 h-6 mr-2 text-indigo-500" />
            <h3 className="text-2xl font-bold text-indigo-900">{itinerary.theme}</h3>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <div className="flex items-center bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-lg">
                  <IconMoney className="w-4 h-4 mr-1.5 text-indigo-600" />
                  <span>{itinerary.total_estimated_cost}</span>
              </div>
              <div className="flex items-center bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-lg">
                  <IconRoute className="w-4 h-4 mr-1.5 text-indigo-600" />
                  <span>{itinerary.stops.length} Stops</span>
              </div>
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