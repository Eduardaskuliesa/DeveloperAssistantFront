import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createChat = mutation({
  args: {
    chatId: v.string(),
    projectId: v.string(),
    createdBy: v.string(),
    teamId: v.string(),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chats", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const addMessage = mutation({
  args: {
    chatId: v.string(),
    projectId: v.string(),
    teamId: v.string(),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      ...args,
      messageId: crypto.randomUUID(),
      timestamp: Date.now(),
    });
  },
});

export const getNewMessages = query({
  args: { chatId: v.string() },
  handler: async (ctx, { chatId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", chatId))
      .collect();
  },
});
