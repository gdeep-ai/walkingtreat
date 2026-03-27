import React, { useState, useEffect } from 'react';
import type { Stop } from '../types.ts';
import { MapPin, Star, Clock, Camera, Image as ImageIcon, Info, IceCream, Cake, Pizza, Coffee, Utensils, Croissant, UtensilsCrossed } from 'lucide-react';

interface StopCardProps {
  stop: Stop;
  index: number;
}

const getCategoryIcon = (category: string, className: string = "w-5 h-5") => {
  const normalizedCategory = category?.toLowerCase().trim();
  switch (normalizedCategory) {
    case 'ice-cream': return <IceCream className={className} />;
    case 'cake': return <Cake className={className} />;
    case 'pizza': return <Pizza className={className} />;
    case 'coffee': return <Coffee className={className} />;
    case 'savory': return <Utensils className={className} />;
    case 'pastry': return <Croissant className={className} />;
    default: return <UtensilsCrossed className={className} />;
  }
};

// Curated high-quality Unsplash images by category to guarantee reliable, beautiful rendering
const CURATED_IMAGES: Record<string, string[]> = {
  'ice-cream': [
    'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?auto=format&fit=crop&q=80&w=800'
  ],
  'cake': [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1557308536-ee471ef2c390?auto=format&fit=crop&q=80&w=800'
  ],
  'pizza': [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800'
  ],
  'coffee': [
    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800'
  ],
  'savory': [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1544025162-8366fd0677ea?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800'
  ],
  'pastry': [
    'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800'
  ],
  'other': [
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1484723091791-c0e7e147c36e?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=800'
  ]
};

const guessCategory = (stop: Stop): string => {
  let cat = stop.category?.toLowerCase().trim() || '';
  const validCategories = ['ice-cream', 'cake', 'pizza', 'coffee', 'savory', 'pastry'];
  if (validCategories.includes(cat)) return cat;

  // Fallback guessing based on text content
  const textToSearch = `${stop.name} ${stop.notes} ${stop.reason} ${stop.recommendations.map(r => r.item + ' ' + r.description).join(' ')}`.toLowerCase();

  if (textToSearch.includes('ice cream') || textToSearch.includes('gelato') || textToSearch.includes('sorbet')) return 'ice-cream';
  if (textToSearch.includes('cake') || textToSearch.includes('cupcake') || textToSearch.includes('torte')) return 'cake';
  if (textToSearch.includes('pizza') || textToSearch.includes('slice')) return 'pizza';
  if (textToSearch.includes('coffee') || textToSearch.includes('espresso') || textToSearch.includes('latte') || textToSearch.includes('cafe')) return 'coffee';
  if (textToSearch.includes('pastry') || textToSearch.includes('croissant') || textToSearch.includes('bakery') || textToSearch.includes('tart') || textToSearch.includes('pie')) return 'pastry';
  if (textToSearch.includes('savory') || textToSearch.includes('burger') || textToSearch.includes('sandwich') || textToSearch.includes('taco')) return 'savory';

  return 'other';
};

