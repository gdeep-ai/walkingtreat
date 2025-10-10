import React, { useState, useEffect } from 'react';
import type { Itinerary, ItineraryResponse, FormState } from '../types';
import ItineraryCard from './ItineraryCard';
import MapComponent from './MapComponent';
import { IconShare } from './IconComponents';

interface ItineraryDisplayProps {
  data: ItineraryResponse;
  formData: FormState;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ data, formData }) => {
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (data?.itineraries?.length > 0) {
      setSelectedItinerary(data.itineraries[0]);
    } else {
      setSelectedItinerary(null);
    }
  }, [data]);


  const handleShare = () => {
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value));
      }
    });
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!data?.itineraries?.length) {
    return (
        <div className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg text-center">
            <h3 className="text-2xl font-bold text-indigo-900">No Itineraries Found</h3>
            <p className="mt-2 text-slate-700">
                We couldn't find any dessert spots that matched your criteria. Try being less specific with your focus or exclusions.
            </p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-indigo-900">
          Your Dessert Itinerary for {data.city}
        </h2>
        {data.suggested_schedule && (
            <p className="mt-4 max-w-3xl mx-auto text-indigo-800/90 bg-white/60 backdrop-blur-sm p-3 rounded-xl">
                <span className="font-bold">Suggested Pace:</span> {data.suggested_schedule}
            </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <div className="flex justify-center flex-wrap gap-2 md:gap-3 p-2 bg-white/50 backdrop-blur-sm rounded-full">
            {data.itineraries.map((itinerary) => (
            <button
                key={itinerary.theme}
                onClick={() => setSelectedItinerary(itinerary)}
                className={`px-4 py-2 text-sm md:text-base font-semibold rounded-full transition-all duration-300 ${
                selectedItinerary?.theme === itinerary.theme
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-transparent text-indigo-800 hover:bg-white/70'
                }`}
            >
                {itinerary.theme}
            </button>
            ))}
        </div>
        <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 text-sm md:text-base font-semibold rounded-full transition-all duration-300 bg-white/80 text-indigo-800 hover:bg-white shadow-sm"
        >
            <IconShare className="w-5 h-5" />
            {copied ? 'Link Copied!' : 'Share Results'}
        </button>
      </div>
      
      {selectedItinerary && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
              <ItineraryCard itinerary={selectedItinerary} />
          </div>
          <div className="lg:col-span-1">
              <MapComponent stops={selectedItinerary.stops} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryDisplay;