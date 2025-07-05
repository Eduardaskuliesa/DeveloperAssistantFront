"use client";
import { Plus, X, Eye } from "lucide-react";
import { usePathname } from "next/navigation";

const recentConversations = [
  {
    id: "1",
    title: "Authentication Setup",
    lastMessage: "How should we implement JWT tokens?",
    timestamp: "2 hours ago",
    messageCount: 12,
  },
  {
    id: "2",
    title: "Database Schema",
    lastMessage: "Let's discuss the user table structure",
    timestamp: "Yesterday",
    messageCount: 8,
  },
  {
    id: "3",
    title: "Component Architecture",
    lastMessage: "Should we use atomic design principles?",
    timestamp: "2 days ago",
    messageCount: 15,
  },
  {
    id: "4",
    title: "API Design",
    lastMessage: "REST vs GraphQL for our endpoints",
    timestamp: "1 week ago",
    messageCount: 6,
  },
];

interface ConversationListProps {
  onClose: () => void;
  onSelectConversation: (chatId: string) => void;
  onNewChat: () => void;
}

export function ConversationList({
  onClose,
  onSelectConversation,
  onNewChat,
}: ConversationListProps) {
  const pathname = usePathname();

  const getCurrentPage = () => {
    if (pathname.includes("/blueprint")) return "Blueprint";
    if (pathname.includes("/memory")) return "Memory";
    if (pathname.includes("/dependencies")) return "Dependencies";
    if (pathname.includes("/documents")) return "Documents";
    if (pathname.includes("/settings")) return "Settings";
    return "Project Overview";
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
            <X className="w-5 h-5"></X>
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
          {recentConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className="p-3 rounded-lg hover:bg-theme-gray cursor-pointer transition-colors mb-2 border border-transparent hover:border-neutral-600"
            >
              <div className="flex items-start justify-between mb-1">
                <h5 className="text-neutral-300 font-medium text-sm">
                  {conv.title}
                </h5>
                <span className="text-xs text-neutral-500">
                  {conv.messageCount} msgs
                </span>
              </div>
              <p className="text-neutral-400 text-xs mb-2 line-clamp-2">
                {conv.lastMessage}
              </p>
              <span className="text-xs text-neutral-500">{conv.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-neutral-700">
        <button
          onClick={onNewChat}
          className="w-full bg-theme-pink hover:bg-opacity-90 text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-semibold">Start New Chat</span>
        </button>
      </div>
    </div>
  );
}
