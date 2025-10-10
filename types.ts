export interface Recommendation {
  item: string;
  description: string;
}

export interface Stop {
  name: string;
  address: string;
  hours_of_operation: string;
  recommendations: Recommendation[];
  notes: string;
  maps_link: string;
  reason: string;
}

export interface Itinerary {
  theme: string;
  stops: Stop[];
  total_estimated_cost: string;
  imageUrl?: string;
}

export interface ItineraryResponse {
  city: string;
  itineraries: Itinerary[];
  suggested_schedule: string;
}

export interface FormState {
  city: string;
  days: number;
  budget: number;
  currency: string;
  focus: string;
  exclusions: string;
  neighborhood: string;
  tourPace: 'relaxed' | 'intensive';
}