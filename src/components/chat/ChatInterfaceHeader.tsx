import { useMutation } from "convex/react";
import { ChevronLeft, X } from "lucide-react";
import React, { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Doc } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";

interface ChatInterfaceHeaderProps {
  handleBackToList: () => void;
  chatId: string;
  chats: Doc<"chats">[];
  setIsOpen: (open: boolean) => void;
}

const ChatInterfaceHeader: React.FC<ChatInterfaceHeaderProps> = ({
  handleBackToList,
  setIsOpen,
  chatId,
  chats,
}) => {
  const currentChat = chats?.find((chat) => chat.chatId === chatId);
  const currentTitle = currentChat?.title || "";

  const [title, setTitle] = useState(currentTitle);

  const [isEditing, setIsEditing] = useState(false);
  const updateTitle = useMutation(api.chats.updateTitle);

  const handleUpdateTitle = async (newTitle: string) => {
    if (!newTitle.trim() || newTitle === currentTitle) {
      setIsEditing(false);
      setTitle(currentTitle);
      return;
    }
    try {
      await updateTitle({ chatId, title: newTitle });
      toast.success("Chat title updated successfully!");
    } catch (error) {
      console.error("Failed to update chat title:", error);
      toast.error("Failed to update chat title.");
      setTitle(currentTitle);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="p-2 border-b border-neutral-700 flex items-center justify-between">
      <button
        onClick={handleBackToList}
        className="text-neutral-400 hover:text-neutral-300 bg-theme-gray rounded-full p-1 hover:bg-theme-lgray cursor-pointer text-sm"
      >
        <ChevronLeft />
      </button>
      <div className="flex-1 flex justify-center">
        {isEditing ? (
          <input
            className="bg-theme-gray text-neutral-300 font-semibold rounded px-2 py-1 text-center outline-none border border-theme-pink"
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => handleUpdateTitle(title)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUpdateTitle(title);
              if (e.key === "Escape") {
                setIsEditing(false);
                setTitle(currentTitle);
              }
            }}
            style={{ minWidth: 80, maxWidth: 200 }}
          />
        ) : (
          <h3
            className="text-neutral-300 font-semibold cursor-pointer select-none"
            title="Double click to edit"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title || "Chat"}
          </h3>
        )}
      </div>
      <button
        onClick={() => setIsOpen(false)}
        className="text-neutral-400 hover:text-neutral-300 bg-theme-gray hover:bg-theme-lgray transition-colors cursor-pointer rounded-full p-2"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ChatInterfaceHeader;
