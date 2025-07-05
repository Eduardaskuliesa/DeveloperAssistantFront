"use client";
import { useState } from "react";
import { ChatButton } from "./ChatButton";
import { ConversationList } from "./ConversationList";
import { ChatInterface } from "./ChatInterface";
import { ChevronLeft, X } from "lucide-react";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const handleSelectConversation = (chatId: string) => {
    setActiveChatId(chatId);
  };

  const handleNewChat = () => {
    setActiveChatId("new");
  };

  const handleBackToList = () => {
    setActiveChatId(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveChatId(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <ChatButton onClick={() => setIsOpen(true)} />
      ) : activeChatId ? (
        <div className="bg-theme-bg border fixed bottom-0 right-0 border-neutral-700 shadow-xl w-132 h-[90vh] flex flex-col">
          <div className="p-2 border-b border-neutral-700 flex items-center justify-between">
            <button
              onClick={handleBackToList}
              className="text-neutral-400 hover:text-neutral-300 bg-theme-gray rounded-full p-1 hover:bg-theme-lgray cursor-pointer text-sm"
            >
              <ChevronLeft></ChevronLeft>
            </button>
            <h3 className="text-neutral-300 font-semibold">Chat</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-neutral-300 bg-theme-gray hover:bg-theme-lgray transition-colors cursor-pointer rounded-full p-2"
            >
              <X className="w-5 h-5"></X>
            </button>
          </div>
          <ChatInterface
            chatId={activeChatId}
            onChatCreated={setActiveChatId}
          />
        </div>
      ) : (
        <ConversationList
          onClose={handleClose}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
        />
      )}
    </div>
  );
}
