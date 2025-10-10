import React from 'react';
import type { Stop } from '../types';
import { IconMapPin } from './IconComponents';

interface MapComponentProps {
  stops: Stop[];
}

const MapComponent: React.FC<MapComponentProps> = ({ stops }) => {
  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg h-full border border-white/50">
      <h3 className="text-xl font-bold text-indigo-900 mb-4">Tour Stops</h3>
      <div className="bg-indigo-50/80 p-4 rounded-xl text-center text-indigo-800">
        <p className="font-semibold">Map visualization of stops would appear here.</p>
        <p className="text-sm">For now, here's a list of your destinations:</p>
      </div>
      <ul className="space-y-3 mt-4">
        {stops.map((stop, index) => (
          <li key={stop.name} className="flex items-center">
             <span className="text-slate-500 mr-2 text-lg">{index + 1}.</span>
            <a 
                href={stop.maps_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-slate-800 hover:text-sky-600 hover:underline"
            >
              {stop.name}
              <IconMapPin className="w-4 h-4 ml-1.5 text-slate-400" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MapComponent;