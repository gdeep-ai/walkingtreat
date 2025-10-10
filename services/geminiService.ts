import { GoogleGenAI } from '@google/genai';
import type { FormState, ItineraryResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const createPrompt = (formData: FormState): string => {
  const { city, days, treatFocus, neighborhood, priceRange, specialRequests, exclusions } = formData;

  let prompt = `You are a world-class, witty, and slightly sarcastic travel curator specializing in treats. Your goal is to create a bespoke treat-focused itinerary for a well-traveled family of 3 (including an adventurous 11-year-old). They want places that are "worth the detour"—truly exceptional, avoiding tourist traps. Focus on craftsmanship, creativity, and unique experiences. Your tone should be humorous and engaging, like a savvy friend giving them the inside scoop.

**CRITICAL INSTRUCTION: Use your search tool to find the most current, accurate, and highly-rated information available for all recommendations. Verify hours of operation, addresses, and popular menu items. Pay special attention to recent discussions and recommendations on community forums like Reddit.**

**Destination:** ${city}
**Duration:** ${days} day(s)
${neighborhood ? `**Starting Point:** Center the tour around "${neighborhood}". All stops should be within a reasonable walking distance from this area.` : ''}
${priceRange ? `**Price Preference:** Please tailor the recommendations to be "${priceRange}".` : ''}

**Key Interests:**
- The family is particularly interested in: ${treatFocus.join(', ')}.

**Additional Considerations:**
- Special requests: "${specialRequests || 'None.'}"
- Exclusions to avoid: "${exclusions || 'None.'}"

**Your Task:**
Generate **exactly 3** distinct themed itineraries (e.g., "The Sugar-High Scramble," "Modernist Munchies Tour," "A Very Serious Quest for Carbs"). For each itinerary:
1.  Provide a concise, evocative, and witty theme name under the key "theme".
2.  Provide a **total_estimated_cost** (e.g., "$50-75 USD per person, or your firstborn's college fund").
3.  List 2-4 exceptional stops per day. For each stop:
    -   **name**: The name of the establishment.
    -   **notes**: A brief, insightful, and witty tip (e.g., "The line looks scary, but it moves faster than a rumor in a small town," "Their seasonal special is more fleeting than a toddler's attention span.").
    -   **recommendations**: List 1-2 must-try items. The description for each MUST be witty and enticing (e.g., "A croissant so flaky it might just float away," "Ice cream that will make you question all your life choices.").
    -   **reason**: A compelling, humorous justification for why this place is exceptional. "Delicious" is banned. Be specific. (e.g., "They churn their gelato with the tears of angels," "The baker has a PhD in gluten wizardry.").
    -   **CRITICAL REQUIREMENT**: You MUST provide the full, accurate **address** and the current **hours_of_operation** for every single stop. This is non-negotiable. Be a professional; get the real, current details from your search results.

4. At the top level of the JSON, provide a **suggested_schedule** that matches the witty tone (e.g., "A brisk pace of 3 stops per day. Wear your stretchy pants.").

**Output Format:** Your response MUST be a single, valid JSON object matching the schema below. Do not include any text, notes, or markdown formatting before or after the JSON object.

**JSON Schema Example:**
{
  "city": "${city}",
  "suggested_schedule": "Your witty suggested schedule for the entire trip.",
  "itineraries": [
    {
      "theme": "Witty theme name for itinerary 1",
      "total_estimated_cost": "Estimated cost for itinerary 1",
      "stops": [
        {
          "name": "Stop 1 name",
          "address": "Full address for stop 1",
          "hours_of_operation": "Hours for stop 1",
          "notes": "Witty note for stop 1",
          "recommendations": [
            { "item": "Must-try item 1", "description": "Witty description" }
          ],
          "reason": "Witty reason to visit stop 1"
        }
      ]
    }
  ]
}
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
        tools: [{googleSearch: {}}],
        temperature: 0.7,
      },
    });
    
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    let jsonText = response.text.trim();
    
    // Clean potential markdown fences
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.substring(7);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3);
    }
    jsonText = jsonText.trim();
    
    let itineraryData: Omit<ItineraryResponse, 'groundingMetadata'>;

    try {
        // The AI sometimes uses a different key for 'theme'. This corrects it.
        const correctedJsonText = jsonText.replace(/"theme_name":/g, '"theme":');
        itineraryData = JSON.parse(correctedJsonText);
    } catch (parseError) {
        console.error("Failed to parse JSON response:", jsonText);
        console.error("Parse error:", parseError);
        throw new Error("Failed to generate a valid itinerary. The model returned an unexpected format.");
    }

    // Validate the structure of the parsed JSON
    if (!itineraryData || !Array.isArray(itineraryData.itineraries)) {
        console.error("Validation failed: Parsed JSON is missing 'itineraries' array.", itineraryData);
        throw new Error("The AI returned data in an unexpected structure. Please try refining your query.");
    }
    
    return {
        ...itineraryData,
        groundingMetadata
    };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && (error.message.includes("unexpected structure") || error.message.includes("unexpected format"))) {
      throw error;
    }
    throw new Error("There was an issue generating your dessert itinerary. Please check your connection or try again later.");
  }
};