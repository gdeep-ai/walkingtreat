import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ItineraryForm from './components/ItineraryForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import ImageGallery from './components/ImageGallery';
import PromoText from './components/PromoText';
import Footer from './components/Footer';
import { generateDessertItineraries, generateItineraryImage, generateGalleryImages } from './services/geminiService';
import type { FormState, ItineraryResponse } from './types';

function App() {
  const [itineraryResponse, setItineraryResponse] = useState<ItineraryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryLoading, setGalleryLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchGalleryImages = async () => {
      setGalleryLoading(true);
      const images = await generateGalleryImages(9);
      setGalleryImages(images);
      setGalleryLoading(false);
    };

    fetchGalleryImages();
  }, []);


  const handleFormSubmit = async (formData: FormState) => {
    setLoading(true);
    setError(null);
    setItineraryResponse(null);
    try {
      const response = await generateDessertItineraries(formData);
      
      const itinerariesWithImages = await Promise.all(
        response.itineraries.map(async (itinerary) => {
          const imageUrl = await generateItineraryImage(itinerary.theme, response.city);
          return { ...itinerary, imageUrl };
        })
      );

      setItineraryResponse({ ...response, itineraries: itinerariesWithImages });

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-sky-50 via-purple-50 to-blue-100 min-h-screen text-slate-900 flex flex-col">
      <Header />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        {/* Fix: Corrected typo from 'handleFormSplit' to 'handleFormSubmit'. */}
        <ItineraryForm onSubmit={handleFormSubmit} loading={loading} />
        <div className="mt-8">
          {loading && <LoadingSpinner />}
          {error && <ErrorDisplay message={error} />}
          {itineraryResponse && <ItineraryDisplay data={itineraryResponse} />}
          
          {!loading && !error && !itineraryResponse && (
            <>
              <ImageGallery images={galleryImages} loading={galleryLoading} />
              <PromoText />
            </>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;