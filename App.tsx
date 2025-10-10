
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ItineraryForm from './components/ItineraryForm';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import ItineraryDisplay from './components/ItineraryDisplay';
import ImageGallery from './components/ImageGallery';
import PromoText from './components/PromoText';
import { generateItinerary } from './services/geminiService';
import type { FormState, ItineraryResponse } from './types';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormState | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (data: FormState) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);
    setFormData(data); // Save form data to re-populate if needed

    try {
      const result = await generateItinerary(data);
      if (result && result.itineraries && result.itineraries.length > 0) {
          setItinerary(result);
      } else {
          setError("The generated itinerary was empty or invalid. Please try adjusting your request.");
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setItinerary(null);
    setError(null);
    // Keep formData so the form is pre-filled for a new attempt
  }, []);

  const handleHardReset = useCallback(() => {
    setItinerary(null);
    setError(null);
    setFormData(null);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return (
        <div className="w-full max-w-4xl mx-auto space-y-4">
          <ErrorDisplay message={error} />
           <button
             onClick={handleReset}
             className="w-full inline-flex justify-center items-center py-3 px-6 border border-transparent shadow-md text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
           >
             Try Again
           </button>
        </div>
      );
    }
    if (itinerary) {
      return <ItineraryDisplay itineraryData={itinerary} onReset={handleHardReset} />;
    }
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <ImageGallery />
        <PromoText />
        <ItineraryForm onSubmit={handleSubmit} isLoading={isLoading} initialState={formData || undefined} />
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-700 flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;