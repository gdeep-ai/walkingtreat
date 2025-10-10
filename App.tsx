
import React, { useState, useCallback } from 'react';
import type { FormState, Itinerary } from './types';
import { generateDessertItineraries } from './services/geminiService';
import ItineraryForm from './components/ItineraryForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import Welcome from './components/Welcome';
import ErrorDisplay from './components/ErrorDisplay';

const App: React.FC = () => {
  const [itineraries, setItineraries] = useState<Itinerary[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>('');

  const handleFormSubmit = useCallback(async (formData: FormState) => {
    setIsLoading(true);
    setError(null);
    setItineraries(null);
    setCity(formData.city);

    try {
      const result = await generateDessertItineraries(formData);
      if (result && result.itineraries) {
        setItineraries(result.itineraries);
      } else {
        setError('The response from the AI was empty or malformed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate itineraries. The AI might be busy, or there could be an issue with your request. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800 antialiased">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <ItineraryForm onSubmit={handleFormSubmit} isLoading={isLoading} />

          <div className="mt-12">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorDisplay message={error} />}
            {itineraries && !isLoading && !error && (
              <ItineraryDisplay itineraries={itineraries} city={city} />
            )}
            {!itineraries && !isLoading && !error && <Welcome />}
          </div>
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-stone-500">
        <p>Powered by Gemini API. Curated for the discerning sweet tooth.</p>
      </footer>
    </div>
  );
};

export default App;
