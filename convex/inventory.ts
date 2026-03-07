import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getItems = query({
  args: {
    searchTerm: v.optional(v.string()),
    category: v.optional(v.string()), // e.g., 'All Items', 'Energy', 'Lighting', 'Recycled'
  },
  handler: async (ctx, args) => {
    let items;
    
    // 1. Text Search (if provided)
    if (args.searchTerm && args.searchTerm.trim() !== "") {
      items = await ctx.db
        .query("items")
        .withSearchIndex("search_name", (q) => q.search("name", args.searchTerm as string))
        .collect();
    } else {
      // Otherwise, return all items
      items = await ctx.db.query("items").collect();
    }

    // 2. Filter by category (if provided and not 'All Items')
    if (args.category && args.category !== "All Items") {
      items = items.filter((item) => item.category === args.category);
    }

    return items;
  },
});

export const getItem = query({
  args: { id: v.id("items") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const addItem = mutation({
  args: {
    name: v.string(),
    quantity: v.number(),
    location: v.string(),
    expirationDate: v.optional(v.string()),
    category: v.optional(v.string()),
    score: v.optional(v.number()),
    stockStatus: v.optional(v.union(v.literal("Eco-Friendly"), v.literal("Low Stock"))),
  },
  handler: async (ctx, args) => {
    const newItemId = await ctx.db.insert("items", { ...args });
    return newItemId;
  },
});

export const updateItem = mutation({
  args: {
    id: v.id("items"),
    name: v.optional(v.string()),
    quantity: v.optional(v.number()),
    location: v.optional(v.string()),
    expirationDate: v.optional(v.string()),
    category: v.optional(v.string()),
    score: v.optional(v.number()),
    stockStatus: v.optional(v.union(v.literal("Eco-Friendly"), v.literal("Low Stock"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteItem = mutation({
  args: { id: v.id("items") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
