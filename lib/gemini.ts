import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

export async function generateProfessionalSummary(terms: string) {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Transform the following real estate compensation terms into a professional, transparent summary for a Commission Certificate. 
               Focus on "mutual protection" and "clarity." 
               Terms: ${terms}`,
        config: {
            systemInstruction: "You are a legal communications expert for Dwellingly, a real estate infrastructure platform.",
        }
    });

    return response.text || '';
}
