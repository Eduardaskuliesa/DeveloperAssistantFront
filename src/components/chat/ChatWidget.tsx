"use client";
import { useState } from "react";
import { ChatButton } from "./ChatButton";
import { ConversationList } from "./ConversationList";
import { ChatInterface } from "./ChatInterface";
import { usePathname } from "next/navigation";
import ChatInterfaceHeader from "./ChatInterfaceHeader";
import { api } from "../../../convex/_generated/api";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const pathname = usePathname();
  const projectId = pathname.split("/project/")[1]?.split("/")[0];

  const {
    data: chats,
    isPending,
    error,
  } = useQuery(
    convexQuery(api.chats.getRecentChats, {
      projectId: projectId as Id<"projects">,
    })
  );

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
    <div className="fixed bottom-7 right-4 z-50">
      {!isOpen ? (
        <ChatButton onClick={() => setIsOpen(true)} />
      ) : activeChatId ? (
        <div className="bg-theme-bg border fixed bottom-0 right-0 border-neutral-700 shadow-xl w-132 h-[90%]">
          <ChatInterfaceHeader
            chatId={activeChatId}
            chats={chats as Doc<"chats">[]}
            handleBackToList={handleBackToList}
            setIsOpen={setIsOpen}
          />
          <ChatInterface
            chats={chats as Doc<"chats">[]}
            projectId={projectId}
            chatId={activeChatId}
            onChatCreated={setActiveChatId}
          />
        </div>
      ) : (
        <ConversationList
          onClose={handleClose}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          chats={chats as Doc<"chats">[]}
          isPending={isPending}
          error={error}
        />
      )}
    </div>
  );
}
