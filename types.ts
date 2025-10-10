export interface FormState {
  city: string;
  days: number;
  treatFocus: string[];
  neighborhood: string;
  priceRange: string;
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

// Based on groundingMetadata structure
export interface GroundingChunk {
  // FIX: The `web` property is optional in the Gemini SDK's GroundingChunk type.
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}

export interface ItineraryResponse {
  city: string;
  suggested_schedule: string;
  itineraries: Itinerary[];
  groundingMetadata?: GroundingMetadata;
}
