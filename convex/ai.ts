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
      let content = data.choices[0].message.content;
      
      // Ensure we strip out any markdown formatting the LLM might inject
      content = content.replace(/```json/gi, "").replace(/```/g, "").trim();
      
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
      
      // Group all waste logs by item name so we don't lose data for deleted items
      const logsByItemName: Record<string, any[]> = {};
      wasteLogs.forEach((log) => {
        if (!logsByItemName[log.itemName]) {
          logsByItemName[log.itemName] = [];
        }
        logsByItemName[log.itemName].push(log);
      });

      const itemSummaries = Object.keys(logsByItemName).map((itemName) => {
        const itemLogs = logsByItemName[itemName];
        const used = itemLogs.filter((l: any) => l.action === "fully used").reduce((sum: number, l: any) => sum + l.quantity, 0);
        const donated = itemLogs.filter((l: any) => l.action === "donated").reduce((sum: number, l: any) => sum + l.quantity, 0);
        const expired = itemLogs.filter((l: any) => l.action === "expired").reduce((sum: number, l: any) => sum + l.quantity, 0);
        
        // Find if it still exists in current inventory to show current stock
        const currentItem = items.find((i: any) => i.name === itemName);
        const currentStockStr = currentItem ? `${currentItem.quantity} ${currentItem.unit || 'units'}` : "0 (Item removed)";
        
        return `Item: ${itemName}
- Current Stock: ${currentStockStr}
- Total Fully Used: ${used}
- Total Donated: ${donated}
- Total Expired/Wasted: ${expired}`;
      }).join("\\n\\n");

      let prompt = "";
      if (wasteLogs.length === 0) {
        prompt = `You are a sustainability inventory assistant. The user has requested an insight, but there is not enough data logged yet. Reply exactly with: "Not enough usage data to generate a recommendation yet. Keep logging your waste and utilization!"`;
      } else {
        prompt = `You are a sustainability inventory assistant. Here is the exact usage data for a user's local inventory. You MUST ONLY use the items and numbers provided below. Do not make up items like "coffee" or "milk" unless they are listed here:

${itemSummaries}

Analyze this specific data to identify which items are being wasted (expired) frequently, or which items the user has too much of, and provide a single, short, actionable recommendation to reduce waste based STRICTLY on the numbers above.

Format your response somewhat like this example:
You ordered 30 cartons of [Actual Item Name] last month.
Only 12 were used.

RECOMMENDATION: Reduce next order by ~40% to avoid overstock.

Keep it concise, supportive, and focus on the most problematic item or a general trend if there are multiple. Do not include any title headers like "AI Insight".`;
      }

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

export const generateItemInsight = action({
  args: {
    itemName: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const data: any = await ctx.runQuery(internal.inventory.getWasteDataForInsight);
      
      const items: any[] = data.items;
      const wasteLogs: any[] = data.wasteLogs;
      
      // Filter logs specifically for this item
      const itemLogs = wasteLogs.filter((log: any) => log.itemName === args.itemName);
      
      if (itemLogs.length === 0) {
        return "Not enough historical data to analyze this item. Keep logging your usage!";
      }

      const used = itemLogs.filter((l: any) => l.action === "fully used").reduce((sum: number, l: any) => sum + l.quantity, 0);
      const donated = itemLogs.filter((l: any) => l.action === "donated").reduce((sum: number, l: any) => sum + l.quantity, 0);
      const expired = itemLogs.filter((l: any) => l.action === "expired").reduce((sum: number, l: any) => sum + l.quantity, 0);
      
      // Find current stock
      const currentItem = items.find((i: any) => i.name === args.itemName);
      const currentStockStr = currentItem ? `${currentItem.quantity} ${currentItem.unit || 'units'}` : "0 (Item removed)";
      
      // Build a chronological timeline for the AI to understand the 'trend'
      const chronologicalLogs = [...itemLogs].sort((a: any, b: any) => a.loggedAt - b.loggedAt);
      const timelineText = chronologicalLogs.map((log: any) => {
        const dateObj = new Date(log.loggedAt);
        // Format MM-DD
        const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
        return `[${dateStr}] ${log.quantity} units ${log.action}`;
      }).join("\\n");

      const prompt = `You are an expert inventory analyst. You are looking at the specific history for this item: "${args.itemName}".

CURRENT STATUS:
- Current Stock: ${currentStockStr}
- All-Time Used: ${used}
- All-Time Donated: ${donated}
- All-Time Wasted/Expired: ${expired}

TIMELINE OF EVENTS (Oldest to Newest):
${timelineText}

Analyze this specific trend line. Identify if the user is buying too much and letting it expire, or buying too little and constantly running out.
Provide a single, short, actionable recommendation to optimize their procurement of THIS SPECIFIC ITEM based strictly on the data.

Format your response somewhat like this:
You have wasted ${expired} units recently while only using ${used}.

RECOMMENDATION: Reduce your regular order size to prevent overstocking.

Keep it concise, direct, and actionable. Do not include headers like "AI Insight".`;

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
      console.error("Failed to generate item-specific insight:", error);
      throw new Error(`Failed to analyze item trend: ${error.message}`);
    }
  }
});
