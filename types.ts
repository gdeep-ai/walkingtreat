export interface Recommendation {
  item: string;
  description: string;
}

export interface Stop {
  name: string;
  recommendations: Recommendation[];
  notes: string;
  maps_link: string;
  reason: string;
}

export interface Itinerary {
  theme: string;
  stops: Stop[];
  total_estimated_cost: string;
}

export interface ItineraryResponse {
  city: string;
  itineraries: Itinerary[];
}

export interface FormState {
  city: string;
  days: number;
  budget: number;
  currency: string;
  focus: string;
}