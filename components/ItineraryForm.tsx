import React, { useState, useEffect } from 'react';
import type { FormState } from '../types';

interface ItineraryFormProps {
  onSubmit: (formData: FormState) => void;
  loading: boolean;
}

const ItineraryForm: React.FC<ItineraryFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<FormState>({
    city: 'Paris',
    days: 3,
    budget: 50,
    currency: 'EUR',
    focus: 'Chocolate and pastries',
    exclusions: '',
    neighborhood: '',
    tourPace: 'relaxed',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('city')) {
        setFormData({
            city: params.get('city') || 'Paris',
            days: Number(params.get('days')) || 3,
            budget: Number(params.get('budget')) || 50,
            currency: params.get('currency') || 'EUR',
            focus: params.get('focus') || '',
            exclusions: params.get('exclusions') || '',
            neighborhood: params.get('neighborhood') || '',
            tourPace: (params.get('tourPace') as FormState['tourPace']) || 'relaxed',
        });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setFormData((prev) => ({
      ...prev,
      [name]: isNumber ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-slate-200/50">
      <h2 className="text-xl font-bold mb-4 text-indigo-900">Generate Your Itinerary</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-slate-700">City</label>
            <input
              type="text" id="city" name="city" value={formData.city} onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-slate-300/70 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5"
              required
            />
          </div>
          <div>
            <label htmlFor="days" className="block text-sm font-medium text-slate-700">Days</label>
            <input
              type="number" id="days" name="days" value={formData.days} onChange={handleChange} min="1" max="10"
              className="mt-1 block w-full rounded-lg border-slate-300/70 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5"
              required
            />
          </div>
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-slate-700">Budget (per day)</label>
            <input
              type="number" id="budget" name="budget" value={formData.budget} onChange={handleChange} min="10"
              className="mt-1 block w-full rounded-lg border-slate-300/70 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5"
              required
            />
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-slate-700">Currency</label>
            <select
              id="currency" name="currency" value={formData.currency} onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-slate-300/70 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>JPY</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="focus" className="block text-sm font-medium text-slate-700">Optional Focus</label>
                <input
                    type="text" id="focus" name="focus" value={formData.focus} onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-slate-300/70 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5"
                    placeholder='e.g., "ice cream", "vegan"'
                />
            </div>
            <div>
                <label htmlFor="exclusions" className="block text-sm font-medium text-slate-700">Exclusions (optional)</label>
                <input
                    type="text" id="exclusions" name="exclusions" value={formData.exclusions} onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-slate-300/70 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5"
                    placeholder='e.g., "nuts", "tourist traps"'
                />
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label htmlFor="neighborhood" className="block text-sm font-medium text-slate-700">Starting Neighborhood or Attraction</label>
                <input
                    type="text" id="neighborhood" name="neighborhood" value={formData.neighborhood} onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-slate-300/70 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5"
                    placeholder="e.g., 'Le Marais', 'Eiffel Tower'"
                />
            </div>
            <div>
                <label htmlFor="tourPace" className="block text-sm font-medium text-slate-700">Tour Pace</label>
                <select
                    id="tourPace" name="tourPace" value={formData.tourPace} onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-slate-300/70 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5"
                >
                    <option value="relaxed">Relaxed (1 tour/day)</option>
                    <option value="intensive">Intensive (2 tours/day)</option>
                </select>
            </div>
        </div>

        <div className="pt-2">
            <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center items-center py-3 px-6 border border-transparent shadow-md text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
                {loading ? 'Curating...' : 'Generate Itinerary'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default ItineraryForm;