import { GoogleGenAI, Type } from "@google/genai";
import type { FormState, ItineraryResponse } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const DESSERT_PROMPTS = [
  "A vibrant, colorful stack of French macarons with a shallow depth of field.",
  "A decadent slice of chocolate lava cake, with molten chocolate oozing out, dusted with powdered sugar.",
  "A scoop of artisanal pistachio gelato in a crispy waffle cone, against a blurred city background.",
  "Japanese mochi ice cream, cut in half to show the colorful ice cream filling.",
  "A classic New York cheesecake with a graham cracker crust and a strawberry on top.",
  "A fluffy, golden-brown Belgian waffle topped with whipped cream, fresh berries, and maple syrup.",
  "An elegant slice of Italian tiramisu on a white plate, with cocoa powder dusted on top.",
  "A close-up shot of a Portuguese pastel de nata with its characteristic caramelized top.",
  "A rustic, homemade apple pie with a lattice crust, fresh from the oven.",
  "A trio of gourmet donuts with unique glazes and toppings on a modern, clean surface.",
  "A glass of creamy Spanish churros with a side of thick hot chocolate for dipping.",
  "Baklava, a rich, sweet dessert pastry made of layers of filo filled with chopped nuts and sweetened with syrup.",
  "A bright yellow lemon tart with a perfectly torched meringue topping.",
  "A bowl of Thai mango sticky rice, with ripe mango slices and coconut milk.",
  "A perfectly decorated cupcake with swirled frosting and sprinkles.",
  "Crème brûlée with a crisp, caramelized sugar top being cracked with a spoon.",
  "A beautiful arrangement of Turkish delight in various colors and flavors.",
  "A scoop of black sesame ice cream, showing its unique dark color and texture.",
  "Gulab jamun, soft berry-sized balls made of milk solids, soaked in rose-flavored sugar syrup.",
  "A slice of key lime pie with a dollop of whipped cream.",
  "Cannoli, Italian pastries of tube-shaped shells of fried pastry dough, filled with a sweet, creamy filling.",
  "A slice of Black Forest cake, with layers of chocolate sponge cake, whipped cream, and cherries.",
  "S'mores being toasted over a campfire, with gooey marshmallow and melting chocolate.",
  "A refreshing and colorful fruit tart with a glossy glaze."
];

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    city: { type: Type.STRING },
    suggested_schedule: { type: Type.STRING, description: "A brief suggested schedule for how to tackle the 3 itineraries over the specified number of days, based on the user's preferred pace." },
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
                address: { type: Type.STRING, description: "The full, factual street address of the location." },
                hours_of_operation: { type: Type.STRING, description: "The hours of operation, e.g., 'Mon-Sat 9am-6pm, Sun closed'." },
                recommendations: {
                  type: Type.ARRAY,
                  description: "A list of 2-3 must-try items.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      item: { type: Type.STRING, description: "Name of the recommended dessert." },
                      description: { type: Type.STRING, description: "A witty and humorous description of why this item is a must-try." },
                    },
                     required: ['item', 'description']
                  }
                },
                notes: { type: Type.STRING, description: "A witty and humorous description of the location's vibe and atmosphere." },
                maps_link: { type: Type.STRING },
                reason: { type: Type.STRING, description: "A witty and humorous reason why this place is 'worth the detour'." },
              },
              required: ['name', 'address', 'hours_of_operation', 'recommendations', 'notes', 'maps_link', 'reason']
            },
          },
        },
        required: ['theme', 'total_estimated_cost', 'stops']
      },
    },
  },
  required: ['city', 'itineraries', 'suggested_schedule']
};

export async function generateGalleryImages(count: number = 9): Promise<string[]> {
  try {
    const selectedPrompts = DESSERT_PROMPTS.sort(() => 0.5 - Math.random()).slice(0, count);

    const imagePromises = selectedPrompts.map(promptText => {
      const fullPrompt = `A vibrant, professional food photograph of: ${promptText}. Studio lighting, mouth-watering detail, on a minimalist background.`;
      return ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: fullPrompt,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: '1:1',
          },
      });
    });

    const responses = await Promise.all(imagePromises);

    return responses.map(response => {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    });

  } catch (error) {
    console.error("Error generating gallery images:", error);
    return [];
  }
}

