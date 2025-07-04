import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { io, Socket } from "socket.io-client";

export interface UseStreamingChatProps {
  chatId: string | null;
}

const userId = Math.random().toString(26).substring(7);

export const useStreamingChat = ({ chatId }: UseStreamingChatProps) => {
  const [isAITyping, setIsAITyping] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isOtherUserTyping, setOtherUserTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isTyping, setIsTyping] = useState(false);

  const handleUserTyping = () => {
    if (!socket || !socket.connected) return;

    if (!isTyping) {
      socket.emit("user-typing", { chatId, isUserTyping: true, userId });
      console.log("📤 SENT: user-typing TRUE");
      setIsTyping(true);
    }

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      if (socket && socket.connected) {
        socket.emit("user-typing", { chatId, isUserTyping: false, userId });
        console.log("📤 SENT: user-typing FALSE");
      }
      setIsTyping(false);
      setTypingTimeout(null);
    }, 1500);

    setTypingTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  useEffect(() => {
    if (!chatId) return;

    const newSocket = io("http://localhost:4040");

    newSocket.emit("join-chat", { chatId, userId });

    newSocket.on("typing", ({ isAITyping }) => {
      setIsAITyping(isAITyping);
    });

    newSocket.on("user-typing", ({ isUserTyping, userId }) => {
      console.log("🔥 CLIENT RECEIVED user-typing event:", {
        isUserTyping,
        userId,
      });
      setOtherUserTyping(isUserTyping);
    });

    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [chatId]);

  const convexMessages = useQuery(
    api.chats.getNewMessages,
    chatId ? { chatId } : "skip"
  );
  const addMessage = useMutation(api.chats.addMessage);

  const [currentResponse, setCurrentResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [tokenUsed, setTokenUsed] = useState<number | undefined>();

  const streamMessage = async (message: string) => {
    if (!chatId) {
      console.error("Cannot send message: chatId is null");
      return;
    }
    setIsStreaming(true);
    socket?.emit("typing", { chatId, isAITyping: true });
    setCurrentResponse("");

    await addMessage({
      chatId,
      projectId: "project1",
      teamId: "team1",
      content: message,
      role: "user",
      userId: "user1",
    });

    try {
      const response = await fetch(
        "http://localhost:4040/api/gemini/chat-send",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, chatId: chatId }),
        }
      );

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const result = await reader?.read();
        if (!result) break;
        const { done, value } = result;
        if (done) break;

        const chunk = decoder.decode(value);

        if (chunk.includes("---METADATA---")) {
          const parts = chunk.split("---METADATA---");
          const textPart = parts[0];
          const metadataPart = parts[1];

          if (textPart) {
            fullResponse += textPart;
            setCurrentResponse((prev) => prev + textPart);
          }

          if (metadataPart) {
            const tokens = JSON.parse(metadataPart).tokens;
            setTokenUsed(tokens);
          }
        } else {
          fullResponse += chunk;
          setCurrentResponse((prev) => prev + chunk);
        }
      }

      await addMessage({
        chatId,
        projectId: "project1",
        teamId: "team1",
        content: fullResponse,
        role: "assistant",
        userId: "system",
      });
      setCurrentResponse("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      socket?.emit("typing", { chatId, isAITyping: false });
      setIsStreaming(false);
    }
  };

  return {
    messages: convexMessages || [],
    currentResponse,
    isStreaming,
    tokenUsed,
    isAITyping,
    isTyping,
    streamMessage,
    handleUserTyping,
    setOtherUserTyping,
    isOtherUserTyping,
  };
};
