export interface Recommendation {
  item: string;
  description: string;
}

export interface Stop {
  name: string;
  address: string;
  hours_of_operation: string;
  notes: string;
  recommendations: Recommendation[];
  reason: string;
  image_prompt: string;
  category: 'ice-cream' | 'cake' | 'pizza' | 'coffee' | 'savory' | 'pastry' | 'other';
}

export interface Itinerary {
  theme: string;
  total_estimated_cost: string;
  stops: Stop[];
}

export interface FormState {
  destination: string;
  budget: string;
  interests: string[];
  tone: number;
}