import React, { useState, useEffect } from 'react';
import type { FormState } from '../types';
import { treatOptions } from '../data/dessertOptions';

interface ItineraryFormProps {
  onSubmit: (formData: FormState) => void;
  isLoading: boolean;
  initialState?: FormState;
}

const ItineraryForm: React.FC<ItineraryFormProps> = ({ onSubmit, isLoading, initialState }) => {
  const defaultState: FormState = {
    city: '',
    days: 1,
    treatFocus: [],
    specialRequests: '',
    exclusions: '',
  };

  const [formData, setFormData] = useState<FormState>(initialState || defaultState);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (initialState) {
      setFormData(initialState);
    }
  }, [initialState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleAddTag = (tagToAdd: string) => {
    const trimmedTag = tagToAdd.trim();
    if (trimmedTag && !formData.treatFocus.includes(trimmedTag)) {
      setFormData(prev => ({ ...prev, treatFocus: [...prev.treatFocus, trimmedTag] }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      treatFocus: prev.treatFocus.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.city && formData.treatFocus.length > 0) {
      onSubmit(formData);
    } else {
      alert('Please fill out the destination city and add at least one treat focus.');
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-2xl mx-auto border border-white/50">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-indigo-900">
            Destination City
          </label>
          <input
            type="text"
            name="city"
            id="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g., Paris, Tokyo, Mexico City"
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="days" className="block text-sm font-medium text-indigo-900">
            Number of Days
          </label>
          <input
            type="number"
            name="days"
            id="days"
            value={formData.days}
            onChange={(e) => setFormData(prev => ({ ...prev, days: e.target.valueAsNumber }))}
            min="1"
            max="7"
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="treatFocus" className="block text-sm font-medium text-indigo-900">
            Treat Focus (add one or more)
          </label>
          <div className="mt-1 flex flex-wrap gap-2 p-2 border border-slate-300 rounded-md bg-white min-h-[42px]">
            {formData.treatFocus.map(tag => (
              <span key={tag} className="flex items-center gap-1 bg-indigo-100 text-indigo-800 text-sm font-medium px-2 py-1 rounded-md">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="text-indigo-600 hover:text-indigo-900 font-bold">
                  &times;
                </button>
              </span>
            ))}
             <input
                type="text"
                id="treatFocus"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Type or select below..."
                className="flex-grow p-1 outline-none bg-transparent"
              />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
              {treatOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleAddTag(option.label)}
                  className="px-2.5 py-1 text-xs bg-slate-200 text-slate-700 rounded-md hover:bg-indigo-500 hover:text-white transition-colors"
                >
                  {option.label}
                </button>
              ))}
          </div>
        </div>

        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-indigo-900">
            Special Requests (optional)
          </label>
          <textarea
            name="specialRequests"
            id="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            rows={2}
            placeholder="e.g., Kid-friendly options, places with great coffee"
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="exclusions" className="block text-sm font-medium text-indigo-900">
            Exclusions (optional)
          </label>
          <textarea
            name="exclusions"
            id="exclusions"
            value={formData.exclusions}
            onChange={handleChange}
            rows={2}
            placeholder="e.g., No nuts, avoid very touristy areas"
            className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex justify-center items-center py-3 px-6 border border-transparent shadow-md text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            {isLoading ? 'Crafting Your Tour...' : 'Build My Treat Itinerary'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItineraryForm;