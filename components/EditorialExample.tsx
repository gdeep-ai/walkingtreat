import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, MapPin, Quote } from 'lucide-react';

const EditorialExample: React.FC = () => {
  return (
    <div className="hidden lg:block w-80 flex-shrink-0">
      <div className="sticky top-8">
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-slate-900 p-4 text-white">
            <h4 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-[#E87A5D]" />
              The Quest Log
            </h4>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Input Section */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Input</span>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <MapPin className="w-3 h-3 text-[#E87A5D]" />
                  Tokyo, Japan
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-full text-[9px] font-medium">Pastries</span>
                  <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-full text-[9px] font-medium">Chocolate</span>
                </div>
                <div className="text-[9px] text-slate-500 italic">Tone: Mysterious (75)</div>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-4 h-4 text-slate-300" />
            </div>

            {/* Output Section */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Curated Result</span>
              <div className="bg-[#FFFBF5] p-4 rounded-2xl border border-[#E87A5D]/20 space-y-3">
                <h5 className="text-xs font-bold text-[#2D2422] leading-tight">The Shadowed Silk of Shibuya</h5>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="w-1 h-auto bg-[#E87A5D]/30 rounded-full"></div>
                    <p className="text-[10px] text-slate-600 leading-relaxed italic">
                      "A journey through the neon-lit alleys where sugar hides in the dark..."
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-slate-200 animate-pulse"></div>
                    <div className="space-y-1">
                      <div className="w-16 h-2 bg-slate-200 rounded"></div>
                      <div className="w-12 h-1.5 bg-slate-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                    Our curator transforms your preferences into a unique, walkable Dessert (De)Tour.
                </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-[rgba(232,122,93,0.05)] rounded-2xl border border-[rgba(232,122,93,0.1)]">
            <h5 className="text-xs font-bold text-[#E87A5D] mb-2 flex items-center gap-2">
                <Quote className="w-3 h-3 fill-[#E87A5D]" />
                Why use this?
            </h5>
            <p className="text-[11px] text-slate-600 leading-relaxed">
                Stop scrolling Yelp. Get a curated, walkable path designed for your specific mood and cravings.
            </p>
        </div>
      </div>
    </div>
  );
};

export default EditorialExample;
