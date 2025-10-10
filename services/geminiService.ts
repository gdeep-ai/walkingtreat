import { GoogleGenAI, Type } from '@google/genai';
import type { FormState, ItineraryResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    city: { type: Type.STRING },
    suggested_schedule: { type: Type.STRING },
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
                address: { type: Type.STRING },
                hours_of_operation: { type: Type.STRING },
                notes: { type: Type.STRING },
                recommendations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      item: { type: Type.STRING },
                      description: { type: Type.STRING },
                    },
                    required: ['item', 'description'],
                  },
                },
                reason: { type: Type.STRING },
              },
              required: ['name', 'address', 'hours_of_operation', 'notes', 'recommendations', 'reason'],
            },
          },
        },
        required: ['theme', 'total_estimated_cost', 'stops'],
      },
    },
  },
  required: ['city', 'suggested_schedule', 'itineraries'],
};

const createPrompt = (formData: FormState): string => {
  const { city, days, treatFocus, specialRequests, exclusions } = formData;

  let prompt = `You are a world-class, witty, and slightly sarcastic travel curator specializing in treats. Your goal is to create a bespoke treat-focused itinerary for a well-traveled family of 3 (including an adventurous 11-year-old). They want places that are "worth the detour"—truly exceptional, avoiding tourist traps. Focus on craftsmanship, creativity, and unique experiences. Your tone should be humorous and engaging, like a savvy friend giving them the inside scoop.

**Destination:** ${city}
**Duration:** ${days} day(s)

**Key Interests:**
- The family is particularly interested in: ${treatFocus.join(', ')}.

**Additional Considerations:**
- Special requests: "${specialRequests || 'None.'}"
- Exclusions to avoid: "${exclusions || 'None.'}"

**Your Task:**
Generate 1 to 3 distinct themed itineraries (e.g., "The Sugar-High Scramble," "Modernist Munchies Tour," "A Very Serious Quest for Carbs"). For each itinerary:
1.  Provide a concise, evocative, and witty theme name.
2.  Provide a **total_estimated_cost** (e.g., "$50-75 USD per person, or your firstborn's college fund").
3.  List 2-4 exceptional stops per day. For each stop:
    -   **name**: The name of the establishment.
    -   **notes**: A brief, insightful, and witty tip (e.g., "The line looks scary, but it moves faster than a rumor in a small town," "Their seasonal special is more fleeting than a toddler's attention span.").
    -   **recommendations**: List 1-2 must-try items. The description for each MUST be witty and enticing (e.g., "A croissant so flaky it might just float away," "Ice cream that will make you question all your life choices.").
    -   **reason**: A compelling, humorous justification for why this place is exceptional. "Delicious" is banned. Be specific. (e.g., "They churn their gelato with the tears of angels," "The baker has a PhD in gluten wizardry.").
    -   **CRITICAL REQUIREMENT**: You MUST provide the full, accurate **address** and the current **hours_of_operation** for every single stop. This is non-negotiable. Be a professional; get the real, current details.

4.  Provide a **suggested_schedule** that matches the witty tone (e.g., "A brisk pace of 3 stops per day. Wear your stretchy pants.").

Do not include any personally identifiable information (PII). Base your recommendations on real, world-class locations.
`;
  return prompt;
};


export const generateItinerary = async (formData: FormState): Promise<ItineraryResponse> => {
  const prompt = createPrompt(formData);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    let jsonText = response.text.trim();
    
    // Clean potential markdown fences
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.substring(7);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3);
    }
    
    if (!jsonText.startsWith('{') || !jsonText.endsWith('}')) {
        console.error("Received non-JSON response:", jsonText);
        throw new Error("Failed to generate a valid itinerary. The model returned an unexpected format.");
    }
    const itineraryData: ItineraryResponse = JSON.parse(jsonText);
    return itineraryData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("There was an issue generating your dessert itinerary. Please check your connection or try again later.");
  }
};