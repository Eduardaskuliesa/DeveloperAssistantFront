/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useCreateChat } from "@/hooks/useCreateChat";
import { useStreamingChat } from "@/hooks/useStreamingMessage";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatInterfaceProps {
  chatId: string | null;
  onChatCreated?: (chatId: string) => void;
}

export function ChatInterface({ chatId, onChatCreated }: ChatInterfaceProps) {
  const { createChat } = useCreateChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(chatId);
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
  } = useStreamingChat({ chatId: activeChatId });

  const handleSend = () => {
    if (inputMessage.trim() && !isStreaming) {
      streamMessage(inputMessage);
      setInputMessage("");
    }
  };

  const handleCreateChat = async () => {
    const result = await createChat();
    if (result.success) {
      setActiveChatId(result.chatId);
      onChatCreated?.(result.chatId);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentResponse]);

  useEffect(() => {
    if (chatId === "new") {
      handleCreateChat();
    } else {
      setActiveChatId(chatId);
    }
  }, [chatId]);

  const markdownComponents = {
    h1: ({ children }: any) => (
      <h1 className="text-base font-bold mb-2 text-theme-pink">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-sm font-bold mb-2 text-theme-pink">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-sm font-semibold mb-1 text-theme-pink">{children}</h3>
    ),
    strong: ({ children }: any) => (
      <strong className="font-bold text-white">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-gray-300">{children}</em>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc list-inside space-y-1 my-2 ml-2">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal list-inside space-y-1 my-2 ml-2">
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="text-gray-200 text-sm">{children}</li>
    ),
    code: ({ children, inline }: any) => {
      if (inline) {
        return (
          <code className="bg-theme-bg px-1 py-0.5 rounded text-theme-pink font-mono text-xs">
            {children}
          </code>
        );
      }
      return (
        <code className="block bg-theme-bg p-2 rounded my-2 overflow-x-auto text-theme-pink font-mono text-xs">
          {children}
        </code>
      );
    },
    pre: ({ children }: any) => (
      <pre className="bg-theme-bg p-2 rounded my-2 overflow-x-auto">
        {children}
      </pre>
    ),
    p: ({ children }: any) => (
      <p className="mb-2 last:mb-0 text-gray-200 leading-relaxed">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-theme-pink pl-3 italic my-2 text-gray-300">
        {children}
      </blockquote>
    ),
  };

  return (
    <div className="flex  flex-col h-full justify-between">
      {/* Messages */}
      <div className="h-[700px]  overflow-y-auto p-3 space-y-2 scrollbar-hide">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg text-sm ${
              msg.role === "user"
                ? "bg-theme-pink text-white ml-auto max-w-[80%]"
                : "bg-theme-lgray text-gray-200 mr-auto max-w-[85%]"
            }`}
          >
            {msg.role === "user" ? (
              <div className="text-white">{msg.content}</div>
            ) : (
              <div className="markdown-content">
                <ReactMarkdown components={markdownComponents}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        {isAITyping && !currentResponse && (
          <div className="bg-theme-lgray text-gray-200 mr-auto max-w-[85%] p-2 rounded-lg text-sm">
            AI is typing...
            <span className="animate-pulse">▋</span>
          </div>
        )}

        {isOtherUserTyping && !isAITyping && (
          <div className="bg-theme-lgray text-gray-200 mr-auto max-w-[85%] p-2 rounded-lg text-sm">
            Someone is typing...
            <span className="animate-pulse">▋</span>
          </div>
        )}

        {currentResponse && (
          <div className="bg-theme-lgray text-gray-200 mr-auto max-w-[85%] p-2 rounded-lg text-sm">
            <div className="markdown-content">
              <ReactMarkdown components={markdownComponents}>
                {currentResponse}
              </ReactMarkdown>
            </div>
            <span className="animate-pulse">▋</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 absolute bottom-0 flex items-end w-full">
        <div className="bg-theme-gray scrollbar-hide border border-neutral-700 rounded-lg w-full p-3">
          <div className="relative scrollbar-hide">
            <textarea
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                handleUserTyping();
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about your architecture..."
              disabled={isStreaming}
              className="w-full scrollbar-hide py-2 bg-transparent border-none text-neutral-200 text-sm placeholder-neutral-400 focus:outline-none resize-none min-h-[36px] max-h-[100px]"
              style={{ height: "auto" }}
            />
          </div>
          <span className="absolute right-6 top-4 text-xs text-neutral-400">
            {tokenUsed?.toLocaleString()} / 1M
          </span>
          <div className="flex items-center justify-between mt-2 text-xs text-neutral-500">
            <span>Press Enter to send, Shift+Enter for new line</span>

            <button
              onClick={handleSend}
              disabled={isStreaming || !inputMessage.trim()}
              className=" text-neutral-300  rounded-full hover:text-theme-pink disabled:opacity-50 transition-colors "
            >
              {isStreaming ? (
                <div className="w-4 h-4 border-2 border-gray-500 border-t-theme-pink rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
