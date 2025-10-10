import { GoogleGenAI, Type } from "@google/genai";
import type { FormState, ItineraryResponse } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    city: { type: Type.STRING },
    itineraries: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          theme: { type: Type.STRING },
          total_estimated_cost: { type: Type.STRING },
          stops: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                recommendations: {
                  type: Type.ARRAY,
                  description: "A list of 2-3 must-try items.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      item: { type: Type.STRING, description: "Name of the recommended dessert." },
                      description: { type: Type.STRING, description: "Witty description of why this item is a must-try." },
                    },
                     required: ['item', 'description']
                  }
                },
                notes: { type: Type.STRING, description: "Witty description of the location's vibe and atmosphere." },
                maps_link: { type: Type.STRING },
                reason: { type: Type.STRING, description: "The reason why this place is 'worth the detour'." },
              },
              required: ['name', 'recommendations', 'notes', 'maps_link', 'reason']
            },
          },
        },
        required: ['theme', 'total_estimated_cost', 'stops']
      },
    },
  },
  required: ['city', 'itineraries']
};

export async function generateDessertItineraries(
  formData: FormState
): Promise<ItineraryResponse> {
  const { city, days, budget, currency, focus } = formData;

  const prompt = `
    You are the Dessert Dossi-AI, a witty and humorous travel curator with an encyclopedic knowledge of all things sweet and an allergy to tourist traps. Your mission, should you choose to accept it, is to craft dessert itineraries for a savvy, well-traveled family of 3 (including a sharp 11-year-old). They demand excellence: craftsmanship, creativity, and ingredients that sing. No sad, soggy pastries on your watch.

    For the city of ${city}, create exactly 3 distinct dessert itineraries. The trip is for ${days} days with a per-person budget of ${budget} ${currency}.
    The family's optional focus is on: ${focus || 'a balanced mix of everything delicious'}.

    The three itineraries must follow these themes, but with your signature flair:
    1. "Classic Icons": The legends. The G.O.A.T.s. The places so good they should be in a museum, but you can eat the exhibits.
    2. "Hidden Genius": The under-the-radar spots. The culinary mad scientists in unassuming storefronts. The kind of place you'd whisper about to your closest friends.
    3. "Modern Artisans": The rule-breakers. The dessert visionaries. The folks using liquid nitrogen and flavor combinations that would make your grandma clutch her pearls.

    HERE ARE YOUR DIRECTIVES (NON-NEGOTIABLE, MY FRIEND):
    - Each itinerary must have 3 to 5 stops. Quality over quantity.
    - For each stop, you must use your most up-to-date knowledge to ensure the place is still in operation. If you have any doubt, state "Existence unconfirmed, proceed with caution" in the 'notes'.
    - The 'notes' field should be a witty, detailed description of the location's vibe and atmosphere. Is it a chic laboratory? A cozy nook that smells like butter? Tell us.
    - The 'reason' field is for why it's a true "detour-worthy" stop. What makes it special? The 100-year-old sourdough starter? The owner who trained with a Parisian pastry god?
    - For 'recommendations', provide 2-3 specific must-try items. For each, explain *why* it's a showstopper. Be descriptive! "Get the chocolate cake" is a firing offense. "Get the 'Midnight Shadow' cake—a dark chocolate monolith with a surprising habanero-caramel core that’ll rewire your brain" is what we're after.
    - For 'total_estimated_cost', give a realistic damage report for one person, like "Approx. 30-50 ${currency} (prepare for a sugar coma)".
    - Your entire output MUST BE a single, valid JSON object. No commentary, no apologies, just pure, unadulterated JSON that adheres strictly to the provided schema. Failure is not an option. Now go, make us proud (and hungry).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.6,
    },
  });

  const jsonText = response.text.trim();
  
  try {
    return JSON.parse(jsonText) as ItineraryResponse;
  } catch (e) {
    console.error("Failed to parse JSON response:", jsonText);
    throw new Error("Received a malformed JSON response from the API.");
  }
}