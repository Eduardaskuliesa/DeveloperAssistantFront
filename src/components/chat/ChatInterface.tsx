/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useStreamingChat } from "@/hooks/useStreamingMessage";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import ChatInterfaceInputs from "./ChatInerfaceInputs";

interface ChatInterfaceProps {
  chatId: string | null;
  onChatCreated?: (chatId: string) => void;
  projectId: string;
}

const TypingIndicator = () => (
  <div className="flex items-center space-x-1">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
    <span className="text-gray-400 text-sm ml-2">AI is thinking...</span>
  </div>
);

export function ChatInterface({ chatId }: ChatInterfaceProps) {
  const [activeChatId, setActiveChatId] = useState<string | null>(chatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveChatId(chatId);
  }, [chatId]);

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

  const handleSendMessage = (message: string) => {
    streamMessage(message);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentResponse]);

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
    <div className="flex flex-col h-full justify-between relative">
      {/* Messages */}
      <div className="h-[700px] overflow-y-auto p-3 space-y-4 scrollbar-hide">
        {messages.map((msg, index) => (
          <div key={index} className="w-full">
            {/* Author Label */}
            <div
              className={`text-xs text-gray-400 mb-1 px-1 ${
                msg.role === "user" ? "text-right mr-2" : "text-left"
              }`}
            >
              {msg.role === "user" ? "You" : "AI Assistant"}
            </div>

            {/* Message Content */}
            <div
              className={`w-[90%] p-3 rounded-lg text-sm ${
                msg.role === "user"
                  ? "bg-theme-pink text-gray-200 rounded-br-none ml-[10%]"
                  : "bg-theme-lgray text-gray-200 rounded-bl-none"
              }`}
            >
              {msg.role === "user" ? (
                <div className="text-gray-200">{msg.content}</div>
              ) : (
                <div className="markdown-content">
                  <ReactMarkdown components={markdownComponents}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}

        {isAITyping && !currentResponse && <TypingIndicator />}

        {isOtherUserTyping && !isAITyping && (
          <div className="w-full">
            <div className="text-xs text-gray-400 mb-1 px-1">Someone</div>
            <div className="w-full bg-theme-lgray p-3 rounded-lg text-sm text-gray-200">
              Someone is typing...
              <span className="animate-pulse">▋</span>
            </div>
          </div>
        )}

        {currentResponse && (
          <div className="w-full">
            <div className="text-xs text-gray-400 mb-1 px-1">AI Assistant</div>
            <div className="w-full bg-theme-lgray p-3 rounded-lg text-sm text-gray-200">
              <div className="markdown-content">
                <ReactMarkdown components={markdownComponents}>
                  {currentResponse}
                </ReactMarkdown>
              </div>
              <span className="animate-pulse">▋</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Component */}
      <ChatInterfaceInputs
        chatId={activeChatId}
        onSendMessage={handleSendMessage}
        isStreaming={isStreaming}
        tokenUsed={tokenUsed}
        onUserTyping={handleUserTyping}
      />
    </div>
  );
}