export async function generateItineraryImage(theme: string, city: string): Promise<string> {
  try {
    const prompt = `A sophisticated, photorealistic image of artisanal desserts on a clean, elegant surface. The image should evoke the theme of "${theme}" in the city of ${city}. Cinematic lighting, high detail, modern aesthetic.`;
    
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '16:9',
        },
    });

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/png;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error generating image:", error);
    return "";
  }
}

export async function generateDessertItineraries(
  formData: FormState
): Promise<ItineraryResponse> {
  const { city, days, budget, currency, focus, exclusions, neighborhood, tourPace } = formData;
  
  const tourPaceDescription = tourPace === 'relaxed' 
    ? 'a relaxed pace, with one tour per day' 
    : 'a more intensive pace, aiming for two tours per day';

  const prompt = `
    You are a dessert travel curator with a sharp wit and a passion for finding world-class bakeries and ice cream shops—places truly "worth the detour."
    You are curating for a well-traveled family of 3 (including an 11-year-old). They avoid tourist traps and average sweets, prioritizing craftsmanship, creativity, and provenance. They appreciate a good laugh.

    For the city of ${city}, create exactly 3 distinct dessert itineraries. The trip is for ${days} days with a per-person budget of ${budget} ${currency}.
    The family's optional focus is on: ${focus || 'a balanced mix of everything delicious'}.${exclusions ? `\nThey want to specifically AVOID: ${exclusions}.` : ''}
    The family prefers ${tourPaceDescription}.

    The three itineraries must follow these themes:
    1. "Classic Icons": The legendary, time-honored establishments that define the city's dessert scene.
    2. "Hidden Gems": The under-the-radar spots known only to locals, offering exceptional quality without the crowds.
    3. "Modern Artisans": The innovative, boundary-pushing creators who are redefining dessert with new techniques and flavors.

    RULES:
    - **Geographical Grouping:** All stops within a single itinerary MUST be geographically close to form a logical walking tour (max 15-20 min walk between stops). This is critical.${neighborhood ? `\n- **Starting Point:** The itineraries should be centered around the ${neighborhood} area.` : ''}
    - **Humorous & Witty Tone:** Inject humor and wit into all descriptive fields ('notes', 'reason', and 'recommendations.description'). The tone should be fun and engaging, like a cool, in-the-know friend sharing secrets. Be creative!
    - **Factual Information:** Despite the witty tone, all core information MUST be factual and up-to-date. This includes location names, menu items, addresses, and hours of operation. Do not make up information.
    - **'address' & 'hours_of_operation':** You must provide the full street address and current hours for each stop.
    - **'reason' field:** Clearly explain why each stop is "worth the detour." Make it funny.
    - **'notes' field:** Describe the location's ambiance and what to expect, with a humorous spin.
    - **'recommendations':** Provide 2-3 specific must-try items with compelling and witty descriptions.
    - **'total_estimated_cost':** Provide a realistic cost estimate for one person in the specified currency.
    - **Suggested Schedule:** Provide a brief, practical schedule for the family to follow over their ${days}-day trip in the 'suggested_schedule' field, based on their chosen pace.
    - **JSON ONLY:** The entire output must be a single, valid JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const rawText = response.text.trim();
    if (!rawText) {
        throw new Error("The AI returned an empty response. Please try refining your request.");
    }
    
    // Clean the response to handle potential markdown code fences
    const jsonText = rawText.replace(/^```json\s*/, '').replace(/```$/, '').trim();

    return JSON.parse(jsonText) as ItineraryResponse;

  } catch (error) {
    console.error("Error in generateDessertItineraries:", error);

    if (error instanceof SyntaxError) {
        throw new Error("The AI returned a response, but it was in an unexpected format. Please try again.");
    }

    if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('api key not valid') || errorMessage.includes('invalid api key')) {
            throw new Error('The API Key is invalid. Please check your configuration.');
        }
        if (errorMessage.includes('429') || errorMessage.includes('rate limit exceeded')) {
            throw new Error("You've made too many requests in a short period. Please wait a moment and try again.");
        }
        if (errorMessage.includes('500') || errorMessage.includes('internal error')) {
            throw new Error('The AI service is currently unavailable or experiencing issues. Please try again later.');
        }
        if (errorMessage.includes('empty response')) {
            throw error;
        }
    }

    throw new Error('An unexpected error occurred while communicating with the AI. Please check the console for details.');
  }
}