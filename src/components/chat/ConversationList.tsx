"use client";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useCallback } from "react";
import { toast } from "sonner";
import { useCreateChat } from "@/hooks/useCreateChat";
import { Plus, X, Eye, Loader } from "lucide-react";
import { Doc } from "../../../convex/_generated/dataModel";

interface ConversationListProps {
  onClose: () => void;
  onSelectConversation: (chatId: string) => void;
  onNewChat: () => void;
  chats: Doc<"chats">[];
  isPending: boolean;
  error: Error | null;
}

export function ConversationList({
  onClose,
  onSelectConversation,
  onNewChat,
  chats,
  isPending,
  error,
}: ConversationListProps) {
  const pathname = usePathname();
  const projectId = pathname.split("/project/")[1]?.split("/")[0];

  const { createChat } = useCreateChat({ projectId });

  const handleCreateChat = useCallback(async () => {
    try {
      const result = await createChat();
      if (result.success) {
        toast.success("New chat created successfully!");
        onSelectConversation(result.chatId);
      } else {
        toast.error("Failed to create chat.");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Error creating chat.");
    }
  }, [createChat, onSelectConversation]);

  const getCurrentPage = () => {
    if (pathname.includes("/blueprint")) return "Blueprint";
    if (pathname.includes("/memory")) return "Memory";
    if (pathname.includes("/dependencies")) return "Dependencies";
    if (pathname.includes("/documents")) return "Documents";
    if (pathname.includes("/settings")) return "Settings";
    return "Project Overview";
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-theme-bg border border-neutral-700 rounded-lg shadow-xl w-96 max-h-[500px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-neutral-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-neutral-300 font-semibold">Chat with AI</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-300 bg-theme-gray hover:bg-theme-lgray transition-colors cursor-pointer rounded-full p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current page indicator */}
        <div className="flex items-center gap-2 bg-theme-lgray rounded-md px-3 py-2">
          <Eye className="w-3 h-3 text-theme-pink" />
          <span className="text-xs text-neutral-400">Currently watching:</span>
          <span className="text-xs text-theme-pink font-semibold">
            {getCurrentPage()}
          </span>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-3">
          <h4 className="text-xs text-neutral-400 mb-3 uppercase tracking-wide">
            Recent Conversations
          </h4>

          {isPending && (
            <div className="flex justify-center py-8">
              <Loader className="w-6 h-6 text-theme-pink animate-spin" />
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm text-center py-4">
              Failed to load conversations
            </div>
          )}

          {chats && chats.length === 0 && (
            <div className="text-neutral-500 text-sm text-center py-8">
              No conversations yet
            </div>
          )}

          {chats &&
            chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => onSelectConversation(chat.chatId)}
                className="p-3 rounded-lg hover:bg-theme-gray cursor-pointer transition-colors mb-2 border border-transparent hover:border-neutral-600"
              >
                <div className="flex items-start justify-between mb-1">
                  <h5 className="text-neutral-300 font-medium text-sm truncate">
                    {chat.title || "Untitled Chat"}
                  </h5>
                  <span className="text-xs text-neutral-500 ml-2">
                    {chat.totalTokensUsed
                      ? `${Math.floor(chat.totalTokensUsed / 1000)}k`
                      : "0"}
                  </span>
                </div>
                <span className="text-xs text-neutral-500">
                  {formatTimestamp(chat.createdAt)}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-neutral-700">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            handleCreateChat();
            onNewChat();
          }}
          className="w-full bg-theme-pink cursor-pointer hover:bg-theme-pink/90 text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-semibold">Start New Chat</span>
        </motion.button>
      </div>
    </div>
  );
}
