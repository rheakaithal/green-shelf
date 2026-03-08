import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  items: defineTable({
    name: v.string(),
    quantity: v.number(),
    location: v.string(),
    expirationDate: v.optional(v.string()), // Optional, stored as YYYY-MM-DD
    stockStatus: v.optional(v.union(v.literal("Eco-Friendly"), v.literal("Low Stock"))),
    createdAt: v.number(),
  })
  .searchIndex("search_name", {
    searchField: "name",
  }),

  wasteLogs: defineTable({
    itemId: v.id("items"),
    itemName: v.string(),
    action: v.string(), // "fully used", "donated", "expired"
    quantity: v.number(),
    loggedAt: v.number(),
  }),
});
