import React from 'react';
import type { Stop } from '../types';
import { IconMapPin, IconStar, IconClock, IconInstagram } from './IconComponents';

interface StopCardProps {
  stop: Stop;
  index: number;
}

const StopCard: React.FC<StopCardProps> = ({ stop, index }) => {
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.address)}`;

  const instagramSearchTerm = stop.name
    .normalize('NFD') // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-zA-Z0-9]/g, '') // Remove non-alphanumeric characters
    .toLowerCase();
  const instagramLink = `https://www.instagram.com/explore/tags/${instagramSearchTerm}/`;


  return (
    <div className="border-l-4 border-indigo-300 pl-4 py-2 transition-all hover:border-indigo-500 hover:bg-white/40 rounded-r-lg">
      <div className="flex justify-between items-start">
        <h4 className="text-xl font-bold text-indigo-900 flex items-center">
            <span className="text-slate-500 mr-3 text-2xl">{index + 1}.</span>
            {stop.name}
        </h4>
        <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
            <a
            href={instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
            aria-label={`Search for ${stop.name} on Instagram`}
            title={`Search for ${stop.name} on Instagram`}
            >
            <IconInstagram className="w-5 h-5" />
            </a>
            <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-sky-600 hover:text-sky-800 hover:underline"
            aria-label={`View ${stop.name} on Google Maps`}
            >
            <IconMapPin className="w-4 h-4 mr-1" />
            Map
            </a>
        </div>
      </div>

      <div className="pl-10 mt-2 space-y-1 text-sm text-slate-600">
        {stop.address && (
            <p className="flex items-start">
            <IconMapPin className="w-4 h-4 mr-2 mt-0.5 text-slate-400 flex-shrink-0" />
            <span>{stop.address}</span>
            </p>
        )}
        {stop.hours_of_operation && (
            <p className="flex items-start">
            <IconClock className="w-4 h-4 mr-2 mt-0.5 text-slate-400 flex-shrink-0" />
            <span>{stop.hours_of_operation}</span>
            </p>
        )}
      </div>

      <p className="text-slate-700 mt-2 italic pl-10">"{stop.notes}"</p>
      
      <div className="mt-3 bg-white/30 p-3 rounded-md ml-10">
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