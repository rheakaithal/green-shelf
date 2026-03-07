import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  items: defineTable({
    name: v.string(),
    quantity: v.number(),
    location: v.string(),
    expirationDate: v.optional(v.string()), // Optional, stored as YYYY-MM-DD
    category: v.optional(v.string()), 
    score: v.optional(v.number()), // Eco score (0-100)
    stockStatus: v.optional(v.union(v.literal("Eco-Friendly"), v.literal("Low Stock"))),
  })
  .searchIndex("search_name", {
    searchField: "name",
  }),
});
