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

export const getRecentChats = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("projectId"), args.projectId))
      .order("desc")
      .take(5);
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

export const getInitialMessages = query({
  args: { chatId: v.string() },
  handler: async (ctx, { chatId }) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", chatId))
      .order("asc")
      .collect();

    console.log(`Initial load: Found ${messages.length} messages`);
    return messages;
  },
});

export const getLatest5Messages = query({
  args: { chatId: v.string() },
  handler: async (ctx, { chatId }) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", chatId))
      .order("desc")
      .take(2);
    console.log(`Latest 2 messages: Found ${messages.length} messages`);

    return messages.reverse();
  },
});

export const updateTitle = mutation({
  args: {
    chatId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, { chatId, title }) => {
    const chat = await ctx.db
      .query("chats")
      .withIndex("by_chat_id", (q) => q.eq("chatId", chatId))
      .first();
    if (!chat) throw new Error("Chat not found");
    await ctx.db.patch(chat._id, {
      title: title,
    });
  },
});

export const updateTokenCount = mutation({
  args: {
    chatId: v.string(),
    totalTokenUsed: v.number(),
  },
  handler: async (ctx, { chatId, totalTokenUsed }) => {
    const chat = await ctx.db
      .query("chats")
      .withIndex("by_chat_id", (q) => q.eq("chatId", chatId))
      .first();
    if (!chat) throw new Error("Chat not found");
    await ctx.db.patch(chat._id, {
      totalTokensUsed: totalTokenUsed,
    });
  },
});
