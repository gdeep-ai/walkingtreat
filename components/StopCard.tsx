import React from 'react';
import type { Stop } from '../types';
import { IconMapPin, IconStar, IconSparkles } from './IconComponents';

interface StopCardProps {
  stop: Stop;
}

const StopCard: React.FC<StopCardProps> = ({ stop }) => {
  return (
    <div className="bg-amber-50/50 rounded-xl p-4 flex flex-col h-full border border-amber-200/60 hover:shadow-lg hover:border-amber-300 transition-all duration-300">
      <div className="flex-grow">
        <h4 className="font-bold text-lg text-stone-800">{stop.name}</h4>
        <p className="text-stone-600 text-sm mt-2 mb-3">{stop.notes}</p>

        {stop.recommendations && stop.recommendations.length > 0 && (
          <div className="mb-3 space-y-2">
            <h5 className="text-sm font-semibold text-stone-700 flex items-center gap-2">
              <IconSparkles className="w-4 h-4 text-amber-500" />
              Must-Try Items
            </h5>
            <ul className="list-none space-y-2 text-sm pl-1">
              {stop.recommendations.map((rec, i) => (
                <li key={i}>
                  <strong className="font-semibold text-stone-800">{rec.item}:</strong>
                  <span className="text-stone-600 ml-1">{rec.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-amber-200/80">
        <div className="flex items-start gap-2 text-sm text-stone-700 mb-3">
          <IconStar className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
          <p><span className="font-semibold">Worth it:</span> {stop.reason}</p>
        </div>
        <a
          href={stop.maps_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-sky-900 transition-colors"
        >
          <IconMapPin className="w-4 h-4" />
          View on Google Maps
        </a>
      </div>
    </div>
  );
};

export default StopCard;