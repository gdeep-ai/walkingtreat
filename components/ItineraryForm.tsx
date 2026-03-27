import React, { useState } from 'react';
import { treatOptions } from '../data/dessertOptions.ts';
import type { FormState } from '../types.ts';
import { 
  IceCream, 
  Croissant, 
  CakeSlice, 
  Candy, 
  Cookie, 
  Coffee, 
  CupSoda, 
  Pizza, 
  MapPin, 
  Sparkles, 
  Store,
  Wand2,
  Info,
  HelpCircle,
  Star
} from 'lucide-react';

interface ItineraryFormProps {
  onGenerate: (data: FormState) => void;
  isLoading: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  'ice-cream': <IceCream className="w-6 h-6 mb-2" />,
  'pastries': <Croissant className="w-6 h-6 mb-2" />,
  'cakes': <CakeSlice className="w-6 h-6 mb-2" />,
  'chocolate': <Candy className="w-6 h-6 mb-2" />,
  'cookies': <Cookie className="w-6 h-6 mb-2" />,
  'beverages': <Coffee className="w-6 h-6 mb-2" />,
  'bubble-tea': <CupSoda className="w-6 h-6 mb-2" />,
  'savory': <Pizza className="w-6 h-6 mb-2" />,
  'regional': <MapPin className="w-6 h-6 mb-2" />,
  'avant-garde': <Sparkles className="w-6 h-6 mb-2" />,
  'bakeries': <Store className="w-6 h-6 mb-2" />,
  'best-of': <Star className="w-6 h-6 mb-2" />,
};

const tooltipMap: Record<string, string> = {
  'ice-cream': 'Gelato, soft serve, sorbet, and classic scoops.',
  'pastries': 'Croissants, danishes, eclairs, and flaky delights.',
  'cakes': 'Layer cakes, tarts, cheesecakes, and elegant slices.',
  'chocolate': 'Truffles, bonbons, hot chocolate, and rich confections.',
  'cookies': 'Chocolate chip, macarons, shortbread, and more.',
  'beverages': 'Milkshakes, specialty lattes, and sweet drinks.',
  'bubble-tea': 'Boba, fruit teas, and milk teas with toppings.',
  'savory': 'Pizza, savory crepes, or salty snacks to balance the sweet.',
  'regional': 'Local specialties unique to the destination.',
  'avant-garde': 'Modern, experimental, and visually stunning desserts.',
  'bakeries': 'Classic bread, buns, and rustic baked goods.',
  'best-of': 'Top picks and quintessential choices for the city.',
};

const ItineraryForm: React.FC<ItineraryFormProps> = ({ onGenerate, isLoading }) => {
  const [destination, setDestination] = useState('Paris, France');
  const [budget, setBudget] = useState('moderate');
  const [interests, setInterests] = useState<string[]>(['pastries', 'chocolate']);
  const [tone, setTone] = useState(50);

  const handleInterestChange = (interestValue: string) => {
    setInterests(prev =>
      prev.includes(interestValue)
        ? prev.filter(i => i !== interestValue)
        : [...prev, interestValue]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ destination, budget, interests, tone });
  };

  const getToneLabel = (value: number) => {
    if (value < 20) return "Classic & Sweet";
    if (value < 40) return "Traditional";
    if (value < 60) return "Balanced Narrative";
    if (value < 80) return "Adventurous";
    return "Wild & Decadent";
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-12">
            <label htmlFor="destination" className="block text-sm font-bold text-[#2D2422] mb-2">
              Destination City
            </label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#E87A5D] focus:border-[#E87A5D] transition outline-none"
              placeholder="e.g., Tokyo, Japan"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="md:col-span-5">
            <label htmlFor="budget" className="block text-sm font-bold text-[#2D2422] mb-2">
              Budget
            </label>
            <select
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#E87A5D] focus:border-[#E87A5D] transition outline-none"
              required
              disabled={isLoading}
            >
              <option value="frugal">Frugal & Fabulous</option>
              <option value="moderate">Sweet Splurge</option>
              <option value="luxurious">Decadent & Divine</option>
            </select>
          </div>

          <div className="md:col-span-7">
            <div className="flex items-center gap-2 mb-2">
                <label htmlFor="tone" className="block text-sm font-bold text-[#2D2422]">
                    Narrative Tone
                </label>
                <div className="group relative">
                    <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none">
                        This slider sets the mood of your storyteller. 
                        <br/><br/>
                        <b>Low:</b> Classic, sweet, and traditional descriptions.
                        <br/>
                        <b>High:</b> Wild, decadent, or experimental narrative style.
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                </div>
            </div>
            <div className="pt-2">
              <input
                  id="tone"
                  type="range"
                  min="0"
                  max="100"
                  value={tone}
                  onChange={(e) => setTone(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#E87A5D]"
                  disabled={isLoading}
              />
              <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-2">
                  <span>Classic</span>
                  <span className="text-[#E87A5D]">{getToneLabel(tone)}</span>
                  <span>Wild</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-12 mt-4">
            <label className="block text-sm font-bold text-[#2D2422] mb-4">
              Dessert Interests
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {treatOptions.map(option => {
                const isSelected = interests.includes(option.value);
                return (
                  <div key={option.value} className="relative group h-full">
                    <button
                      type="button"
                      onClick={() => handleInterestChange(option.value)}
                      className={`w-full h-full flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:-translate-y-1 hover:scale-105 ${
                        isSelected 
                          ? 'border-[#E87A5D] bg-[#E87A5D]/10 text-[#E87A5D]' 
                          : 'border-transparent bg-slate-50 text-slate-600 hover:bg-slate-100 hover:shadow-sm'
                      }`}
                      disabled={isLoading}
                    >
                      {iconMap[option.value]}
                      <span className="text-xs font-medium text-center leading-tight">{option.label}</span>
                    </button>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none text-center">
                      {tooltipMap[option.value]}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-10 text-center">
            <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-full text-white bg-[#E87A5D] hover:bg-[#D97757] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E87A5D] disabled:bg-[rgba(232,122,93,0.5)] disabled:cursor-not-allowed hover:shadow-md transform hover:-translate-y-0.5 transition-all"
                disabled={isLoading}
            >
                <Wand2 className="w-5 h-5"/>
                {isLoading ? 'Conjuring...' : 'Create My Dessert Tour'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ItineraryForm;