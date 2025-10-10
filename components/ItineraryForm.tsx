
import React, { useState } from 'react';
import type { FormState } from '../types';

interface ItineraryFormProps {
  onSubmit: (formData: FormState) => void;
  isLoading: boolean;
}

const ItineraryForm: React.FC<ItineraryFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FormState>({
    city: '',
    days: 3,
    budget: 50,
    currency: 'USD',
    focus: '',
  });
  const [error, setError] = useState('');

  const handleChange = <T,>(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.city.trim()) {
      setError('Please enter a city.');
      return;
    }
    setError('');
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-stone-200/50">
      <h2 className="text-2xl font-bold text-stone-700 mb-2">Plan Your Sweet Escape</h2>
      <p className="text-stone-500 mb-6">Tell us about your trip, and we'll curate three perfect dessert itineraries.</p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="lg:col-span-2">
          <label htmlFor="city" className="block text-sm font-medium text-stone-600 mb-1">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g., Madrid"
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            required
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div>
          <label htmlFor="days" className="block text-sm font-medium text-stone-600 mb-1">Days</label>
          <input
            type="number"
            id="days"
            name="days"
            value={formData.days}
            onChange={handleChange}
            min="1"
            max="5"
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
          />
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-stone-600 mb-1">Budget/Person</label>
          <div className="flex">
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              min="1"
              className="w-2/3 px-3 py-2 border border-stone-300 rounded-l-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            />
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-1/3 border-t border-b border-r border-stone-300 rounded-r-lg bg-stone-50 text-stone-600 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
              <option>JPY</option>
            </select>
          </div>
        </div>
        
        <div className="lg:col-span-5">
          <label htmlFor="focus" className="block text-sm font-medium text-stone-600 mb-1">Optional Focus</label>
          <input
            type="text"
            id="focus"
            name="focus"
            value={formData.focus}
            onChange={handleChange}
            placeholder="e.g., pastries, ice cream, local specialties"
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
          />
        </div>
        
        <div className="md:col-span-2 lg:col-span-5">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-600 transition-colors duration-300 disabled:bg-stone-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? 'Curating...' : 'Generate Itineraries'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ItineraryForm;
