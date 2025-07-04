import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/add-message",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const { chatId, content, role, userId } = await request.json();

    await ctx.runMutation(api.chats.addMessage, {
      chatId,
      content,
      role,
      userId,
      projectId: "default-project",
      teamId: "default-team",
    });

    return new Response("Message added successfully", { status: 200 });
  }),
});

export default http;
