import { action } from "./_generated/server";
import { v } from "convex/values";

export const extractItemInfo = action({
  args: {
    naturalLanguageText: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash", // Fast, accurate JSON extraction
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `You are an AI assistant that extracts inventory data from natural language strings. 
              Output MUST be exactly a JSON object matching this TypeScript interface, filling in missing parts with reasonable guesses:
              {
                "name": string,
                "quantity": number,
                "location": string,
                "score": number (0-100 eco score, guess if unknown based on item),
                "stockStatus": "Eco-Friendly" | "Low Stock"
              }`
            },
            {
              role: "user",
              content: args.naturalLanguageText
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      const parsed = JSON.parse(content);
      return parsed;
    } catch (error: any) {
      console.error("AI extraction failed:", error);
      throw new Error(`Failed to extract info: ${error.message}`);
    }
  },
});
