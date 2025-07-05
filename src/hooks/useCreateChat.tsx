"use client";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";

export const useCreateChat = ({ projectId }: { projectId: string }) => {
  console.log("Create chat fired with projectId:", projectId);
  const createChatMutation = useMutation(api.chats.createChat);

  const createChat = async () => {
    const response = await fetch(
      "http://localhost:4040/api/gemini/chat-create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: projectId,
        }),
      }
    );

    if (!response.ok) {
      console.error("Failed to create chat:", response.statusText);
      return { success: false };
    }

    const data = await response.json();

    await createChatMutation({
      chatId: data.chatId,
      projectId: projectId,
      teamId: "team1",
      createdBy: "user1",
    });

    return {
      success: true,
      chatId: data.chatId,
    };
  };

  return { createChat };
};
