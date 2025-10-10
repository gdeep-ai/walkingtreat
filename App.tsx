import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ItineraryForm from './components/ItineraryForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import Welcome from './components/Welcome';
import { generateItinerary } from './services/geminiService';
import type { FormState, ItineraryResponse } from './types';

const App: React.FC = () => {
  const [formState, setFormState] = useState<FormState | null>(null);
  const [itineraryData, setItineraryData] = useState<ItineraryResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for URL params to pre-fill form and auto-submit
    const params = new URLSearchParams(window.location.search);
    if (params.has('city') && params.has('treatFocus')) {
      const initialFormState: FormState = {
        city: params.get('city') || '',
        days: params.get('days') || 1,
        treatFocus: params.get('treatFocus')?.split(',') || [],
        specialRequests: params.get('specialRequests') || '',
        exclusions: params.get('exclusions') || '',
      };
      setFormState(initialFormState);
      handleSubmit(initialFormState);
    }
  }, []);

  const handleSubmit = async (formData: FormState) => {
    setIsLoading(true);
    setError(null);
    setItineraryData(null);
    setFormState(formData); // Store the submitted form data

    // Clear URL params if it was a new search
    if (window.location.search) {
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    try {
      const data = await generateItinerary(formData);
      setItineraryData(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorDisplay message={error} />;
    }
    if (itineraryData && formState) {
      return <ItineraryDisplay data={itineraryData} formData={formState} />;
    }
    return <Welcome />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans relative">
      <div 
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-800 via-purple-700 to-sky-500"
      ></div>
      <div className="relative z-10 text-slate-800">
        <Header />
        <main className="container mx-auto p-4 md:p-6 flex-grow">
          <ItineraryForm onSubmit={handleSubmit} isLoading={isLoading} initialState={formState || undefined} />
          <div className="mt-8 md:mt-12">
            {renderContent()}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;