import React from 'react';
import type { Stop } from '../types';
import { IconMapPin, IconDirections } from './IconComponents';

interface MapComponentProps {
  stops: Stop[];
}

const MapComponent: React.FC<MapComponentProps> = ({ stops }) => {

  const createTourUrl = (stops: Stop[]): string => {
    if (stops.length === 0) return '';
    if (stops.length === 1) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stops[0].address)}`;
    
    const baseUrl = 'https://www.google.com/maps/dir/?api=1';
    const origin = `origin=${encodeURIComponent(stops[0].address)}`;
    const destination = `destination=${encodeURIComponent(stops[stops.length - 1].address)}`;
    
    const waypoints = stops.slice(1, -1).map(stop => encodeURIComponent(stop.address)).join('|');
    const waypointsParam = waypoints ? `&waypoints=${waypoints}` : '';
    
    return `${baseUrl}&${origin}&${destination}${waypointsParam}&travelmode=walking`;
  };

  const tourUrl = createTourUrl(stops);

  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg h-full border border-white/50">
      <h3 className="text-xl font-bold text-indigo-900 mb-4">Tour Stops</h3>
      <div className="bg-indigo-50/80 p-4 rounded-xl text-indigo-800">
        <p className="font-semibold text-center">Your Walking Tour Route</p>
        <p className="text-sm text-center">Use the button below to see the full tour, or the links next to each stop for individual locations.</p>
      </div>
      <ul className="space-y-3 mt-4">
        {stops.map((stop, index) => (
          <li key={stop.name} className="flex items-center">
             <span className="text-slate-500 mr-2 text-lg">{index + 1}.</span>
            <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.address)}`}
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
      {tourUrl && (
        <div className="mt-6">
          <a
            href={tourUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex justify-center items-center gap-2 py-3 px-6 border border-transparent shadow-md text-base font-medium rounded-full text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            <IconDirections className="w-5 h-5" />
            View Full Tour on Google Maps
          </a>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
