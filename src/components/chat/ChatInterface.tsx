/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useStreamingChat } from "@/hooks/useStreamingMessage";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import ChatInterfaceInputs from "./ChatInerfaceInputs";
import { Doc } from "../../../convex/_generated/dataModel";

interface ChatInterfaceProps {
  chatId: string | null;
  onChatCreated?: (chatId: string) => void;
  chats: Doc<"chats">[];
  projectId: string;
}

export function ChatInterface({
  chatId,
  projectId,
  chats,
}: ChatInterfaceProps) {
  const [activeChatId, setActiveChatId] = useState<string | null>(chatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const currentChat = chats?.find((chat) => chat.chatId === chatId);
  const tokens = currentChat?.totalTokensUsed || 0;

  useEffect(() => {
    setActiveChatId(chatId);
  }, [chatId]);

  const {
    messages,
    currentResponse,
    isStreaming,
    streamMessage,
    handleUserTyping,
  } = useStreamingChat({ chatId: activeChatId, projectId: projectId });

  const handleSendMessage = (message: string) => {
    streamMessage(message);
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
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
    <div className="flex flex-col h-full relative">
      <div
        ref={messagesContainerRef}
        className="h-[80%] overflow-y-auto px-2 pt-1 space-y-2 scrollbar-hide"
      >
        {messages
          .filter((msg, index) => {
            const isLastMessage = index === messages.length - 1;
            const isAIMessage = msg.role === "assistant";
            return !(isLastMessage && isAIMessage && currentResponse);
          })
          .map((msg, index) => (
            <div key={`${activeChatId}-${index}`} className="w-full">
              <div
                className={`text-xs text-gray-400 mb-1 px-1 ${
                  msg.role === "user" ? "text-right mr-2" : "text-left"
                }`}
              >
                {msg.role === "user" ? "You" : "AI Assistant"}
              </div>
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

        {currentResponse && (
          <div className="w-full">
            <div className="text-xs text-gray-400 mb-1 px-1 text-left">
              AI Assistant
            </div>
            <div className="w-[90%] p-3 rounded-lg text-sm bg-theme-lgray text-gray-200 rounded-bl-none">
              <div className="markdown-content flex">
                <ReactMarkdown components={markdownComponents}>
                  {currentResponse}
                </ReactMarkdown>
                {isStreaming && (
                  <span className="animate-pulse text-gray-400 ml-1">▋</span>
                )}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInterfaceInputs
        chatId={activeChatId}
        onSendMessage={handleSendMessage}
        isStreaming={isStreaming}
        tokenUsed={tokens}
        onUserTyping={handleUserTyping}
      />
    </div>
  );
}
