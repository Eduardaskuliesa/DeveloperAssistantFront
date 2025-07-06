import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import { io, Socket } from "socket.io-client";
import { Doc, Id } from "../../convex/_generated/dataModel";

export interface UseStreamingChatProps {
  chatId: string | null;
  projectId: string;
}

const userId = Math.random().toString(26).substring(7);

export const useStreamingChat = ({
  chatId,
  projectId,
}: UseStreamingChatProps) => {
  const [isAITyping, setIsAITyping] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isOtherUserTyping, setOtherUserTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isTyping, setIsTyping] = useState(false);

  const [allMessages, setAllMessages] = useState<Doc<"messages">[]>([]);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const initialMessages = useQuery(
    api.chats.getInitialMessages,
    initialLoaded ? "skip" : { chatId: chatId as string }
  );

  const latest5Messages = useQuery(
    api.chats.getLatest5Messages,
    !initialLoaded ? "skip" : { chatId: chatId as string }
  );

  const addMessage = useMutation(api.chats.addMessage);
  const updateTokenCount = useMutation(api.chats.updateTokenCount);

  const [currentResponse, setCurrentResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [tokenUsed, setTokenUsed] = useState<number | undefined>();

  useEffect(() => {
    if (initialMessages && !initialLoaded) {
      setAllMessages(initialMessages);
      setInitialLoaded(true);
    }
  }, [initialMessages, initialLoaded]);

  useEffect(() => {
    if (latest5Messages && latest5Messages.length > 0 && initialLoaded) {
      setAllMessages((prev) => {
        const newMessages = latest5Messages.filter(
          (msg) => !prev.some((existing) => existing._id === msg._id)
        );
        return newMessages.length > 0 ? [...prev, ...newMessages] : prev;
      });
    }
  }, [latest5Messages, initialLoaded]);

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
    }, 500);

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
      setOtherUserTyping(false);
      setTypingTimeout(null);
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

  const streamMessage = async (message: string) => {
    if (!chatId) {
      console.error("Cannot send message: chatId is null");
      return;
    }

    setIsStreaming(true);
    socket?.emit("typing", { chatId, isAITyping: true });
    setCurrentResponse("");

    try {
      // 1. Add user message to database
      await addMessage({
        chatId,
        projectId: projectId,
        teamId: "team1",
        content: message,
        role: "user",
        userId: "user1",
      });

      // 2. Stream AI response
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
      let tokens;

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
            tokens = JSON.parse(metadataPart).tokens;
            setTokenUsed(tokens);
          }
        } else {
          fullResponse += chunk;
          setCurrentResponse((prev) => prev + chunk);
        }
      }

      // 3. Save AI response
      await addMessage({
        chatId,
        projectId: projectId,
        teamId: "team1",
        content: fullResponse,
        role: "assistant",
        userId: "system",
      });

      // 4. Update token count
      await updateTokenCount({
        chatId: chatId as Id<"chats">,
        totalTokenUsed: tokens as number,
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
    messages: allMessages,
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
