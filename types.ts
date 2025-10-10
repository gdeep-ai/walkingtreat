export interface FormState {
  city: string;
  days: number | string;
  treatFocus: string[];
  specialRequests: string;
  exclusions: string;
}

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
}

export interface Itinerary {
  theme: string;
  total_estimated_cost: string;
  stops: Stop[];
}

export interface ItineraryResponse {
  city: string;
  suggested_schedule: string;
  itineraries: Itinerary[];
}