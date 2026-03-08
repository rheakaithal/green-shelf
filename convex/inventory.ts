import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getItems = query({
  args: {
    searchTerm: v.optional(v.string()),
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
    stockStatus: v.optional(v.union(v.literal("Eco-Friendly"), v.literal("Low Stock"))),
  },
  handler: async (ctx, args) => {
    const newItemId = await ctx.db.insert("items", { ...args, createdAt: Date.now() });
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

export const logWaste = mutation({
  args: {
    itemId: v.id("items"),
    itemName: v.string(),
    action: v.string(),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("wasteLogs", {
      ...args,
      loggedAt: Date.now(),
    });
  },
});

export const getWasteLogs = query({
  handler: async (ctx) => {
    return await ctx.db.query("wasteLogs").order("desc").collect();
  },
});


export const seedItem = mutation({
  handler: async (ctx) => {
    await ctx.db.insert("items", {
      name: "Test Item",
      quantity: 3,
      location: "Shelf A",
      createdAt: Date.now(),
    });
  },
});