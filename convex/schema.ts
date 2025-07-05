import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chats: defineTable({
    chatId: v.string(),
    projectId: v.string(),
    createdAt: v.number(),
    createdBy: v.string(),
    teamId: v.string(),
    title: v.optional(v.string()),
    totalTokensUsed: v.optional(v.number()),
  })
    .index("by_project", ["projectId"])
    .index("by_team", ["teamId"])
    .index("by_chat_id", ["chatId"]),

  messages: defineTable({
    messageId: v.string(),
    chatId: v.string(),
    projectId: v.string(),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    timestamp: v.number(),
    userId: v.string(),
    teamId: v.string(),
  })
    .index("by_chat", ["chatId"])
    .index("by_project", ["projectId"])
    .index("by_team", ["teamId"]),

  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    userId: v.string(),
    teamId: v.string(),
  })
    .index("by_team", ["teamId"])
    .index("by_user", ["userId"])
    .index("by_team_user", ["teamId", "userId"]),
});
