"use client";
import { useCreateChat } from "@/hooks/useCreateChat";
import { useStreamingChat } from "@/hooks/useStreamingMessage";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { createChat } = useCreateChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");

  const {
    messages,
    currentResponse,
    isStreaming,
    streamMessage,
    tokenUsed,
    isAITyping,

    isOtherUserTyping,
    handleUserTyping,
  } = useStreamingChat({ chatId });

  const handleSend = () => {
    if (inputMessage.trim() && !isStreaming) {
      streamMessage(inputMessage);
      setInputMessage("");
    }
  };

  const handleCreateChat = async () => {
    const result = await createChat();
    if (result.success) {
      setChatId(result.chatId);
    }
  };

  const joinChat = () => {
    setChatId("1");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentResponse]);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-scroll mb-4 space-y-2 scrollbar-hide">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-theme-pink text-white ml-auto max-w-xs"
                : "bg-theme-lgray shadow-md text-gray-200 mr-auto max-w-lg"
            }`}
          >
            {msg.content}
          </div>
        ))}

        {isAITyping && !currentResponse && (
          <div className="bg-theme-lgray text-gray-200 mr-auto max-w-lg p-3 rounded-lg">
            AI is typing...
            <span className="animate-pulse">▋</span>
          </div>
        )}
        {isOtherUserTyping && !isAITyping && (
          <div className="bg-theme-lgray text-gray-200 mr-auto max-w-lg p-3 rounded-lg">
            Someone is typing...
            <span className="animate-pulse">▋</span>
          </div>
        )}

        {currentResponse && (
          <div className="bg-theme-lgray text-gray-200 mr-auto max-w-lg p-3 rounded-lg">
            {currentResponse}
            <span className="animate-pulse">▋</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <div className="text-gray-200">Context: {tokenUsed} / 1000000</div>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => {
            setInputMessage(e.target.value);

            handleUserTyping();
          }}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          disabled={isStreaming}
          className="flex-1 p-2 border border-pink-300 rounded-lg bg-theme-lgray text-gray-200 focus:outline-none focus:ring-2 focus:ring-theme-pink"
        />
        <button
          onClick={handleSend}
          disabled={isStreaming || !inputMessage.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isStreaming ? "⏳" : "📤"}
        </button>
        {!chatId && (
          <>
            <button
              onClick={handleCreateChat}
              className="px-4 py-2 bg-theme-pink hover:cursor-pointer text-white rounded-lg "
            >
              Create Chat
            </button>
            <button
              onClick={joinChat}
              className="px-4 py-2 bg-theme-pink hover:cursor-pointer text-white rounded-lg "
            >
              Join Chat
            </button>
          </>
        )}
      </div>
    </div>
  );
}
