import React from 'react';
import type { Stop } from '../types.ts';
import { MapPin, Navigation } from 'lucide-react';

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
    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm h-full border border-slate-100">
      <h3 className="text-xl font-bold text-[#2D2422] mb-6">Tour Stops</h3>
      <div className="bg-[#FFFBF5] p-4 rounded-xl text-slate-700 border border-slate-100 mb-6">
        <p className="font-bold text-center mb-1">Your Walking Tour Route</p>
        <p className="text-sm text-center">Use the button below to see the full tour, or the links next to each stop for individual locations.</p>
      </div>
      <ul className="space-y-4">
        {stops.map((stop, index) => (
          <li key={stop.name} className="flex items-center">
             <span className="text-[#E87A5D] mr-3 text-xl font-bold italic">{index + 1}.</span>
            <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-slate-700 hover:text-[#E87A5D] hover:underline transition-colors"
            >
              {stop.name}
              <MapPin className="w-4 h-4 ml-2 text-slate-400" />
            </a>
          </li>
        ))}
      </ul>
      {tourUrl && (
        <div className="mt-8">
          <a
            href={tourUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex justify-center items-center gap-2 py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-[#2D2422] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2D2422] hover:shadow-md transform hover:-translate-y-0.5 transition-all"
          >
            <Navigation className="w-5 h-5" />
            View Full Tour on Google Maps
          </a>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
