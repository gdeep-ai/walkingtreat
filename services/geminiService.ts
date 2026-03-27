import { GoogleGenAI, Type } from "@google/genai";
import type { FormState, Itinerary } from '../types.ts';
import { db, auth } from '../firebase.ts';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// Per guidelines, API key must be obtained from process.env.GEMINI_API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

/**
 * Strips markdown code blocks from a string to ensure it's valid JSON.
 */
const cleanJsonString = (str: string): string => {
    return str.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
};

const itinerarySchema = {
    type: Type.OBJECT,
    properties: {
        theme: { type: Type.STRING, description: "A creative, catchy theme for the dessert tour, reflecting the player's tone and alignment. e.g., 'The Sun-Dappled Path of Pastries' or 'A Shadowy Sojourn for Forbidden Sweets'." },
        total_estimated_cost: { type: Type.STRING, description: "An estimated total cost for one person, like '$50-70 USD'. Provide a range." },
        stops: {
            type: Type.ARRAY,
            description: "An array of 3-5 unique, high-quality dessert stops.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The name of the shop." },
                    address: { type: Type.STRING, description: "The full, real-world street address." },
                    hours_of_operation: { type: Type.STRING, description: "The shop's actual, verified opening and closing times (e.g., '10:00 AM - 8:00 PM'). Double check these are realistic for the specific establishment." },
                    notes: { type: Type.STRING, description: "A brief, enticing note about the stop's atmosphere or specialty, written in the narrative style of the storyteller persona. Should be a complete sentence." },
                    reason: { type: Type.STRING, description: "A compelling explanation of why this place is a must-visit, focusing on craftsmanship, unique offerings, or creator's story, all framed by the storyteller persona. Should be a complete sentence." },
                    recommendations: {
                        type: Type.ARRAY,
                        description: "An array of 2-3 specific, must-try items.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                item: { type: Type.STRING, description: "Name of the recommended dessert." },
                                description: { type: Type.STRING, description: "A brief, mouth-watering description of the item, written in the storyteller's narrative voice. Should be a complete sentence." }
                            },
                            required: ["item", "description"]
                        }
                    },
                    image_prompt: { 
                        type: Type.STRING, 
                        description: "A concise, unambiguous, SFW, and visually descriptive prompt for an image generation model, capturing the essence of this stop according to the specified tone and alignment. Example: 'A dimly lit, opulent bakery case filled with jewel-like pastries, steam rising from a silver teapot, baroque wallpaper in the background, mysterious shadows in the corner, cinematic lighting.'" 
                    },
                    category: {
                        type: Type.STRING,
                        description: "The primary category of this stop. You MUST assign a category from this exact list: 'ice-cream', 'cake', 'pizza', 'coffee', 'savory', 'pastry', or 'other'. Do not use any other values."
                    }
                },
                required: ["name", "address", "hours_of_operation", "notes", "reason", "recommendations", "image_prompt", "category"]
            }
        }
    },
    required: ["theme", "total_estimated_cost", "stops"]
};

/**
 * Determines a flavor profile based on user's budget and interests.
 * @param formState The user's form input.
 * @returns A profile string (e.g., "Classic & Light", "Experimental & Decadent").
 */
const determineProfile = (formState: FormState): string => {
    let classicVsExperimental = 0; // Positive for Classic, negative for Experimental
    let lightVsDecadent = 0; // Positive for Light, negative for Decadent

    // Budget influence
    if (formState.budget === 'frugal') {
        classicVsExperimental += 1;
        lightVsDecadent += 1;
    } else if (formState.budget === 'luxurious') {
        classicVsExperimental -= 1;
        lightVsDecadent -= 1;
    }

    // Interests influence
    if (formState.interests.includes('regional')) classicVsExperimental += 1;
    if (formState.interests.includes('avant-garde')) classicVsExperimental -= 1;
    if (formState.interests.includes('bakeries')) lightVsDecadent += 1;
    if (formState.interests.includes('chocolate')) lightVsDecadent -= 0.5; // Decadence

    const styleAxis = classicVsExperimental > 0 ? 'Classic' : classicVsExperimental < 0 ? 'Experimental' : 'Balanced';
    const flavorAxis = lightVsDecadent > 0 ? 'Light' : lightVsDecadent < 0 ? 'Decadent' : 'Neutral';
    
    if (styleAxis === 'Balanced' && flavorAxis === 'Neutral') return 'Balanced & Neutral';
    if (styleAxis === 'Balanced') return `Balanced & ${flavorAxis}`;
    if (flavorAxis === 'Neutral') return `${styleAxis} & Neutral`;

    return `${styleAxis} & ${flavorAxis}`;
};

export interface GenerationResult {
  itinerary: Itinerary;
  correctedDestination: string;
}