const StopCard: React.FC<StopCardProps> = ({ stop, index }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string | null>(null);
  
  const effectiveCategory = guessCategory(stop);

  useEffect(() => {
    let isMounted = true;
    
    // Use a curated, high-quality Unsplash image based on the category.
    // This guarantees the image will render, won't have CORS issues with html2canvas,
    // and will always be relevant to the food type (no random clothes).
    const categoryImages = CURATED_IMAGES[effectiveCategory] || CURATED_IMAGES['other'];
    
    // Use the stop name's length to deterministically pick an image from the array
    // so the same stop always gets the same image during a session.
    const imageIndex = stop.name.length % categoryImages.length;
    const fallbackUrl = categoryImages[imageIndex];
    
    if (isMounted) {
        setImageUrl(fallbackUrl);
        setIsGeneratingImage(false);
    }

    return () => {
      isMounted = false;
    };
  }, [stop.name, effectiveCategory]);
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.address)}`;

  const instagramSearchTerm = stop.name
    .normalize('NFD') // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-zA-Z0-9]/g, '') // Remove non-alphanumeric characters
    .toLowerCase();
  const instagramLink = `https://www.instagram.com/explore/tags/${instagramSearchTerm}/`;


  return (
    <div className="transition-all hover:bg-[rgba(248,250,252,0.5)] rounded-2xl p-4 -ml-4">
      <div className="flex justify-between items-start">
        <a 
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start hover:opacity-80 transition-opacity"
            title={`View ${stop.name} on Google Maps`}
        >
            <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-[#E87A5D] rounded-full flex items-center justify-center text-[#E87A5D] font-bold italic text-xl shadow-sm mr-4 z-10 group-hover:bg-[#E87A5D] group-hover:text-white transition-all">
                {index + 1}
            </div>
            <div>
                <h4 className="text-xl font-bold text-[#2D2422] group-hover:text-[#E87A5D] transition-colors flex items-center gap-2">
                    {stop.name}
                    {effectiveCategory && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E87A5D]/10 text-[#E87A5D] text-xs font-medium uppercase tracking-wider" title={effectiveCategory}>
                        {getCategoryIcon(effectiveCategory, "w-3 h-3")}
                        {effectiveCategory.replace('-', ' ')}
                      </span>
                    )}
                </h4>
                <p className="text-xs text-slate-400 mt-1 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {stop.address}
                </p>
            </div>
        </a>
        <div className="flex items-center space-x-3 flex-shrink-0 ml-4 no-print">
            <a
            href={instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-[#E87A5D] hover:bg-[rgba(232,122,93,0.1)] transition-all"
            aria-label={`Search for ${stop.name} on Instagram`}
            title={`Search for ${stop.name} on Instagram`}
            >
            <Camera className="w-4 h-4" />
            </a>
            <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-[#E87A5D] hover:bg-[rgba(232,122,93,0.1)] transition-all"
            aria-label={`View ${stop.name} on Google Maps`}
            >
            <MapPin className="w-4 h-4" />
            </a>
        </div>
      </div>

      <div className="pl-16 mt-4">
        <p className="text-slate-600 italic leading-relaxed text-sm">"{stop.notes}"</p>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#FFFBF5] border border-slate-100 p-4 rounded-xl">
                <h5 className="font-bold text-[#2D2422] text-xs uppercase tracking-wider mb-3 flex items-center opacity-60">
                    <Star className="w-3 h-3 mr-2 text-[#E87A5D]" />
                    Must-Try Items
                </h5>
                <ul className="space-y-2 list-none">
                {stop.recommendations.map((rec) => (
                    <li key={rec.item} className="text-sm">
                        <span className="font-bold text-[#2D2422]">{rec.item}</span>
                        <p className="text-slate-500 text-xs mt-0.5">{rec.description}</p>
                    </li>
                ))}
                </ul>
            </div>
            
            <div className="space-y-4">
                <div className="bg-[rgba(248,250,252,0.5)] p-4 rounded-xl border border-slate-100">
                    <h5 className="font-bold text-[#2D2422] text-xs uppercase tracking-wider mb-2 flex items-center opacity-60">
                        <Info className="w-3 h-3 mr-2 text-[#E87A5D]" />
                        Why it's worth it
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        {stop.reason}
                    </p>
                </div>
                
                {stop.hours_of_operation && (
                    <div className="flex items-center text-xs text-slate-400">
                        <Clock className="w-3 h-3 mr-2" />
                        <span>{stop.hours_of_operation}</span>
                    </div>
                )}
            </div>
        </div>

        {stop.image_prompt && (
            <div className="mt-4 no-print">
                {isGeneratingImage ? (
                    <div className="flex items-center justify-center h-40 bg-slate-50 animate-pulse rounded-xl border border-dashed border-slate-200">
                        <span className="text-slate-400 text-xs">Generating atmosphere...</span>
                    </div>
                ) : imageError ? (
                    <div className="flex items-center justify-center h-40 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <span className="text-slate-400 text-xs">{imageError}</span>
                    </div>
                ) : imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt={`Atmosphere at ${stop.name}`} 
                        className="w-full h-48 object-cover rounded-xl shadow-sm hover:shadow-md transition-shadow"
                        referrerPolicy="no-referrer"
                    />
                ) : null}
            </div>
        )}
      </div>
    </div>
  );
};

export default StopCard;