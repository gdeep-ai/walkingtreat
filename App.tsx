import React, { useState } from 'react';
import Header from './components/Header.tsx';
import ItineraryForm from './components/ItineraryForm.tsx';
import ItineraryDisplay from './components/ItineraryDisplay.tsx';
import Footer from './components/Footer.tsx';
import Welcome from './components/Welcome.tsx';
import ImageGallery from './components/ImageGallery.tsx';
import PromoText from './components/PromoText.tsx';
import { Itinerary, FormState, Stop } from './types.ts';
import { generateItinerary } from './services/geminiService.ts';
import { HALL_OF_FAME_QUESTS, HallOfFameQuest } from './src/constants/hallOfFame.ts';

import { motion, AnimatePresence } from 'motion/react';
import EditorialExample from './components/EditorialExample.tsx';
import { Sparkles, Wand2, Info, Trophy, Map } from 'lucide-react';

const App: React.FC = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [varietyMessage, setVarietyMessage] = useState<string | null>(null);
  const [correctedDestination, setCorrectedDestination] = useState<string | null>(null);

  const handleSelectQuest = (quest: HallOfFameQuest) => {
    setItinerary(null);
    setIsLoading(true);
    setError(null);
    setVarietyMessage(null);
    setCorrectedDestination(quest.location);
    
    // Simulate a brief loading for effect
    setTimeout(() => {
        setItinerary(quest.itinerary);
        setIsLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  const handleGenerateItinerary = async (data: FormState) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);
    setVarietyMessage(null);
    setCorrectedDestination(null);
    try {
      const { itinerary: result, correctedDestination: correctedDest } = await generateItinerary(data);

      // De-duplication logic
      const uniqueStops: Stop[] = [];
      const seenNames = new Set<string>();
      let hasDuplicates = false;

      for (const stop of result.stops) {
        // Normalize names for better comparison (lowercase, trim whitespace)
        const normalizedName = stop.name.trim().toLowerCase();
        if (seenNames.has(normalizedName)) {
            hasDuplicates = true;
        } else {
            seenNames.add(normalizedName);
            uniqueStops.push(stop);
        }
      }

      if (hasDuplicates) {
        setVarietyMessage("We noticed a repeat suggestion and consolidated your tour. How about a different treat to add some variety?");
      }
      
      const uniqueItinerary: Itinerary = {
        ...result,
        stops: uniqueStops,
      };

      setItinerary(uniqueItinerary);
      // Show the corrected destination if it's different from the user's input
      if (correctedDest.trim().toLowerCase() !== data.destination.trim().toLowerCase()) {
        setCorrectedDestination(correctedDest);
      }

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] font-sans text-[#2D2422] relative overflow-hidden">
        {/* Background Hero Image (Desktop) */}
        <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-screen z-0 opacity-10 pointer-events-none">
            <img 
                src="https://picsum.photos/seed/dessert/1920/1080?blur=4" 
                alt="Dessert Background" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#FFFBF5]"></div>
        </div>

        {/* Floating Decorative Elements */}
        <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-16 h-16 bg-[rgba(232,122,93,0.1)] rounded-full blur-xl z-0"
        ></motion.div>
        <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-40 right-20 w-24 h-24 bg-[rgba(232,122,93,0.05)] rounded-full blur-2xl z-0"
        ></motion.div>

        <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 flex-grow pb-12">
                <AnimatePresence mode="wait">
                    {(!itinerary || isLoading) ? (
                        <motion.div 
                            key="hero"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col lg:flex-row gap-12 items-start pt-8 lg:pt-16"
                        >
                            <div className="flex-grow w-full">
                                <div className="max-w-2xl mb-12">
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#E87A5D]/10 text-[#E87A5D] rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        The Ultimate Sweet Quest
                                    </motion.div>
                                    <h1 className="text-5xl lg:text-7xl font-bold text-[#2D2422] leading-[0.85] tracking-[-0.04em] mb-6">
                                        Your Personalized <br/>
                                        <span className="text-[#E87A5D]">Dessert (De)Tour</span>
                                    </h1>
                                    <p className="text-lg text-slate-600 leading-relaxed max-w-xl mb-8">
                                        Stop settling for generic lists. Our curator crafts a unique, walkable adventure through the world's finest sweets, tailored to your specific mood and cravings.
                                    </p>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[rgba(226,232,240,0.5)]">
                                        <div className="space-y-1">
                                            <div className="text-[#E87A5D] font-bold text-sm">01. Choose</div>
                                            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">Your Cravings</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[#E87A5D] font-bold text-sm">02. Set</div>
                                            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">The Narrative Tone</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[#E87A5D] font-bold text-sm">03. Quest</div>
                                            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-bold">A Walkable Path</p>
                                        </div>
                                    </div>
                                </div>
                                <div id="quest-form">
                                    <ItineraryForm onGenerate={handleGenerateItinerary} isLoading={isLoading} />
                                </div>
                                <div className="mt-16">
                                    <Welcome />
                                    <ImageGallery />
                                    <PromoText />
                                </div>
                            </div>
                            <EditorialExample />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="pt-8"
                        >
                            <ItineraryDisplay 
                                itinerary={itinerary} 
                                isLoading={isLoading} 
                                error={error} 
                                varietyMessage={varietyMessage} 
                                correctedDestination={correctedDestination}
                            />
                            <div className="mt-16 pt-16 border-t border-[#E87A5D]/20" id="quest-form">
                                <div className="max-w-2xl mx-auto text-center mb-12">
                                    <h3 className="text-3xl font-bold text-[#2D2422] mb-4">Plan Another Adventure</h3>
                                    <p className="text-slate-500">Not satisfied? Or just hungry for more? Start a new quest.</p>
                                </div>
                                <ItineraryForm onGenerate={handleGenerateItinerary} isLoading={isLoading} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hall of Fame Section */}
                <section id="hall-of-fame" className="mt-32 pt-20 border-t border-slate-200">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                            <Trophy className="w-4 h-4" />
                            Hall of Fame
                        </div>
                        <h2 className="text-4xl font-bold text-[#2D2422] tracking-tight">Legendary Sweet Quests</h2>
                        <p className="text-slate-500 mt-4 max-w-xl mx-auto">
                            The most epic dessert journeys ever taken by our most dedicated explorers.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {HALL_OF_FAME_QUESTS.map((quest, i) => (
                            <motion.div 
                                key={i} 
                                whileHover={{ y: -10 }}
                                onClick={() => handleSelectQuest(quest)}
                                className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
                            >
                                <div className="relative w-full h-48 rounded-2xl mb-4 overflow-hidden">
                                    <img 
                                        src={quest.image} 
                                        alt={quest.title}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute top-3 left-3 px-3 py-1 bg-[rgba(255,255,255,0.9)] backdrop-blur-sm rounded-full text-[10px] font-bold text-[#2D2422]">
                                        {quest.location}
                                    </div>
                                </div>
                                <h4 className="text-lg font-bold text-[#2D2422] mb-1">{quest.title}</h4>
                                <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                                    <span>{quest.itinerary.stops.length} Stops</span>
                                    <span>by {quest.author}</span>
                                </div>
                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between group-hover:border-[rgba(232,122,93,0.2)] transition-colors">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-[#E87A5D]">Explore Quest</span>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#E87A5D] group-hover:text-white transition-all">
                                        <Map className="w-4 h-4" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    </div>
  );
};

export default App;