export const generateItinerary = async (formState: FormState): Promise<GenerationResult> => {
    const { destination, interests, tone, budget } = formState;
    const profile = determineProfile(formState);

    // 1. Check Cache
    let cacheKey = "";
    try {
        const data = JSON.stringify({
            d: destination.toLowerCase().trim(),
            b: budget,
            i: [...interests].sort(),
            t: tone
        });
        const msgBuffer = new TextEncoder().encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        cacheKey = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const cacheDocRef = doc(db, "itineraries", cacheKey);
        const cacheSnap = await getDoc(cacheDocRef);
        if (cacheSnap.exists()) {
            console.log("Returning cached itinerary!");
            const cachedData = cacheSnap.data();
            return JSON.parse(cachedData.result);
        }
    } catch (err) {
        console.warn("Cache check failed, proceeding to generate:", err);
    }

    const prompt = `
        You are a friendly local guide and culinary expert. Your task is to convert a user's preferences into a themed, narrative dessert tour.
        
        **STEP 1: DESTINATION CORRECTION (STRICT)**
        The user input for destination is: "${destination}". 
        First, identify the canonical city and country name in English (e.g., "Paris, France"). Use this corrected name for the entire itinerary.
        **CRITICAL:** Every single stop MUST be a real, verifiable place located within this specific city. Do NOT suggest places in other cities, even if they are famous.

        **STEP 2: ITINERARY GENERATION**
        **USER PREFERENCES:**
        *   **STRICT Destination:** [The city you identified in Step 1]
        *   **Flavor Profile:** ${profile}
        *   **Narrative Tone (0-100):** ${tone} (0 is extremely Classic/Sweet, 100 is extremely Wild/Decadent)
        *   **Skills & Interests:** ${interests.join(', ')}
        ${interests.includes('best-of') ? '*   **SPECIAL INSTRUCTION:** The user selected "Best Of". Include the absolute top picks and quintessential desserts for this city, regardless of other categories. Focus on the most famous, iconic, or highly-rated spots.' : ''}

        **YOUR QUEST OBJECTIVES:**
        1.  **Craft a Narrative:** Generate a dessert tour itinerary that embodies the user's preferences. The 'theme', 'notes', 'reason', and 'recommendations' must all reflect the specified Flavor Profile and Tone.
        2.  **STRICT ADHERENCE TO INTERESTS:** You MUST ONLY include stops that match the user's selected Skills & Interests (${interests.join(', ')}). For example, if they selected 'pizza' and 'savory', do NOT include ice cream or cake. If they selected 'ice-cream', do NOT include pizza. Triple-check that every stop aligns with the requested treats.
        3.  **Generate Visual Prompts:** For each stop, create a concise, SFW, and unambiguous \`image_prompt\` suitable for an image generation AI.
        4.  **STRICT LOCALITY:** All stops MUST be located in the corrected destination. If the destination is "New York, USA", all stops must be in New York City.
        5.  **World-Class Only:** Focus exclusively on real, high-quality places.
        6.  **Walkability (CRITICAL):** Maximum 1.5 miles total walking distance. Total walking time < 45 minutes.
        7.  **Realistic Routing & Hours:** Order the stops logically. Ensure the \`hours_of_operation\` are accurate and realistic for the specific establishment (e.g., don't say 12 PM to 11 PM if it's a morning bakery).

        Return a JSON object that includes the corrected destination name and the itinerary data.
    `;

    const extendedSchema = {
        type: Type.OBJECT,
        properties: {
            correctedDestination: { type: Type.STRING, description: "The canonical 'City, Country' name." },
            itinerary: itinerarySchema
        },
        required: ["correctedDestination", "itinerary"]
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: extendedSchema,
            },
        });

        const jsonText = cleanJsonString(response.text);
        const result = JSON.parse(jsonText);

        if (!result.itinerary.stops || result.itinerary.stops.length === 0) {
            throw new Error("The generated itinerary has no stops. Please try a different query.");
        }

        const finalResult: GenerationResult = { 
            itinerary: result.itinerary, 
            correctedDestination: result.correctedDestination 
        };

        // 2. Save to Cache
        if (cacheKey) {
            try {
                await setDoc(doc(db, "itineraries", cacheKey), {
                    destination: destination.toLowerCase().trim(),
                    budget,
                    interests: [...interests].sort(),
                    tone,
                    result: JSON.stringify(finalResult),
                    createdAt: serverTimestamp()
                });
            } catch (err) {
                console.warn("Failed to save to cache:", err);
            }
        }

        return finalResult;
    } catch (error: any) {
        console.error("Error generating itinerary with Gemini API:", error);
        
        // Graceful error handling for rate limits
        if (error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("quota") || error?.message?.includes("rate limit")) {
            throw new Error("Whoa, too many dessert lovers right now! The kitchen is backed up. Please try again in 60 seconds.");
        }
        
        throw new Error("Failed to generate your dessert tour. Please try again with a broader location.");
    }
};