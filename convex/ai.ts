import { action } from "./_generated/server";
import { internal } from "./_generated/api";
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
                "unit": string (e.g. "lbs", "oz", "cartons", "" if unknown),
                "location": string,
                "expirationDate": string (format: YYYY-MM-DD, try to extrapolate from today if relative)
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

export const generateWasteInsight = action({
  args: {},
  handler: async (ctx) => {
    try {
      const data: any = await ctx.runQuery(internal.inventory.getWasteDataForInsight);
      
      const items: any[] = data.items;
      const wasteLogs: any[] = data.wasteLogs;
      
      // Simple aggregation logic for the prompt
      const itemSummaries = items.map((item: any) => {
        const itemLogs = wasteLogs.filter((log: any) => log.itemId === item._id);
        const used = itemLogs.filter((l: any) => l.action === "fully used").reduce((sum: number, l: any) => sum + l.quantity, 0);
        const donated = itemLogs.filter((l: any) => l.action === "donated").reduce((sum: number, l: any) => sum + l.quantity, 0);
        const expired = itemLogs.filter((l: any) => l.action === "expired").reduce((sum: number, l: any) => sum + l.quantity, 0);
        
        return `Item: ${item.name}
- Current Stock: ${item.quantity} ${item.unit || 'units'}
- Total Fully Used: ${used}
- Total Donated: ${donated}
- Total Expired/Wasted: ${expired}`;
      }).join("\\n\\n");

      const prompt = `You are a sustainability inventory assistant. Here is the usage data for a user's local inventory:

${itemSummaries}

Analyze this data to identify which items are being wasted (expired) frequently, or which items the user has too much of, and provide a single, short, actionable recommendation to reduce waste.

Format your response exactly like this example, using plain text without markdown asterisks:

You ordered 30 coffee filters last month.
Only 12 were used.

RECOMMENDATION: Reduce next order by ~40% to avoid overstock.

Keep it concise, supportive, and focus on the most problematic item or a general trend if there are multiple. Do not include any title headers like "AI Insight".`;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            { role: "user", content: prompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }

      const responseData = await response.json();
      return responseData.choices[0].message.content;

    } catch (error: any) {
      console.error("Failed to generate insight:", error);
      throw new Error(`Failed to generate insight: ${error.message}`);
    }
  }
});
