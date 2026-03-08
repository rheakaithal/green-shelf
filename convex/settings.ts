import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getSettings = query({
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").first();
    // Return defaults if no settings exist yet
    if (!settings) {
      return { lowStockThreshold: 5, expiringSoonDays: 7 };
    }
    return settings;
  },
});

export const updateSettings = mutation({
  args: {
    lowStockThreshold: v.number(),
    expiringSoonDays: v.number(),
  },
  handler: async (ctx, args) => {
    const existingSettings = await ctx.db.query("settings").first();
    if (existingSettings) {
      await ctx.db.patch(existingSettings._id, args);
    } else {
      await ctx.db.insert("settings", args);
    }
  },
});
