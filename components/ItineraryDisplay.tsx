import React from 'react';
import type { Itinerary } from '../types.ts';
import LoadingSpinner from './LoadingSpinner.tsx';
import ErrorDisplay from './ErrorDisplay.tsx';
import ItineraryCard from './ItineraryCard.tsx';
import MapComponent from './MapComponent.tsx';

import { motion } from 'motion/react';

interface ItineraryDisplayProps {
  itinerary: Itinerary | null;
  isLoading: boolean;
  error: string | null;
  varietyMessage: string | null;
  correctedDestination: string | null;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary, isLoading, error, varietyMessage, correctedDestination }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (itinerary) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8"
      >
        {correctedDestination && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-4 bg-[rgba(232,122,93,0.1)] border-l-4 border-[#E87A5D] text-[#2D2422] p-4 rounded-r-lg shadow-sm" 
            role="status"
          >
            <p>Showing results for <strong>{correctedDestination}</strong>.</p>
          </motion.div>
        )}
        {varietyMessage && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 bg-amber-50 border-l-4 border-amber-500 text-amber-900 p-4 rounded-r-lg shadow-sm" 
            role="status"
          >
            <p className="font-bold">Just a heads up!</p>
            <p>{varietyMessage}</p>
          </motion.div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
              <ItineraryCard itinerary={itinerary} />
          </div>
          <div className="lg:sticky lg:top-8">
              <MapComponent stops={itinerary.stops} />
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default ItineraryDisplay;