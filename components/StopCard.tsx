import React from 'react';
import type { Stop } from '../types';
import { IconMapPin, IconStar } from './IconComponents';

interface StopCardProps {
  stop: Stop;
  index: number;
}

const StopCard: React.FC<StopCardProps> = ({ stop, index }) => {
  return (
    <div className="border-l-4 border-indigo-200 pl-4 py-2 transition-all hover:border-indigo-400 hover:bg-indigo-50/50 rounded-r-lg">
      <div className="flex justify-between items-start">
        <h4 className="text-xl font-bold text-indigo-900 flex items-center">
            <span className="text-slate-500 mr-3 text-2xl">{index + 1}.</span>
            {stop.name}
        </h4>
        <a
          href={stop.maps_link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-sky-600 hover:text-sky-800 hover:underline"
        >
          <IconMapPin className="w-4 h-4 mr-1" />
          Map
        </a>
      </div>

      <p className="text-slate-700 mt-1 italic pl-10">"{stop.notes}"</p>
      
      <div className="mt-3 bg-indigo-50/70 p-3 rounded-md ml-10">
        <h5 className="font-semibold text-indigo-900 mb-2">Must-Try Items:</h5>
        <ul className="space-y-2 list-none">
          {stop.recommendations.map((rec) => (
            <li key={rec.item} className="flex items-start">
              <IconStar className="w-5 h-5 mr-2 text-sky-500 flex-shrink-0 mt-1" />
              <div>
                <span className="font-bold text-slate-800">{rec.item}:</span>{' '}
                <span className="text-slate-700">{rec.description}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 ml-10">
        <p className="text-sm">
          <span className="font-semibold text-indigo-900">Why it's worth it:</span>{' '}
          <span className="text-slate-700">{stop.reason}</span>
        </p>
      </div>
    </div>
  );
};

export default StopCard;