import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import testData from "../lib/seedData.json";
import { validateStorageString, validateQuantity } from "../lib/security";

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
    unit: v.optional(v.string()),
    location: v.string(),
    expirationDate: v.optional(v.string()),
    stockStatus: v.optional(v.union(v.literal("Eco-Friendly"), v.literal("Low Stock"))),
    customLowStockThreshold: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Security: Validate lengths and logic
    const sanitizedName = validateStorageString(args.name, 'name');
    const sanitizedLoc = validateStorageString(args.location, 'location');
    const sanitizedUnit = args.unit ? validateStorageString(args.unit, 'unit') : '';
    const safeQty = validateQuantity(args.quantity);

    const newItemId = await ctx.db.insert("items", { 
      ...args, 
      name: sanitizedName, 
      location: sanitizedLoc, 
      unit: sanitizedUnit, 
      quantity: safeQty, 
      createdAt: Date.now() 
    });
    return newItemId;
  },
});

export const updateItem = mutation({
  args: {
    id: v.id("items"),
    name: v.optional(v.string()),
    quantity: v.optional(v.number()),
    unit: v.optional(v.string()),
    location: v.optional(v.string()),
    expirationDate: v.optional(v.string()),
    stockStatus: v.optional(v.union(v.literal("Eco-Friendly"), v.literal("Low Stock"))),
    customLowStockThreshold: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Security check on updates
    if (updates.name !== undefined) updates.name = validateStorageString(updates.name, 'name');
    if (updates.location !== undefined) updates.location = validateStorageString(updates.location, 'location');
    if (updates.unit !== undefined) updates.unit = validateStorageString(updates.unit, 'unit');
    if (updates.quantity !== undefined) updates.quantity = validateQuantity(updates.quantity);

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
    const sanitizedName = validateStorageString(args.itemName, 'name');
    const safeQty = validateQuantity(args.quantity);

    await ctx.db.insert("wasteLogs", {
      ...args,
      itemName: sanitizedName,
      quantity: safeQty,
      loggedAt: Date.now(),
    });
  },
});

export const getWasteLogs = query({
  handler: async (ctx) => {
    return await ctx.db.query("wasteLogs").order("desc").collect();
  },
});

export const clearWasteLogs = mutation({
  handler: async (ctx) => {
    const logs = await ctx.db.query("wasteLogs").collect();
    for (const log of logs) {
      await ctx.db.delete(log._id);
    }
  },
});


export const seedTestData = mutation({
  handler: async (ctx) => {
    // 1. Clear existing data
    const oldItems = await ctx.db.query("items").collect();
    for (const item of oldItems) await ctx.db.delete(item._id);
    
    const oldLogs = await ctx.db.query("wasteLogs").collect();
    for (const log of oldLogs) await ctx.db.delete(log._id);

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    // 2. Parse and Seed Inventory Items from JSON
    const inventoryMap = new Map<string, any>(); // Map to store names to inserted IDs
    
    for (const item of testData.inventory) {
      const { createdAtOffsetDays, ...itemData } = item;
      const docId = await ctx.db.insert("items", {
        ...itemData,
        createdAt: now - (createdAtOffsetDays * dayMs)
      });
      inventoryMap.set(item.name, docId);
    }

    // 3. Parse and Seed Logs from JSON
    // We must generate a valid Convex ID for logs that reference items missing from inventory.
    // We achieve this by creating a generic "Ghost Item", grabbing its ID, and then deleting it.
    // Convex IDs remain valid even if the document is deleted.
    const ghostId = await ctx.db.insert("items", {
      name: "Deleted Item",
      quantity: 0,
      location: "Unknown",
      createdAt: now
    });
    await ctx.db.delete(ghostId);

    for (const log of testData.logs) {
      const { loggedAtOffsetDays, ...logData } = log;
      const matchingItemId = inventoryMap.get(log.itemName) || ghostId;
      
      await ctx.db.insert("wasteLogs", {
        ...logData,
        itemId: matchingItemId as any,
        loggedAt: now - (loggedAtOffsetDays * dayMs)
      });
    }
  },
});

export const getWasteDataForInsight = internalQuery({
  handler: async (ctx) => {
    const items = await ctx.db.query("items").collect();
    const wasteLogs = await ctx.db.query("wasteLogs").collect();
    return { items, wasteLogs };
  },
});